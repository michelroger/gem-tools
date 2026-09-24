/* Regras de selecao de item/voz do player. */
(function () {
  'use strict';

  function hasAtLeastOneScore(files) {
    if (!files || typeof files !== 'object') return false;
    return ['s', 'c', 't', 'b'].some(function (v) { return !!files[v]; });
  }

  function getInstrumentFiles(item, instrumentId) {
    if (!item) return null;
    var byInstrument = item.arquivosPorInstrumento || item.instrumentos || null;
    if (byInstrument && instrumentId && byInstrument[instrumentId] && hasAtLeastOneScore(byInstrument[instrumentId])) {
      return byInstrument[instrumentId];
    }
    // Se clarinete, saxofone, trompete ou tuba foi selecionado, nao fazemos fallback para outros instrumentos (evita ler partitura de outra afinacao/clave)
    if (instrumentId === 'clarinete' || instrumentId === 'saxofone' || instrumentId === 'trompete' || instrumentId === 'tuba') {
      return null;
    }
    // Para outros instrumentos, fazemos fallback mas ignoramos o clarinete e saxofone (afinacao diferente)
    if (byInstrument && typeof byInstrument === 'object') {
      var keys = Object.keys(byInstrument);
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key === 'clarinete' || key === 'saxofone' || key === 'trompete' || key === 'tuba') continue;
        if (hasAtLeastOneScore(byInstrument[key])) return byInstrument[key];
      }
      if (keys.length && keys[0] !== 'clarinete' && keys[0] !== 'saxofone' && keys[0] !== 'trompete' && keys[0] !== 'tuba' && byInstrument[keys[0]]) return byInstrument[keys[0]];
    }
    if (item.arquivos && typeof item.arquivos === 'object') return item.arquivos;
    return null;
  }

  function getAvailableVoices(item, instrumentId) {
    var files = getInstrumentFiles(item, instrumentId);
    if (!files) return [];
    return ['s', 'c', 't', 'b'].filter(function (v) { return !!files[v]; });
  }

  function normalizeSelectedVoices(selectedVoices, availableVoices, preferredVoice) {
    var selected = Array.isArray(selectedVoices) ? selectedVoices.slice() : ['s'];
    selected = selected.map(function (v) { return String(v || '').toLowerCase(); })
      .filter(function (v, idx, arr) {
        return ['s', 'c', 't', 'b'].indexOf(v) >= 0 && arr.indexOf(v) === idx;
      });
    if (availableVoices && availableVoices.length) {
      selected = selected.filter(function (v) { return availableVoices.indexOf(v) >= 0; });
      if (!selected.length) {
        var pref = preferredVoice ? String(preferredVoice).toLowerCase() : '';
        if (pref && availableVoices.indexOf(pref) >= 0) {
          selected = [pref];
        } else {
          selected = [availableVoices[0]];
        }
      }
    }
    return selected.length ? selected : ['s'];
  }

  function buildVoicePaths(files, selectedVoices) {
    var selected = Array.isArray(selectedVoices) ? selectedVoices : [];
    var seen = {};
    return selected.map(function (voice) {
      var raw = files && files[voice] ? String(files[voice]) : '';
      if (!raw) return '';
      return './' + raw.replace(/^\.\//, '').replace(/^\/+/, '');
    }).filter(function (p) {
      if (!p || seen[p]) return false;
      seen[p] = true;
      return true;
    });
  }

  window.PlayerSelectionModule = window.PlayerSelectionModule || {};
  window.PlayerSelectionModule.getInstrumentFiles = getInstrumentFiles;
  window.PlayerSelectionModule.getAvailableVoices = getAvailableVoices;
  window.PlayerSelectionModule.normalizeSelectedVoices = normalizeSelectedVoices;
  window.PlayerSelectionModule.buildVoicePaths = buildVoicePaths;
})();
