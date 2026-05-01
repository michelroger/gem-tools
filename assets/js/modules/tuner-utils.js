/* Utilitarios puros de afinador (notas, MIDI e rótulos). */
(function () {
  'use strict';

  var NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  function noteToMidi(noteName) {
    var m = /^([A-G])(#?)(-?\d+)$/.exec(String(noteName || '').trim());
    if (!m) return null;
    var key = m[1] + (m[2] || '');
    var octave = parseInt(m[3], 10);
    var index = NOTE_NAMES.indexOf(key);
    if (index === -1 || isNaN(octave)) return null;
    return (octave + 1) * 12 + index;
  }

  function midiToName(midi) {
    var idx = ((midi % 12) + 12) % 12;
    var oct = Math.floor(midi / 12) - 1;
    return NOTE_NAMES[idx] + String(oct);
  }

  function humanNoteLabel(noteName) {
    var m = /^([A-G])(#?)(-?\d+)?$/.exec(String(noteName || '').trim());
    if (!m) return String(noteName || '--');
    var letter = m[1];
    var sharp = m[2] || '';
    var map = {
      C: 'Dó',
      D: 'Ré',
      E: 'Mi',
      F: 'Fá',
      G: 'Sol',
      A: 'Lá',
      B: 'Si'
    };
    var base = map[letter] || letter;
    return base + sharp;
  }

  function humanNoteWithOctave(noteName) {
    var m = /^([A-G])(#?)(-?\d+)?$/.exec(String(noteName || '').trim());
    if (!m) return String(noteName || '--');
    var octave = m[3] || '';
    return humanNoteLabel(m[1] + (m[2] || '')) + octave;
  }

  function adjacentHumanLabels(noteName) {
    var midi = noteToMidi(noteName);
    if (midi === null) return { prev: '--', next: '--' };
    return {
      prev: humanNoteLabel(midiToName(midi - 1)),
      next: humanNoteLabel(midiToName(midi + 1))
    };
  }

  function freqToMidi(freq) {
    return Math.round(69 + 12 * Math.log(freq / 440) / Math.log(2));
  }

  function median(values) {
    if (!values || !values.length) return 0;
    var arr = values.slice().sort(function (a, b) { return a - b; });
    var m = Math.floor(arr.length / 2);
    if (arr.length % 2) return arr[m];
    return (arr[m - 1] + arr[m]) / 2;
  }

  function getSmoothingConfig() {
    return { alpha: 0.55, medianWindow: 2 };
  }

  function presetTargetForFreq(freq, notes, noteToMidiFn, midiToFreqFn) {
    var list = Array.isArray(notes) ? notes : [];
    if (!list.length) return null;
    var noteToMidi = typeof noteToMidiFn === 'function' ? noteToMidiFn : noteToMidi;
    var midiToFreq = typeof midiToFreqFn === 'function'
      ? midiToFreqFn
      : function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };

    var best = null;
    var bestDiff = Infinity;
    list.forEach(function (n) {
      var midi = noteToMidi(n);
      if (midi === null) return;
      var f = midiToFreq(midi);
      var diff = Math.abs(freq - f);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = { note: n, freq: f };
      }
    });
    return best;
  }

  function noteFrequency(noteName, noteToMidiFn, midiToFreqFn) {
    var noteToMidi = typeof noteToMidiFn === 'function' ? noteToMidiFn : noteToMidi;
    var midiToFreq = typeof midiToFreqFn === 'function'
      ? midiToFreqFn
      : function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
    var midi = noteToMidi(noteName);
    if (midi === null) return null;
    return midiToFreq(midi);
  }

  function statusFromDeviation(deviationHz, toleranceHz) {
    var tolerance = typeof toleranceHz === 'number' ? toleranceHz : 0.8;
    if (Math.abs(deviationHz) <= tolerance) {
      return { mode: 'ok', text: 'Afinado' };
    }
    if (deviationHz < 0) {
      return { mode: 'flat', text: 'Apertar' };
    }
    return { mode: 'sharp', text: 'Afrouxar' };
  }

  function formatHz(value, decimals) {
    if (!isFinite(value)) return '-- Hz';
    var d = typeof decimals === 'number' ? decimals : 2;
    return Number(value).toFixed(d) + ' Hz';
  }

  function formatSignedHz(value, decimals) {
    if (!isFinite(value)) return '-- Hz';
    var d = typeof decimals === 'number' ? decimals : 1;
    var sign = value >= 0 ? '+' : '-';
    return sign + Math.abs(Number(value)).toFixed(d) + ' Hz';
  }

  function idleUiState() {
    return {
      cents: 0,
      status: 'idle',
      note: '--',
      targetFreq: 0,
      rawHistory: []
    };
  }

  function chartBounds(history, minSpan) {
    if (!Array.isArray(history) || !history.length) return null;
    var min = Math.min.apply(null, history);
    var max = Math.max.apply(null, history);
    if (!isFinite(min) || !isFinite(max)) return null;
    var span = typeof minSpan === 'number' ? minSpan : 2;
    if (max - min < span) {
      var half = span / 2;
      var center = (max + min) / 2;
      min = center - half;
      max = center + half;
    }
    return { min: min, max: max };
  }

  function analyzeFrequency(freq, deps) {
    var d = deps || {};
    var freqToMidiFn = typeof d.freqToMidi === 'function' ? d.freqToMidi : freqToMidi;
    var midiToFreqFn = typeof d.midiToFreq === 'function'
      ? d.midiToFreq
      : function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
    var midiToNameFn = typeof d.midiToName === 'function' ? d.midiToName : midiToName;
    var presetTargetFn = typeof d.presetTargetForFreq === 'function' ? d.presetTargetForFreq : null;

    var midi = freqToMidiFn(freq);
    var targetFreq = midiToFreqFn(midi);
    var noteName = midiToNameFn(midi);
    var presetTarget = presetTargetFn ? presetTargetFn(freq) : null;

    if (presetTarget) {
      targetFreq = presetTarget.freq;
      noteName = presetTarget.note;
    }

    return {
      midi: midi,
      targetFreq: targetFreq,
      noteName: noteName,
      deviationHz: freq - targetFreq
    };
  }

  function nextSmoothedFrequency(currentSmoothed, filteredValue, alpha) {
    var f = Number(filteredValue);
    if (!isFinite(f) || f <= 0) return Number(currentSmoothed) || 0;
    var cur = Number(currentSmoothed) || 0;
    var a = Number(alpha);
    if (!isFinite(a)) a = 0.55;
    if (!cur) return f;
    return cur + a * (f - cur);
  }

  function pushWithLimit(list, value, limit) {
    if (!Array.isArray(list)) return [];
    list.push(value);
    var max = Number(limit) || 0;
    if (max > 0 && list.length > max) list.shift();
    return list;
  }

  function noSignalPlaceholders() {
    return {
      note: '--',
      target: '-- Hz',
      deviation: '-- Hz',
      statusText: 'Toque uma nota sustentada'
    };
  }

  function normalizeFrequency(freq, notes, deps) {
    if (!isFinite(freq) || freq <= 0) return -1;
    var d = deps || {};
    // Leitura ao vivo: escolhe harmônico do sinal bruto mais próximo da nota esperada na partitura.
    var hint = d.hintExpectedFreq;
    if (isFinite(hint) && hint > 0) {
      var liveCand = [freq, freq / 2, freq / 3, freq / 4, freq / 5, freq * 2, freq * 3, freq * 4];
      var bestH = freq;
      var bestS = Infinity;
      liveCand.forEach(function (cand) {
        if (!isFinite(cand) || cand < 35 || cand > 1200) return;
        var s = Math.abs(Math.log(cand / hint));
        if (s < bestS) {
          bestS = s;
          bestH = cand;
        }
      });
      freq = bestH;
    }
    var freqToMidiFn = typeof d.freqToMidi === 'function' ? d.freqToMidi : freqToMidi;
    var midiToFreqFn = typeof d.midiToFreq === 'function'
      ? d.midiToFreq
      : function (midi) { return 440 * Math.pow(2, (midi - 69) / 12); };
    var noteToMidiFn = typeof d.noteToMidi === 'function' ? d.noteToMidi : noteToMidi;
    var presetTargetFn = typeof d.presetTargetForFreq === 'function' ? d.presetTargetForFreq : presetTargetForFreq;

    var candidates = [freq, freq / 2, freq / 3, freq / 4, freq * 2];
    var bestFreq = freq;
    var bestScore = Infinity;
    var hasPreset = Array.isArray(notes) && notes.length > 0;

    candidates.forEach(function (candidate) {
      if (!isFinite(candidate) || candidate < 35 || candidate > 1200) return;
      var score;
      if (hasPreset) {
        var target = presetTargetFn(candidate, notes, noteToMidiFn, midiToFreqFn);
        if (!target) return;
        score = Math.abs(Math.log(candidate / target.freq));
      } else {
        var midi = freqToMidiFn(candidate);
        var targetFreq = midiToFreqFn(midi);
        score = Math.abs(Math.log(candidate / targetFreq));
      }
      if (score < bestScore) {
        bestScore = score;
        bestFreq = candidate;
      }
    });

    return bestScore < 0.12 ? bestFreq : freq;
  }

  window.TunerUtils = window.TunerUtils || {};
  window.TunerUtils.noteToMidi = noteToMidi;
  window.TunerUtils.midiToName = midiToName;
  window.TunerUtils.humanNoteLabel = humanNoteLabel;
  window.TunerUtils.humanNoteWithOctave = humanNoteWithOctave;
  window.TunerUtils.adjacentHumanLabels = adjacentHumanLabels;
  window.TunerUtils.freqToMidi = freqToMidi;
  window.TunerUtils.median = median;
  window.TunerUtils.getSmoothingConfig = getSmoothingConfig;
  window.TunerUtils.presetTargetForFreq = presetTargetForFreq;
  window.TunerUtils.normalizeFrequency = normalizeFrequency;
  window.TunerUtils.noteFrequency = noteFrequency;
  window.TunerUtils.statusFromDeviation = statusFromDeviation;
  window.TunerUtils.formatHz = formatHz;
  window.TunerUtils.formatSignedHz = formatSignedHz;
  window.TunerUtils.idleUiState = idleUiState;
  window.TunerUtils.chartBounds = chartBounds;
  window.TunerUtils.analyzeFrequency = analyzeFrequency;
  window.TunerUtils.nextSmoothedFrequency = nextSmoothedFrequency;
  window.TunerUtils.pushWithLimit = pushWithLimit;
  window.TunerUtils.noSignalPlaceholders = noSignalPlaceholders;
})();
