/* Regras de catalogo do player (funcoes puras). */
(function () {
  'use strict';

  function normalizeCatalogJson(json) {
    if (json && Array.isArray(json.colecoes)) {
      return {
        version: json.version || '2.0.0',
        lastUpdated: json.lastUpdated || '',
        colecoes: json.colecoes.filter(function (c) { return c && Array.isArray(c.items); })
      };
    }

    var legacyItems = (json && Array.isArray(json.items)) ? json.items : [];
    return {
      version: '2.0.0',
      lastUpdated: (json && json.lastUpdated) ? json.lastUpdated : '',
      colecoes: [
        {
          id: 'hinario5-ccb',
          nome: 'Hinário 5 CCB',
          tipo: 'hinario',
          ordem: 1,
          filtros: { afinacoes: ['do', 'mib', 'sib'], vozes: ['s', 'c', 't', 'b'] },
          items: legacyItems
        }
      ]
    };
  }

  function getCollections(catalog) {
    if (!catalog || !Array.isArray(catalog.colecoes)) return [];
    return catalog.colecoes;
  }

  function getCurrentCollection(catalog, selectedCollectionId) {
    var cols = getCollections(catalog);
    if (!cols.length) return null;
    for (var i = 0; i < cols.length; i++) {
      if (String(cols[i].id || '') === String(selectedCollectionId || '')) return cols[i];
    }
    return cols[0];
  }

  function getItems(catalog, selectedCollectionId) {
    var col = getCurrentCollection(catalog, selectedCollectionId);
    if (!col || !Array.isArray(col.items)) return [];
    return col.items;
  }

  function getItemByNumero(catalog, selectedCollectionId, numero) {
    var items = getItems(catalog, selectedCollectionId);
    for (var i = 0; i < items.length; i++) {
      if (Number(items[i].numero) === Number(numero)) return items[i];
    }
    return null;
  }

  function getItemById(catalog, selectedCollectionId, itemId) {
    var items = getItems(catalog, selectedCollectionId);
    for (var i = 0; i < items.length; i++) {
      if (String(items[i].id || '') === String(itemId || '')) return items[i];
    }
    return null;
  }

  window.PlayerCatalogModule = window.PlayerCatalogModule || {};
  window.PlayerCatalogModule.normalizeCatalogJson = normalizeCatalogJson;
  window.PlayerCatalogModule.getCollections = getCollections;
  window.PlayerCatalogModule.getCurrentCollection = getCurrentCollection;
  window.PlayerCatalogModule.getItems = getItems;
  window.PlayerCatalogModule.getItemByNumero = getItemByNumero;
  window.PlayerCatalogModule.getItemById = getItemById;
})();
