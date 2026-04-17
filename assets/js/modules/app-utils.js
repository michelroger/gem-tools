/* Utilitarios compartilhados entre modulos da aplicacao. */
(function () {
  'use strict';

  function clampNumber(value, min, max) {
    var n = Number(value);
    if (!isFinite(n)) n = min;
    return Math.max(min, Math.min(max, n));
  }

  function formatMmSs(seconds) {
    var safe = Math.max(0, Math.floor(Number(seconds) || 0));
    var mm = String(Math.floor(safe / 60)).padStart(2, '0');
    var ss = String(safe % 60).padStart(2, '0');
    return mm + ':' + ss;
  }

  function normalizeSearchText(text) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function parseNumeroInput(value) {
    var text = String(value || '').trim();
    if (!text) return null;
    var num = parseInt(text, 10);
    if (!isFinite(num)) return null;
    return num;
  }

  window.AppUtils = window.AppUtils || {};
  window.AppUtils.clampNumber = clampNumber;
  window.AppUtils.formatMmSs = formatMmSs;
  window.AppUtils.normalizeSearchText = normalizeSearchText;
  window.AppUtils.parseNumeroInput = parseNumeroInput;
})();
