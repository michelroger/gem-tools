/* Utilitarios de filtro e busca do catalogo do player. */
(function () {
  'use strict';

  function getAfinacoes(items) {
    var list = [];
    (items || []).forEach(function (it) {
      var a = String((it && it.afinacao) || 'do').toLowerCase();
      if (list.indexOf(a) === -1) list.push(a);
    });
    return list;
  }

  function filterByAfinacao(items, afinacao) {
    var filtered = (items || []).filter(function (it) {
      return String((it && it.afinacao) || 'do').toLowerCase() === String(afinacao || '').toLowerCase();
    });
    return filtered.length ? filtered : (items || []).slice();
  }

  function filterBySearch(items, searchTerm, normalizeFn) {
    var term = String(searchTerm || '').trim();
    if (!term) return (items || []).slice();
    var normalize = typeof normalizeFn === 'function' ? normalizeFn : function (v) { return String(v || '').toLowerCase(); };
    var needle = normalize(term);
    return (items || []).filter(function (it) {
      var n = String((it && it.numero) || '');
      var t = normalize((it && it.titulo) || '');
      var combo = normalize(n + ' ' + ((it && it.titulo) || ''));
      return n.indexOf(needle) >= 0 || t.indexOf(needle) >= 0 || combo.indexOf(needle) >= 0;
    });
  }

  function afinacaoLabel(a) {
    var x = String(a || '').toLowerCase();
    if (x === 'mib') return 'Mib';
    if (x === 'sib') return 'Sib';
    return 'Do';
  }

  function sortCollectionsByOrder(collections) {
    return (collections || []).slice().sort(function (a, b) {
      return (Number(a && a.ordem) || 0) - (Number(b && b.ordem) || 0);
    });
  }

  function resolveSelectedCollectionId(collections, selectedCollectionId) {
    var cols = collections || [];
    if (!cols.length) return '';
    var selected = String(selectedCollectionId || '');
    var exists = cols.some(function (c) { return String((c && c.id) || '') === selected; });
    if (exists) return selected;
    return String((cols[0] && cols[0].id) || '');
  }

  function resolveSelectedItem(filteredItems, selectedNumero, selectedItemId) {
    var items = filteredItems || [];
    if (!items.length) return { numero: 0, itemId: '' };
    var hasNumero = items.some(function (it) { return Number(it && it.numero) === Number(selectedNumero); });
    if (hasNumero) {
      return { numero: Number(selectedNumero || 0), itemId: String(selectedItemId || '') };
    }
    return {
      numero: Number((items[0] && items[0].numero) || 0),
      itemId: String((items[0] && items[0].id) || '')
    };
  }

  window.PlayerFilterUtils = window.PlayerFilterUtils || {};
  window.PlayerFilterUtils.getAfinacoes = getAfinacoes;
  window.PlayerFilterUtils.filterByAfinacao = filterByAfinacao;
  window.PlayerFilterUtils.filterBySearch = filterBySearch;
  window.PlayerFilterUtils.afinacaoLabel = afinacaoLabel;
  window.PlayerFilterUtils.sortCollectionsByOrder = sortCollectionsByOrder;
  window.PlayerFilterUtils.resolveSelectedCollectionId = resolveSelectedCollectionId;
  window.PlayerFilterUtils.resolveSelectedItem = resolveSelectedItem;
})();
