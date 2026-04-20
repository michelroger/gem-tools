/* Bindings para PlayerOsmdLoadUtils (leem window.PlayerLoadBindingAccess definido no index). */
(function () {
  'use strict';

  function getPlayerOsmdLoadBindings() {
    var a = window.PlayerLoadBindingAccess;
    return {
      setOsmdLoading: a.setPlayerOsmdLoading,
      assignPlayerOsmd: a.setPlayerOsmd,
      assignPlayerScoreData: a.setPlayerScoreData,
      assignPlayerNoteAnchors: a.setPlayerNoteAnchors,
      applyOsmdDisplayOptions: a.applyPlayerOsmdDisplayOptions,
      isPlayerMode: a.isPlayerMode,
      parseXml: function (xmlText) {
        return window.PlayerMusicXmlUtils.parseMusicXml(xmlText);
      },
      setMessage: a.setMessage,
      updatePlayerUiNow: a.updatePlayerUiNow,
      resetPlayerCursorToCurrentPosition: a.resetPlayerCursorToCurrentPosition,
      resizePlayerOsmdIfActive: a.resizePlayerOsmdIfActive,
      buildPlayerNoteAnchorsFromDom: a.buildPlayerNoteAnchorsFromDom,
      getPlayerPlayback: a.getPlayerPlayback
    };
  }

  function getPlayerMusicXmlLoadContext() {
    var a = window.PlayerLoadBindingAccess;
    return {
      isOsmdLoading: function () {
        return a.readPlayerOsmdLoading();
      },
      trySkipIfAlreadyLoaded: a.trySkipScore,
      getHost: a.getHost,
      setMessage: a.setMessage,
      clearPreviousOsmd: a.clearPreviousOsmd,
      beginLoadState: a.beginLoadState,
      onOsmdConstructorFailed: a.onOsmdConstructorFailed,
      getAppVersion: a.getAppVersion,
      buildDisplayMusicXml: a.buildPlayerDisplayMusicXml,
      getFinalizeBindings: getPlayerOsmdLoadBindings
    };
  }

  window.PlayerLoadBindings = window.PlayerLoadBindings || {};
  window.PlayerLoadBindings.getPlayerOsmdLoadBindings = getPlayerOsmdLoadBindings;
  window.PlayerLoadBindings.getPlayerMusicXmlLoadContext = getPlayerMusicXmlLoadContext;
})();
