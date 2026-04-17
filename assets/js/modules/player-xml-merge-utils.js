/* Utilitario para mesclar partes MusicXML (multivoz no player). */
(function () {
  'use strict';

  function mergeMusicXmlParts(xmlPrimary, xmlSecondary, secondaryPartId) {
    var parser = new DOMParser();
    var xmlA = parser.parseFromString(String(xmlPrimary || ''), 'application/xml');
    var xmlB = parser.parseFromString(String(xmlSecondary || ''), 'application/xml');
    if (!xmlA || !xmlB || xmlA.getElementsByTagName('parsererror').length || xmlB.getElementsByTagName('parsererror').length) {
      return null;
    }

    var rootA = xmlA.querySelector('score-partwise');
    var rootB = xmlB.querySelector('score-partwise');
    if (!rootA || !rootB) return null;

    var partListA = rootA.querySelector('part-list');
    var partListB = rootB.querySelector('part-list');
    var partB = rootB.querySelector('part');
    var scorePartB = partListB ? partListB.querySelector('score-part') : null;
    if (!partListA || !partB || !scorePartB) return null;

    var importedScorePartB = xmlA.importNode(scorePartB, true);
    var importedPartB = xmlA.importNode(partB, true);
    var partId = secondaryPartId || ('P' + (rootA.querySelectorAll('part').length + 1));
    importedScorePartB.setAttribute('id', partId);
    importedPartB.setAttribute('id', partId);

    partListA.appendChild(importedScorePartB);
    rootA.appendChild(importedPartB);

    return new XMLSerializer().serializeToString(xmlA);
  }

  window.PlayerXmlMergeUtils = window.PlayerXmlMergeUtils || {};
  window.PlayerXmlMergeUtils.mergeMusicXmlParts = mergeMusicXmlParts;
})();
