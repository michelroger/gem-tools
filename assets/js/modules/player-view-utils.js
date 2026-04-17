/* Utilitarios de apresentacao do player (rotulos e titulos). */
(function () {
  'use strict';

  function voiceLabel(voice) {
    function one(v) {
      var x = String(v || '').toLowerCase();
      if (x === 'c') return 'Contralto';
      if (x === 't') return 'Tenor';
      if (x === 'b') return 'Baixo';
      return 'Soprano';
    }
    if (Array.isArray(voice)) {
      var normalized = voice.map(function (v) { return String(v || '').toLowerCase(); })
        .filter(function (v) { return ['s', 'c', 't', 'b'].indexOf(v) >= 0; });
      if (!normalized.length) return 'Soprano';
      return normalized.map(one).join(' + ');
    }
    return one(voice);
  }

  function buildHeaderTitle(collectionName, item, voice) {
    if (!item) return 'Player';
    var colName = collectionName ? String(collectionName) : 'Coleção';
    var numero = item.numero != null ? String(item.numero) : '--';
    var nome = item.titulo ? String(item.titulo) : 'Sem título';
    return colName + ' · ' + numero + ' · ' + nome + ' · ' + voiceLabel(voice);
  }

  window.PlayerViewUtils = window.PlayerViewUtils || {};
  window.PlayerViewUtils.voiceLabel = voiceLabel;
  window.PlayerViewUtils.buildHeaderTitle = buildHeaderTitle;
})();
