/* Utilitarios matematicos de pentagrama/altura. */
(function () {
  'use strict';

  function diatonicValue(noteId, octave, noteDegreeMap) {
    return (octave * 7) + noteDegreeMap[noteId];
  }

  function noteFromDiatonic(value, degreeNoteIdMap) {
    var octave = Math.floor(value / 7);
    var degree = value % 7;
    if (degree < 0) {
      degree += 7;
      octave -= 1;
    }
    return { noteId: degreeNoteIdMap[degree], octave: octave };
  }

  function naturalMidi(noteId, octave, noteSemitoneMap) {
    return (octave + 1) * 12 + noteSemitoneMap[noteId];
  }

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  function getLedgerLineDiffs(diff) {
    var ledgerDiffs = [];
    if (diff < -1) {
      for (var d = -2; d >= diff; d -= 2) ledgerDiffs.push(d);
    } else if (diff > 9) {
      for (var d2 = 10; d2 <= diff; d2 += 2) ledgerDiffs.push(d2);
    }
    return ledgerDiffs;
  }

  window.StaffMathUtils = window.StaffMathUtils || {};
  window.StaffMathUtils.diatonicValue = diatonicValue;
  window.StaffMathUtils.noteFromDiatonic = noteFromDiatonic;
  window.StaffMathUtils.naturalMidi = naturalMidi;
  window.StaffMathUtils.midiToFreq = midiToFreq;
  window.StaffMathUtils.getLedgerLineDiffs = getLedgerLineDiffs;
})();
