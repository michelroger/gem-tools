/* Utilitarios de transformacao e parse leve de MusicXML para o player. */
(function () {
  'use strict';

  function buildDisplayMusicXml(xmlText, options) {
    var raw = String(xmlText || '');
    var display = raw;
    var opts = options || {};
    var colorizedNotes = !!opts.colorizedNotes;
    var showFingering = !!opts.showFingering;

    if (!colorizedNotes) {
      /* Remove cores vindas do MusicXML para manter render padrao. */
      display = display.replace(/\scolor=(\"[^\"]*\"|'[^']*')/gi, '');
    }
    if (!showFingering) {
      /* Esconde dedilhado visual sem alterar o XML salvo em disco. */
      display = display.replace(/<fingering\b[^>]*>[\s\S]*?<\/fingering>/gi, '');
    }
    return display;
  }

  /**
   * Extrai eventos de nota, cursores e batidas a partir do MusicXML bruto (para playback/cursor).
   * Depende de `StaffMathUtils.midiToFreq` e `MetronomeUtils.fromMusicXmlElement` (carregados no head).
   */
  function parseMusicXml(xmlText) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlText, 'application/xml');
    if (!xmlDoc || xmlDoc.getElementsByTagName('parsererror').length > 0) return null;
    var parts = xmlDoc.querySelectorAll('score-partwise > part');
    if (!parts || !parts.length) return null;

    var events = [];
    var cursorStarts = [];
    var allCursorStarts = [];
    var beatEventsFromFirstPart = [];
    parts.forEach(function (part, partIndex) {
      var timelineSec = 0;
      var tempo = 60;
      var divisions = 1;
      var beatsPerMeasure = 4;
      var beatType = 4;
      var lastStartSec = 0;
      var measureBeatEvents = [];
      var partCursorStarts = [];
      /** Indice do ultimo evento de audio por voz+MIDI quando ha ligadura de valor em aberto. */
      var tieOpenEventIndex = {};

      var measures = part.querySelectorAll('measure');
      measures.forEach(function (measure, measureIdx) {
        var measureStartSec = timelineSec;
        var tempoFromSound = null;
        var soundTag = measure.querySelector('sound[tempo]');
        if (soundTag && soundTag.getAttribute('tempo')) {
          var tSound = parseFloat(soundTag.getAttribute('tempo'));
          if (isFinite(tSound) && tSound > 0) tempoFromSound = tSound;
        }
        var metroEl = measure.querySelector('metronome');
        var tempoFromMetro = window.MetronomeUtils.fromMusicXmlElement(metroEl);
        if (tempoFromSound != null) tempo = tempoFromSound;
        else if (tempoFromMetro != null) tempo = tempoFromMetro;
        var divNode = measure.querySelector('attributes divisions');
        if (divNode && divNode.textContent) {
          var divParsed = parseFloat(divNode.textContent);
          if (isFinite(divParsed) && divParsed > 0) divisions = divParsed;
        }
        var beatsNode = measure.querySelector('attributes time beats');
        var beatTypeNode = measure.querySelector('attributes time beat-type');
        if (beatsNode && beatsNode.textContent) {
          var bpmNum = parseInt(beatsNode.textContent || '4', 10);
          if (isFinite(bpmNum) && bpmNum > 0) beatsPerMeasure = bpmNum;
        }
        if (beatTypeNode && beatTypeNode.textContent) {
          var beatDen = parseInt(beatTypeNode.textContent || '4', 10);
          if (isFinite(beatDen) && beatDen > 0) beatType = beatDen;
        }

        var notes = measure.querySelectorAll('note');
        notes.forEach(function (noteNode) {
          if (noteNode.querySelector('grace')) return;

          var voiceNode = noteNode.querySelector('voice');
          var voiceNum = voiceNode && voiceNode.textContent ? voiceNode.textContent.trim() : '1';
          if (voiceNum !== '1') return;

          var durationNode = noteNode.querySelector('duration');
          var durationDiv = durationNode ? parseFloat(durationNode.textContent || '0') : 0;
          if (!isFinite(durationDiv) || durationDiv <= 0) durationDiv = 0;
          var durSec = Math.max(0.06, (durationDiv / divisions) * (60 / tempo));
          var isChord = !!noteNode.querySelector('chord');
          var isRest = !!noteNode.querySelector('rest');
          var startSec = isChord ? lastStartSec : timelineSec;

          var tieStart = false;
          var tieStop = false;
          var tieContinue = false;
          noteNode.querySelectorAll('tie, notations tied').forEach(function (tn) {
            var t = (tn.getAttribute('type') || '').toLowerCase();
            if (t === 'start') tieStart = true;
            if (t === 'stop') tieStop = true;
            if (t === 'continue') tieContinue = true;
          });

          var freq = 0;
          var midi = null;
          if (!isRest) {
            var stepNode = noteNode.querySelector('pitch step');
            var octNode = noteNode.querySelector('pitch octave');
            if (stepNode && octNode) {
              var step = (stepNode.textContent || '').trim().toUpperCase();
              var alterNode = noteNode.querySelector('pitch alter');
              var alter = alterNode ? parseInt(alterNode.textContent || '0', 10) : 0;
              var octave = parseInt(octNode.textContent || '4', 10);
              var map = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
              if (typeof map[step] === 'number' && isFinite(octave)) {
                midi = ((octave + 1) * 12) + map[step] + alter;
                freq = window.StaffMathUtils.midiToFreq(midi);
              }
            }
          }

          var tieKey = voiceNum + ':' + (midi != null ? String(midi) : 'rest');
          var extendedTie = false;
          if (!isRest && midi != null && !isChord && tieStop) {
            var prevIdx = tieOpenEventIndex[tieKey];
            var prevEv = prevIdx != null ? events[prevIdx] : null;
            if (!prevEv || prevEv.isRest || prevEv.midi !== midi) {
              for (var ei = events.length - 1; ei >= 0; ei--) {
                var cand = events[ei];
                if (!cand || cand.isRest || cand.midi !== midi) continue;
                var endAt = cand.startSec + cand.durationSec;
                if (Math.abs(endAt - startSec) < 0.0005) {
                  prevIdx = ei;
                  prevEv = cand;
                  break;
                }
              }
            }
            if (prevEv && !prevEv.isRest && prevEv.midi === midi) {
              prevEv.durationSec = Math.max(0.06, (prevEv.durationSec || 0) + durSec);
              extendedTie = true;
              if (tieStart || tieContinue) tieOpenEventIndex[tieKey] = prevIdx;
              else delete tieOpenEventIndex[tieKey];
            }
          }

          if (!extendedTie) {
            events.push({
              startSec: startSec,
              durationSec: durSec,
              isRest: isRest,
              isChord: isChord,
              midi: midi,
              freq: freq
            });
            if (isRest && !isChord) {
              Object.keys(tieOpenEventIndex).forEach(function (k) {
                if (k.indexOf(voiceNum + ':') === 0) delete tieOpenEventIndex[k];
              });
            } else if (!isRest && midi != null && !isChord) {
              if (tieStart || tieContinue) tieOpenEventIndex[tieKey] = events.length - 1;
              else if (!tieStop) delete tieOpenEventIndex[tieKey];
            }
          }

          if (!isChord) {
            partCursorStarts.push(startSec);
            allCursorStarts.push(startSec);
            timelineSec += durSec;
            lastStartSec = startSec;
          }
        });

        var measureDurationSec = Math.max(0, timelineSec - measureStartSec);
        var beatDurSec = (60 / Math.max(1, tempo)) * (4 / Math.max(1, beatType));
        if (beatDurSec > 0 && measureDurationSec > 0.0001) {
          var fullMeasureSec = beatDurSec * Math.max(1, beatsPerMeasure);
          var missingSec = Math.max(0, fullMeasureSec - measureDurationSec);
          var pickupBeats = measureIdx === 0 ? Math.round(missingSec / beatDurSec) : 0;
          var startBeatIndex = ((pickupBeats % Math.max(1, beatsPerMeasure)) + Math.max(1, beatsPerMeasure)) % Math.max(1, beatsPerMeasure);
          var beatCountThisMeasure = Math.max(1, Math.ceil(measureDurationSec / beatDurSec));
          var bi;
          for (bi = 0; bi < beatCountThisMeasure; bi++) {
            var beatSec = measureStartSec + (bi * beatDurSec);
            if (beatSec > timelineSec + 0.001) break;
            var beatIdxInBar = (startBeatIndex + bi) % Math.max(1, beatsPerMeasure);
            measureBeatEvents.push({
              sec: beatSec,
              accent: beatIdxInBar === 0
            });
          }
        }
      });

      if (partIndex === 0) {
        beatEventsFromFirstPart = measureBeatEvents;
      }
    });

    if (allCursorStarts.length) {
      allCursorStarts.sort(function (a, b) { return a - b; });
      var mergedCursorStarts = [];
      for (var ci = 0; ci < allCursorStarts.length; ci++) {
        var cs = allCursorStarts[ci];
        if (!mergedCursorStarts.length || Math.abs(cs - mergedCursorStarts[mergedCursorStarts.length - 1]) > 0.02) {
          mergedCursorStarts.push(cs);
        }
      }
      cursorStarts = mergedCursorStarts;
    }

    var totalDuration = 0;
    var totalDurationAll = 0;
    events.forEach(function (ev) {
      var endAt = ev.startSec + ev.durationSec;
      totalDurationAll = Math.max(totalDurationAll, endAt);
      if (!ev.isRest) totalDuration = Math.max(totalDuration, endAt);
    });
    if (totalDuration <= 0) totalDuration = totalDurationAll;
    events.sort(function (a, b) {
      if (a.startSec !== b.startSec) return a.startSec - b.startSec;
      if (!!a.isRest !== !!b.isRest) return a.isRest ? 1 : -1;
      return 0;
    });

    if (!events.length || totalDuration <= 0) return null;
    var beatEvents = beatEventsFromFirstPart && beatEventsFromFirstPart.length ? beatEventsFromFirstPart : [{ sec: 0, accent: true }];
    return {
      events: events,
      cursorStarts: cursorStarts,
      beatEvents: beatEvents,
      totalDurationSec: totalDuration
    };
  }

  window.PlayerMusicXmlUtils = window.PlayerMusicXmlUtils || {};
  window.PlayerMusicXmlUtils.buildDisplayMusicXml = buildDisplayMusicXml;
  window.PlayerMusicXmlUtils.parseMusicXml = parseMusicXml;
})();
