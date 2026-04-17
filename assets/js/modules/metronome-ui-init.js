/* Inicializacao e listeners do metronomo (DOM em window.MetroUiRefs; logica em MetronomeUiBindingAccess). */
(function () {
  'use strict';

  function initMetronomeUI() {
    var d = window.MetroUiRefs;
    var a = window.MetronomeUiBindingAccess;
    if (!d || !a) return;

    d.modalEl = document.getElementById('metroSection');
    d.dotsEl = document.getElementById('metroDots');
    d.visualFlashEl = document.getElementById('metroVisualFlash');
    d.bpmValueEl = document.getElementById('metroBpmValue');
    d.bpmLabelEl = document.getElementById('metroBpmLabel');
    d.bpmSliderEl = document.getElementById('metroBpmSlider');
    d.accentCheckboxEl = document.getElementById('chkMetroAccent');
    d.beatsValueEl = document.getElementById('metroBeatsValue');
    d.subdivRowEl = document.getElementById('metroSubdivRow');
    d.solfejoWrapEl = document.getElementById('metroSolfejoWrap');
    d.solfejoBaseImgEl = document.getElementById('metroSolfejoBaseImg');
    d.solfejoHandImgEl = document.getElementById('metroSolfejoHandImg');
    d.solfejoModeCheckboxEl = document.getElementById('chkMetroSolfejoMode');
    d.solfejoLeftHandCheckboxEl = document.getElementById('chkMetroSolfejoLeftHand');

    if (!d.modalEl || !d.dotsEl || !d.bpmSliderEl) return;

    a.bootstrapMetroUiDefaults();
    a.syncMetroBpmFromSlider();
    a.refreshMetroBpmLabels();
    a.syncMetroCheckboxDom();
    a.refreshMetroBeatsValueLabel();
    a.runMetroInitialLayoutRefresh();

    d.bpmSliderEl.addEventListener('input', function () {
      a.invokeSetMetroBpm(this.value, true);
    });

    var btnMetroMinus = document.getElementById('btnMetroMinus');
    var btnMetroPlus = document.getElementById('btnMetroPlus');
    if (btnMetroMinus) {
      btnMetroMinus.addEventListener('click', function () {
        a.invokeSetMetroBpm(a.getMetroBpm() - 1, true);
      });
    }
    if (btnMetroPlus) {
      btnMetroPlus.addEventListener('click', function () {
        a.invokeSetMetroBpm(a.getMetroBpm() + 1, true);
      });
    }

    var btnMetroStop = document.getElementById('btnMetroStop');
    var btnMetroStart = document.getElementById('btnMetroStart');
    if (btnMetroStop) btnMetroStop.addEventListener('click', a.invokeStopMetronome);
    if (btnMetroStart) btnMetroStart.addEventListener('click', a.invokeStartMetronome);

    var btnBeatsMinus = document.getElementById('btnMetroBeatsMinus');
    var btnBeatsPlus = document.getElementById('btnMetroBeatsPlus');
    if (btnBeatsMinus) {
      btnBeatsMinus.addEventListener('click', function () {
        a.invokeSetMetroBeatsPerBar(a.getMetroBeatsPerBar() - 1, true);
      });
    }
    if (btnBeatsPlus) {
      btnBeatsPlus.addEventListener('click', function () {
        a.invokeSetMetroBeatsPerBar(a.getMetroBeatsPerBar() + 1, true);
      });
    }

    if (d.accentCheckboxEl) {
      d.accentCheckboxEl.addEventListener('change', function () {
        a.setMetroAccentFirst(!!this.checked);
      });
    }

    if (d.solfejoModeCheckboxEl) {
      d.solfejoModeCheckboxEl.addEventListener('change', function () {
        a.onSolfejoModeCheckboxChange(this);
      });
    }

    if (d.solfejoLeftHandCheckboxEl) {
      d.solfejoLeftHandCheckboxEl.addEventListener('change', function () {
        a.setMetroSolfejoLeftHand(!!this.checked);
        if (a.getMetroIsRunning() && a.getMetroSolfejoMode()) {
          a.invokeStopMetronome();
          a.invokeStartMetronome();
        }
      });
    }

    if (d.subdivRowEl) {
      d.subdivRowEl.querySelectorAll('.metro-subdiv-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          d.subdivRowEl.querySelectorAll('.metro-subdiv-btn').forEach(function (b) {
            b.classList.remove('active');
          });
          btn.classList.add('active');
          var subdiv = btn.dataset.subdiv ? parseInt(btn.dataset.subdiv, 10) : 1;
          a.invokeSetMetroSubdivision(subdiv, true);
        });
      });
    }
  }

  window.MetronomeUiInit = {
    initMetronomeUI: initMetronomeUI
  };
})();
