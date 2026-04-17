/* Utilitarios de velocidade do player. */
(function () {
  'use strict';

  function clampSpeedPercent(percent) {
    return Math.max(30, Math.min(300, Math.round(Number(percent) || 100)));
  }

  function rateToPercent(rate) {
    return clampSpeedPercent((Number(rate) || 1) * 100);
  }

  function percentToRate(percent) {
    var pct = clampSpeedPercent(percent);
    var rate = pct / 100;
    if (!isFinite(rate) || rate <= 0) rate = 1;
    return rate;
  }

  function formatSpeedLabel(percent) {
    var pct = clampSpeedPercent(percent);
    return 'Velocidade: ' + pct + '%';
  }

  window.PlayerSpeedUtils = window.PlayerSpeedUtils || {};
  window.PlayerSpeedUtils.clampSpeedPercent = clampSpeedPercent;
  window.PlayerSpeedUtils.rateToPercent = rateToPercent;
  window.PlayerSpeedUtils.percentToRate = percentToRate;
  window.PlayerSpeedUtils.formatSpeedLabel = formatSpeedLabel;
})();
