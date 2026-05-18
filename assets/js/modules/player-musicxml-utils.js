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
   * Remove marcas de repetição e voltas quando algum consumidor precisar de uma cópia linear do XML.
   * O parser principal abaixo mantém as marcas para montar a linha de playback expandida.
   */
  function stripPlaybackRepeatMarks(xmlText) {
    var s = String(xmlText || '');
    if (!s) return s;
    s = s.replace(/<repeat\b[^>]*\/>/gi, '');
    s = s.replace(/<repeat\b[^>]*>[\s\S]*?<\/repeat>/gi, '');
    s = s.replace(/<ending\b[^>]*\/>/gi, '');
    s = s.replace(/<ending\b[^>]*>[\s\S]*?<\/ending>/gi, '');
    return s;
  }

  function parseEndingNumbers(value) {
    var nums = [];
    String(value || '').split(/[,\s]+/).forEach(function (part) {
      var n = parseInt(part, 10);
      if (isFinite(n) && n > 0 && nums.indexOf(n) < 0) nums.push(n);
    });
    return nums;
  }

  function collectMeasureEndingNumbers(measure) {
    var out = [];
    measure.querySelectorAll('ending[number]').forEach(function (ending) {
      parseEndingNumbers(ending.getAttribute('number')).forEach(function (n) {
        if (out.indexOf(n) < 0) out.push(n);
      });
    });
    return out;
  }

  function measureHasForwardRepeat(measure) {
    return !!measure.querySelector('repeat[direction="forward"]');
  }

  function measureBackwardRepeatTimes(measure) {
    var repeat = measure.querySelector('repeat[direction="backward"]');
    if (!repeat) return 0;
    var times = parseInt(repeat.getAttribute('times') || '2', 10);
    return isFinite(times) && times > 0 ? times : 2;
  }

  function maxEndingNumberInRange(measures, startIdx, endIdx) {
    var max = 0;
    var i;
    for (i = Math.max(0, startIdx); i <= endIdx && i < measures.length; i++) {
      measures[i].endingNumbers.forEach(function (n) {
        if (n > max) max = n;
      });
    }
    for (i = endIdx + 1; i < measures.length; i++) {
      if (!measures[i].endingNumbers.length) break;
      measures[i].endingNumbers.forEach(function (n) {
        if (n > max) max = n;
      });
    }
    return max;
  }

  function shouldPlayMeasureOnPass(measureInfo, passNumber) {
    if (!measureInfo || !measureInfo.endingNumbers || !measureInfo.endingNumbers.length) return true;
    return measureInfo.endingNumbers.indexOf(passNumber) >= 0;
  }

  function buildMeasurePlaybackSegments(measures) {
    if (!measures || !measures.length) return null;
    var hasRepeatStructure = false;
    measures.forEach(function (m) {
      if (m.hasForwardRepeat || m.backwardRepeatTimes || (m.endingNumbers && m.endingNumbers.length)) {
        hasRepeatStructure = true;
      }
    });
    if (!hasRepeatStructure) return null;

    var segments = [];
    var playbackSec = 0;
    var repeatStartIdx = 0;
    var passNumber = 1;
    var resetPassAfterEnding = false;
    var i = 0;
    var guard = 0;

    while (i < measures.length && guard < measures.length * 12) {
      guard += 1;
      var m = measures[i];

      if (resetPassAfterEnding && !m.endingNumbers.length) {
        passNumber = 1;
        resetPassAfterEnding = false;
      }
      if (m.hasForwardRepeat && passNumber === 1) {
        repeatStartIdx = i;
      }

      if (shouldPlayMeasureOnPass(m, passNumber) && m.durationSec > 0) {
        segments.push({
          measureIndex: i,
          passNumber: passNumber,
          playbackStart: playbackSec,
          playbackEnd: playbackSec + m.durationSec,
          displayStart: m.startSec,
          displayEnd: m.endSec,
          xmlMeasureNum: m.xmlMeasureNum
        });
        playbackSec += m.durationSec;
      }

      if (m.backwardRepeatTimes) {
        var totalPasses = Math.max(
          2,
          m.backwardRepeatTimes,
          maxEndingNumberInRange(measures, repeatStartIdx, i)
        );
        if (passNumber < totalPasses) {
          passNumber += 1;
          i = repeatStartIdx;
          continue;
        }
        resetPassAfterEnding = true;
        repeatStartIdx = i + 1;
      }

      i += 1;
    }

    return segments.length ? segments : null;
  }

  function copyTimedItemWithStart(item, startKey, newStart) {
    var copy = {};
    Object.keys(item).forEach(function (k) { copy[k] = item[k]; });
    copy[startKey] = newStart;
    return copy;
  }

  function mergeTimeList(values) {
    if (!values.length) return [];
    values.sort(function (a, b) { return a - b; });
    var merged = [];
    for (var i = 0; i < values.length; i++) {
      var v = values[i];
      if (!merged.length || Math.abs(v - merged[merged.length - 1]) > 0.02) merged.push(v);
    }
    return merged;
  }

  /**
   * Extrai eventos de nota, cursores e batidas a partir do MusicXML (para playback/cursor).
   * A partitura desenhada fica original; o áudio expande retornelas e casas quando o MusicXML as informa.
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
    var allVisualCursorStarts = [];
    var beatEventsFromFirstPart = [];
    var repeatMap = [];
    /** Andamento “da partitura” para o controlo de velocidade (ex.: ♩=78 → 78, unidade semínima). */
    var scoreBaselineMarkingBpm = null;
    var scoreBaselineMarkingBeatUnit = 'quarter';

    parts.forEach(function (part, partIndex) {
      var timelineSec = 0;
      var tempo = 60;
      var divisions = 1;
      var beatsPerMeasure = 4;
      var beatType = 4;
      var lastStartSec = 0;
      var measureBeatEvents = [];
      var partCursorStarts = [];
      var partEvents = [];
      var measureInfos = [];
      /** Indice do ultimo evento de audio por voz+MIDI quando ha ligadura de valor em aberto. */
      var tieOpenEventIndex = {};

      var measures = part.querySelectorAll('measure');
      measures.forEach(function (measure, measureIdx) {
        var mnAttr = measure.getAttribute ? measure.getAttribute('number') : null;
        var xmlMeasureNum = mnAttr ? parseInt(mnAttr, 10) : NaN;
        if (!isFinite(xmlMeasureNum) || xmlMeasureNum <= 0) xmlMeasureNum = measureIdx + 1;

        var measureStartSec = timelineSec;
        var measureEvents = [];
        var measureCursors = [];
        var measureBeats = [];
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
        if (partIndex === 0 && scoreBaselineMarkingBpm == null) {
          if (tempoFromSound != null && isFinite(tempoFromSound) && tempoFromSound > 0) {
            scoreBaselineMarkingBpm = tempoFromSound;
            scoreBaselineMarkingBeatUnit = 'quarter';
          } else if (metroEl) {
            var perMinEl = metroEl.querySelector('per-minute');
            if (perMinEl && perMinEl.textContent) {
              var rawMark = parseFloat(perMinEl.textContent);
              if (isFinite(rawMark) && rawMark > 0) {
                scoreBaselineMarkingBpm = rawMark;
                var buEl = metroEl.querySelector('beat-unit');
                scoreBaselineMarkingBeatUnit = buEl && buEl.textContent
                  ? String(buEl.textContent).trim().toLowerCase()
                  : 'quarter';
              }
            }
          }
        }
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
            var prevEv = prevIdx != null ? partEvents[prevIdx] : null;
            if (!prevEv || prevEv.isRest || prevEv.midi !== midi) {
              for (var ei = partEvents.length - 1; ei >= 0; ei--) {
                var cand = partEvents[ei];
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
            var evObj = {
              startSec: startSec,
              durationSec: durSec,
              isRest: isRest,
              isChord: isChord,
              midi: midi,
              freq: freq
            };
            partEvents.push(evObj);
            measureEvents.push(evObj);
            if (isRest && !isChord) {
              Object.keys(tieOpenEventIndex).forEach(function (k) {
                if (k.indexOf(voiceNum + ':') === 0) delete tieOpenEventIndex[k];
              });
            } else if (!isRest && midi != null && !isChord) {
              if (tieStart || tieContinue) tieOpenEventIndex[tieKey] = partEvents.length - 1;
              else if (!tieStop) delete tieOpenEventIndex[tieKey];
            }
          }

          if (!isChord) {
            partCursorStarts.push(startSec);
            measureCursors.push(startSec);
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
            var beatObj = {
              sec: beatSec,
              accent: beatIdxInBar === 0
            };
            measureBeatEvents.push(beatObj);
            measureBeats.push(beatObj);
          }
        }
        if (partIndex === 0 && measureIdx === 0 && scoreBaselineMarkingBpm == null && isFinite(tempo) && tempo > 0) {
          scoreBaselineMarkingBpm = tempo;
          scoreBaselineMarkingBeatUnit = 'quarter';
        }
        measureInfos.push({
          startSec: measureStartSec,
          endSec: timelineSec,
          durationSec: Math.max(0, timelineSec - measureStartSec),
          events: measureEvents,
          cursorStarts: measureCursors,
          beatEvents: measureBeats,
          endingNumbers: collectMeasureEndingNumbers(measure),
          hasForwardRepeat: measureHasForwardRepeat(measure),
          backwardRepeatTimes: measureBackwardRepeatTimes(measure),
          xmlMeasureNum: xmlMeasureNum
        });
      });

      var playbackSegments = buildMeasurePlaybackSegments(measureInfos);
      if (playbackSegments && playbackSegments.length) {
        if (partIndex === 0) repeatMap = playbackSegments;
        playbackSegments.forEach(function (seg) {
          var info = measureInfos[seg.measureIndex];
          if (!info) return;
          info.events.forEach(function (ev) {
            var rel = ev.startSec - info.startSec;
            events.push(copyTimedItemWithStart(ev, 'startSec', seg.playbackStart + rel));
          });
          info.cursorStarts.forEach(function (cs) {
            allCursorStarts.push(seg.playbackStart + (cs - info.startSec));
          });
          if (partIndex === 0) {
            info.beatEvents.forEach(function (beat) {
              beatEventsFromFirstPart.push(copyTimedItemWithStart(
                beat,
                'sec',
                seg.playbackStart + (beat.sec - info.startSec)
              ));
            });
          }
        });
      } else {
        partEvents.forEach(function (ev) { events.push(ev); });
        partCursorStarts.forEach(function (cs) { allCursorStarts.push(cs); });
        if (partIndex === 0) beatEventsFromFirstPart = measureBeatEvents;
      }
      partCursorStarts.forEach(function (cs) { allVisualCursorStarts.push(cs); });
    });

    if (allCursorStarts.length) {
      cursorStarts = mergeTimeList(allCursorStarts);
    }
    var visualCursorStarts = mergeTimeList(allVisualCursorStarts);

    var beatEvents = beatEventsFromFirstPart && beatEventsFromFirstPart.length
      ? beatEventsFromFirstPart
      : [{ sec: 0, accent: true }];
    var totalDuration = 0;
    events.forEach(function (ev) {
      var endAt = ev.startSec + ev.durationSec;
      totalDuration = Math.max(totalDuration, endAt);
    });
    events.sort(function (a, b) {
      if (a.startSec !== b.startSec) return a.startSec - b.startSec;
      if (!!a.isRest !== !!b.isRest) return a.isRest ? 1 : -1;
      return 0;
    });

    if (!events.length || totalDuration <= 0) return null;
    if (!isFinite(scoreBaselineMarkingBpm) || scoreBaselineMarkingBpm <= 0) {
      scoreBaselineMarkingBpm = 60;
      scoreBaselineMarkingBeatUnit = 'quarter';
    }
    return {
      events: events,
      cursorStarts: cursorStarts,
      visualCursorStarts: visualCursorStarts.length ? visualCursorStarts : cursorStarts,
      beatEvents: beatEvents,
      totalDurationSec: totalDuration,
      repeatMap: repeatMap,
      voltaPlaybackMap: null,
      baselineMarkingBpm: scoreBaselineMarkingBpm,
      baselineMarkingBeatUnit: scoreBaselineMarkingBeatUnit
    };
  }

  window.PlayerMusicXmlUtils = window.PlayerMusicXmlUtils || {};
  window.PlayerMusicXmlUtils.buildDisplayMusicXml = buildDisplayMusicXml;
  window.PlayerMusicXmlUtils.stripPlaybackRepeatMarks = stripPlaybackRepeatMarks;
  window.PlayerMusicXmlUtils.parseMusicXml = parseMusicXml;
})();
