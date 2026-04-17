/* Utilitarios de carregamento de MusicXML (fetch, merge, chave de cache). */
(function () {
  'use strict';

  function scoreCacheKey(scorePath) {
    return Array.isArray(scorePath) ? scorePath.join('|') : String(scorePath);
  }

  function normalizeScorePaths(scorePath) {
    return Array.isArray(scorePath) ? scorePath.slice() : [scorePath];
  }

  function fetchMusicXmlTexts(paths, appVersion) {
    return Promise.all(paths.map(function (p) {
      var url = String(p) + '?v=' + encodeURIComponent(appVersion);
      return fetch(url).then(function (res) {
        if (!res.ok) throw new Error('http ' + res.status);
        return res.text();
      });
    }));
  }

  function mergeXmlPartList(xmlTexts) {
    var mergeMusicXmlParts = window.PlayerXmlMergeUtils && window.PlayerXmlMergeUtils.mergeMusicXmlParts;
    if (typeof mergeMusicXmlParts !== 'function') return xmlTexts[0] || '';
    var sourceXml = xmlTexts[0] || '';
    if (xmlTexts.length >= 2 && sourceXml) {
      var i;
      for (i = 1; i < xmlTexts.length; i++) {
        var merged = mergeMusicXmlParts(sourceXml, xmlTexts[i], 'P' + (i + 1));
        if (!merged) break;
        sourceXml = merged;
      }
    }
    return sourceXml;
  }

  window.PlayerScoreLoadUtils = window.PlayerScoreLoadUtils || {};
  window.PlayerScoreLoadUtils.scoreCacheKey = scoreCacheKey;
  window.PlayerScoreLoadUtils.normalizeScorePaths = normalizeScorePaths;
  window.PlayerScoreLoadUtils.fetchMusicXmlTexts = fetchMusicXmlTexts;
  window.PlayerScoreLoadUtils.mergeXmlPartList = mergeXmlPartList;
})();
