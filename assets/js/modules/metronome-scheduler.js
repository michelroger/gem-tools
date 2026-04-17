/* Loop de agendamento e start/stop do metronomo (estado via MetronomeUiBindingAccess). */
(function () {
  'use strict';

  var METRO_LOOKAHEAD_MS = 25;
  var METRO_SCHEDULE_AHEAD_S = 0.12;

  function metroScheduleLoop() {
    var a = window.MetronomeUiBindingAccess;
    if (!a || !a.schedGetIsRunning() || !a.schedGetAudioCtx()) return;
    var ctx = a.schedGetAudioCtx();
    var now = ctx.currentTime;
    while (a.schedGetNextClickTime() < now + METRO_SCHEDULE_AHEAD_S) {
      var beats = a.getMetroBeatsPerBar();
      var subdiv = a.schedGetSubdivision();
      var clicksInBar = beats * subdiv;
      var clickIndex = a.schedGetClickIndexInBar() % clicksInBar;
      var beatIndex = Math.floor(clickIndex / subdiv) + 1;
      var subdivIndex = clickIndex % subdiv;
      var isBeatStart = subdivIndex === 0;
      var isAccent = a.getMetroAccentFirst() && beatIndex === 1 && isBeatStart;

      if (isBeatStart) {
        a.schedInvokeHighlightMetroBeat(beatIndex);
        a.schedInvokeTriggerMetroVisualPulse(isAccent);
        if (a.getMetroSolfejoMode()) {
          a.schedInvokeTriggerSolfejoHandTap();
          var currentBeatFrame = beatIndex - 1;
          var toFrame = beatIndex % beats;
          if (a.schedGetSolfejoCurrentFrame() !== currentBeatFrame) {
            a.schedSetSolfejoCurrentFrame(currentBeatFrame);
            a.schedInvokeSetSolfejoHandToFrame(currentBeatFrame);
          }
          a.schedInvokeStartSolfejoHandTween(toFrame);
        }
      }
      a.schedInvokePlayMetroClick(isAccent, a.schedGetNextClickTime());

      var bpm = a.getMetroBpm();
      a.schedSetNextClickTime(a.schedGetNextClickTime() + (60 / bpm) / subdiv);
      a.schedSetClickIndexInBar(a.schedGetClickIndexInBar() + 1);
    }
  }

  function stopMetronome() {
    var a = window.MetronomeUiBindingAccess;
    if (!a) return;
    a.schedSetIsRunning(false);
    var sid = a.schedGetSchedulerId();
    if (sid) clearInterval(sid);
    a.schedSetSchedulerId(null);
    a.schedSetNextClickTime(0);
    a.schedSetClickIndexInBar(0);
    if (window.MetroUiRefs && window.MetroUiRefs.dotsEl) a.schedInvokeHighlightMetroBeat(1);
    a.schedClearMetroVisualPulseDom();
    if (a.getMetroSolfejoMode()) {
      a.schedInvokeCancelSolfejoTween();
      a.schedSetSolfejoCurrentFrame(0);
      a.schedInvokeSetSolfejoHandToFrame(0);
    }
    a.schedInvokeUpdateMetroButtons();
  }

  function startMetronome() {
    var a = window.MetronomeUiBindingAccess;
    if (!a) return;
    if (a.schedGetIsRunning()) return;
    var ctx = a.ensureMetroAudioCtx();
    if (!ctx) return;
    if (ctx.resume) ctx.resume();

    a.schedSetIsRunning(true);
    a.schedSetClickIndexInBar(0);
    a.schedSetNextClickTime(ctx.currentTime + 0.05);

    a.schedInvokeUpdateMetroButtons();
    a.schedInvokeHighlightMetroBeat(1);

    if (a.getMetroSolfejoMode()) {
      var supportedBeats = [2, 3, 4, 6, 9, 12];
      if (supportedBeats.indexOf(a.getMetroBeatsPerBar()) === -1) {
        a.schedInvokeSetMessage('Solfejo animado disponivel apenas para 2, 3, 4, 6, 9 e 12 batidas.');
        a.schedSetSolfejoMode(false);
        a.schedSetSolfejoModeCheckboxChecked(false);
        a.schedInvokeUpdateMetronomeModeUI();
      }
    }

    if (a.getMetroSolfejoMode()) {
      a.schedClearSolfejoCaches();
      a.schedSetSolfejoCurrentFrame(0);
      a.schedInvokeUpdateMetronomeModeUI();
      a.schedInvokeEnsureHandTipCalibrated().then(function () {
        a.schedInvokeEnsureSolfejoFramesLoaded().then(function () {
          a.schedInvokeSetSolfejoHandToFrame(0);
        });
        a.schedInvokeSetSolfejoHandToFrame(0);
      });
      a.schedInvokeSetSolfejoHandToFrame(0);
    }

    a.schedSetSchedulerId(setInterval(metroScheduleLoop, METRO_LOOKAHEAD_MS));
  }

  window.MetronomeUiSchedule = {
    metroScheduleLoop: metroScheduleLoop,
    stopMetronome: stopMetronome,
    startMetronome: startMetronome,
    METRO_LOOKAHEAD_MS: METRO_LOOKAHEAD_MS,
    METRO_SCHEDULE_AHEAD_S: METRO_SCHEDULE_AHEAD_S
  };
})();
