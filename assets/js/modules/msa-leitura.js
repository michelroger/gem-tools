/**
 * Módulo de Leitura Rítmica, Métrica e Solfejo do MSA (GEM Tools)
 * Versão 2.6.0:
 * - Início imediato e confiável do Playback com parser autônomo e robusto de MusicXML.
 * - Suporte pleno a notas convencionais (pitch) e exercícios rítmicos percussivos (unpitched).
 * - Respeito rigoroso aos silêncios/pausas com silêncio absoluto.
 * - Sincronização milissegunda entre Cursor OSMD, som "TA", metrônomo e movimento da mão.
 * - Condução curvilínea da mão sobre as linhas do diagrama do MSA (idêntico ao metrônomo).
 * - Toggles independentes: Voz da Leitura (ON/OFF), Metrônomo (ON/OFF) e Canhoto (ON/OFF).
 * - Síntese vocal de "TA" aveludada, agradável e livre de distorção sonora.
 */
(function () {
  'use strict';

  // Coordenadas manuais idênticas às calibradas no Metrônomo do GEM Tools
  var SOLFEJO_MANUAL_POINTS = {
    '2-direita': [
      { x: 0.48, y: 0.72 }, // 1
      { x: 0.70, y: 0.50 },
      { x: 0.65, y: 0.22 },
      { x: 0.48, y: 0.32 }, // 2
      { x: 0.40, y: 0.22 },
      { x: 0.42, y: 0.22 }
    ],
    '2-esquerda': [
      { x: 0.50, y: 0.72 }, // 1
      { x: 0.35, y: 0.50 },
      { x: 0.31, y: 0.22 },
      { x: 0.48, y: 0.32 }, // 2
      { x: 0.58, y: 0.24 },
      { x: 0.50, y: 0.22 }
    ],
    '3-direita': [
      { x: 0.41, y: 0.71 }, // 1
      { x: 0.55, y: 0.51 },
      { x: 0.61, y: 0.48 },
      { x: 0.77, y: 0.54 }, // 2
      { x: 0.67, y: 0.29 },
      { x: 0.58, y: 0.25 },
      { x: 0.46, y: 0.34 }, // 3
      { x: 0.44, y: 0.20 },
      { x: 0.44, y: 0.71 }
    ],
    '3-esquerda': [
      { x: 0.59, y: 0.74 }, // 1
      { x: 0.47, y: 0.55 },
      { x: 0.37, y: 0.48 },
      { x: 0.23, y: 0.57 }, // 2
      { x: 0.28, y: 0.33 },
      { x: 0.41, y: 0.26 },
      { x: 0.55, y: 0.37 }, // 3
      { x: 0.58, y: 0.28 },
      { x: 0.54, y: 0.20 }
    ],
    '4-direita': [
      { x: 0.50, y: 0.73 }, // 1
      { x: 0.44, y: 0.55 },
      { x: 0.32, y: 0.52 },
      { x: 0.16, y: 0.58 }, // 2
      { x: 0.41, y: 0.42 },
      { x: 0.70, y: 0.42 },
      { x: 0.82, y: 0.49 }, // 3
      { x: 0.72, y: 0.26 },
      { x: 0.60, y: 0.25 },
      { x: 0.52, y: 0.33 }, // 4
      { x: 0.51, y: 0.28 },
      { x: 0.54, y: 0.20 }
    ],
    '4-esquerda': [
      { x: 0.46, y: 0.73 }, // 1
      { x: 0.57, y: 0.52 },
      { x: 0.70, y: 0.54 },
      { x: 0.80, y: 0.58 }, // 2
      { x: 0.48, y: 0.40 },
      { x: 0.32, y: 0.41 },
      { x: 0.16, y: 0.49 }, // 3
      { x: 0.22, y: 0.33 },
      { x: 0.33, y: 0.28 },
      { x: 0.44, y: 0.33 }, // 4
      { x: 0.45, y: 0.24 },
      { x: 0.43, y: 0.20 }
    ],
    '6-direita': [
      { x: 0.49, y: 0.74 }, // 1
      { x: 0.45, y: 0.64 },
      { x: 0.38, y: 0.63 },
      { x: 0.30, y: 0.68 }, // 2
      { x: 0.25, y: 0.58 },
      { x: 0.20, y: 0.54 },
      { x: 0.12, y: 0.60 }, // 3
      { x: 0.35, y: 0.44 },
      { x: 0.63, y: 0.45 },
      { x: 0.74, y: 0.55 }, // 4
      { x: 0.79, y: 0.46 },
      { x: 0.83, y: 0.46 },
      { x: 0.89, y: 0.51 }, // 5
      { x: 0.78, y: 0.26 },
      { x: 0.63, y: 0.28 },
      { x: 0.57, y: 0.35 }, // 6
      { x: 0.49, y: 0.20 },
      { x: 0.50, y: 0.50 }
    ],
    '6-esquerda': [
      { x: 0.49, y: 0.74 }, // 1
      { x: 0.54, y: 0.64 },
      { x: 0.64, y: 0.65 },
      { x: 0.69, y: 0.67 }, // 2
      { x: 0.73, y: 0.58 },
      { x: 0.78, y: 0.54 },
      { x: 0.87, y: 0.60 }, // 3
      { x: 0.63, y: 0.44 },
      { x: 0.40, y: 0.43 },
      { x: 0.24, y: 0.54 }, // 4
      { x: 0.20, y: 0.46 },
      { x: 0.14, y: 0.47 },
      { x: 0.11, y: 0.51 }, // 5
      { x: 0.22, y: 0.26 },
      { x: 0.37, y: 0.28 },
      { x: 0.43, y: 0.35 }, // 6
      { x: 0.51, y: 0.20 },
      { x: 0.50, y: 0.50 }
    ],
    '9-direita': [
      { x: 0.42, y: 0.73 }, // 1
      { x: 0.38, y: 0.65 },
      { x: 0.32, y: 0.64 },
      { x: 0.25, y: 0.68 }, // 2
      { x: 0.20, y: 0.59 },
      { x: 0.14, y: 0.58 },
      { x: 0.09, y: 0.62 }, // 3
      { x: 0.30, y: 0.51 },
      { x: 0.48, y: 0.52 },
      { x: 0.61, y: 0.59 }, // 4
      { x: 0.66, y: 0.52 },
      { x: 0.70, y: 0.53 },
      { x: 0.73, y: 0.56 }, // 5
      { x: 0.78, y: 0.50 },
      { x: 0.82, y: 0.51 },
      { x: 0.86, y: 0.54 }, // 6
      { x: 0.84, y: 0.40 },
      { x: 0.78, y: 0.35 },
      { x: 0.71, y: 0.38 }, // 7
      { x: 0.67, y: 0.31 },
      { x: 0.62, y: 0.31 },
      { x: 0.58, y: 0.34 }, // 8
      { x: 0.53, y: 0.27 },
      { x: 0.48, y: 0.27 },
      { x: 0.44, y: 0.30 }, // 9
      { x: 0.41, y: 0.22 },
      { x: 0.43, y: 0.52 }
    ],
    '9-esquerda': [
      { x: 0.55, y: 0.71 }, // 1
      { x: 0.59, y: 0.63 },
      { x: 0.65, y: 0.62 },
      { x: 0.72, y: 0.66 }, // 2
      { x: 0.77, y: 0.58 },
      { x: 0.83, y: 0.57 },
      { x: 0.88, y: 0.60 }, // 3
      { x: 0.68, y: 0.50 },
      { x: 0.50, y: 0.51 },
      { x: 0.38, y: 0.57 }, // 4
      { x: 0.33, y: 0.51 },
      { x: 0.29, y: 0.52 },
      { x: 0.25, y: 0.55 }, // 5
      { x: 0.20, y: 0.49 },
      { x: 0.16, y: 0.50 },
      { x: 0.12, y: 0.52 }, // 6
      { x: 0.14, y: 0.39 },
      { x: 0.20, y: 0.34 },
      { x: 0.27, y: 0.36 }, // 7
      { x: 0.32, y: 0.29 },
      { x: 0.36, y: 0.29 },
      { x: 0.41, y: 0.32 }, // 8
      { x: 0.46, y: 0.25 },
      { x: 0.50, y: 0.25 },
      { x: 0.55, y: 0.28 }, // 9
      { x: 0.57, y: 0.21 },
      { x: 0.54, y: 0.50 }
    ],
    '12-direita': [
      { x: 0.51, y: 0.80 }, // 1
      { x: 0.54, y: 0.74 },
      { x: 0.57, y: 0.74 },
      { x: 0.60, y: 0.78 }, // 2
      { x: 0.63, y: 0.71 },
      { x: 0.66, y: 0.72 },
      { x: 0.69, y: 0.76 }, // 3
      { x: 0.56, y: 0.65 },
      { x: 0.43, y: 0.66 },
      { x: 0.35, y: 0.72 }, // 4
      { x: 0.33, y: 0.65 },
      { x: 0.30, y: 0.65 },
      { x: 0.28, y: 0.69 }, // 5
      { x: 0.25, y: 0.61 },
      { x: 0.23, y: 0.62 },
      { x: 0.21, y: 0.66 }, // 6
      { x: 0.36, y: 0.54 },
      { x: 0.53, y: 0.55 },
      { x: 0.66, y: 0.60 }, // 7
      { x: 0.70, y: 0.53 },
      { x: 0.73, y: 0.54 },
      { x: 0.76, y: 0.58 }, // 8
      { x: 0.80, y: 0.51 },
      { x: 0.83, y: 0.52 },
      { x: 0.86, y: 0.55 }, // 9
      { x: 0.69, y: 0.40 },
      { x: 0.47, y: 0.38 },
      { x: 0.32, y: 0.41 }, // 10
      { x: 0.45, y: 0.33 },
      { x: 0.56, y: 0.33 },
      { x: 0.64, y: 0.35 }, // 11
      { x: 0.62, y: 0.24 },
      { x: 0.55, y: 0.23 },
      { x: 0.48, y: 0.25 }, // 12
      { x: 0.45, y: 0.16 },
      { x: 0.49, y: 0.52 }
    ],
    '12-esquerda': [
      { x: 0.52, y: 0.80 }, // 1
      { x: 0.48, y: 0.74 },
      { x: 0.45, y: 0.75 },
      { x: 0.43, y: 0.78 }, // 2
      { x: 0.39, y: 0.71 },
      { x: 0.36, y: 0.72 },
      { x: 0.34, y: 0.76 }, // 3
      { x: 0.46, y: 0.65 },
      { x: 0.59, y: 0.66 },
      { x: 0.67, y: 0.72 }, // 4
      { x: 0.70, y: 0.65 },
      { x: 0.73, y: 0.65 },
      { x: 0.75, y: 0.69 }, // 5
      { x: 0.78, y: 0.61 },
      { x: 0.80, y: 0.62 },
      { x: 0.83, y: 0.66 }, // 6
      { x: 0.68, y: 0.54 },
      { x: 0.51, y: 0.55 },
      { x: 0.36, y: 0.60 }, // 7
      { x: 0.32, y: 0.53 },
      { x: 0.29, y: 0.54 },
      { x: 0.27, y: 0.57 }, // 8
      { x: 0.23, y: 0.51 },
      { x: 0.20, y: 0.52 },
      { x: 0.17, y: 0.55 }, // 9
      { x: 0.35, y: 0.40 },
      { x: 0.57, y: 0.38 },
      { x: 0.70, y: 0.39 }, // 10
      { x: 0.58, y: 0.33 },
      { x: 0.47, y: 0.33 },
      { x: 0.39, y: 0.34 }, // 11
      { x: 0.40, y: 0.24 },
      { x: 0.48, y: 0.23 },
      { x: 0.55, y: 0.24 }, // 12
      { x: 0.57, y: 0.16 },
      { x: 0.53, y: 0.52 }
    ]
  };

  var STEP_TO_NOTE = { 'C': 'Dó', 'D': 'Ré', 'E': 'Mi', 'F': 'Fá', 'G': 'Sol', 'A': 'Lá', 'B': 'Si' };
  var STEP_SEMITONES = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };

  var state = {
    catalogo: [],
    exercicioAtual: null,
    faseSelecionada: 2,
    osmd: null,
    isPlaying: false,
    audioCtx: null,
    bpm: 70,
    generoVoz: (function () {
      try {
        return localStorage.getItem('msa_voice_gender') || 'fem';
      } catch (e) {
        return 'fem';
      }
    })(),
    claveSelecionada: (function () {
      try {
        return localStorage.getItem('msa_clave') || 'sol';
      } catch (e) {
        return 'sol';
      }
    })(),
    osmdZoom: (function () {
      try {
        var s = parseFloat(localStorage.getItem('msa_score_zoom'));
        if (isFinite(s) && s >= 0.55 && s <= 2.5) return s;
      } catch (e) {}
      return (typeof window !== 'undefined' && window.innerWidth < 640) ? 1.05 : 1.15;
    })(),
    modoLeitura: 'ritmica', // 'ritmica', 'metrica', 'solfejo'
    maoEsquerda: false,
    somLeituraAtivo: true,
    somMetronomoAtivo: true,
    somGeralAtivo: true,
    batidasCompasso: 4,
    xmlDoc: null,
    rawXmlText: '',
    scoreData: null,
    tipCache: {},
    animFrameId: null,
    handTweenRaf: null,
    framesHandNatural: [],
    currentHandBeat: 0
  };

  var voiceBanks = {
    fem: {
      vocalTaBuffer: null,
      noteVoiceBuffers: {},
      loaded: false
    },
    masc: {
      vocalTaBuffer: null,
      noteVoiceBuffers: {},
      loaded: false
    }
  };

  var CLEF_INFO = {
    'sol': { name: 'Sol', icon: '𝄞', fullName: 'Clave de Sol (2ª linha)' },
    'do': { name: 'Dó', icon: '𝄡', fullName: 'Clave de Dó (3ª linha - Viola)' },
    'fa': { name: 'Fá', icon: '𝄢', fullName: 'Clave de Fá (4ª linha - Graves)' }
  };

  function getScoreFileForCurrentClef(exercicio) {
    if (!exercicio) return '';
    var clef = state.claveSelecionada || 'sol';
    if (exercicio.arquivos && exercicio.arquivos[clef]) {
      return exercicio.arquivos[clef];
    }
    return exercicio.arquivo || '';
  }

  function setClave(novaClave) {
    if (novaClave !== 'sol' && novaClave !== 'do' && novaClave !== 'fa') novaClave = 'sol';
    state.claveSelecionada = novaClave;
    try {
      localStorage.setItem('msa_clave', novaClave);
    } catch (e) {}

    updateClefUi();

    if (state.exercicioAtual) {
      var isCurrentlyPlaying = state.isPlaying;
      if (isCurrentlyPlaying) stopPlayback();
      var fileToLoad = getScoreFileForCurrentClef(state.exercicioAtual);
      if (fileToLoad) {
        renderScore(fileToLoad);
      }
    }
  }

  function updateClefUi() {
    var currentClef = state.claveSelecionada || 'sol';
    var info = CLEF_INFO[currentClef] || CLEF_INFO.sol;

    var labelEl = document.getElementById('msaCurrentClefLabel');
    var iconEl = document.getElementById('msaClefIcon');
    if (labelEl) labelEl.textContent = info.name;
    if (iconEl) iconEl.textContent = info.icon;

    var hasMelody = !!(state.exercicioAtual && state.exercicioAtual.temNotasComAltura);
    var clefToggleBtn = document.getElementById('btnMsaClefToggle');
    if (clefToggleBtn) {
      clefToggleBtn.classList.toggle('opacity-40', !hasMelody);
      clefToggleBtn.classList.toggle('cursor-not-allowed', !hasMelody);
      clefToggleBtn.disabled = !hasMelody;
      clefToggleBtn.title = hasMelody
        ? 'Clave atual: ' + info.fullName + '. Toque para alternar (Sol / Dó / Fá)'
        : 'Exercício rítmico percussivo (sem clave melódica)';
    }

    var noticeEl = document.getElementById('msaClefNotice');
    if (noticeEl) {
      noticeEl.textContent = hasMelody ? '' : '(exercício percussivo sem pauta melódica)';
    }

    ['sol', 'do', 'fa'].forEach(function (c) {
      var btn = document.getElementById('btnMsaClef' + c.charAt(0).toUpperCase() + c.slice(1));
      if (btn) {
        var isSel = (c === currentClef);
        btn.classList.toggle('active', isSel);
        btn.classList.toggle('du-btn-primary', isSel);
        btn.disabled = !hasMelody;
      }
    });
  }

  function getDefaultScoreZoom() {
    return (typeof window !== 'undefined' && window.innerWidth < 640) ? 1.05 : 1.15;
  }

  function updateScoreZoomLabel() {
    var valEl = document.getElementById('msaScoreZoomVal');
    if (valEl) {
      valEl.textContent = Math.round((state.osmdZoom || 1.05) * 100) + '%';
    }
  }

  function setScoreZoom(newZoom) {
    var clamped = Math.max(0.45, Math.min(2.5, newZoom));
    state.osmdZoom = Math.round(clamped * 100) / 100;
    try {
      localStorage.setItem('msa_score_zoom', state.osmdZoom);
    } catch (e) {}
    updateScoreZoomLabel();
    if (state.osmd) {
      try {
        state.osmd.zoom = state.osmdZoom;
        state.osmd.render();
        if (state.osmd.cursor) {
          state.osmd.cursor.show();
        }
        setTimeout(autoScrollScoreToCursor, 80);
      } catch (err) {}
    }
  }

  function normalizeNoteKey(name) {
    if (!name) return 'Dó';
    var n = name.toString().trim().replace(/[#b]/g, '');
    var map = {
      'do': 'Dó', 'dó': 'Dó', 'c': 'Dó',
      're': 'Ré', 'ré': 'Ré', 'd': 'Ré',
      'mi': 'Mi', 'e': 'Mi',
      'fa': 'Fá', 'fá': 'Fá', 'f': 'Fá',
      'sol': 'Sol', 'so': 'Sol', 'g': 'Sol',
      'la': 'Lá', 'lá': 'Lá', 'a': 'Lá',
      'si': 'Si', 'ti': 'Si', 'b': 'Si'
    };
    return map[n.toLowerCase()] || n;
  }

  function loadAudioVariation(url, callback) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.arrayBuffer();
      })
      .then(function (buf) {
        var ctx = getAudioContext();
        if (!ctx) return;
        return ctx.decodeAudioData(buf.slice(0)).then(function (decoded) {
          if (decoded && typeof callback === 'function') {
            callback(decoded);
          }
        });
      })
      .catch(function (err) {
        console.warn('MSA Áudio: Falha ao carregar', url, err);
      });
  }

  var METRICA_BASE_NAMES = {
    'Dó': 'do', 'Ré': 're', 'Mi': 'mi', 'Fá': 'fa', 'Sol': 'sol', 'Lá': 'la', 'Si': 'si'
  };

  function setVoiceGender(gender) {
    state.generoVoz = (gender === 'masc') ? 'masc' : 'fem';
    try {
      localStorage.setItem('msa_voice_gender', state.generoVoz);
    } catch (e) {}

    var btnFem = document.getElementById('btnMsaVoiceFem');
    var btnMasc = document.getElementById('btnMsaVoiceMasc');
    if (btnFem && btnMasc) {
      var isFem = state.generoVoz === 'fem';
      btnFem.classList.toggle('du-btn-primary', isFem);
      btnFem.classList.toggle('du-btn-ghost', !isFem);
      btnMasc.classList.toggle('du-btn-primary', !isFem);
      btnMasc.classList.toggle('du-btn-ghost', isFem);
    }

    loadVoiceSamples(state.generoVoz, true);
  }

  function loadVoiceSamples(gender, force) {
    var targets = gender ? [gender] : ['fem', 'masc'];
    targets.forEach(function (g) {
      if (!voiceBanks[g]) return;
      if (voiceBanks[g].vocalTaBuffer && !force) return;

      // 1. Vocal TA (Leitura Rítmica) - gravação de 10s contínua sem repetição e sem CD riscado
      loadAudioVariation('./assets/audio/' + g + '/msa-ta-vocal.wav?v=2.8.3', function (dec) {
        voiceBanks[g].vocalTaBuffer = dec;
        console.log('MSA Áudio: TA [' + g + '] carregado (' + dec.duration.toFixed(2) + 's)');
      });

      // 2. 7 notas da Leitura Métrica - gravações de 10s contínuas cortadas no tempo exato
      Object.keys(METRICA_BASE_NAMES).forEach(function (name) {
        var base = METRICA_BASE_NAMES[name];
        loadAudioVariation('./assets/audio/' + g + '/msa-nota-' + base + '.wav?v=2.8.3', function (dec) {
          voiceBanks[g].noteVoiceBuffers[name] = dec;
          voiceBanks[g].noteVoiceBuffers[name.toLowerCase()] = dec;
          voiceBanks[g].noteVoiceBuffers[normalizeNoteKey(name)] = dec;
        });
      });
    });
  }

  function getAudioContext() {
    if (window.gemPlayerAudio && typeof window.gemPlayerAudio.getAudioContext === 'function') {
      try {
        var sharedCtx = window.gemPlayerAudio.getAudioContext();
        if (sharedCtx) {
          if (sharedCtx.state === 'suspended') {
            sharedCtx.resume();
          }
          state.audioCtx = sharedCtx;
          return sharedCtx;
        }
      } catch (e) {}
    }
    if (!state.audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) state.audioCtx = new AC();
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  // =========================================================================
  // PARSER ESPECIALIZADO DE PARTITURA MSA (Com Anacruse e Métrica Rigorosa)
  // =========================================================================
  function parseMsaScore(xmlSource, bpm, batidasCompasso) {
    var xmlDoc = null;
    if (typeof xmlSource === 'string') {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString(xmlSource, 'application/xml');
    } else if (xmlSource && xmlSource.nodeType) {
      xmlDoc = xmlSource;
    }
    if (!xmlDoc) return null;

    var parts = xmlDoc.querySelectorAll('score-partwise > part');
    var firstPart = parts && parts.length ? parts[0] : xmlDoc.querySelector('part');
    if (!firstPart) return null;

    var measures = firstPart.querySelectorAll('measure');
    if (!measures || !measures.length) return null;

    var currentBpm = Math.max(30, Math.min(220, bpm || 60));
    var beatSec = 60 / currentBpm;

    var events = [];
    var cursorStarts = [];
    var beatEvents = [];
    var currentTimeSec = 0;
    var divisions = 1;
    var beats = batidasCompasso || 4;
    var beatType = 4;
    var initialBeatIndex = 0;

    measures.forEach(function (measure, measureIdx) {
      var divEl = measure.querySelector('attributes divisions');
      if (divEl && divEl.textContent) {
        var d = parseFloat(divEl.textContent);
        if (isFinite(d) && d > 0) divisions = d;
      }

      var beatsEl = measure.querySelector('attributes time beats');
      var beatTypeEl = measure.querySelector('attributes time beat-type');
      if (beatsEl && beatsEl.textContent) {
        var b = parseInt(beatsEl.textContent, 10);
        if (isFinite(b) && b > 0) beats = b;
      }
      if (beatTypeEl && beatTypeEl.textContent) {
        var bt = parseInt(beatTypeEl.textContent, 10);
        if (isFinite(bt) && bt > 0) beatType = bt;
      }

      var divisionsPerBeat = divisions * (4 / beatType);
      if (!divisionsPerBeat || divisionsPerBeat <= 0) divisionsPerBeat = 1;

      // 1. Calcular a duração nominal deste compasso em divisões
      var measureDivs = 0;
      var isWholeMeasureRest = false;
      var notes = measure.querySelectorAll('note');

      notes.forEach(function (noteNode) {
        if (noteNode.querySelector('grace')) return;
        var voiceEl = noteNode.querySelector('voice');
        var voice = voiceEl ? voiceEl.textContent.trim() : '1';
        if (voice !== '1') return;

        var isChord = !!noteNode.querySelector('chord');
        var isRest = !!noteNode.querySelector('rest');
        if (isRest && noteNode.querySelector('rest[measure="yes"]')) {
          isWholeMeasureRest = true;
        }

        var durEl = noteNode.querySelector('duration');
        var durDiv = (durEl && durEl.textContent) ? parseFloat(durEl.textContent) || 0 : 0;
        if (!isChord) {
          measureDivs += durDiv;
        }
      });

      var measureBeatsFloat = isWholeMeasureRest ? beats : (measureDivs / divisionsPerBeat);
      var measureBeatsCount = Math.max(1, Math.round(measureBeatsFloat));

      // Se o compasso tiver menos batidas que a fórmula de compasso: é anacruse!
      var isAnacruse = measureBeatsCount < beats;
      var startBeatInMeasure = 0;
      if (isAnacruse) {
        // A anacruse ocupa o final do compasso (ex: 1 batida em 4/4 ocupa o 4º tempo)
        startBeatInMeasure = (beats - measureBeatsCount) % beats;
      }

      if (measureIdx === 0) {
        initialBeatIndex = startBeatInMeasure;
      }

      var measureStartSec = currentTimeSec;

      // 2. Batidas métricas e metrônomo para este compasso
      for (var bi = 0; bi < measureBeatsCount; bi++) {
        var beatInBar = (startBeatInMeasure + bi) % beats;
        var bTime = measureStartSec + (bi * beatSec);
        beatEvents.push({
          sec: bTime,
          beatIndex: beatInBar,
          accent: beatInBar === 0,
          measureNumber: measureIdx + 1
        });
      }

      // 3. Processamento das notas musicais e silêncios do compasso
      notes.forEach(function (noteNode) {
        if (noteNode.querySelector('grace')) return;
        var voiceEl = noteNode.querySelector('voice');
        var voice = voiceEl ? voiceEl.textContent.trim() : '1';
        if (voice !== '1') return;

        var isChord = !!noteNode.querySelector('chord');
        var isRest = !!noteNode.querySelector('rest');
        var isMeasureRest = isRest && !!noteNode.querySelector('rest[measure="yes"]');

        var durDiv = 0;
        var durEl = noteNode.querySelector('duration');
        if (durEl && durEl.textContent) {
          durDiv = parseFloat(durEl.textContent) || 0;
        }

        var durSec = 0;
        if (isMeasureRest || (!durDiv && isRest)) {
          durSec = beats * beatSec;
        } else {
          durSec = (durDiv / divisionsPerBeat) * beatSec;
        }
        if (durSec <= 0) durSec = beatSec;

        var step = 'E';
        var octave = 4;
        var alter = 0;

        if (!isRest) {
          var pitchStep = noteNode.querySelector('pitch step');
          var pitchOct = noteNode.querySelector('pitch octave');
          var pitchAlter = noteNode.querySelector('pitch alter');

          var unpitchStep = noteNode.querySelector('unpitched display-step');
          var unpitchOct = noteNode.querySelector('unpitched display-octave');

          if (pitchStep) {
            step = (pitchStep.textContent || 'C').trim().toUpperCase();
            octave = pitchOct ? (parseInt(pitchOct.textContent, 10) || 4) : 4;
            alter = pitchAlter ? (parseInt(pitchAlter.textContent, 10) || 0) : 0;
          } else if (unpitchStep) {
            step = (unpitchStep.textContent || 'E').trim().toUpperCase();
            octave = unpitchOct ? (parseInt(unpitchOct.textContent, 10) || 4) : 4;
          }
        }

        var hasFermata = !!noteNode.querySelector('fermata');
        if (hasFermata && !isRest) {
          // Sustentação da fermata no MSA (tempo extra de prolongamento sonoro)
          durSec += (beatSec * 1.5);
        }

        var noteName = STEP_TO_NOTE[step] || 'Dó';
        var semi = STEP_SEMITONES[step] || 0;
        var midi = 12 * (octave + 1) + semi + alter;
        var hz = 440 * Math.pow(2, (midi - 69) / 12);

        if (!isChord) {
          cursorStarts.push(currentTimeSec);
        }

        var hasTieStart = !!noteNode.querySelector('tie[type="start"], tied[type="start"], slur[type="start"]');
        var hasTieStop = !!noteNode.querySelector('tie[type="stop"], tied[type="stop"], slur[type="stop"]');
        var pitchKey = isRest ? 'rest' : (unpitchStep ? 'unpitched' : (step + octave + alter));

        events.push({
          startSec: currentTimeSec,
          durationSec: durSec,
          originalDurSec: durSec,
          hasFermata: hasFermata,
          isRest: isRest,
          isChord: isChord,
          hasTieStart: hasTieStart,
          hasTieStop: hasTieStop,
          isTiedContinuation: false,
          pitchKey: pitchKey,
          step: step,
          octave: octave,
          alter: alter,
          name: noteName,
          hz: hz,
          measureNumber: measureIdx + 1
        });

        if (!isChord) {
          currentTimeSec += durSec;
        }
      });
    });

    var totalDurationSec = currentTimeSec;
    if (!events.length || totalDurationSec <= 0) return null;

    // 4. Injeta a batida de PREPARAÇÃO antes do 1º compasso (tempo exato de respiração do vídeo)
    var prepSec = beatSec;
    beatEvents.unshift({
      sec: -prepSec,
      beatIndex: -1,
      isPrep: true,
      accent: true,
      measureNumber: 0
    });

    // 5. Resolução precisa de ligaduras (Ties / Slurs entre notas da mesma altura)
    // As figuras ligadas somam suas durações na primeira nota, mantendo a fonação contínua sem interrupção
    for (var ei = 0; ei < events.length; ei++) {
      var curEv = events[ei];
      if (curEv.isRest || curEv.isChord) continue;
      if (curEv.hasTieStart) {
        var ej = ei + 1;
        while (ej < events.length) {
          var nextEv = events[ej];
          if (nextEv.isRest) break;
          var samePitch = (nextEv.pitchKey === curEv.pitchKey) ||
                          (curEv.pitchKey === 'unpitched') ||
                          (nextEv.pitchKey === 'unpitched');
          if (nextEv.hasTieStop && samePitch) {
            curEv.durationSec += nextEv.originalDurSec;
            nextEv.isTiedContinuation = true;
            if (!nextEv.hasTieStart) {
              break;
            }
            ej++;
          } else {
            break;
          }
        }
      }
    }

    return {
      events: events,
      cursorStarts: cursorStarts,
      beatEvents: beatEvents,
      initialBeatIndex: initialBeatIndex,
      totalDurationSec: totalDurationSec,
      prepDurationSec: prepSec,
      bpm: currentBpm
    };
  }

  // =========================================================================
  // GERENCIADOR DE VOZ MONOFÔNICA E AGENDAMENTO DE ALTA PRECISÃO
  // =========================================================================
  var activeVoiceNode = null;
  var activeVoiceGain = null;

  function stopActiveVoice(fadeSec, atTime) {
    var ctx = getAudioContext();
    if (!ctx) return;
    var now = ctx.currentTime;
    var t = (typeof atTime === 'number') ? Math.max(now, atTime) : now;
    var fo = fadeSec || 0.012;
    if (activeVoiceGain) {
      try {
        activeVoiceGain.gain.cancelScheduledValues(t);
        activeVoiceGain.gain.setValueAtTime(activeVoiceGain.gain.value || 1.0, t);
        activeVoiceGain.gain.linearRampToValueAtTime(0.0001, t + fo);
      } catch (e) {}
    }
    if (activeVoiceNode) {
      try {
        activeVoiceNode.stop(t + fo + 0.005);
      } catch (e) {}
      activeVoiceNode = null;
    }
  }

  function playVoiceAudioBuffer(buf, durationSec, scheduleTime) {
    if (!state.somLeituraAtivo) return;
    if (!buf) {
      loadVoiceSamples(state.generoVoz, true);
      return;
    }
    var ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    var now = ctx.currentTime;
    var t = (typeof scheduleTime === 'number') ? Math.max(now, scheduleTime) : now;
    var dur = Math.max(0.08, durationSec || 0.35);

    // Monofonia estrita: reduz o ganho de qualquer fonação anterior antes da nova começar
    if (activeVoiceGain) {
      try {
        var cutTime = Math.max(now, t - 0.008);
        activeVoiceGain.gain.cancelScheduledValues(cutTime);
        activeVoiceGain.gain.setValueAtTime(activeVoiceGain.gain.value || 1.0, cutTime);
        activeVoiceGain.gain.linearRampToValueAtTime(0.0001, t);
      } catch (e) {}
    }

    try {
      var src = ctx.createBufferSource();
      src.buffer = buf;

      var g = ctx.createGain();
      g.gain.setValueAtTime(1.0, t);

      src.connect(g);
      g.connect(ctx.destination);

      activeVoiceNode = src;
      activeVoiceGain = g;

      // 1. Reprodução da gravação de 10s contínua a partir do início (sem loop para zero repetição)
      src.loop = false;

      // 2. OBRIGATÓRIO NA ESPECIFICAÇÃO W3C: start() SEMPRE deve ser chamado antes de stop()
      src.start(t);

      // 3. Fonação Orgânica Humana: sustentação com envelope de desarticulação e micro-respiração natural
      // Uma nota não dura 100% mecânicos até colidir com a próxima: há ~40ms a 80ms de folga de respiração
      var breathGap = Math.min(0.080, Math.max(0.035, dur * 0.14));
      var voicedDur = Math.max(0.06, dur - breathGap);

      // Fade-out suave nos últimos 30ms a 55ms simulando o ar e relaxamento vocal natural
      var fadeLen = Math.min(0.055, Math.max(0.020, voicedDur * 0.22));
      var fadeStart = t + voicedDur - fadeLen;

      if (fadeStart > t) {
        g.gain.setValueAtTime(1.0, fadeStart);
        g.gain.linearRampToValueAtTime(0.0001, t + voicedDur);
      } else {
        g.gain.setValueAtTime(1.0, t);
        g.gain.linearRampToValueAtTime(0.0001, t + voicedDur);
      }
      src.stop(t + voicedDur + 0.005);

      src.onended = function () {
        if (activeVoiceNode === src) {
          activeVoiceNode = null;
          activeVoiceGain = null;
        }
      };
    } catch (err) {
      console.error('MSA Áudio Playback Error:', err);
    }
  }

  // =========================================================================
  // =========================================================================
  // REPRODUÇÃO NO TIMBRE REAL DO INSTRUMENTO (Soundfont MusyngKite do Player)
  // =========================================================================
  var activeInstrumentStops = [];
  var loadedSoundfontCache = {};

  function getActiveInstrument() {
    if (window.gemPlayerAudio && typeof window.gemPlayerAudio.getCurrentInstrument === 'function') {
      var inst = window.gemPlayerAudio.getCurrentInstrument();
      if (inst) return inst;
    }
    if (window.gemApp && window.gemApp.audio && typeof window.gemApp.audio.getCurrentInstrument === 'function') {
      var inst2 = window.gemApp.audio.getCurrentInstrument();
      if (inst2) return inst2;
    }
    return { id: 'violino', nome: 'Violino', emoji: '🎻', soundfont: 'violin' };
  }

  function ensureInstrumentSoundFontLoaded() {
    var inst = getActiveInstrument();
    var instId = inst && inst.id ? inst.id : 'violino';
    var sfName = inst.soundfont || 'violin';

    if (loadedSoundfontCache[sfName]) {
      return Promise.resolve(loadedSoundfontCache[sfName]);
    }

    // 1. Tenta carregar via motor do Player
    if (window.gemPlayerAudio && typeof window.gemPlayerAudio.loadInstrument === 'function') {
      return window.gemPlayerAudio.loadInstrument(instId).then(function (loaded) {
        if (loaded && typeof loaded.play === 'function') {
          loadedSoundfontCache[sfName] = loaded;
          return loaded;
        }
        return loadSoundfontDirect(sfName);
      }).catch(function () {
        return loadSoundfontDirect(sfName);
      });
    }

    return loadSoundfontDirect(sfName);
  }

  function loadSoundfontDirect(sfName) {
    if (loadedSoundfontCache[sfName]) {
      return Promise.resolve(loadedSoundfontCache[sfName]);
    }
    var ctx = getAudioContext();
    if (typeof Soundfont === 'undefined' || !ctx) {
      return Promise.resolve(null);
    }
    var url = 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/';
    return Soundfont.instrument(ctx, sfName, {
      from: url,
      destination: ctx.destination
    }).then(function (instObj) {
      loadedSoundfontCache[sfName] = instObj;
      return instObj;
    }).catch(function (e) {
      console.warn('MSA: Falha ao carregar soundfont ' + sfName, e);
      return null;
    });
  }

  function updateInstrumentButtonLabel() {
    var inst = getActiveInstrument();
    var titleEl = document.getElementById('msaModalInstTitle');
    var emojiEl = document.getElementById('msaModalInstEmoji');
    if (titleEl) titleEl.textContent = (inst.nome || 'Violino') + ' (Som Real do Player)';
    if (emojiEl) emojiEl.textContent = inst.emoji || '🎻';

    var btn = document.getElementById('btnMsaModeInstrumento');
    if (btn) {
      btn.title = 'Tocar no som real de ' + (inst.nome || 'violino');
    }
  }

  function stopActiveInstrumentSound() {
    activeInstrumentStops.forEach(function (stopFn) {
      try {
        if (typeof stopFn === 'function') {
          stopFn();
        } else if (stopFn && typeof stopFn.stop === 'function') {
          var ctx = getAudioContext();
          stopFn.stop(ctx ? ctx.currentTime : 0);
        }
      } catch (e) {}
    });
    activeInstrumentStops = [];
  }

  // =========================================================================
  // SÍNTESE ACÚSTICA RICA DE INSTRUMENTOS (Fallback Imediato e Seguro)
  // Suporta Metais (Trompete, Trompa, Trombone, Tuba), Cordas e Sopros
  // =========================================================================
  function playInstrumentSynth(inst, ev, t, playDur, midiNote) {
    var ctx = getAudioContext();
    if (!ctx) return;
    try {
      var instId = inst && inst.id ? inst.id : 'violino';
      var freq = 440;
      if (typeof midiNote === 'number' && midiNote > 0) {
        freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      } else if (typeof ev.hz === 'number' && ev.hz > 0) {
        freq = ev.hz;
      }

      var osc1 = ctx.createOscillator();
      var osc2 = ctx.createOscillator();
      var gainNode = ctx.createGain();
      var filterNode = ctx.createBiquadFilter();

      var isBrass = (instId === 'trompete' || instId === 'trompa' || instId === 'trombone' || instId === 'tuba');
      var isWoodwind = (instId === 'flauta' || instId === 'clarinete' || instId === 'oboe' || instId === 'saxofone' || instId === 'fagote');

      if (isBrass) {
        // Timbre de Metal / Trompete: dente de serra brilhante + triangular encorpada
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, t);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, t);

        // Ressonância de bocal e campana metálica
        filterNode.type = 'lowpass';
        var cutoff = (instId === 'trompete') ? 4200 : (instId === 'tuba' ? 1800 : 3200);
        filterNode.frequency.setValueAtTime(cutoff, t);
        filterNode.Q.setValueAtTime(2.2, t);

        var brassVol = 0.32;
        var brassAttack = 0.014; // Ataque vivo de articulação de bocal/língua
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(brassVol, t + brassAttack);
        gainNode.gain.setValueAtTime(brassVol * 0.92, t + playDur - 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + playDur);
      } else if (isWoodwind) {
        // Madeiras / Palhetas
        osc1.type = (instId === 'clarinete') ? 'square' : 'sawtooth';
        osc1.frequency.setValueAtTime(freq, t);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, t);

        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(3600, t);
        filterNode.Q.setValueAtTime(1.0, t);

        var woodVol = 0.28;
        var woodAttack = 0.022;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(woodVol, t + woodAttack);
        gainNode.gain.setValueAtTime(woodVol * 0.90, t + playDur - 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + playDur);
      } else {
        // Cordas friccionadas (Violino, Viola, Violoncelo)
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, t);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq, t);

        filterNode.type = 'lowpass';
        filterNode.frequency.setValueAtTime(3200, t);
        filterNode.Q.setValueAtTime(1.2, t);

        var stringVol = 0.28;
        var stringAttack = 0.040;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(stringVol, t + stringAttack);
        gainNode.gain.setValueAtTime(stringVol * 0.88, t + playDur - 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + playDur);
      }

      osc1.connect(filterNode);
      osc2.connect(filterNode);
      filterNode.connect(gainNode);

      if (window.gemPlayerAudio && typeof window.gemPlayerAudio.getAudioContext === 'function') {
        var gBus = window.gemPlayerAudio.getAudioContext().destination;
        gainNode.connect(gBus);
      } else {
        gainNode.connect(ctx.destination);
      }

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + playDur + 0.03);
      osc2.stop(t + playDur + 0.03);

      activeInstrumentStops.push(function () {
        try {
          var now = ctx.currentTime;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.02);
          osc1.stop(now + 0.03);
          osc2.stop(now + 0.03);
        } catch (e) {}
      });
    } catch (e) {}
  }

  function playInstrumentNote(ev, scheduleTime) {
    if (!state.somLeituraAtivo || !state.somGeralAtivo) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    var now = ctx.currentTime;
    var t = (typeof scheduleTime === 'number') ? Math.max(now, scheduleTime) : now;
    var dur = Math.max(0.08, (ev.durationSec * 0.94));

    var inst = getActiveInstrument();
    var instId = inst && inst.id ? String(inst.id) : 'violino';
    var sfName = inst.soundfont || 'violin';

    // Nas lições que têm TAAA (rítmicas / unpitched), toca nota única estável e definida
    // na região média confortável do instrumento, próxima à entonação do TAAA (Mi 4 / 329.63 Hz).
    var isRhythmTa = (ev.pitchKey === 'unpitched' || !ev.hz || ev.hz <= 0 || state.modoLeitura === 'ritmica');
    var hzRef = isRhythmTa ? 329.63 : ev.hz;

    // 1. Resolução da nota MIDI com transposição fiel para afinação real de cada instrumento
    var midi = 60;
    if (typeof hzRef === 'number' && hzRef > 0) {
      var midiOrig = Math.round(69 + 12 * Math.log2(hzRef / 440));
      midi = midiOrig;
      if (instId === 'saxofone') {
        midi = midiOrig - 9; // Sax Alto em Mib
      } else if (instId === 'clarinete' || instId === 'trompete') {
        midi = midiOrig - 2; // Sib (soam 2 semitons abaixo da nota escrita)
      } else if (instId === 'trompa') {
        midi = midiOrig - 7; // Trompa em Fá
      } else if (instId === 'tuba' || instId === 'contrabaixo') {
        if (midiOrig > 72) midi = midiOrig - 36;
        else if (midiOrig > 60) midi = midiOrig - 24;
        else if (midiOrig > 48) midi = midiOrig - 12;
      } else if (instId === 'violoncelo' || instId === 'trombone' || instId === 'fagote') {
        if (midiOrig > 72) midi = midiOrig - 24;
        else if (midiOrig > 60) midi = midiOrig - 12;
      } else if (instId === 'viola' && midiOrig > 59) {
        midi = midiOrig - 12;
      }
    }
    midi = Math.max(21, Math.min(108, midi));

    var noteNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    var oct = Math.floor(midi / 12) - 1;
    var noteName = noteNames[midi % 12] + oct;

    var playOptions = (window.gemPlayerAudio && typeof window.gemPlayerAudio.buildSoundfontPlayOptions === 'function')
      ? window.gemPlayerAudio.buildSoundfontPlayOptions(dur, 0.65)
      : { duration: dur, gain: 0.65, attack: 0.015, release: 0.25 };

    var loadedInst = loadedSoundfontCache[sfName];
    if (loadedInst && typeof loadedInst.play === 'function') {
      try {
        var note = loadedInst.play(noteName, t, playOptions);
        if (note && typeof note.stop === 'function') {
          activeInstrumentStops.push(note);
        }
      } catch (errPlay) {
        playInstrumentSynth(inst, ev, t, dur, midi);
      }
    } else {
      // Dispara síntese imediata de altíssima resposta para NÃO HAVER SILÊNCIO
      playInstrumentSynth(inst, ev, t, dur, midi);
      // Pré-carrega o Soundfont das amostras reais para as notas seguintes
      ensureInstrumentSoundFontLoaded();
    }
  }

  function triggerNoteVoice(ev, scheduleTime) {
    if (!state.somLeituraAtivo || !state.somGeralAtivo) return;

    // Modo Instrumento: toca as notas com o timbre e transposição do instrumento real do Player
    // Funciona perfeitamente tanto nas lições melódicas quanto nas lições rítmicas com TAAA (nota única)
    if (state.modoLeitura === 'instrumento') {
      playInstrumentNote(ev, scheduleTime);
      return;
    }

    var g = state.generoVoz || 'fem';
    var bank = voiceBanks[g] || voiceBanks.fem;
    var dur = ev.durationSec;

    // Se o exercício for rítmico percussivo ou o modo for 'ritmica': sempre falar "TA"
    if (state.modoLeitura === 'ritmica' || ev.pitchKey === 'unpitched' || !ev.name) {
      var taBuf = (g === 'masc')
        ? (voiceBanks.masc.vocalTaBuffer || bank.vocalTaBuffer)
        : (voiceBanks.fem.vocalTaBuffer || bank.vocalTaBuffer);
      if (taBuf) playVoiceAudioBuffer(taBuf, dur, scheduleTime);
    } else {
      // Leitura Métrica: fala o nome correto de cada nota (Dó, Ré, Mi, Fá, Sol, Lá, Si)
      var norm = normalizeNoteKey(ev.name);
      var mBuf = (g === 'masc')
        ? (voiceBanks.masc.noteVoiceBuffers[norm] ||
           voiceBanks.masc.noteVoiceBuffers[norm.toLowerCase()] ||
           voiceBanks.masc.noteVoiceBuffers['Dó'])
        : (voiceBanks.fem.noteVoiceBuffers[norm] ||
           voiceBanks.fem.noteVoiceBuffers[norm.toLowerCase()] ||
           voiceBanks.fem.noteVoiceBuffers['Dó']);
      if (mBuf) playVoiceAudioBuffer(mBuf, dur, scheduleTime);
    }
  }

  // =========================================================================
  // METRÔNOMO MECÂNICO CLÁSSICO DE CORDAS (Wittner Maelzel Madeira Antigo)
  // Tique-taque oco amadeirado, escapamento analógico e sino no tempo 1
  // Polifonia completa: toca em paralelo simultâneo com a voz ou com o violino
  // =========================================================================
  function playClick(isAccent, scheduleTime) {
    if (!state.somMetronomoAtivo || !state.somGeralAtivo) return;
    var ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    var now = ctx.currentTime;
    var t = (typeof scheduleTime === 'number') ? Math.max(now, scheduleTime) : now;

    try {
      // 1. Baque Mecânico de Madeira (corpo do pêndulo)
      var oscWood = ctx.createOscillator();
      var gainWood = ctx.createGain();
      var filterWood = ctx.createBiquadFilter();

      oscWood.type = 'triangle';
      var startFreq = isAccent ? 1280 : 980;
      var endFreq = isAccent ? 320 : 240;
      oscWood.frequency.setValueAtTime(startFreq, t);
      oscWood.frequency.exponentialRampToValueAtTime(endFreq, t + 0.024);

      filterWood.type = 'bandpass';
      filterWood.frequency.setValueAtTime(isAccent ? 1500 : 1150, t);
      filterWood.Q.setValueAtTime(2.4, t);

      var woodVol = isAccent ? 0.44 : 0.30;
      gainWood.gain.setValueAtTime(0.0001, t);
      gainWood.gain.linearRampToValueAtTime(woodVol, t + 0.001);
      gainWood.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      oscWood.connect(filterWood);
      filterWood.connect(gainWood);
      gainWood.connect(ctx.destination);

      oscWood.start(t);
      oscWood.stop(t + 0.050);

      // 2. Ruído Acústico do Escapamento de Corda
      var bufferSize = Math.floor(ctx.sampleRate * 0.016);
      var noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var output = noiseBuffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }
      var noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      var noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(isAccent ? 2600 : 2100, t);
      noiseFilter.Q.setValueAtTime(2.8, t);

      var noiseGain = ctx.createGain();
      var nVol = isAccent ? 0.26 : 0.18;
      noiseGain.gain.setValueAtTime(nVol, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseSource.start(t);
      noiseSource.stop(t + 0.022);

      // 3. Batida 1: Sino de latão clássico de metrônomo tradicional
      if (isAccent) {
        var oscBell = ctx.createOscillator();
        var gainBell = ctx.createGain();
        oscBell.type = 'sine';
        oscBell.frequency.setValueAtTime(2093, t); // C7 sino de latão
        gainBell.gain.setValueAtTime(0.0001, t);
        gainBell.gain.linearRampToValueAtTime(0.22, t + 0.002);
        gainBell.gain.exponentialRampToValueAtTime(0.0001, t + 0.180);

        oscBell.connect(gainBell);
        gainBell.connect(ctx.destination);
        oscBell.start(t);
        oscBell.stop(t + 0.200);
      }
    } catch (e) {}
  }

  // =========================================================================
  // CALIBRAÇÃO DA PONTA DO DEDO (Analisa o pixel mais alto da imagem da mão)
  // =========================================================================
  function analyzeHandTipFromImage(imgEl) {
    return new Promise(function (resolve) {
      try {
        var w = imgEl.naturalWidth || 1;
        var h = imgEl.naturalHeight || 1;
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(imgEl, 0, 0, w, h);
        var imgData = ctx.getImageData(0, 0, w, h);
        var data = imgData.data;

        var minY = Infinity;
        var alphaThreshold = 40;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var idx = (y * w + x) * 4;
            if (data[idx + 3] >= alphaThreshold) {
              minY = Math.min(minY, y);
            }
          }
        }
        if (minY === Infinity) {
          resolve({ x: w / 2, y: 0 });
          return;
        }

        var sumX = 0;
        var countX = 0;
        var scanBand = Math.min(h - 1, minY + 4);
        for (var sy = minY; sy <= scanBand; sy++) {
          for (var sx = 0; sx < w; sx++) {
            var sidx = (sy * w + sx) * 4;
            if (data[sidx + 3] >= alphaThreshold) {
              sumX += sx;
              countX++;
            }
          }
        }

        var tipX = countX > 0 ? (sumX / countX) : (w / 2);
        resolve({ x: tipX, y: minY });
      } catch (e) {
        resolve({ x: (imgEl.naturalWidth || 1) / 2, y: 0 });
      }
    });
  }

  function ensureHandTipCalibrated() {
    var handImg = document.getElementById('msaSolfejoHandImg');
    if (!handImg) return Promise.resolve();
    var side = state.maoEsquerda ? 'esquerda' : 'direita';
    if (state.tipCache[side]) return Promise.resolve(state.tipCache[side]);

    return new Promise(function (resolve) {
      function finish() {
        analyzeHandTipFromImage(handImg).then(function (tip) {
          state.tipCache[side] = tip;
          resolve(tip);
        });
      }

      if (handImg.complete && handImg.naturalWidth > 0) {
        finish();
      } else {
        handImg.onload = finish;
        handImg.onerror = function () {
          state.tipCache[side] = { x: (handImg.naturalWidth || 100) / 2, y: 0 };
          resolve(state.tipCache[side]);
        };
      }
    });
  }

  // =========================================================================
  // MOVIMENTO DA MÃO (Ponta do Dedo Exata + Trajetória Curva Contínua)
  // =========================================================================
  function setSolfejoHandToPosNatural(pos) {
    var handImg = document.getElementById('msaSolfejoHandImg');
    var baseImg = document.getElementById('msaSolfejoBaseImg');
    if (!handImg || !baseImg || !pos) return;
    if (!baseImg.complete || !baseImg.naturalWidth) return;
    if (!handImg.complete || !handImg.naturalWidth) return;

    var rect = baseImg.getBoundingClientRect();
    var naturalW = baseImg.naturalWidth || 1;
    var naturalH = baseImg.naturalHeight || 1;
    var scaleX = rect.width / naturalW;
    var scaleY = rect.height / naturalH;

    var baseDisplayW = baseImg.offsetWidth || rect.width || 1;
    var handDisplayW = baseDisplayW * 0.28;
    handImg.style.width = handDisplayW + 'px';

    var side = state.maoEsquerda ? 'esquerda' : 'direita';
    var tip = state.tipCache[side];
    if (!tip) return;

    var handNaturalW = handImg.naturalWidth || 1;
    var handScale = handDisplayW / handNaturalW;
    var tipDisplayX = tip.x * handScale;
    var tipDisplayY = tip.y * handScale;

    var baseX = baseImg.offsetLeft + (pos.x * scaleX);
    var baseY = baseImg.offsetTop + (pos.y * scaleY);

    var finalLeft = (baseX - tipDisplayX);
    var finalTop = (baseY - tipDisplayY);
    handImg.style.left = finalLeft + 'px';
    handImg.style.top = finalTop + 'px';
    handImg.style.display = 'block';
  }

  // =========================================================================
  // COORDENADAS E CURVAS DE ALTA FIDELIDADE DO SOLFEJO (PIXELS OFICIAIS DO MSA)
  // Medidas precisamente a partir das imagens oficiais do diagrama (600x600)
  // =========================================================================
    var SOLFEJO_ANCHOR_CIRCLES = {
  "2-direita": [
    {
      "x": 0.4715,
      "y": 0.7186
    },
    {
      "x": 0.4719,
      "y": 0.3359
    }
  ],
  "3-direita": [
    {
      "x": 0.3959,
      "y": 0.7235
    },
    {
      "x": 0.744,
      "y": 0.5521
    },
    {
      "x": 0.4328,
      "y": 0.3599
    }
  ],
  "4-direita": [
    {
      "x": 0.485,
      "y": 0.7383
    },
    {
      "x": 0.143,
      "y": 0.5961
    },
    {
      "x": 0.7944,
      "y": 0.5058
    },
    {
      "x": 0.5096,
      "y": 0.338
    }
  ],
  "6-direita": [
    {
      "x": 0.4719,
      "y": 0.7451
    },
    {
      "x": 0.2882,
      "y": 0.678
    },
    {
      "x": 0.1087,
      "y": 0.6082
    },
    {
      "x": 0.7207,
      "y": 0.5542
    },
    {
      "x": 0.8732,
      "y": 0.5129
    },
    {
      "x": 0.5555,
      "y": 0.3562
    }
  ],
  "9-direita": [
    {
      "x": 0.4238,
      "y": 0.7306
    },
    {
      "x": 0.2547,
      "y": 0.6807
    },
    {
      "x": 0.0891,
      "y": 0.6233
    },
    {
      "x": 0.6049,
      "y": 0.5944
    },
    {
      "x": 0.7296,
      "y": 0.5657
    },
    {
      "x": 0.8605,
      "y": 0.5371
    },
    {
      "x": 0.7083,
      "y": 0.3753
    },
    {
      "x": 0.5764,
      "y": 0.3353
    },
    {
      "x": 0.4348,
      "y": 0.2972
    }
  ],
  "12-direita": [
    {
      "x": 0.5053,
      "y": 0.8015
    },
    {
      "x": 0.5928,
      "y": 0.7824
    },
    {
      "x": 0.6847,
      "y": 0.7658
    },
    {
      "x": 0.3561,
      "y": 0.7197
    },
    {
      "x": 0.2818,
      "y": 0.6935
    },
    {
      "x": 0.204,
      "y": 0.6643
    },
    {
      "x": 0.6613,
      "y": 0.6037
    },
    {
      "x": 0.7549,
      "y": 0.578
    },
    {
      "x": 0.8552,
      "y": 0.5547
    },
    {
      "x": 0.3239,
      "y": 0.4029
    },
    {
      "x": 0.6335,
      "y": 0.3478
    },
    {
      "x": 0.4767,
      "y": 0.2525
    }
  ]
};

  // Trajetórias calibradas passando exatamente pelo centro de cada linha
  var SOLFEJO_EXACT_CURVES = {
  "2-direita": {
    "prep": [
      { "x": 0.4285, "y": 0.4997 },
      { "x": 0.4285, "y": 0.6200 },
      { "x": 0.4285, "y": 0.7100 },
      { "x": 0.4500, "y": 0.7186 },
      { "x": 0.4715, "y": 0.7186 }
    ],
    "beats": [
      [
        {
          "x": 0.4715,
          "y": 0.7186
        },
        {
          "x": 0.52,
          "y": 0.7
        },
        {
          "x": 0.58,
          "y": 0.65
        },
        {
          "x": 0.63,
          "y": 0.58
        },
        {
          "x": 0.6657,
          "y": 0.492
        },
        {
          "x": 0.66,
          "y": 0.42
        },
        {
          "x": 0.62,
          "y": 0.35
        },
        {
          "x": 0.55,
          "y": 0.315
        },
        {
          "x": 0.4719,
          "y": 0.3359
        }
      ],
      [
        {
          "x": 0.4719,
          "y": 0.3359
        },
        {
          "x": 0.45,
          "y": 0.25
        },
        {
          "x": 0.43,
          "y": 0.2
        },
        {
          "x": 0.42,
          "y": 0.23
        },
        {
          "x": 0.445,
          "y": 0.29
        },
        {
          "x": 0.4719,
          "y": 0.3359
        },
        {
          "x": 0.4718,
          "y": 0.45
        },
        {
          "x": 0.4717,
          "y": 0.55
        },
        {
          "x": 0.4716,
          "y": 0.65
        },
        {
          "x": 0.4715,
          "y": 0.7186
        }
      ]
    ]
  },
  "3-direita": {
    "prep": [
      { "x": 0.3533, "y": 0.5133 },
      { "x": 0.3533, "y": 0.6200 },
      { "x": 0.3533, "y": 0.7100 },
      { "x": 0.3750, "y": 0.7235 },
      { "x": 0.3959, "y": 0.7235 }
    ],
    "beats": [
      [
        {
          "x": 0.3959,
          "y": 0.7235
        },
        {
          "x": 0.4083,
          "y": 0.7156
        },
        {
          "x": 0.425,
          "y": 0.6417
        },
        {
          "x": 0.4417,
          "y": 0.6067
        },
        {
          "x": 0.4583,
          "y": 0.5793
        },
        {
          "x": 0.475,
          "y": 0.5574
        },
        {
          "x": 0.4917,
          "y": 0.5309
        },
        {
          "x": 0.5083,
          "y": 0.5261
        },
        {
          "x": 0.525,
          "y": 0.509
        },
        {
          "x": 0.5417,
          "y": 0.4973
        },
        {
          "x": 0.5583,
          "y": 0.4872
        },
        {
          "x": 0.575,
          "y": 0.4788
        },
        {
          "x": 0.5917,
          "y": 0.4711
        },
        {
          "x": 0.6083,
          "y": 0.467
        },
        {
          "x": 0.625,
          "y": 0.4638
        },
        {
          "x": 0.6417,
          "y": 0.4624
        },
        {
          "x": 0.6583,
          "y": 0.4639
        },
        {
          "x": 0.675,
          "y": 0.4676
        },
        {
          "x": 0.6917,
          "y": 0.4757
        },
        {
          "x": 0.7083,
          "y": 0.4984
        },
        {
          "x": 0.725,
          "y": 0.5206
        },
        {
          "x": 0.744,
          "y": 0.5521
        }
      ],
      [
        {
          "x": 0.744,
          "y": 0.5521
        },
        {
          "x": 0.73,
          "y": 0.44
        },
        {
          "x": 0.7,
          "y": 0.35
        },
        {
          "x": 0.65,
          "y": 0.29
        },
        {
          "x": 0.58,
          "y": 0.27
        },
        {
          "x": 0.51,
          "y": 0.285
        },
        {
          "x": 0.46,
          "y": 0.32
        },
        {
          "x": 0.4328,
          "y": 0.3599
        }
      ],
      [
        {
          "x": 0.4328,
          "y": 0.3599
        },
        {
          "x": 0.425,
          "y": 0.26
        },
        {
          "x": 0.415,
          "y": 0.17
        },
        {
          "x": 0.43,
          "y": 0.14
        },
        {
          "x": 0.445,
          "y": 0.17
        },
        {
          "x": 0.44,
          "y": 0.26
        },
        {
          "x": 0.4328,
          "y": 0.3599
        },
        {
          "x": 0.42,
          "y": 0.45
        },
        {
          "x": 0.408,
          "y": 0.55
        },
        {
          "x": 0.398,
          "y": 0.65
        },
        {
          "x": 0.3959,
          "y": 0.7235
        }
      ]
    ]
  },
  "4-direita": {
    "prep": [
      { "x": 0.5685, "y": 0.4986 },
      { "x": 0.5685, "y": 0.6000 },
      { "x": 0.5685, "y": 0.7100 },
      { "x": 0.5200, "y": 0.7300 },
      { "x": 0.4850, "y": 0.7383 }
    ],
    "beats": [
      [
        {
          "x": 0.485,
          "y": 0.7383
        },
        {
          "x": 0.46,
          "y": 0.65
        },
        {
          "x": 0.425,
          "y": 0.585
        },
        {
          "x": 0.38,
          "y": 0.555
        },
        {
          "x": 0.32,
          "y": 0.54
        },
        {
          "x": 0.26,
          "y": 0.54
        },
        {
          "x": 0.2,
          "y": 0.555
        },
        {
          "x": 0.143,
          "y": 0.5961
        }
      ],
      [
        {
          "x": 0.143,
          "y": 0.5961
        },
        {
          "x": 0.21,
          "y": 0.51
        },
        {
          "x": 0.3,
          "y": 0.445
        },
        {
          "x": 0.41,
          "y": 0.415
        },
        {
          "x": 0.52,
          "y": 0.405
        },
        {
          "x": 0.62,
          "y": 0.415
        },
        {
          "x": 0.71,
          "y": 0.445
        },
        {
          "x": 0.7944,
          "y": 0.5058
        }
      ],
      [
        {
          "x": 0.7944,
          "y": 0.5058
        },
        {
          "x": 0.75,
          "y": 0.39
        },
        {
          "x": 0.68,
          "y": 0.32
        },
        {
          "x": 0.6,
          "y": 0.295
        },
        {
          "x": 0.54,
          "y": 0.31
        },
        {
          "x": 0.5096,
          "y": 0.338
        }
      ],
      [
        {
          "x": 0.5096,
          "y": 0.338
        },
        {
          "x": 0.505,
          "y": 0.24
        },
        {
          "x": 0.49,
          "y": 0.15
        },
        {
          "x": 0.505,
          "y": 0.08
        },
        {
          "x": 0.525,
          "y": 0.15
        },
        {
          "x": 0.518,
          "y": 0.24
        },
        {
          "x": 0.5096,
          "y": 0.338
        },
        {
          "x": 0.498,
          "y": 0.44
        },
        {
          "x": 0.492,
          "y": 0.54
        },
        {
          "x": 0.487,
          "y": 0.64
        },
        {
          "x": 0.485,
          "y": 0.7383
        }
      ]
    ]
  },
  "6-direita": {
    "prep": [
      { "x": 0.5333, "y": 0.5233 },
      { "x": 0.5333, "y": 0.6400 },
      { "x": 0.5333, "y": 0.7300 },
      { "x": 0.5000, "y": 0.7451 },
      { "x": 0.4719, "y": 0.7451 }
    ],
    "beats": [
      [
        {
          "x": 0.4719,
          "y": 0.7451
        },
        {
          "x": 0.41,
          "y": 0.68
        },
        {
          "x": 0.34,
          "y": 0.67
        },
        {
          "x": 0.2882,
          "y": 0.678
        }
      ],
      [
        {
          "x": 0.2882,
          "y": 0.678
        },
        {
          "x": 0.23,
          "y": 0.6
        },
        {
          "x": 0.16,
          "y": 0.59
        },
        {
          "x": 0.1087,
          "y": 0.6082
        }
      ],
      [
        {
          "x": 0.1087,
          "y": 0.6082
        },
        {
          "x": 0.24,
          "y": 0.46
        },
        {
          "x": 0.52,
          "y": 0.48
        },
        {
          "x": 0.7207,
          "y": 0.5542
        }
      ],
      [
        {
          "x": 0.7207,
          "y": 0.5542
        },
        {
          "x": 0.77,
          "y": 0.49
        },
        {
          "x": 0.82,
          "y": 0.49
        },
        {
          "x": 0.8732,
          "y": 0.5129
        }
      ],
      [
        {
          "x": 0.8732,
          "y": 0.5129
        },
        {
          "x": 0.81,
          "y": 0.34
        },
        {
          "x": 0.68,
          "y": 0.3
        },
        {
          "x": 0.5555,
          "y": 0.3562
        }
      ],
      [
        {
          "x": 0.5555,
          "y": 0.3562
        },
        {
          "x": 0.54,
          "y": 0.25
        },
        {
          "x": 0.52,
          "y": 0.18
        },
        {
          "x": 0.55,
          "y": 0.18
        },
        {
          "x": 0.5555,
          "y": 0.3562
        },
        {
          "x": 0.52,
          "y": 0.48
        },
        {
          "x": 0.49,
          "y": 0.62
        },
        {
          "x": 0.4719,
          "y": 0.7451
        }
      ]
    ]
  },
  "9-direita": {
    "prep": [
      { "x": 0.4781, "y": 0.5075 },
      { "x": 0.4781, "y": 0.6300 },
      { "x": 0.4781, "y": 0.7200 },
      { "x": 0.4500, "y": 0.7306 },
      { "x": 0.4238, "y": 0.7306 }
    ],
    "beats": [
      [
        {
          "x": 0.4238,
          "y": 0.7306
        },
        {
          "x": 0.35,
          "y": 0.67
        },
        {
          "x": 0.2547,
          "y": 0.6807
        }
      ],
      [
        {
          "x": 0.2547,
          "y": 0.6807
        },
        {
          "x": 0.18,
          "y": 0.61
        },
        {
          "x": 0.0891,
          "y": 0.6233
        }
      ],
      [
        {
          "x": 0.0891,
          "y": 0.6233
        },
        {
          "x": 0.22,
          "y": 0.5
        },
        {
          "x": 0.45,
          "y": 0.52
        },
        {
          "x": 0.6049,
          "y": 0.5944
        }
      ],
      [
        {
          "x": 0.6049,
          "y": 0.5944
        },
        {
          "x": 0.66,
          "y": 0.55
        },
        {
          "x": 0.7296,
          "y": 0.5657
        }
      ],
      [
        {
          "x": 0.7296,
          "y": 0.5657
        },
        {
          "x": 0.79,
          "y": 0.52
        },
        {
          "x": 0.8605,
          "y": 0.5371
        }
      ],
      [
        {
          "x": 0.8605,
          "y": 0.5371
        },
        {
          "x": 0.82,
          "y": 0.38
        },
        {
          "x": 0.7083,
          "y": 0.3753
        }
      ],
      [
        {
          "x": 0.7083,
          "y": 0.3753
        },
        {
          "x": 0.64,
          "y": 0.32
        },
        {
          "x": 0.5764,
          "y": 0.3353
        }
      ],
      [
        {
          "x": 0.5764,
          "y": 0.3353
        },
        {
          "x": 0.5,
          "y": 0.285
        },
        {
          "x": 0.4348,
          "y": 0.2972
        }
      ],
      [
        {
          "x": 0.4348,
          "y": 0.2972
        },
        {
          "x": 0.42,
          "y": 0.2
        },
        {
          "x": 0.44,
          "y": 0.16
        },
        {
          "x": 0.4348,
          "y": 0.2972
        },
        {
          "x": 0.43,
          "y": 0.45
        },
        {
          "x": 0.426,
          "y": 0.6
        },
        {
          "x": 0.4238,
          "y": 0.7306
        }
      ]
    ]
  },
  "12-direita": {
  "prep": [
    {
      "x": 0.4645,
      "y": 0.5901
    },
    {
      "x": 0.4645,
      "y": 0.66
    },
    {
      "x": 0.4645,
      "y": 0.74
    },
    {
      "x": 0.485,
      "y": 0.79
    },
    {
      "x": 0.5053,
      "y": 0.8015
    }
  ],
  "beats": [
    [
      {
        "x": 0.5053,
        "y": 0.8015
      },
      {
        "x": 0.525,
        "y": 0.788
      },
      {
        "x": 0.55,
        "y": 0.78
      },
      {
        "x": 0.572,
        "y": 0.779
      },
      {
        "x": 0.5928,
        "y": 0.7824
      }
    ],
    [
      {
        "x": 0.5928,
        "y": 0.7824
      },
      {
        "x": 0.615,
        "y": 0.77
      },
      {
        "x": 0.64,
        "y": 0.762
      },
      {
        "x": 0.665,
        "y": 0.76
      },
      {
        "x": 0.6847,
        "y": 0.7658
      }
    ],
    [
      {
        "x": 0.6847,
        "y": 0.7658
      },
      {
        "x": 0.64,
        "y": 0.71
      },
      {
        "x": 0.57,
        "y": 0.67
      },
      {
        "x": 0.48,
        "y": 0.655
      },
      {
        "x": 0.41,
        "y": 0.665
      },
      {
        "x": 0.37,
        "y": 0.69
      },
      {
        "x": 0.3561,
        "y": 0.7197
      }
    ],
    [
      {
        "x": 0.3561,
        "y": 0.7197
      },
      {
        "x": 0.338,
        "y": 0.702
      },
      {
        "x": 0.315,
        "y": 0.695
      },
      {
        "x": 0.298,
        "y": 0.692
      },
      {
        "x": 0.2818,
        "y": 0.6935
      }
    ],
    [
      {
        "x": 0.2818,
        "y": 0.6935
      },
      {
        "x": 0.26,
        "y": 0.68
      },
      {
        "x": 0.24,
        "y": 0.672
      },
      {
        "x": 0.22,
        "y": 0.666
      },
      {
        "x": 0.204,
        "y": 0.6643
      }
    ],
    [
      {
        "x": 0.204,
        "y": 0.6643
      },
      {
        "x": 0.25,
        "y": 0.6
      },
      {
        "x": 0.35,
        "y": 0.56
      },
      {
        "x": 0.47,
        "y": 0.54
      },
      {
        "x": 0.57,
        "y": 0.55
      },
      {
        "x": 0.6613,
        "y": 0.6037
      }
    ],
    [
      {
        "x": 0.6613,
        "y": 0.6037
      },
      {
        "x": 0.685,
        "y": 0.59
      },
      {
        "x": 0.71,
        "y": 0.582
      },
      {
        "x": 0.732,
        "y": 0.578
      },
      {
        "x": 0.7549,
        "y": 0.578
      }
    ],
    [
      {
        "x": 0.7549,
        "y": 0.578
      },
      {
        "x": 0.78,
        "y": 0.568
      },
      {
        "x": 0.81,
        "y": 0.558
      },
      {
        "x": 0.835,
        "y": 0.553
      },
      {
        "x": 0.8552,
        "y": 0.5547
      }
    ],
    [
      {
        "x": 0.8552,
        "y": 0.5547
      },
      {
        "x": 0.8133,
        "y": 0.4783
      },
      {
        "x": 0.73,
        "y": 0.42
      },
      {
        "x": 0.605,
        "y": 0.3833
      },
      {
        "x": 0.48,
        "y": 0.37
      },
      {
        "x": 0.3967,
        "y": 0.38
      },
      {
        "x": 0.3239,
        "y": 0.4029
      }
    ],
    [
      {
        "x": 0.3239,
        "y": 0.4029
      },
      {
        "x": 0.38,
        "y": 0.365
      },
      {
        "x": 0.45,
        "y": 0.345
      },
      {
        "x": 0.53,
        "y": 0.338
      },
      {
        "x": 0.59,
        "y": 0.342
      },
      {
        "x": 0.6335,
        "y": 0.3478
      }
    ],
    [
      {
        "x": 0.6335,
        "y": 0.3478
      },
      {
        "x": 0.6,
        "y": 0.31
      },
      {
        "x": 0.5667,
        "y": 0.2667
      },
      {
        "x": 0.5333,
        "y": 0.2533
      },
      {
        "x": 0.5,
        "y": 0.25
      },
      {
        "x": 0.4767,
        "y": 0.2525
      }
    ],
    [
      {
        "x": 0.4767,
        "y": 0.2525
      },
      {
        "x": 0.468,
        "y": 0.2
      },
      {
        "x": 0.46,
        "y": 0.15
      },
      {
        "x": 0.475,
        "y": 0.11
      },
      {
        "x": 0.49,
        "y": 0.15
      },
      {
        "x": 0.485,
        "y": 0.2
      },
      {
        "x": 0.4767,
        "y": 0.2525
      },
      {
        "x": 0.488,
        "y": 0.4
      },
      {
        "x": 0.495,
        "y": 0.6
      },
      {
        "x": 0.502,
        "y": 0.75
      },
      {
        "x": 0.5053,
        "y": 0.8015
      }
    ]
  ]
}
};

  function getExactCurveData(beatsCount, isLeftHand) {
    var validBeats = [2, 3, 4, 6, 9, 12];
    var b = validBeats.indexOf(beatsCount) !== -1 ? beatsCount : 4;
    var raw = SOLFEJO_EXACT_CURVES[b + '-direita'] || SOLFEJO_EXACT_CURVES['4-direita'];
    if (!isLeftHand) return raw;

    // Condução Canhoto: espelha horizontalmente em relação ao eixo X central (1 - x)
    function mirrorPts(pts) {
      return pts.map(function (p) {
        return { x: 1 - p.x, y: p.y };
      });
    }

    return {
      prep: mirrorPts(raw.prep),
      beats: raw.beats.map(function (beatPts) {
        return mirrorPts(beatPts);
      })
    };
  }

  function getAnchorCircleCenter(beatsCount, isLeftHand, beatIndex) {
    var validBeats = [2, 3, 4, 6, 9, 12];
    var b = validBeats.indexOf(beatsCount) !== -1 ? beatsCount : 4;
    var list = SOLFEJO_ANCHOR_CIRCLES[b + '-direita'] || SOLFEJO_ANCHOR_CIRCLES['4-direita'];
    var idx = ((beatIndex % b) + b) % b;
    var pt = list[idx] || list[0];
    return isLeftHand ? { x: 1 - pt.x, y: pt.y } : { x: pt.x, y: pt.y };
  }

  // Interpolação ao longo de uma polyline que garante que a bolinha deslize EXATAMENTE sobre a linha
  function interpolateAlongPolyline(pts, progress) {
    if (!pts || pts.length === 0) return { x: 0.5, y: 0.5 };
    if (pts.length === 1 || progress <= 0) return pts[0];
    if (progress >= 1) return pts[pts.length - 1];

    var totalLen = 0;
    var segLens = [];
    for (var i = 0; i < pts.length - 1; i++) {
      var dx = pts[i + 1].x - pts[i].x;
      var dy = pts[i + 1].y - pts[i].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      segLens.push(len);
      totalLen += len;
    }
    if (totalLen <= 0) return pts[0];

    var targetDist = progress * totalLen;
    var accumulated = 0;
    for (var j = 0; j < segLens.length; j++) {
      var segLen = segLens[j];
      if (accumulated + segLen >= targetDist) {
        var segT = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
        var pA = pts[j];
        var pB = pts[j + 1];
        return {
          x: pA.x + (pB.x - pA.x) * segT,
          y: pA.y + (pB.y - pA.y) * segT
        };
      }
      accumulated += segLen;
    }
    return pts[pts.length - 1];
  }

  function getBallPixelCoords(normPt) {
    var baseImg = document.getElementById('msaSolfejoBaseImg');
    var wrapper = document.getElementById('msaSolfejoBaseWrapper');
    if (!baseImg || !wrapper || !normPt) return { x: 0, y: 0 };

    var wrapRect = wrapper.getBoundingClientRect();
    var imgRect = baseImg.getBoundingClientRect();

    // Calcula a caixa visual exata do conteúdo renderizado (sem letterbox)
    var naturalAspect = (baseImg.naturalWidth && baseImg.naturalHeight)
      ? (baseImg.naturalWidth / baseImg.naturalHeight)
      : 1;

    var renderW = imgRect.width;
    var renderH = imgRect.height;
    if (renderW / renderH > naturalAspect) {
      renderW = renderH * naturalAspect;
    } else {
      renderH = renderW / naturalAspect;
    }

    var contentLeft = imgRect.left + (imgRect.width - renderW) / 2;
    var contentTop = imgRect.top + (imgRect.height - renderH) / 2;

    var leftOffset = contentLeft - wrapRect.left;
    var topOffset = contentTop - wrapRect.top;

    return {
      x: leftOffset + (normPt.x * renderW),
      y: topOffset + (normPt.y * renderH)
    };
  }

  function setBallPosition(normPt) {
    var ball = document.getElementById('msaBallCursor');
    if (!ball || !normPt) return;
    ball.style.left = (normPt.x * 100).toFixed(3) + '%';
    ball.style.top = (normPt.y * 100).toFixed(3) + '%';
    ball.style.display = 'block';
  }

  function triggerBallPulse() {
    var ball = document.getElementById('msaBallCursor');
    if (!ball) return;
    ball.classList.remove('pulsing');
    void ball.offsetWidth; // Força reflow no browser para reiniciar o efeito de pop radiante a cada tempo
    ball.classList.add('pulsing');
  }

  function updateNoteBadge(ev) {
    var nameEl = document.getElementById('msaNoteCurrentName');
    var labelEl = document.getElementById('msaNoteVoiceLabel');
    if (!nameEl) return;

    if (!ev || ev.isRest) {
      nameEl.textContent = ev ? 'Pausa' : '--';
      nameEl.style.color = '#94A3B8';
      return;
    }

    if (state.modoLeitura === 'ritmica' || !ev.step || ev.pitchKey === 'unpitched') {
      nameEl.textContent = 'TÁ';
      nameEl.style.color = '#F59E0B';
      if (labelEl) {
        labelEl.textContent = state.modoLeitura === 'instrumento' ? 'Instrumento:' : 'Voz:';
      }
      return;
    }

    var stepMap = { 'C': 'Dó', 'D': 'Ré', 'E': 'Mi', 'F': 'Fá', 'G': 'Sol', 'A': 'Lá', 'B': 'Si' };
    var ptName = stepMap[ev.step] || ev.step;
    if (ev.alter === 1) ptName += '♯';
    else if (ev.alter === -1) ptName += '♭';

    nameEl.textContent = ptName;
    nameEl.style.color = '#EA580C';

    if (labelEl) {
      labelEl.textContent = state.modoLeitura === 'instrumento' ? 'Instrumento:' : 'Voz:';
    }
  }

  function updateBeatDirection(beatIndex, isPrep, hasFermata) {
    var numEl = document.getElementById('msaBeatNum');
    var txtEl = document.getElementById('msaBeatDirectionText');
    var fermBadge = document.getElementById('msaFermataBadge');

    if (fermBadge) {
      fermBadge.classList.toggle('hidden', !hasFermata);
    }

    if (!numEl || !txtEl) return;

    if (isPrep) {
      numEl.textContent = ' ';
      txtEl.textContent = 'Preparação';
      txtEl.style.color = '#00B4D8';
      return;
    }

    var beats = state.batidasCompasso || 4;
    var b = ((beatIndex % beats) + beats) % beats;
    var fermataSuffix = hasFermata ? ' 𝄐 (Fermata)' : '';

    if (beats === 6) {
      numEl.textContent = String(b + 1);
      if (b === 0) {
        txtEl.textContent = 'embaixo' + fermataSuffix;
        txtEl.style.color = '#1E293B';
      } else if (b === 1) {
        txtEl.textContent = 'para dentro' + fermataSuffix;
        txtEl.style.color = '#2B6CB0';
      } else if (b === 2) {
        txtEl.textContent = 'mais para dentro' + fermataSuffix;
        txtEl.style.color = '#2B6CB0';
      } else if (b === 3) {
        txtEl.textContent = 'para fora' + fermataSuffix;
        txtEl.style.color = '#2F855A';
      } else if (b === 4) {
        txtEl.textContent = 'mais para fora' + fermataSuffix;
        txtEl.style.color = '#2F855A';
      } else {
        txtEl.textContent = 'para cima' + fermataSuffix;
        txtEl.style.color = '#EA3829';
      }
    } else if (beats === 4) {
      numEl.textContent = String(b + 1);
      if (b === 0) {
        txtEl.textContent = 'embaixo' + fermataSuffix;
        txtEl.style.color = '#1E293B';
      } else if (b === 1) {
        txtEl.textContent = 'para dentro' + fermataSuffix;
        txtEl.style.color = '#2B6CB0';
      } else if (b === 2) {
        txtEl.textContent = 'para fora' + fermataSuffix;
        txtEl.style.color = '#2F855A';
      } else {
        txtEl.textContent = 'para cima' + fermataSuffix;
        txtEl.style.color = '#EA3829';
      }
    } else if (beats === 3) {
      numEl.textContent = String(b + 1);
      if (b === 0) {
        txtEl.textContent = 'embaixo' + fermataSuffix;
        txtEl.style.color = '#1E293B';
      } else if (b === 1) {
        txtEl.textContent = 'para fora' + fermataSuffix;
        txtEl.style.color = '#2F855A';
      } else {
        txtEl.textContent = 'para cima' + fermataSuffix;
        txtEl.style.color = '#EA3829';
      }
    } else if (beats === 2) {
      numEl.textContent = String(b + 1);
      if (b === 0) {
        txtEl.textContent = 'embaixo' + fermataSuffix;
        txtEl.style.color = '#1E293B';
      } else {
        txtEl.textContent = 'para cima' + fermataSuffix;
        txtEl.style.color = '#EA3829';
      }
    } else {
      numEl.textContent = String(b + 1);
      var quarter = Math.floor((b / beats) * 4);
      var dirs = ['embaixo', 'para dentro', 'para fora', 'para cima'];
      txtEl.textContent = (dirs[quarter] || 'contagem') + fermataSuffix;
      txtEl.style.color = '#1E293B';
    }
  }

  function cancelSolfejoTween() {
    if (state.handTweenRaf) {
      cancelAnimationFrame(state.handTweenRaf);
      state.handTweenRaf = null;
    }
  }

  function startSolfejoBallTween(fromBeat, toBeat, durationMs, isPrep, hasFermata) {
    cancelSolfejoTween();

    var ball = document.getElementById('msaBallCursor');
    if (!ball) return;
    ball.classList.remove('fermata-holding');

    var beatsCount = state.batidasCompasso || 4;
    var curveData = getExactCurveData(beatsCount, state.maoEsquerda);

    var startPerf = performance.now();
    var duration = durationMs || ((60 / state.bpm) * 1000);

    // Easing sinusoidal ultra suave: acelera no início e desacelera perfeitamente para pousar na bolinha
    function easeSolfejo(t) {
      return 0.5 * (1 - Math.cos(Math.PI * t));
    }

    if (isPrep) {
      var prepPts = (curveData && curveData.prep) ? curveData.prep : [
        { x: 0.5401, y: 0.4867 },
        { x: 0.5401, y: 0.7550 },
        { x: 0.4850, y: 0.7383 }
      ];

      setBallPosition(prepPts[0]);
      triggerBallPulse();

      function prepTweenLoop(nowPerf) {
        if (!state.isPlaying) return;
        var elapsed = nowPerf - startPerf;
        var t = Math.min(1, elapsed / duration);

        var travelT = Math.min(1, t / 0.80);
        var progress = easeSolfejo(travelT);

        var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number') ? state.scoreData.initialBeatIndex : 0;
        var endPt = getAnchorCircleCenter(beatsCount, state.maoEsquerda, initialBeat);
        var curPt = (travelT >= 1) ? endPt : interpolateAlongPolyline(prepPts, progress);
        setBallPosition(curPt);

        if (t >= 1) {
          state.handTweenRaf = null;
          setBallPosition(endPt);
          triggerBallPulse();
          return;
        }
        state.handTweenRaf = requestAnimationFrame(prepTweenLoop);
      }

      state.handTweenRaf = requestAnimationFrame(prepTweenLoop);
      return;
    }

    if (!curveData || !curveData.beats || !curveData.beats.length) return;
    var b = ((fromBeat % beatsCount) + beatsCount) % beatsCount;
    var beatPts = curveData.beats[b] || curveData.beats[0];
    var targetAnchor = getAnchorCircleCenter(beatsCount, state.maoEsquerda, (b + 1) % beatsCount);

    setBallPosition(beatPts[0]);
    triggerBallPulse();

    function beatTweenLoop(nowPerf) {
      if (!state.isPlaying) return;
      var elapsed = nowPerf - startPerf;
      var t = elapsed / duration;

      if (hasFermata && t >= 0.75) {
        setBallPosition(targetAnchor);
        if (!ball.classList.contains('fermata-holding')) {
          ball.classList.add('fermata-holding');
        }
        state.handTweenRaf = requestAnimationFrame(beatTweenLoop);
        return;
      }

      // Conclui a viagem suave pelos primeiros 80% do tempo e repousa 100% PARADA sobre a bolinha destino nos 20% finais!
      var travelT = Math.min(1, t / 0.80);
      var progress = easeSolfejo(travelT);
      var curPt = (travelT >= 1) ? targetAnchor : interpolateAlongPolyline(beatPts, progress);
      setBallPosition(curPt);

      if (t >= 1) {
        state.handTweenRaf = null;
        setBallPosition(targetAnchor);
        return;
      }

      state.handTweenRaf = requestAnimationFrame(beatTweenLoop);
    }

    state.handTweenRaf = requestAnimationFrame(beatTweenLoop);
  }

  function getPrepPoint(beatsCount, isLeftHand) {
    var curveData = getExactCurveData(beatsCount, isLeftHand);
    if (curveData && curveData.prep && curveData.prep.length > 0) {
      return curveData.prep[0];
    }
    return getAnchorCircleCenter(beatsCount, isLeftHand, 0);
  }

  function posicionarNaPreparacao() {
    cancelSolfejoTween();
    var ball = document.getElementById('msaBallCursor');
    if (!ball) return;
    ball.classList.remove('pulsing', 'fermata-holding');

    var beats = state.batidasCompasso || 4;
    var prepPt = getPrepPoint(beats, state.maoEsquerda);
    setBallPosition(prepPt);
    updateBeatDirection(-1, true, false);
  }

  function posicionarNoPontoAnchor(beatIndex) {
    cancelSolfejoTween();
    var ball = document.getElementById('msaBallCursor');
    if (!ball) return;
    ball.classList.remove('pulsing', 'fermata-holding');

    var beats = state.batidasCompasso || 4;
    var b = ((beatIndex % beats) + beats) % beats;
    var pt = getAnchorCircleCenter(beats, state.maoEsquerda, b);
    setBallPosition(pt);
    updateBeatDirection(beatIndex, false, false);
  }

  function atualizarQuadroSolfejo() {
    var beats = state.batidasCompasso || 4;
    var side = state.maoEsquerda ? 'esquerda' : 'direita';
    var baseImg = document.getElementById('msaSolfejoBaseImg');
    if (baseImg) {
      baseImg.onload = function () {
        var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
          ? state.scoreData.initialBeatIndex
          : 0;
        posicionarNaPreparacao();
        highlightBeatDot(initialBeat);
      };
      baseImg.src = './imgs/movimento-' + beats + '-' + side + '.png';
      if (baseImg.complete && baseImg.naturalWidth) {
        baseImg.onload();
      }
    }
  }

  // =========================================================================
  // DESTAQUE DA PARTITURA: CABEÇA/HASTE EM VERMELHO E SÍLABA EM AMARELO
  // =========================================================================
  function highlightScoreAtCursor(clearOnly) {
    var container = document.getElementById('msaOsmdContainer');
    if (!container) return;

    // Remove destaques anteriores
    container.querySelectorAll('.msa-highlight-notehead').forEach(function (el) {
      el.classList.remove('msa-highlight-notehead');
    });
    container.querySelectorAll('.msa-highlight-stem').forEach(function (el) {
      el.classList.remove('msa-highlight-stem');
    });
    container.querySelectorAll('.msa-highlight-lyric').forEach(function (el) {
      el.classList.remove('msa-highlight-lyric');
    });
    container.querySelectorAll('.msa-lyric-box-rect').forEach(function (el) {
      el.remove();
    });

    if (clearOnly || !state.isPlaying || !state.osmd || !state.osmd.cursor || !state.osmd.cursor.cursorElement) {
      return;
    }

    try {
      var cursorEl = state.osmd.cursor.cursorElement;
      var cursorRect = cursorEl.getBoundingClientRect();
      var cursorCenterX = cursorRect.left + (cursorRect.width / 2);

      var matchedNote = false;

      // 1. Tenta obter a nota gráfica oficial apontada pelo cursor do OSMD
      if (typeof state.osmd.cursor.GNotesUnderCursor === 'function') {
        var gnotes = state.osmd.cursor.GNotesUnderCursor();
        if (gnotes && gnotes.length > 0) {
          var hasOnlyRests = true;
          for (var gi = 0; gi < gnotes.length; gi++) {
            var gn = gnotes[gi];
            if (gn && gn.sourceNote && !gn.sourceNote.isRest()) {
              hasOnlyRests = false;
              break;
            }
          }

          if (hasOnlyRests) {
            // Em pausas, nenhuma nota deve ficar vermelha!
            autoScrollScoreToCursor();
            return;
          }

          gnotes.forEach(function (gn) {
            if (!gn || (gn.sourceNote && gn.sourceNote.isRest())) return;
            var svgGroup = null;
            if (typeof gn.getSVGGElement === 'function') {
              svgGroup = gn.getSVGGElement();
            }
            if (!svgGroup && gn.vfGraphicalNote && typeof gn.vfGraphicalNote.getSVGGElement === 'function') {
              svgGroup = gn.vfGraphicalNote.getSVGGElement();
            }

            if (svgGroup) {
              matchedNote = true;
              var heads = svgGroup.querySelectorAll('.vf-notehead path, .vf-notehead ellipse, path.vf-notehead, path, ellipse');
              heads.forEach(function (h) { h.classList.add('msa-highlight-notehead'); });
              var stems = svgGroup.querySelectorAll('line, path');
              stems.forEach(function (s) { s.classList.add('msa-highlight-stem'); });
            }
          });
        }
      }

      // 2. Fallback de alta precisão: encontra a nota no mesmo sistema com a MENOR distância horizontal ao cursor
      if (!matchedNote) {
        var svgs = container.querySelectorAll('svg');
        var bestStaveNote = null;
        var minXDist = Infinity;

        svgs.forEach(function (svg) {
          var staveNotes = svg.querySelectorAll('g.vf-stavenote');
          staveNotes.forEach(function (sn) {
            var r = sn.getBoundingClientRect();
            var vertDist = Math.abs(r.top - cursorRect.top);
            // Deve estar no mesmo sistema/pauta (tolerância vertical)
            if (vertDist < 90) {
              var snCenterX = r.left + (r.width / 2);
              var xDist = Math.abs(snCenterX - cursorCenterX);
              if (xDist < minXDist && xDist < 60) {
                minXDist = xDist;
                bestStaveNote = sn;
              }
            }
          });
        });

        if (bestStaveNote) {
          var heads = bestStaveNote.querySelectorAll('.vf-notehead path, .vf-notehead ellipse, path.vf-notehead, path, ellipse');
          heads.forEach(function (h) { h.classList.add('msa-highlight-notehead'); });
          var stems = bestStaveNote.querySelectorAll('line, path');
          stems.forEach(function (s) { s.classList.add('msa-highlight-stem'); });
        }
      }

      // 3. Destaca a sílaba (letra / lyric) correspondente sob o cursor
      var svgsList = container.querySelectorAll('svg');
      svgsList.forEach(function (svg) {
        var lyrics = svg.querySelectorAll('text');
        var bestLyric = null;
        var minLDist = Infinity;

        lyrics.forEach(function (txt) {
          var r = txt.getBoundingClientRect();
          if (r.top >= cursorRect.top && Math.abs(r.top - (cursorRect.top + cursorRect.height)) < 70) {
            var txtCenterX = r.left + (r.width / 2);
            var dist = Math.abs(txtCenterX - cursorCenterX);
            if (dist < minLDist && dist < 35) {
              minLDist = dist;
              bestLyric = txt;
            }
          }
        });

        if (bestLyric) {
          bestLyric.classList.add('msa-highlight-lyric');
          try {
            var bbox = bestLyric.getBBox();
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('class', 'msa-lyric-box-rect');
            rect.setAttribute('x', bbox.x - 3);
            rect.setAttribute('y', bbox.y - 1);
            rect.setAttribute('width', bbox.width + 6);
            rect.setAttribute('height', bbox.height + 2);
            rect.setAttribute('rx', '3');
            rect.setAttribute('fill', '#FEF08A');
            rect.setAttribute('opacity', '0.92');
            bestLyric.parentNode.insertBefore(rect, bestLyric);
          } catch (e2) {}
        }
      });

      // Auto-scroll contínuo e suave seguindo a nota em execução
      autoScrollScoreToCursor();
    } catch (e) {}
  }

  // =========================================================================
  // AUTO-SCROLL SUAVE DA PARTITURA SEGUINDO A NOTA ATIVA (ESTILO DO APP)
  // =========================================================================
  function autoScrollScoreToCursor() {
    var container = document.getElementById('msaOsmdContainer');
    if (!container || !state.osmd || !state.osmd.cursor) return;
    var cursorEl = state.osmd.cursor.cursorElement;
    if (!cursorEl) return;

    var cRect = cursorEl.getBoundingClientRect();
    var boxRect = container.getBoundingClientRect();

    // Scroll vertical inteligente: se a nota desceu para uma nova linha / sistema,
    // alinha a pauta a ~24% da altura da janela de partitura
    var currentScrollTop = container.scrollTop;
    var targetScrollTop = (currentScrollTop + cRect.top) - (boxRect.top + (boxRect.height * 0.24));

    // Scroll horizontal inteligente: mantém o cursor a ~32% da largura para visão antecipada
    var currentScrollLeft = container.scrollLeft;
    var targetScrollLeft = (currentScrollLeft + cRect.left) - (boxRect.left + (boxRect.width * 0.32));

    var deltaY = targetScrollTop - currentScrollTop;
    var deltaX = targetScrollLeft - currentScrollLeft;

    if (Math.abs(deltaY) > 16 || Math.abs(deltaX) > 12) {
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth'
      });
    }
  }

  // =========================================================================
  // CARREGAMENTO E VISUALIZAÇÃO DA PARTITURA COM OSMD
  // =========================================================================
  function renderScore(musicXmlUrl) {
    var host = document.getElementById('msaOsmdContainer');
    if (!host) return;
    host.innerHTML = '<div id="msaScoreLoadingNotice" class="p-6 text-center text-sm text-base-content/60"><span class="du-loading du-loading-spinner du-loading-md"></span><br>Carregando partitura da lição...</div><div id="msaScoreInnerHost"></div>';

    var innerHost = document.getElementById('msaScoreInnerHost');
    if (typeof window.opensheetmusicdisplay === 'undefined') {
      host.innerHTML = '<div class="p-4 text-center text-error">Biblioteca OSMD não disponível.</div>';
      return;
    }

    try {
      state.osmd = new window.opensheetmusicdisplay.OpenSheetMusicDisplay(innerHost || host, {
        backend: 'svg',
        autoResize: true,
        drawTitle: true,
        drawCredits: false,
        drawingParameters: 'compact'
      });
      // Escala personalizada/padrão da partitura
      state.isZoomExpanded = true;
      if (!state.osmdZoom) state.osmdZoom = getDefaultScoreZoom();
      state.osmd.zoom = state.osmdZoom;
      updateScoreZoomLabel();
      var stageCard = document.getElementById('msaVideoStageCard');
      if (stageCard) stageCard.classList.add('msa-view-expanded');

      var targetUrl = (musicXmlUrl.startsWith('./') || musicXmlUrl.startsWith('/')) ? musicXmlUrl : './' + musicXmlUrl;
      fetch(targetUrl)
        .then(function (res) { return res.text(); })
        .then(function (xmlText) {
          state.rawXmlText = xmlText;
          var parser = new DOMParser();
          state.xmlDoc = parser.parseFromString(xmlText, 'application/xml');

          // Parse instantâneo e garantido da partitura
          state.scoreData = parseMsaScore(state.xmlDoc, state.bpm, state.batidasCompasso);
          if (state.scoreData && state.scoreData.beats && state.scoreData.beats !== state.batidasCompasso) {
            state.batidasCompasso = state.scoreData.beats;
            atualizarQuadroSolfejo();
          }
          var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
            ? state.scoreData.initialBeatIndex
            : 0;
          highlightBeatDot(initialBeat);
          posicionarNaPreparacao();

          state.osmd.load(xmlText).then(function () {
            var notice = document.getElementById('msaScoreLoadingNotice');
            if (notice) notice.remove();
            state.osmd.zoom = state.osmdZoom;
            state.osmd.render();
            if (state.osmd.cursor) {
              state.osmd.cursor.show();
              state.osmd.cursor.reset();
            }
            setTimeout(autoScrollScoreToCursor, 150);
          });
        })
        .catch(function () {
          host.innerHTML = '<div class="p-4 text-center text-error">Erro ao carregar arquivo MusicXML.</div>';
        });
    } catch (e) {
      host.innerHTML = '<div class="p-4 text-center text-error">Falha ao iniciar visualizador OSMD.</div>';
    }
  }

  // =========================================================================
  // MOTOR DE PLAYBACK SINCRONIZADO (Lookahead Scheduler Web Audio + Visual)
  // =========================================================================
  function startPlayback() {
    if (state.isPlaying) return;
    var ctx = getAudioContext();
    if (ctx && ctx.resume) {
      ctx.resume();
    }
    if (window.gemPlayerAudio && typeof window.gemPlayerAudio.getAudioContext === 'function') {
      try {
        var gCtx = window.gemPlayerAudio.getAudioContext();
        if (gCtx && gCtx.state === 'suspended') gCtx.resume();
      } catch (e) {}
    }
    if (state.modoLeitura === 'instrumento') {
      ensureInstrumentSoundFontLoaded();
    } else {
      loadVoiceSamples(state.generoVoz, true);
    }

    if (!state.scoreData && state.xmlDoc) {
      state.scoreData = parseMsaScore(state.xmlDoc, state.bpm, state.batidasCompasso);
    }
    if (!state.scoreData && state.rawXmlText) {
      state.scoreData = parseMsaScore(state.rawXmlText, state.bpm, state.batidasCompasso);
    }
    if (!state.scoreData) {
      console.warn('MSA: Partitura ainda não processada.');
      return;
    }

    state.isPlaying = true;
    updatePlayButtons();

    if (state.osmd && state.osmd.cursor) {
      try {
        state.osmd.cursor.show();
        state.osmd.cursor.reset();
      } catch (e) {}
    }

    var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
      ? state.scoreData.initialBeatIndex
      : 0;
    highlightBeatDot(initialBeat);
    posicionarNaPreparacao();

    var beatDurationMs = (60 / state.bpm) * 1000;
    var prepSec = (state.scoreData && typeof state.scoreData.prepDurationSec === 'number')
      ? state.scoreData.prepDurationSec
      : (60 / state.bpm);

    // ÂNCORA DE TEMPO MESTRE DO WEB AUDIO: margem segura de 60ms + tempo de PREPARAÇÃO (tempo de respiração do vídeo)
    var audioAnchor = ctx.currentTime + 0.060 + prepSec;

    var nextAudioNoteIdx = 0;
    var nextAudioBeatIdx = 0;

    var nextVisualCursorIdx = 1; // O cursor OSMD já inicia posicionado no elemento inicial (índice 0)
    var nextVisualBeatIdx = 0;
    var firstNoteHighlighted = false;

    function mainTimelineLoop() {
      if (!state.isPlaying) return;

      var currentAudioTime = ctx.currentTime;
      var elapsedSec = currentAudioTime - audioAnchor;

      // -------------------------------------------------------------
      // 1. AGENDADOR DE ÁUDIO NO HARDWARE (Lookahead de 140ms à frente)
      // Dispara a voz e o clique do metrônomo no tempo exato, livre de lag de tela
      // -------------------------------------------------------------
      var scheduleHorizon = elapsedSec + 0.140;

      // Notas e Fonação (TÁ ou Dó/Ré/Mi/Fá/Sol/Lá/Si)
      while (state.scoreData && nextAudioNoteIdx < state.scoreData.events.length &&
             state.scoreData.events[nextAudioNoteIdx].startSec <= scheduleHorizon) {
        var ev = state.scoreData.events[nextAudioNoteIdx];
        var noteExactTime = audioAnchor + ev.startSec;
        var voiceTriggerTime = Math.max(ctx.currentTime, noteExactTime - 0.008);

        if (ev.isRest) {
          stopActiveVoice(0.012, noteExactTime);
        } else if (!ev.isTiedContinuation) {
          triggerNoteVoice(ev, voiceTriggerTime);
        }
        nextAudioNoteIdx++;
      }

      // Cliques do Metrônomo (incluindo preparação e batidas)
      while (state.scoreData && state.scoreData.beatEvents &&
             nextAudioBeatIdx < state.scoreData.beatEvents.length &&
             state.scoreData.beatEvents[nextAudioBeatIdx].sec <= scheduleHorizon) {
        var beatEv = state.scoreData.beatEvents[nextAudioBeatIdx];
        var beatExactTime = audioAnchor + beatEv.sec;
        if (state.somMetronomoAtivo) {
          playClick(beatEv.accent, beatExactTime);
        }
        nextAudioBeatIdx++;
      }

      // -------------------------------------------------------------
      // 2. ATUALIZAÇÃO VISUAL SINCRONIZADA (Cursor OSMD + Destaque + Solfejo)
      // -------------------------------------------------------------
      // Destaque inicial imediato da primeira nota assim que a lição inicia
      if (elapsedSec >= -0.005 && !firstNoteHighlighted) {
        firstNoteHighlighted = true;
        highlightScoreAtCursor();
        if (state.scoreData.events && state.scoreData.events[0]) {
          updateNoteBadge(state.scoreData.events[0]);
        }
      }

      // Avanço do cursor e destaque da nota sob a cabeça/haste e sílaba
      while (state.scoreData && state.scoreData.cursorStarts &&
             nextVisualCursorIdx < state.scoreData.cursorStarts.length &&
             state.scoreData.cursorStarts[nextVisualCursorIdx] <= elapsedSec + 0.005) {
        if (state.osmd && state.osmd.cursor) {
          try {
            state.osmd.cursor.next();
          } catch (e) {}
          highlightScoreAtCursor();
          if (state.scoreData.events && state.scoreData.events[nextVisualCursorIdx]) {
            updateNoteBadge(state.scoreData.events[nextVisualCursorIdx]);
          }
        }
        nextVisualCursorIdx++;
      }

      // Condução do solfejo (preparação, batidas normais e fermatas)
      while (state.scoreData && state.scoreData.beatEvents &&
             nextVisualBeatIdx < state.scoreData.beatEvents.length &&
             state.scoreData.beatEvents[nextVisualBeatIdx].sec <= elapsedSec + 0.010) {
        var vBeatEv = state.scoreData.beatEvents[nextVisualBeatIdx];
        var isPrep = !!vBeatEv.isPrep;
        var hasFermata = !!vBeatEv.hasFermata;

        if (isPrep) {
          updateBeatDirection(-1, true, false);
          startSolfejoBallTween(null, null, prepSec * 1000, true, false);
        } else {
          var thisBeat = vBeatEv.beatIndex;
          var nextBeat = (thisBeat + 1) % state.batidasCompasso;
          updateBeatDirection(thisBeat, false, hasFermata);
          highlightBeatDot(thisBeat);
          startSolfejoBallTween(thisBeat, nextBeat, beatDurationMs, false, hasFermata);

          if (vBeatEv.measureNumber === 1 && thisBeat === (state.scoreData.initialBeatIndex || 0)) {
            highlightScoreAtCursor();
          }
        }

        nextVisualBeatIdx++;
      }

      // -------------------------------------------------------------
      // 3. FINAL DA LIÇÃO
      // -------------------------------------------------------------
      if (state.scoreData && elapsedSec >= state.scoreData.totalDurationSec + 0.25) {
        stopPlayback();
        return;
      }

      state.animFrameId = requestAnimationFrame(mainTimelineLoop);
    }

    state.animFrameId = requestAnimationFrame(mainTimelineLoop);
  }

  function pausePlayback() {
    state.isPlaying = false;
    stopActiveVoice(0.012);
    stopActiveInstrumentSound();
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    cancelSolfejoTween();
    updatePlayButtons();
  }

  function stopPlayback() {
    pausePlayback();
    stopActiveVoice(0.012);
    stopActiveInstrumentSound();
    highlightScoreAtCursor(true);
    updateNoteBadge(null);
    if (state.osmd && state.osmd.cursor) {
      try {
        state.osmd.cursor.reset();
      } catch (e) {}
    }
    var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
      ? state.scoreData.initialBeatIndex
      : 0;
    highlightBeatDot(initialBeat);
    posicionarNaPreparacao();
    updatePlayButtons();
  }

  function updatePlayButtons() {
    var btnAction = document.getElementById('btnMsaPlayStop');
    var playIcon = document.getElementById('msaPlayIcon');
    var playText = document.getElementById('msaPlayText');

    if (btnAction) {
      if (state.isPlaying) {
        btnAction.classList.remove('btn-msa-start');
        btnAction.classList.add('btn-msa-stop');
        if (playIcon) playIcon.setAttribute('data-lucide', 'square');
        if (playText) playText.textContent = 'Parar';
      } else {
        btnAction.classList.remove('btn-msa-stop');
        btnAction.classList.add('btn-msa-start');
        if (playIcon) playIcon.setAttribute('data-lucide', 'play');
        if (playText) playText.textContent = 'Iniciar';
      }
    }

    // Compatibilidade com botões herdados se presentes
    var btnPlay = document.getElementById('btnMsaPlay');
    var btnPause = document.getElementById('btnMsaPause');
    if (btnPlay) btnPlay.classList.toggle('hidden', state.isPlaying);
    if (btnPause) btnPause.classList.toggle('hidden', !state.isPlaying);

    if (window.gemRefreshLucide) window.gemRefreshLucide();
    else if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
  }

  // =========================================================================
  // INTERFACE, SELEÇÃO E CONTROLES
  // =========================================================================
  function renderBeatDots() {
    var container = document.getElementById('msaBeatDots');
    if (!container) return;
    container.innerHTML = '';
    var beats = state.batidasCompasso || 4;

    for (var i = 0; i < beats; i++) {
      var dot = document.createElement('span');
      dot.className = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ' +
        (i === 0 ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/70');
      dot.dataset.beatNum = String(i + 1);
      dot.textContent = String(i + 1);
      container.appendChild(dot);
    }
  }

  function highlightBeatDot(beatIndex) {
    var container = document.getElementById('msaBeatDots');
    if (!container) return;
    var dots = container.querySelectorAll('[data-beat-num]');
    dots.forEach(function (dot, idx) {
      var isCur = idx === beatIndex;
      if (isCur) {
        dot.className = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold bg-primary text-primary-content scale-110 shadow-sm';
      } else {
        dot.className = 'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-base-300 text-base-content/60';
      }
    });
  }

  function loadCatalog() {
    return fetch('./xml/colecoes/msa/catalogo-msa.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.catalogo = data.exercicios || [];
        renderFasesSelector();
        selectFase(state.faseSelecionada);
      })
      .catch(function (err) {
        console.error('Erro ao carregar catálogo MSA:', err);
      });
  }

  function renderFasesSelector() {
    var container = document.getElementById('msaFaseTabs');
    if (!container) return;
    container.innerHTML = '';

    var fasesSet = {};
    state.catalogo.forEach(function (ex) {
      if (ex.fase) fasesSet[ex.fase] = true;
    });
    var fases = Object.keys(fasesSet).map(Number).sort(function (a, b) { return a - b; });

    fases.forEach(function (f) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'msa-fase-tab du-btn du-btn-sm whitespace-nowrap' + (f === state.faseSelecionada ? ' du-btn-primary' : ' du-btn-outline');
      btn.textContent = 'Fase ' + f;
      btn.addEventListener('click', function () {
        selectFase(f);
      });
      container.appendChild(btn);
    });
  }

  function selectFase(faseNum) {
    state.faseSelecionada = faseNum;
    document.querySelectorAll('.msa-fase-tab').forEach(function (btn) {
      var isActive = btn.textContent.trim() === 'Fase ' + faseNum;
      btn.classList.toggle('du-btn-primary', isActive);
      btn.classList.toggle('du-btn-outline', !isActive);
      if (isActive) {
        try {
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch (e) {}
      }
    });

    var selectEl = document.getElementById('msaExercicioSelect');
    if (!selectEl) return;
    selectEl.innerHTML = '';

    var exercicios = state.catalogo.filter(function (ex) { return ex.fase === faseNum; });
    exercicios.forEach(function (ex) {
      var opt = document.createElement('option');
      opt.value = ex.id;
      var rawName = (ex.exercicio || ex.titulo || '').replace(/_/g, ' ').replace(/\s+/g, ' ').replace(/-\s*P\b/i, '').trim();
      var pagInfo = ex.pagina ? ' (Pág. ' + ex.pagina + ')' : '';
      var compInfo = ex.compasso ? ' [' + ex.compasso + ']' : '';
      opt.textContent = rawName + pagInfo + compInfo;
      selectEl.appendChild(opt);
    });

    if (exercicios.length > 0) {
      carregarExercicio(exercicios[0]);
    }
  }

  function carregarExercicio(exercicio) {
    if (!exercicio) return;
    stopPlayback();
    state.exercicioAtual = exercicio;
    var deducedBeats = 4;
    if (exercicio.batidas) {
      deducedBeats = exercicio.batidas;
    } else if (exercicio.compasso) {
      var parts = exercicio.compasso.split('/');
      var num = parseInt(parts[0], 10);
      if (num === 2) deducedBeats = 2;
      else if (num === 3) deducedBeats = 3;
      else if (num === 4) deducedBeats = 4;
      else if (num === 6) deducedBeats = 6;
      else if (num === 9) deducedBeats = 9;
      else if (num === 12) deducedBeats = 12;
    }
    state.batidasCompasso = deducedBeats;
    state.bpm = exercicio.bpm || 60;

    var bpmSlider = document.getElementById('msaBpmSlider');
    var bpmVal = document.getElementById('msaBpmValue');
    var titleEl = document.getElementById('msaExercicioTitle');
    var metaEl = document.getElementById('msaExercicioMeta');
    var badgeCompasso = document.getElementById('msaCompassoBadge');

    if (bpmSlider) bpmSlider.value = state.bpm;
    if (bpmVal) bpmVal.textContent = state.bpm;
    if (titleEl) titleEl.textContent = exercicio.titulo || exercicio.exercicio;
    if (badgeCompasso) badgeCompasso.textContent = state.batidasCompasso + ' Tempos';

    // Atualiza botão de favorito
    var btnFav = document.getElementById('btnMsaFav');
    if (btnFav) {
      var favKey = 'msa_fav_' + exercicio.id;
      var isFav = localStorage.getItem(favKey) === 'true';
      btnFav.classList.toggle('text-amber-500', isFav);
    }

    if (metaEl) {
      var badges = '<span class="du-badge du-badge-sm du-badge-primary">Compasso: ' + exercicio.compasso + '</span> ';
      badges += '<span class="du-badge du-badge-sm du-badge-ghost">' + exercicio.batidas + ' Batidas</span> ';
      if (exercicio.pagina) badges += '<span class="du-badge du-badge-sm du-badge-outline">Pág. ' + exercicio.pagina + '</span> ';
      metaEl.innerHTML = badges;
      if (window.gemRefreshLucide) window.gemRefreshLucide();
      else if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    }

    renderBeatDots();

    if (exercicio.tipo === 'ritmica' || !exercicio.temNotasComAltura) {
      // Nas lições rítmicas com TAAA, permite tanto Rítmica (voz humana) quanto Instrumento (nota única)
      setTabDisabled('metrica', true);
      setTabDisabled('instrumento', false);
      if (state.modoLeitura === 'metrica') {
        setModoLeitura('ritmica');
      }
    } else {
      setTabDisabled('metrica', false);
      setTabDisabled('instrumento', false);
      if (state.modoLeitura === 'ritmica' && (exercicio.tipo === 'solfejo' || exercicio.tipo === 'metrica')) {
        setModoLeitura('metrica');
      }
    }

    atualizarQuadroSolfejo();
    updateClefUi();
    var fileToLoad = getScoreFileForCurrentClef(exercicio);
    renderScore(fileToLoad);
  }

  function setTabDisabled(modo, disabled) {
    var btn = document.querySelector('[data-msa-mode="' + modo + '"]');
    if (!btn) return;
    btn.disabled = disabled;
    btn.classList.toggle('opacity-40', disabled);
    btn.classList.toggle('cursor-not-allowed', disabled);
  }

  function setModoLeitura(modo) {
    if (modo !== 'ritmica' && modo !== 'metrica' && modo !== 'instrumento') modo = 'ritmica';
    state.modoLeitura = modo;
    document.querySelectorAll('.msa-mode-btn').forEach(function (btn) {
      var isCur = btn.dataset.msaMode === modo;
      btn.classList.toggle('du-btn-primary', isCur);
      btn.classList.toggle('du-btn-outline', !isCur);
    });

    var modeLabel = document.getElementById('msaCurrentModeLabel');
    if (modeLabel) {
      if (modo === 'ritmica') modeLabel.textContent = 'Rítmica';
      else if (modo === 'metrica') modeLabel.textContent = 'Métrica';
      else {
        var inst = getActiveInstrument();
        modeLabel.textContent = inst.nome || 'Violino';
      }
    }

    var voiceWrap = document.getElementById('msaVoiceGenderWrap');
    if (voiceWrap) {
      voiceWrap.classList.toggle('hidden', modo === 'instrumento');
    }

    var descEl = document.getElementById('msaModoDesc');
    if (descEl) {
      if (modo === 'ritmica') {
        descEl.textContent = 'Leitura Rítmica: sílaba "TA" na duração e ritmo exatos.';
      } else if (modo === 'metrica') {
        descEl.textContent = 'Leitura Métrica: fala o nome das notas (Dó, Ré, Mi...) com voz humana.';
      } else if (modo === 'instrumento') {
        var inst = getActiveInstrument();
        descEl.textContent = 'Modo ' + (inst.nome || 'Instrumento') + ': toca as notas reais no timbre e afinação do instrumento da configuração.';
      }
    }
    updateInstrumentButtonLabel();
  }

  function applyBpm(newBpm) {
    state.bpm = Math.max(40, Math.min(180, newBpm));
    var bpmSlider = document.getElementById('msaBpmSlider');
    var val = document.getElementById('msaBpmValue');
    if (bpmSlider) bpmSlider.value = state.bpm;
    if (val) val.textContent = state.bpm;

    if (state.xmlDoc) {
      state.scoreData = parseMsaScore(state.xmlDoc, state.bpm, state.batidasCompasso);
    }
  }

  function initEvents() {
    var btnPlayStop = document.getElementById('btnMsaPlayStop');
    var btnModeToggle = document.getElementById('btnMsaModeToggle');
    var btnAudioToggle = document.getElementById('btnMsaAudioToggle');
    var btnSettingsToggle = document.getElementById('btnMsaSettingsToggle');
    var btnBpmMinus = document.getElementById('btnMsaBpmMinus');
    var btnBpmPlus = document.getElementById('btnMsaBpmPlus');
    var selectEx = document.getElementById('msaExercicioSelect');
    var chkLeftHand = document.getElementById('chkMsaLeftHand');

    // Pré-carrega o soundfont real do instrumento (violino, etc.) em background
    ensureInstrumentSoundFontLoaded();

    // Botão Principal Iniciar / Parar Grande (Estilo App do Vídeo)
    if (btnPlayStop) {
      btnPlayStop.addEventListener('click', function () {
        if (state.isPlaying) {
          stopPlayback();
        } else {
          startPlayback();
        }
      });
    }

    // Botão de Áudio Geral (Mute / Unmute)
    if (btnAudioToggle) {
      btnAudioToggle.addEventListener('click', function () {
        state.somGeralAtivo = !state.somGeralAtivo;
        var audioIcon = document.getElementById('msaAudioIcon');

        if (state.somGeralAtivo) {
          btnAudioToggle.classList.remove('du-btn-ghost', 'text-error');
          btnAudioToggle.classList.add('du-btn-outline');
          if (audioIcon) {
            audioIcon.setAttribute('data-lucide', 'volume-2');
            audioIcon.className = 'w-4 h-4 text-emerald-600';
          }
        } else {
          btnAudioToggle.classList.remove('du-btn-outline');
          btnAudioToggle.classList.add('du-btn-ghost', 'text-error');
          if (audioIcon) {
            audioIcon.setAttribute('data-lucide', 'volume-x');
            audioIcon.className = 'w-4 h-4 text-error';
          }
          stopActiveVoice(0.01);
          stopActiveInstrumentSound();
        }
        if (window.gemRefreshLucide) window.gemRefreshLucide();
      });
    }

    // Sincronização e Abertura do Modal Pop-up de Opções
    function syncModalControls() {
      var btnRitmica = document.getElementById('btnMsaModeRitmica');
      var btnMetrica = document.getElementById('btnMsaModeMetrica');
      var btnInst = document.getElementById('btnMsaModeInstrumento');
      var voiceSec = document.getElementById('msaVoiceGenderSection');
      var btnFem = document.getElementById('btnMsaVoiceFemModal');
      var btnMasc = document.getElementById('btnMsaVoiceMascModal');
      var chkLeft = document.getElementById('chkMsaLeftHandModal');
      var chkClick = document.getElementById('chkMsaMetroClickModal');

      var inst = getActiveInstrument();
      var instTitleEl = document.getElementById('msaModalInstTitle');
      var instEmojiEl = document.getElementById('msaModalInstEmoji');
      if (instTitleEl) instTitleEl.textContent = (inst.nome || 'Violino') + ' (Som Real do Player)';
      if (instEmojiEl) instEmojiEl.textContent = inst.emoji || '🎻';

      function updateCardState(btn, isSel) {
        if (!btn) return;
        btn.classList.toggle('active', isSel);
        btn.classList.toggle('du-btn-primary', isSel);
        btn.classList.toggle('border-primary', isSel);
        btn.classList.toggle('du-btn-outline', !isSel);
        btn.classList.toggle('border-base-300', !isSel);
        var title = btn.querySelector('.msa-card-title');
        var desc = btn.querySelector('.msa-card-desc');
        if (title) title.classList.toggle('text-white', isSel);
        if (desc) {
          desc.classList.toggle('text-white/90', isSel);
          desc.classList.toggle('opacity-85', isSel);
          desc.classList.toggle('opacity-75', !isSel);
        }
      }

      updateCardState(btnRitmica, state.modoLeitura === 'ritmica');
      updateCardState(btnMetrica, state.modoLeitura === 'metrica');
      updateCardState(btnInst, state.modoLeitura === 'instrumento');

      if (voiceSec) {
        voiceSec.classList.toggle('hidden', state.modoLeitura === 'instrumento');
      }
      if (btnFem) {
        var isF = state.generoVoz === 'fem';
        btnFem.classList.toggle('active', isF);
        btnFem.classList.toggle('du-btn-primary', isF);
        btnFem.classList.toggle('du-btn-ghost', !isF);
      }
      if (btnMasc) {
        var isMasc = state.generoVoz === 'masc';
        btnMasc.classList.toggle('active', isMasc);
        btnMasc.classList.toggle('du-btn-primary', isMasc);
        btnMasc.classList.toggle('du-btn-ghost', !isMasc);
      }
      if (chkLeft) chkLeft.checked = !!state.maoEsquerda;
      if (chkClick) chkClick.checked = !!state.somMetronomoAtivo;
      updateClefUi();
    }

    function openMsaSettingsModal() {
      var modal = document.getElementById('msaSettingsModal');
      if (!modal) return;
      syncModalControls();
      modal.classList.remove('hidden');
      if (window.gemRefreshLucide) window.gemRefreshLucide();
    }

    function closeMsaSettingsModal() {
      var modal = document.getElementById('msaSettingsModal');
      if (modal) modal.classList.add('hidden');
    }

    // Alternador de Modo de Leitura e Botão de Ajustes abrem o modal pop-up de opções
    if (btnModeToggle) {
      btnModeToggle.addEventListener('click', openMsaSettingsModal);
    }
    if (btnSettingsToggle) {
      btnSettingsToggle.addEventListener('click', openMsaSettingsModal);
    }

    // Botões internos do Modal Pop-up
    var btnModeR = document.getElementById('btnMsaModeRitmica');
    if (btnModeR) {
      btnModeR.addEventListener('click', function () {
        setModoLeitura('ritmica');
        syncModalControls();
      });
    }
    var btnModeM = document.getElementById('btnMsaModeMetrica');
    if (btnModeM) {
      btnModeM.addEventListener('click', function () {
        setModoLeitura('metrica');
        syncModalControls();
      });
    }
    var btnModeI = document.getElementById('btnMsaModeInstrumento');
    if (btnModeI) {
      btnModeI.addEventListener('click', function () {
        setModoLeitura('instrumento');
        ensureInstrumentSoundFontLoaded();
        syncModalControls();
      });
    }

    var btnVFem = document.getElementById('btnMsaVoiceFemModal');
    if (btnVFem) {
      btnVFem.addEventListener('click', function () {
        state.generoVoz = 'fem';
        loadVoiceSamples('fem', true);
        syncModalControls();
      });
    }
    var btnVMasc = document.getElementById('btnMsaVoiceMascModal');
    if (btnVMasc) {
      btnVMasc.addEventListener('click', function () {
        state.generoVoz = 'masc';
        loadVoiceSamples('masc', true);
        syncModalControls();
      });
    }

    var chkLeftModal = document.getElementById('chkMsaLeftHandModal');
    if (chkLeftModal) {
      chkLeftModal.addEventListener('change', function () {
        state.maoEsquerda = !!this.checked;
        atualizarQuadroSolfejo();
      });
    }

    var chkClickModal = document.getElementById('chkMsaMetroClickModal');
    if (chkClickModal) {
      chkClickModal.addEventListener('change', function () {
        state.somMetronomoAtivo = !!this.checked;
      });
    }

    var btnCloseModal = document.getElementById('btnMsaSettingsClose');
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeMsaSettingsModal);
    }
    var btnOkModal = document.getElementById('btnMsaSettingsOk');
    if (btnOkModal) {
      btnOkModal.addEventListener('click', closeMsaSettingsModal);
    }
    var settingsModal = document.getElementById('msaSettingsModal');
    if (settingsModal) {
      settingsModal.addEventListener('click', function (e) {
        if (e.target === settingsModal) closeMsaSettingsModal();
      });
    }

    // Botão rápido de alternância de clave na barra de ferramentas (Sol -> Dó -> Fá)
    var btnClefToggle = document.getElementById('btnMsaClefToggle');
    if (btnClefToggle) {
      btnClefToggle.addEventListener('click', function () {
        if (!state.exercicioAtual || !state.exercicioAtual.temNotasComAltura) return;
        var order = ['sol', 'do', 'fa'];
        var currentIdx = order.indexOf(state.claveSelecionada || 'sol');
        if (currentIdx === -1) currentIdx = 0;
        var nextIdx = (currentIdx + 1) % order.length;
        setClave(order[nextIdx]);
        syncModalControls();
      });
    }

    // Botões dedicados no Modal de Opções de Estudo
    var btnClefSol = document.getElementById('btnMsaClefSol');
    if (btnClefSol) {
      btnClefSol.addEventListener('click', function () {
        setClave('sol');
        syncModalControls();
      });
    }
    var btnClefDo = document.getElementById('btnMsaClefDo');
    if (btnClefDo) {
      btnClefDo.addEventListener('click', function () {
        setClave('do');
        syncModalControls();
      });
    }
    var btnClefFa = document.getElementById('btnMsaClefFa');
    if (btnClefFa) {
      btnClefFa.addEventListener('click', function () {
        setClave('fa');
        syncModalControls();
      });
    }

    // Controles de BPM (avanço de velocidade de 1 em 1)
    if (btnBpmMinus) {
      btnBpmMinus.addEventListener('click', function () {
        applyBpm(state.bpm - 1);
      });
    }
    if (btnBpmPlus) {
      btnBpmPlus.addEventListener('click', function () {
        applyBpm(state.bpm + 1);
      });
    }

    if (selectEx) {
      selectEx.addEventListener('change', function () {
        var id = this.value;
        var ex = state.catalogo.find(function (item) { return item.id === id; });
        if (ex) carregarExercicio(ex);
      });
    }

    if (chkLeftHand) {
      chkLeftHand.addEventListener('change', function () {
        state.maoEsquerda = !!this.checked;
        atualizarQuadroSolfejo();
      });
    }

    var btnFasePrev = document.getElementById('btnMsaFasePrev');
    var btnFaseNext = document.getElementById('btnMsaFaseNext');
    var tabsContainer = document.getElementById('msaFaseTabs');
    if (btnFasePrev && tabsContainer) {
      btnFasePrev.addEventListener('click', function () {
        tabsContainer.scrollBy({ left: -220, behavior: 'smooth' });
      });
    }
    if (btnFaseNext && tabsContainer) {
      btnFaseNext.addEventListener('click', function () {
        tabsContainer.scrollBy({ left: 220, behavior: 'smooth' });
      });
    }

    document.querySelectorAll('.msa-mode-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!this.disabled) {
          setModoLeitura(this.dataset.msaMode);
        }
      });
    });

    var btnVoiceFem = document.getElementById('btnMsaVoiceFem');
    var btnVoiceMasc = document.getElementById('btnMsaVoiceMasc');
    if (btnVoiceFem) {
      btnVoiceFem.addEventListener('click', function () {
        setVoiceGender('fem');
      });
    }
    // Controles de Zoom da Partitura (Botões + / - e Reset)
    var btnZoomIn = document.getElementById('btnMsaScoreZoomIn');
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', function () {
        setScoreZoom((state.osmdZoom || 1.05) + 0.15);
      });
    }
    var btnZoomOut = document.getElementById('btnMsaScoreZoomOut');
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', function () {
        setScoreZoom((state.osmdZoom || 1.05) - 0.15);
      });
    }
    var btnZoomReset = document.getElementById('btnMsaScoreZoomReset');
    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', function () {
        setScoreZoom(getDefaultScoreZoom());
      });
    }

    // Gesto de Pinça com 2 dedos (Pinch-to-Zoom) na Partitura
    var scoreContainer = document.getElementById('msaOsmdContainer');
    if (scoreContainer) {
      var pinchStartDistance = null;
      var pinchStartZoom = null;

      scoreContainer.addEventListener('touchstart', function (e) {
        if (e.touches && e.touches.length === 2) {
          e.preventDefault(); // Impede o navegador de dar zoom in na tela inteira
          pinchStartDistance = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY
          );
          pinchStartZoom = state.osmdZoom || 1.05;
        }
      }, { passive: false });

      scoreContainer.addEventListener('touchmove', function (e) {
        if (e.touches && e.touches.length === 2 && pinchStartDistance && pinchStartDistance > 10) {
          e.preventDefault(); // Impede o navegador de dar zoom in na tela inteira
          var curDistance = Math.hypot(
            e.touches[1].clientX - e.touches[0].clientX,
            e.touches[1].clientY - e.touches[0].clientY
          );
          var factor = curDistance / pinchStartDistance;
          // Permite reduzir até 0.50 (50% do tamanho)
          var nextZoom = Math.round(pinchStartZoom * factor * 20) / 20;
          if (Math.abs(nextZoom - state.osmdZoom) >= 0.05) {
            setScoreZoom(nextZoom);
          }
        }
      }, { passive: false });

      scoreContainer.addEventListener('touchend', function (e) {
        if (!e.touches || e.touches.length < 2) {
          pinchStartDistance = null;
          pinchStartZoom = null;
        }
      });
    }

    window.addEventListener('resize', function () {
      if (!state.isPlaying) {
        posicionarNaPreparacao();
      }
    });
  }

  function onShowSection() {
    updateInstrumentButtonLabel();
    if (state.osmd && state.exercicioAtual) {
      setTimeout(function () {
        try {
          state.osmd.render();
          if (state.osmd.cursor) {
            state.osmd.cursor.show();
            state.osmd.cursor.reset();
          }
        } catch (e) {}
        posicionarNaPreparacao();
      }, 80);
    }
  }

  function init() {
    initEvents();
    loadCatalog();
    setVoiceGender(state.generoVoz);
    updateInstrumentButtonLabel();
    updateClefUi();
    updateScoreZoomLabel();
    if (window.gemRefreshLucide) window.gemRefreshLucide();
  }

  window.MsaLeituraModule = {
    init: init,
    carregarExercicio: carregarExercicio,
    stopPlayback: stopPlayback,
    setClave: setClave,
    onShowSection: onShowSection,
    onInstrumentChange: function (newInst) {
      updateInstrumentButtonLabel();
      var modeLabel = document.getElementById('msaCurrentModeLabel');
      if (modeLabel && state.modoLeitura === 'instrumento' && newInst) {
        modeLabel.textContent = newInst.nome || 'Instrumento';
      }
      ensureInstrumentSoundFontLoaded();

      // Sincronização automática intuitiva de clave conforme o instrumento
      if (newInst && newInst.id) {
        var autoClef = null;
        var iId = (newInst.id || '').toLowerCase();
        if (iId.indexOf('viola') !== -1) {
          autoClef = 'do';
        } else if (iId.indexOf('cello') !== -1 || iId.indexOf('violoncelo') !== -1 || iId.indexOf('tuba') !== -1 || iId.indexOf('trombone') !== -1 || iId.indexOf('eufonio') !== -1 || iId.indexOf('euphonium') !== -1 || iId.indexOf('baixo') !== -1 || iId.indexOf('fagote') !== -1) {
          autoClef = 'fa';
        } else if (iId.indexOf('violino') !== -1 || iId.indexOf('flauta') !== -1 || iId.indexOf('trompete') !== -1 || iId.indexOf('clarinete') !== -1 || iId.indexOf('sax') !== -1 || iId.indexOf('oboe') !== -1) {
          autoClef = 'sol';
        }
        if (autoClef && autoClef !== state.claveSelecionada) {
          setClave(autoClef);
        }
      }
    },
    getExactCurveData: getExactCurveData,
    getAnchorCircleCenter: getAnchorCircleCenter,
    interpolateAlongPolyline: interpolateAlongPolyline,
    getPrepPoint: getPrepPoint
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
