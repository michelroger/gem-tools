/* Utilitarios de velocidade do player (BPM relativos ao andamento da partitura). */
(function () {
  'use strict';

  var PLAYER_BPM_MIN = 20;
  var PLAYER_BPM_MAX = 320;

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

  function baselineMarkingBpmFromScore(scoreData) {
    var b = scoreData && scoreData.baselineMarkingBpm;
    if (isFinite(b) && b > 0) return b;
    return 60;
  }

  function baselineBeatUnitFromScore(scoreData) {
    var u = scoreData && scoreData.baselineMarkingBeatUnit;
    return u ? String(u).toLowerCase().trim() : 'quarter';
  }

  function clampPlayerBpm(bpm) {
    return Math.max(PLAYER_BPM_MIN, Math.min(PLAYER_BPM_MAX, Math.round(Number(bpm) || 60)));
  }

  function rateFromBpm(userBpm, baselineBpm) {
    var base = (isFinite(baselineBpm) && baselineBpm > 0) ? baselineBpm : 60;
    var u = clampPlayerBpm(userBpm);
    var r = u / base;
    if (!isFinite(r) || r <= 0) r = 1;
    return Math.max(0.08, Math.min(8, r));
  }

  function bpmFromRate(rate, baselineBpm) {
    var base = (isFinite(baselineBpm) && baselineBpm > 0) ? baselineBpm : 60;
    var r = Number(rate) || 1;
    return clampPlayerBpm(Math.round(r * base));
  }

  function beatUnitLabelPt(beatUnit) {
    var u = String(beatUnit || 'quarter').toLowerCase();
    if (u === 'half') return 'mínimas/min';
    if (u === 'whole') return 'redondas/min';
    if (u === 'eighth') return 'colcheias/min';
    if (u === '16th') return 'semicolcheias/min';
    if (u === '32nd') return 'fusa/min';
    return 'semínimas/min';
  }

  function formatSpeedLabelFromBpm(userBpm, beatUnit) {
    var bpm = clampPlayerBpm(userBpm);
    return 'Tempo: ' + bpm + ' ' + beatUnitLabelPt(beatUnit);
  }

  window.PlayerSpeedUtils = window.PlayerSpeedUtils || {};
  window.PlayerSpeedUtils.clampSpeedPercent = clampSpeedPercent;
  window.PlayerSpeedUtils.rateToPercent = rateToPercent;
  window.PlayerSpeedUtils.percentToRate = percentToRate;
  window.PlayerSpeedUtils.formatSpeedLabel = formatSpeedLabel;
  window.PlayerSpeedUtils.PLAYER_BPM_MIN = PLAYER_BPM_MIN;
  window.PlayerSpeedUtils.PLAYER_BPM_MAX = PLAYER_BPM_MAX;
  window.PlayerSpeedUtils.baselineMarkingBpmFromScore = baselineMarkingBpmFromScore;
  window.PlayerSpeedUtils.baselineBeatUnitFromScore = baselineBeatUnitFromScore;
  window.PlayerSpeedUtils.clampPlayerBpm = clampPlayerBpm;
  window.PlayerSpeedUtils.rateFromBpm = rateFromBpm;
  window.PlayerSpeedUtils.bpmFromRate = bpmFromRate;
  window.PlayerSpeedUtils.beatUnitLabelPt = beatUnitLabelPt;
  window.PlayerSpeedUtils.formatSpeedLabelFromBpm = formatSpeedLabelFromBpm;
})();
