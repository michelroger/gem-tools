/* Utilitarios de nota/tonalidade. */
(function () {
  'use strict';

  function getNoteNameInKey(noteId, key) {
    var base = { do: 'Dó', re: 'Ré', mi: 'Mi', fa: 'Fá', sol: 'Sol', la: 'Lá', si: 'Si' };
    var nome = base[noteId] || '';
    if (!key) return nome;
    if (key.sustenidos && key.sustenidos.indexOf(noteId) >= 0) return nome + '♯';
    if (key.bemolis && key.bemolis.indexOf(noteId) >= 0) return nome + '♭';
    return nome;
  }

  function freqClose(a, b, toleranceHz) {
    var tolerance = typeof toleranceHz === 'number' ? toleranceHz : 0.5;
    if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) return false;
    return Math.abs(a - b) <= tolerance;
  }

  function buildChallengeTargetLabel(target, key) {
    if (!target) return '';
    var noteLabel = getNoteNameInKey(target.id, key);
    if (target.stringKey) {
      return noteLabel + ' da corda ' + getNoteNameInKey(target.stringKey, key);
    }
    return noteLabel;
  }

  window.NoteUtils = window.NoteUtils || {};
  window.NoteUtils.getNoteNameInKey = getNoteNameInKey;
  window.NoteUtils.freqClose = freqClose;
  window.NoteUtils.buildChallengeTargetLabel = buildChallengeTargetLabel;
})();
