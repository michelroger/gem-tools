/* UI e clique de audio do metronomo (estado via MetronomeUiBindingAccess / MetroUiRefs). */
(function () {
  'use strict';

  function tempoLabel(bpm) {
    if (bpm < 60) return 'Lento';
    if (bpm < 90) return 'Médio';
    return 'Rápido';
  }

  function renderMetroDots() {
    var d = window.MetroUiRefs;
    var a = window.MetronomeUiBindingAccess;
    if (!d || !d.dotsEl || !a) return;
    var beats = a.getMetroBeatsPerBar();
    d.dotsEl.innerHTML = '';
    var dotSize = 56;
    if (beats >= 9) dotSize = 30;
    else if (beats >= 6) dotSize = 34;
    else if (beats >= 5) dotSize = 38;
    d.dotsEl.style.setProperty('--dot-size', dotSize + 'px');

    var useTwoRows = beats >= 6;
    d.dotsEl.classList.toggle('two-rows', useTwoRows);
    if (useTwoRows) {
      d.dotsEl.style.setProperty('--metro-dot-cols', String(Math.ceil(beats / 2)));
    } else {
      d.dotsEl.style.removeProperty('--metro-dot-cols');
    }

    for (var i = 0; i < beats; i++) {
      var dot = document.createElement('span');
      dot.className = 'metro-dot';
      dot.dataset.beatIndex = String(i + 1);
      dot.textContent = String(i + 1);
      dot.setAttribute('aria-label', 'Batida ' + String(i + 1));
      dot.style.setProperty('--dot-size', dotSize + 'px');
      d.dotsEl.appendChild(dot);
    }
  }

  function highlightMetroBeat(beatIndex) {
    var d = window.MetroUiRefs;
    var a = window.MetronomeUiBindingAccess;
    if (!d || !d.dotsEl || !a) return;
    var beats = a.getMetroBeatsPerBar();
    var dots = d.dotsEl.querySelectorAll('.metro-dot');
    dots.forEach(function (el) {
      el.classList.remove('active', 'accent');
    });
    var idx = beatIndex - 1;
    if (idx < 0 || idx >= beats) return;
    var dot = dots[idx];
    if (!dot) return;
    dot.classList.add('active');
    if (a.getMetroAccentFirst() && beatIndex === 1) dot.classList.add('accent');
  }

  function triggerMetroVisualPulse(isAccent) {
    var d = window.MetroUiRefs;
    if (!d || !d.visualFlashEl) return;
    d.visualFlashEl.classList.remove('pulse', 'accent');
    void d.visualFlashEl.offsetWidth;
    if (isAccent) d.visualFlashEl.classList.add('accent');
    d.visualFlashEl.classList.add('pulse');
    if (d.visualPulseTimer) clearTimeout(d.visualPulseTimer);
    d.visualPulseTimer = setTimeout(function () {
      if (!d.visualFlashEl) return;
      d.visualFlashEl.classList.remove('pulse', 'accent');
    }, 240);
  }

  function playMetroClick(accent, whenTime) {
    var a = window.MetronomeUiBindingAccess;
    if (!a || !a.isSoundEnabled || !a.isSoundEnabled()) return;
    var ctx = a.ensureMetroAudioCtx ? a.ensureMetroAudioCtx() : null;
    if (!ctx) return;

    var t = whenTime != null ? whenTime : ctx.currentTime;
    var osc = ctx.createOscillator();
    var g = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(accent ? 1600 : 1200, t);

    var calm = a.isCalmMode && a.isCalmMode();
    var vol = calm ? (accent ? 0.22 : 0.15) : (accent ? 0.38 : 0.28);
    var attack = 0.002;
    var decay = accent ? 0.05 : 0.045;

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);

    osc.connect(g);
    g.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + decay + 0.01);
  }

  window.MetronomeUiCore = {
    tempoLabel: tempoLabel,
    renderMetroDots: renderMetroDots,
    highlightMetroBeat: highlightMetroBeat,
    triggerMetroVisualPulse: triggerMetroVisualPulse,
    playMetroClick: playMetroClick
  };
})();
