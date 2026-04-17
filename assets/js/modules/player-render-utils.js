/* Utilitarios de renderizacao de controles do catalogo do player. */
(function () {
  'use strict';

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildCollectionOptions(collections) {
    return (collections || []).map(function (c) {
      var id = escapeHtml(String((c && c.id) || ''));
      var name = escapeHtml(String((c && (c.nome || c.id)) || 'Coleção'));
      return '<option value="' + id + '">' + name + '</option>';
    }).join('');
  }

  function buildHinoSuggestions(items) {
    return (items || []).map(function (it) {
      var n = Number((it && it.numero) || 0);
      var itemId = escapeHtml(String((it && it.id) || ''));
      var title = escapeHtml(String((it && it.titulo) || 'Sem título'));
      return '<button type="button" class="player-hino-suggestion" data-item-id="' +
        itemId + '" data-hino-numero="' + n + '" role="option">' + n + ' · ' + title + '</button>';
    }).join('');
  }

  function buildSelectedHinoLabel(item) {
    if (!item) return '';
    return String(item.numero) + ' · ' + String(item.titulo || 'Sem título');
  }

  function buildSingleOption(value, label) {
    return '<option value="' + escapeHtml(String(value || '')) + '">' + escapeHtml(String(label || '')) + '</option>';
  }

  function safeId(value) {
    return escapeHtml(String(value || ''));
  }

  window.PlayerRenderUtils = window.PlayerRenderUtils || {};
  window.PlayerRenderUtils.buildCollectionOptions = buildCollectionOptions;
  window.PlayerRenderUtils.buildHinoSuggestions = buildHinoSuggestions;
  window.PlayerRenderUtils.buildSelectedHinoLabel = buildSelectedHinoLabel;
  window.PlayerRenderUtils.buildSingleOption = buildSingleOption;
  window.PlayerRenderUtils.safeId = safeId;
})();
