/* Carregamento OSMD: biblioteca, fetch/merge, load e finalizacao. */
(function () {
  'use strict';

  function isOsmdLibraryAvailable() {
    return typeof window.opensheetmusicdisplay !== 'undefined' &&
      window.opensheetmusicdisplay &&
      window.opensheetmusicdisplay.OpenSheetMusicDisplay;
  }

  function setHostOsmdLibraryMissingHtml(host) {
    if (!host) return;
    host.innerHTML = '<p class="player-score-placeholder player-score-error">Biblioteca de partitura indisponível. Verifique a rede ou bloqueio de scripts.</p>';
  }

  function tryCreateOsmdInstance(host) {
    if (!host) return { ok: false };
    try {
      var osmd = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(host, {
        backend: 'svg',
        autoResize: true,
        drawingParameters: 'default'
      });
      return { ok: true, osmd: osmd };
    } catch (e) {
      host.innerHTML = '<p class="player-score-placeholder player-score-error">Não foi possível iniciar o visualizador de partitura.</p>';
      return { ok: false };
    }
  }

  function runLoadPlayerMusicXml(scorePath, titleLabel, forceReload, ctx) {
    if (!scorePath) return;
    var scoreKey = window.PlayerScoreLoadUtils.scoreCacheKey(scorePath);
    if (ctx.isOsmdLoading()) return;
    if (ctx.trySkipIfAlreadyLoaded(scoreKey, forceReload)) return;
    var host = ctx.getHost();
    if (!host) return;
    if (!isOsmdLibraryAvailable()) {
      setHostOsmdLibraryMissingHtml(host);
      ctx.setMessage('Player: OpenSheetMusicDisplay não carregou.');
      return;
    }
    ctx.clearPreviousOsmd();
    ctx.beginLoadState(host, scoreKey);
    var created = tryCreateOsmdInstance(host);
    if (!created.ok) {
      ctx.onOsmdConstructorFailed();
      return;
    }
    runFetchLoadAndFinalize(
      scorePath,
      ctx.getAppVersion(),
      created.osmd,
      host,
      titleLabel,
      ctx.buildDisplayMusicXml,
      ctx.getFinalizeBindings()
    );
  }

  function runFetchLoadAndFinalize(scorePath, appVersion, osmd, host, titleLabel, buildDisplayMusicXml, io) {
    var rawPaths = window.PlayerScoreLoadUtils.normalizeScorePaths(scorePath);
    return window.PlayerScoreLoadUtils.fetchMusicXmlTexts(rawPaths, appVersion).then(function (xmlTexts) {
      var sourceXml = window.PlayerScoreLoadUtils.mergeXmlPartList(xmlTexts);
      var displayXml = buildDisplayMusicXml(sourceXml);
      return osmd.load(displayXml).then(function () {
        return sourceXml;
      });
    }).then(function (xmlText) {
      finalizeAfterXmlLoad(osmd, host, xmlText, titleLabel, io);
    }).catch(function () {
      handlePlayerScoreLoadError(host, io);
    });
  }

  function finalizeAfterXmlLoad(osmd, host, xmlText, titleLabel, io) {
    io.setOsmdLoading(false);
    if (!io.isPlayerMode()) {
      try {
        if (osmd && typeof osmd.clear === 'function') osmd.clear();
      } catch (eClear) {}
      if (host) host.innerHTML = '';
      return;
    }
    try {
      if (typeof io.applyOsmdDisplayOptions === 'function') {
        io.applyOsmdDisplayOptions(osmd);
      }
      osmd.render();
    } catch (e2) {
      io.assignPlayerOsmd(null);
      if (host) {
        host.innerHTML = '<p class="player-score-placeholder player-score-error">Erro ao desenhar o MusicXML.</p>';
      }
      io.setMessage('Player: falha ao renderizar a partitura.');
      return;
    }
    var parsed = io.parseXml(xmlText);
    if (!parsed) {
      io.assignPlayerOsmd(osmd);
      io.assignPlayerScoreData(null);
      io.updatePlayerUiNow(0);
      io.setMessage('Partitura desenhada, mas não consegui extrair as notas para o playback.');
      return;
    }
    io.assignPlayerOsmd(osmd);
    io.assignPlayerScoreData(parsed);
    var pb = io.getPlayerPlayback();
    pb.positionSec = 0;
    pb.nextEventIndex = 0;
    pb.nextCursorIndex = 0;
    io.resetPlayerCursorToCurrentPosition();
    io.updatePlayerUiNow(0);
    io.setMessage((titleLabel || 'Partitura') + ' carregada. Use Play para iniciar.');
    requestAnimationFrame(function () {
      io.resizePlayerOsmdIfActive();
      io.buildPlayerNoteAnchorsFromDom();
    });
    setTimeout(io.buildPlayerNoteAnchorsFromDom, 200);
  }

  function handlePlayerScoreLoadError(host, io) {
    io.setOsmdLoading(false);
    io.assignPlayerOsmd(null);
    io.assignPlayerScoreData(null);
    io.assignPlayerNoteAnchors([]);
    if (host) {
      host.innerHTML = '<p class="player-score-placeholder player-score-error">Este hino ainda não está disponível para carregamento. Em breve ele estará disponível.</p>';
    }
    io.updatePlayerUiNow(0);
    io.setMessage('Este hino ainda não está disponível. Em breve estará disponível.');
  }

  window.PlayerOsmdLoadUtils = window.PlayerOsmdLoadUtils || {};
  window.PlayerOsmdLoadUtils.isOsmdLibraryAvailable = isOsmdLibraryAvailable;
  window.PlayerOsmdLoadUtils.setHostOsmdLibraryMissingHtml = setHostOsmdLibraryMissingHtml;
  window.PlayerOsmdLoadUtils.tryCreateOsmdInstance = tryCreateOsmdInstance;
  window.PlayerOsmdLoadUtils.runLoadPlayerMusicXml = runLoadPlayerMusicXml;
  window.PlayerOsmdLoadUtils.runFetchLoadAndFinalize = runFetchLoadAndFinalize;
  window.PlayerOsmdLoadUtils.finalizeAfterXmlLoad = finalizeAfterXmlLoad;
  window.PlayerOsmdLoadUtils.handlePlayerScoreLoadError = handlePlayerScoreLoadError;
})();
