/* Utilitarios puros relacionados ao metrônomo do player. */
(function () {
  'use strict';

  function beatUnitToQuarterFactor(beatUnit) {
    var u = String(beatUnit || 'quarter').toLowerCase().trim();
    if (u === 'breve') return 8;
    if (u === 'whole') return 4;
    if (u === 'half') return 2;
    if (u === 'quarter') return 1;
    if (u === 'eighth') return 0.5;
    if (u === '16th') return 0.25;
    if (u === '32nd') return 0.125;
    if (u === '64th') return 0.0625;
    return 1;
  }

  function toQuarterNotesPerMinute(beatUnit, beatsPerMinute) {
    var bpm = Number(beatsPerMinute);
    if (!isFinite(bpm) || bpm <= 0) bpm = 60;
    return bpm * beatUnitToQuarterFactor(beatUnit);
  }

  function fromMusicXmlElement(metroEl) {
    if (!metroEl) return null;
    var perMinNode = metroEl.querySelector('per-minute');
    if (!perMinNode || !perMinNode.textContent) return null;
    var perMin = parseFloat(perMinNode.textContent);
    if (!isFinite(perMin) || perMin <= 0) return null;
    var beatUnitNode = metroEl.querySelector('beat-unit');
    var beatUnit = beatUnitNode && beatUnitNode.textContent ? beatUnitNode.textContent : 'quarter';
    var qPerBeat = beatUnitToQuarterFactor(beatUnit);
    if (metroEl.querySelector('beat-unit-dot')) qPerBeat *= 1.5;
    return perMin * qPerBeat;
  }

  window.MetronomeUtils = window.MetronomeUtils || {};
  window.MetronomeUtils.beatUnitToQuarterFactor = beatUnitToQuarterFactor;
  window.MetronomeUtils.toQuarterNotesPerMinute = toQuarterNotesPerMinute;
  window.MetronomeUtils.fromMusicXmlElement = fromMusicXmlElement;
})();
