/* Curriculo de hinos: dados puros (sem DOM). O index passa totais e listas de vozes. */
(function () {
  'use strict';

  function buildFallbackCurriculum(total) {
    var ord = [];
    for (var i = 1; i <= total; i++) ord.push(i);
    var coroF1 = [
      { id: 'coro-5', label: 'Coro 5' },
      { id: 'coro-3', label: 'Coro 3' },
      { id: 'coro-2', label: 'Coro 2' }
    ];
    var coroF3 = [
      { id: 'coro-1', label: 'Coro 1' },
      { id: 'coro-3', label: 'Coro 3' },
      { id: 'coro-4', label: 'Coro 4' }
    ];
    var titles = [
      '1ª FASE: ENSAIOS (100 hinos + 3 coros)',
      '2ª FASE: RJM (50 hinos)',
      '3ª FASE: CULTOS OFICIAIS (200 hinos + 3 coros)',
      '4ª FASE: OFICIALIZAÇÃO (130 hinos)'
    ];
    function flatPhase(hArr, cArr) {
      var it = [];
      hArr.slice().sort(function (a, b) { return a - b; }).forEach(function (n) {
        it.push({ t: 'hino', n: n });
      });
      (cArr || []).forEach(function (c) {
        it.push({ t: 'coro', id: c.id, label: c.label });
      });
      return { titulo: '', grupos: [{ tonalidade: 'Geral (ordenado por nº)', itens: it }] };
    }
    var slices = [
      ord.slice(0, 100),
      ord.slice(100, 150),
      ord.slice(150, 350),
      ord.slice(350, total)
    ];
    var blob = [
      Object.assign({ titulo: titles[0] }, flatPhase(slices[0], coroF1)),
      Object.assign({ titulo: titles[1] }, flatPhase(slices[1], [])),
      Object.assign({ titulo: titles[2] }, flatPhase(slices[2], coroF3)),
      Object.assign({ titulo: titles[3] }, flatPhase(slices[3], []))
    ];
    return { do: blob, mib: blob, sib: blob };
  }

  function isCoroKey(key) {
    return String(key).indexOf('coro-') === 0;
  }

  function voiceCountInEntry(ent, voices) {
    if (!ent) return 0;
    var n = 0;
    voices.forEach(function (v) {
      if (ent[v]) n++;
    });
    return n;
  }

  function entryFull(ent, voices, fullRequired) {
    return voiceCountInEntry(ent, voices) >= fullRequired;
  }

  function getStudentVozPrincipal(st, voices) {
    if (!st) return 'S';
    var v = st.vozPrincipal;
    if (!v || voices.indexOf(v) === -1) return 'S';
    return v;
  }

  function formatVoicesShort(ent, voices) {
    if (!ent) return '';
    var parts = [];
    voices.forEach(function (v) {
      if (ent[v]) parts.push(v);
    });
    return parts.join('|');
  }

  function countOverview(st, afin, total, voices, fullRequired) {
    var book = st && st.hinos && st.hinos[afin] ? st.hinos[afin] : {};
    var vP = getStudentVozPrincipal(st, voices);
    var slotsTotal = total * 4 + 6 * 4;
    var filled = 0;
    var hinosAny = 0;
    var hinosFull = 0;
    var corosFull = 0;
    var hinosWithPrimary = 0;
    var corosWithPrimary = 0;
    for (var hi = 1; hi <= total; hi++) {
      var kn = String(hi);
      var e = book[kn];
      var vc = voiceCountInEntry(e, voices);
      filled += vc;
      if (vc > 0) hinosAny++;
      if (entryFull(e, voices, fullRequired)) hinosFull++;
      if (e && e[vP]) hinosWithPrimary++;
    }
    for (var c = 1; c <= 6; c++) {
      var ck = 'coro-' + c;
      var ec = book[ck];
      var vcc = voiceCountInEntry(ec, voices);
      filled += vcc;
      if (entryFull(ec, voices, fullRequired)) corosFull++;
      if (ec && ec[vP]) corosWithPrimary++;
    }
    return {
      slotsTotal: slotsTotal,
      filled: filled,
      hinosAny: hinosAny,
      hinosFull: hinosFull,
      corosFull: corosFull,
      hinosWithPrimary: hinosWithPrimary,
      corosWithPrimary: corosWithPrimary
    };
  }

  function phaseItemKeys(phase) {
    var keys = [];
    if (phase.grupos && phase.grupos.length) {
      phase.grupos.forEach(function (g) {
        (g.itens || []).forEach(function (it) {
          if (it.t === 'hino') keys.push(String(it.n));
          else if (it.t === 'coro' && it.id) keys.push(it.id);
        });
      });
      return keys;
    }
    (phase.hinos || []).forEach(function (num) {
      keys.push(String(num));
    });
    (phase.coros || []).forEach(function (c) {
      keys.push(c.id);
    });
    return keys;
  }

  function countPhaseProgress(st, afin, phase, voices) {
    var book = st && st.hinos && st.hinos[afin] ? st.hinos[afin] : {};
    var keys = phaseItemKeys(phase);
    var vP = getStudentVozPrincipal(st, voices);
    var slots = keys.length;
    var done = 0;
    keys.forEach(function (k) {
      var ent = book[k];
      if (ent && ent[vP]) done++;
    });
    return { slots: slots, done: done, pct: slots ? Math.round((done / slots) * 100) : 0 };
  }

  function synthGruposForPhase(ph) {
    if (ph.grupos && ph.grupos.length) return ph.grupos;
    var itens = [];
    (ph.hinos || []).slice().sort(function (a, b) {
      return a - b;
    }).forEach(function (n) {
      itens.push({ t: 'hino', n: n });
    });
    (ph.coros || []).forEach(function (c) {
      itens.push({ t: 'coro', id: c.id, label: c.label });
    });
    return [{ tonalidade: 'Geral', itens: itens }];
  }

  function generateStudentId() {
    return 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  }

  function parseBackupJson(text) {
    var parsed = JSON.parse(text);
    if (!parsed || !Array.isArray(parsed.students)) {
      throw new Error('Arquivo inválido: é preciso uma lista de alunos (students).');
    }
    return parsed;
  }

  function ensureStudentShape(st, voices) {
    if (!st) return;
    if (!st.hinos) st.hinos = { do: {}, mib: {}, sib: {} };
    ['do', 'mib', 'sib'].forEach(function (k) {
      if (!st.hinos[k] || typeof st.hinos[k] !== 'object') st.hinos[k] = {};
    });
    if (!st.vozPrincipal || voices.indexOf(st.vozPrincipal) === -1) st.vozPrincipal = 'S';
  }

  function cloneStudent(st, voices) {
    if (!st || typeof st !== 'object') return null;
    var copy = JSON.parse(JSON.stringify(st));
    if (!copy.id || typeof copy.id !== 'string') copy.id = generateStudentId();
    ensureStudentShape(copy, voices);
    return copy;
  }

  function clampHinoNumber(n, total) {
    var x = parseInt(n, 10);
    if (isNaN(x)) x = 1;
    return Math.min(total, Math.max(1, x));
  }

  /** Afinação sugerida da ficha conforme tipo de instrumento. */
  function defaultAfinaçãoForInstrument(inst) {
    if (!inst) return 'do';
    if (inst.tipo === 'corda') return 'do';
    if (inst.tipo === 'metal') return 'sib';
    if (inst.tipo === 'sopro') return 'mib';
    return 'do';
  }

  window.HinosCurriculumUtils = {
    buildFallbackCurriculum: buildFallbackCurriculum,
    isCoroKey: isCoroKey,
    voiceCountInEntry: voiceCountInEntry,
    entryFull: entryFull,
    getStudentVozPrincipal: getStudentVozPrincipal,
    formatVoicesShort: formatVoicesShort,
    countOverview: countOverview,
    phaseItemKeys: phaseItemKeys,
    countPhaseProgress: countPhaseProgress,
    synthGruposForPhase: synthGruposForPhase,
    generateStudentId: generateStudentId,
    parseBackupJson: parseBackupJson,
    ensureStudentShape: ensureStudentShape,
    cloneStudent: cloneStudent,
    clampHinoNumber: clampHinoNumber,
    defaultAfinaçãoForInstrument: defaultAfinaçãoForInstrument
  };
})();
