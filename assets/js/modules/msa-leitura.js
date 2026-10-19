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
    modoLeitura: 'ritmica', // 'ritmica', 'metrica', 'solfejo'
    maoEsquerda: false,
    somLeituraAtivo: true,
    somMetronomoAtivo: true,
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

      // 1. Vocal TA (Leitura Rítmica) - voz natural humana pura
      loadAudioVariation('./assets/audio/' + g + '/msa-ta-vocal.wav?v=2.6.0', function (dec) {
        voiceBanks[g].vocalTaBuffer = dec;
        console.log('MSA Áudio: TA [' + g + '] carregado (' + dec.duration.toFixed(2) + 's)');
      });

      // 2. 7 notas da Leitura Métrica - voz natural humana falada limpa e suave
      Object.keys(METRICA_BASE_NAMES).forEach(function (name) {
        var base = METRICA_BASE_NAMES[name];
        loadAudioVariation('./assets/audio/' + g + '/msa-nota-' + base + '.wav?v=2.6.0', function (dec) {
          voiceBanks[g].noteVoiceBuffers[name] = dec;
          voiceBanks[g].noteVoiceBuffers[name.toLowerCase()] = dec;
          voiceBanks[g].noteVoiceBuffers[normalizeNoteKey(name)] = dec;
        });
      });
    });
  }

  function getAudioContext() {
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

    // 4. Resolução precisa de ligaduras (Ties / Slurs entre notas da mesma altura)
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

      // 1. OBRIGATÓRIO NA ESPECIFICAÇÃO W3C: start() SEMPRE deve ser chamado antes de stop()
      src.start(t);

      // 2. Agendamento do stop() APÓS start()
      if (dur < buf.duration) {
        var playDur = Math.max(0.06, dur);
        var fadeStart = Math.max(t + 0.03, t + playDur - 0.018);
        g.gain.setValueAtTime(1.0, fadeStart);
        g.gain.linearRampToValueAtTime(0.0001, t + playDur);
        src.stop(t + playDur + 0.005);
      } else {
        // Fala natural até o final do sample
        src.stop(t + buf.duration + 0.010);
      }

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

  function triggerNoteVoice(ev, scheduleTime) {
    if (!state.somLeituraAtivo) return;

    var g = state.generoVoz || 'fem';
    var bank = voiceBanks[g] || voiceBanks.fem;
    var dur = ev.durationSec;

    // Se o exercício for rítmico percussivo ou o modo for 'ritmica': sempre falar "TA"
    if (state.modoLeitura === 'ritmica' || ev.pitchKey === 'unpitched' || !ev.name) {
      var taBuf = bank.vocalTaBuffer || voiceBanks.fem.vocalTaBuffer;
      playVoiceAudioBuffer(taBuf, dur, scheduleTime);
    } else {
      // Leitura Métrica: fala o nome correto de cada nota (Dó, Ré, Mi, Fá, Sol, Lá, Si)
      var norm = normalizeNoteKey(ev.name);
      var mBuf = bank.noteVoiceBuffers[norm] ||
                 bank.noteVoiceBuffers[norm.toLowerCase()] ||
                 voiceBanks.fem.noteVoiceBuffers[norm] ||
                 voiceBanks.masc.noteVoiceBuffers[norm] ||
                 bank.noteVoiceBuffers['Dó'];
      playVoiceAudioBuffer(mBuf, dur, scheduleTime);
    }
  }

  function playClick(isAccent, scheduleTime) {
    var ctx = getAudioContext();
    if (!ctx || !state.somMetronomoAtivo) return;
    var now = ctx.currentTime;
    var t = (typeof scheduleTime === 'number') ? Math.max(now, scheduleTime) : now;
    try {
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      var f = ctx.createBiquadFilter();

      osc.type = 'sine';
      var startFreq = isAccent ? 1200 : 800;
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.012);

      f.type = 'bandpass';
      f.frequency.setValueAtTime(isAccent ? 1000 : 700, t);
      f.Q.setValueAtTime(1.2, t);

      var vol = isAccent ? 0.16 : 0.08;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.018);

      osc.connect(f);
      f.connect(g);
      g.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.022);
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

  function atualizarQuadroSolfejo() {
    var baseImg = document.getElementById('msaSolfejoBaseImg');
    var handImg = document.getElementById('msaSolfejoHandImg');
    if (!baseImg || !handImg) return;

    var beats = state.batidasCompasso || 4;
    var side = state.maoEsquerda ? 'esquerda' : 'direita';

    baseImg.src = './imgs/movimento-' + beats + '-' + side + '.png';
    handImg.src = './imgs/mao-' + side + '.png';

    function onReady() {
      var naturalW = baseImg.naturalWidth || 1;
      var naturalH = baseImg.naturalHeight || 1;
      var key = beats + '-' + side;
      var rawPoints = SOLFEJO_MANUAL_POINTS[key] || [];

      state.framesHandNatural = rawPoints.map(function (p) {
        return { x: p.x * naturalW, y: p.y * naturalH };
      });

      ensureHandTipCalibrated().then(function () {
        cancelSolfejoTween();
        var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
          ? state.scoreData.initialBeatIndex
          : 0;
        posicionarNoPontoAnchor(initialBeat);
        highlightBeatDot(initialBeat);
      });
    }

    baseImg.onload = onReady;
    handImg.onload = onReady;
    if (baseImg.complete && handImg.complete) {
      onReady();
    }
  }

  function posicionarNoPontoAnchor(beatIndex) {
    if (!state.framesHandNatural || !state.framesHandNatural.length) return;
    var beats = state.batidasCompasso || 4;
    var idx = getAnchorIndex(beatIndex, beats, state.framesHandNatural.length);
    var pt = state.framesHandNatural[idx];
    if (pt) setSolfejoHandToPosNatural(pt);
  }

  function getAnchorIndex(beatIdx, beats, totalFrames) {
    if (totalFrames <= beats) return beatIdx % totalFrames;
    var ptsPerBeat = totalFrames / beats;
    if (Number.isInteger(ptsPerBeat)) {
      return (beatIdx * ptsPerBeat) % totalFrames;
    }
    var idx = Math.round((beatIdx * totalFrames) / beats);
    return Math.min(idx, totalFrames - 1);
  }

  function cancelSolfejoTween() {
    if (state.handTweenRaf) {
      cancelAnimationFrame(state.handTweenRaf);
      state.handTweenRaf = null;
    }
  }

  function triggerHandTap() {
    var handImg = document.getElementById('msaSolfejoHandImg');
    if (!handImg) return;
    var sideClass = state.maoEsquerda ? 'tapping-left' : 'tapping-right';
    handImg.classList.remove('tapping-right', 'tapping-left');
    void handImg.offsetWidth;
    handImg.classList.add(sideClass);
  }

  // Interpola a mão seguindo perfeitamente a linha curva entre as duas batidas
  function startSolfejoHandTween(fromBeat, toBeat, durationMs) {
    var frames = state.framesHandNatural;
    if (!frames || !frames.length) return;
    var beats = state.batidasCompasso || 4;

    cancelSolfejoTween();

    var fromAnchor = getAnchorIndex(fromBeat, beats, frames.length);
    var toAnchor = getAnchorIndex(toBeat, beats, frames.length);

    var fromPos = frames[fromAnchor];
    var toPos = frames[toAnchor];
    if (!fromPos || !toPos) return;

    setSolfejoHandToPosNatural(fromPos);

    // Constrói a polyline com todos os pontos intermediários da curva
    var pathPoints = [];
    var pi = fromAnchor;
    var guard = 0;
    while (guard < (frames.length + 2)) {
      pathPoints.push(frames[pi]);
      if (pi === toAnchor) break;
      pi = (pi + 1) % frames.length;
      guard++;
    }
    if (pathPoints.length < 2) pathPoints = [fromPos, toPos];

    var cumulative = [0];
    for (var si = 1; si < pathPoints.length; si++) {
      var pdx = pathPoints[si].x - pathPoints[si - 1].x;
      var pdy = pathPoints[si].y - pathPoints[si - 1].y;
      cumulative.push(cumulative[si - 1] + Math.sqrt(pdx * pdx + pdy * pdy));
    }
    var totalLen = cumulative[cumulative.length - 1] || 1;

    var startPerf = performance.now();
    var duration = durationMs || ((60 / state.bpm) * 1000);

    // Curva de condução musical do MSA: saída ágil e elástica no ictos da batida e aterrissagem suave
    function easeMsa(t) {
      return 0.5 * (1 - Math.cos(Math.PI * Math.pow(t, 0.85)));
    }

    function tweenLoop(nowPerf) {
      if (!state.isPlaying) return;
      // Compensação precisa de 35ms entre processamento auditivo e renderização visual
      var elapsed = (nowPerf - startPerf) + 35;
      var t = elapsed / duration;
      if (t >= 1) {
        state.handTweenRaf = null;
        setSolfejoHandToPosNatural(toPos);
        return;
      }

      var e = easeMsa(Math.max(0, Math.min(1, t)));
      var targetLen = totalLen * e;
      var seg = 0;
      while (seg < cumulative.length - 1 && cumulative[seg + 1] < targetLen) {
        seg++;
      }
      var segStartLen = cumulative[seg];
      var segEndLen = cumulative[seg + 1] || segStartLen;
      var segSpan = segEndLen - segStartLen;
      var segT = segSpan > 0.0001 ? (targetLen - segStartLen) / segSpan : 0;
      var pA = pathPoints[seg];
      var pB = pathPoints[Math.min(seg + 1, pathPoints.length - 1)];
      var interX = pA.x + (pB.x - pA.x) * segT;
      var interY = pA.y + (pB.y - pA.y) * segT;

      setSolfejoHandToPosNatural({ x: interX, y: interY });
      state.handTweenRaf = requestAnimationFrame(tweenLoop);
    }

    state.handTweenRaf = requestAnimationFrame(tweenLoop);
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

      var targetUrl = (musicXmlUrl.startsWith('./') || musicXmlUrl.startsWith('/')) ? musicXmlUrl : './' + musicXmlUrl;
      fetch(targetUrl)
        .then(function (res) { return res.text(); })
        .then(function (xmlText) {
          state.rawXmlText = xmlText;
          var parser = new DOMParser();
          state.xmlDoc = parser.parseFromString(xmlText, 'application/xml');

          // Parse instantâneo e garantido da partitura
          state.scoreData = parseMsaScore(state.xmlDoc, state.bpm, state.batidasCompasso);
          var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
            ? state.scoreData.initialBeatIndex
            : 0;
          highlightBeatDot(initialBeat);
          posicionarNoPontoAnchor(initialBeat);

          state.osmd.load(xmlText).then(function () {
            var notice = document.getElementById('msaScoreLoadingNotice');
            if (notice) notice.remove();
            state.osmd.render();
            if (state.osmd.cursor) {
              state.osmd.cursor.show();
              state.osmd.cursor.reset();
            }
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
    loadVoiceSamples(state.generoVoz, true);

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
    posicionarNoPontoAnchor(initialBeat);

    var beatDurationMs = (60 / state.bpm) * 1000;

    // ÂNCORA DE TEMPO MESTRE DO WEB AUDIO (Margem de 60ms para agendamento seguro sem perda)
    var audioAnchor = ctx.currentTime + 0.060;

    var nextAudioNoteIdx = 0;
    var nextAudioBeatIdx = 0;

    var nextVisualCursorIdx = 1; // O cursor OSMD já inicia posicionado no elemento inicial (índice 0)
    var nextVisualBeatIdx = 0;

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

        if (ev.isRest) {
          // Na pausa: corte no tempo agendado
          stopActiveVoice(0.012, noteExactTime);
        } else if (!ev.isTiedContinuation) {
          // Nota musical com ataque próprio: som puro agendado no nanossegundo exato
          triggerNoteVoice(ev, noteExactTime);
        }
        nextAudioNoteIdx++;
      }

      // Cliques do Metrônomo
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
      // 2. ATUALIZAÇÃO VISUAL SINCRONIZADA (Cursor OSMD + Mão Solfejo)
      // -------------------------------------------------------------
      // Avanço do cursor verde do OSMD
      while (state.scoreData && state.scoreData.cursorStarts &&
             nextVisualCursorIdx < state.scoreData.cursorStarts.length &&
             state.scoreData.cursorStarts[nextVisualCursorIdx] <= elapsedSec + 0.010) {
        if (state.osmd && state.osmd.cursor) {
          try {
            state.osmd.cursor.next();
          } catch (e) {}
        }
        nextVisualCursorIdx++;
      }

      // Condução da mão e destaque das bolinhas do compasso
      while (state.scoreData && state.scoreData.beatEvents &&
             nextVisualBeatIdx < state.scoreData.beatEvents.length &&
             state.scoreData.beatEvents[nextVisualBeatIdx].sec <= elapsedSec + 0.010) {
        var vBeatEv = state.scoreData.beatEvents[nextVisualBeatIdx];
        triggerHandTap();

        var thisBeat = vBeatEv.beatIndex;
        var nextBeat = (thisBeat + 1) % state.batidasCompasso;
        highlightBeatDot(thisBeat);
        startSolfejoHandTween(thisBeat, nextBeat, beatDurationMs);

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
    if (state.osmd && state.osmd.cursor) {
      try {
        state.osmd.cursor.reset();
      } catch (e) {}
    }
    var initialBeat = (state.scoreData && typeof state.scoreData.initialBeatIndex === 'number')
      ? state.scoreData.initialBeatIndex
      : 0;
    highlightBeatDot(initialBeat);
    posicionarNoPontoAnchor(initialBeat);
    updatePlayButtons();
  }

  function updatePlayButtons() {
    var btnPlay = document.getElementById('btnMsaPlay');
    var btnPause = document.getElementById('btnMsaPause');
    if (!btnPlay || !btnPause) return;
    btnPlay.classList.toggle('hidden', state.isPlaying);
    btnPause.classList.toggle('hidden', !state.isPlaying);
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
    stopPlayback();
    state.exercicioAtual = exercicio;
    state.bpm = exercicio.bpm || 70;
    state.batidasCompasso = exercicio.batidas || 4;

    var bpmSlider = document.getElementById('msaBpmSlider');
    var bpmVal = document.getElementById('msaBpmValue');
    var titleEl = document.getElementById('msaExercicioTitle');
    var metaEl = document.getElementById('msaExercicioMeta');
    var badgeCompasso = document.getElementById('msaConducaoCompassoBadge');

    if (bpmSlider) bpmSlider.value = state.bpm;
    if (bpmVal) bpmVal.textContent = state.bpm;
    if (titleEl) titleEl.textContent = exercicio.titulo || exercicio.exercicio;
    if (badgeCompasso) badgeCompasso.textContent = state.batidasCompasso + ' Batidas';

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
      setModoLeitura('ritmica');
      setTabDisabled('metrica', true);
    } else {
      setTabDisabled('metrica', false);
      if (state.modoLeitura === 'ritmica' && (exercicio.tipo === 'solfejo' || exercicio.tipo === 'metrica')) {
        setModoLeitura('metrica');
      }
    }

    atualizarQuadroSolfejo();
    renderScore(exercicio.arquivo);
  }

  function setTabDisabled(modo, disabled) {
    var btn = document.querySelector('[data-msa-mode="' + modo + '"]');
    if (!btn) return;
    btn.disabled = disabled;
    btn.classList.toggle('opacity-40', disabled);
    btn.classList.toggle('cursor-not-allowed', disabled);
  }

  function setModoLeitura(modo) {
    if (modo !== 'ritmica' && modo !== 'metrica') modo = 'ritmica';
    state.modoLeitura = modo;
    document.querySelectorAll('.msa-mode-btn').forEach(function (btn) {
      var isCur = btn.dataset.msaMode === modo;
      btn.classList.toggle('du-btn-primary', isCur);
      btn.classList.toggle('du-btn-outline', !isCur);
    });

    var descEl = document.getElementById('msaModoDesc');
    if (descEl) {
      if (modo === 'ritmica') descEl.textContent = 'Leitura Rítmica: sílaba "TA" na duração e ritmo exatos.';
      else descEl.textContent = 'Leitura Métrica: fala o nome das notas (Dó, Ré, Mi...) com voz limpa e natural.';
    }
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
    var btnPlay = document.getElementById('btnMsaPlay');
    var btnPause = document.getElementById('btnMsaPause');
    var btnRestart = document.getElementById('btnMsaRestart');
    var bpmSlider = document.getElementById('msaBpmSlider');
    var btnBpmMinus = document.getElementById('btnMsaBpmMinus');
    var btnBpmPlus = document.getElementById('btnMsaBpmPlus');
    var selectEx = document.getElementById('msaExercicioSelect');
    var chkSomLeitura = document.getElementById('chkMsaSomLeitura');
    var chkSomMetronomo = document.getElementById('chkMsaSomMetronomo');
    var chkLeftHand = document.getElementById('chkMsaLeftHand');

    if (btnPlay) btnPlay.addEventListener('click', startPlayback);
    if (btnPause) btnPause.addEventListener('click', pausePlayback);
    if (btnRestart) btnRestart.addEventListener('click', stopPlayback);

    if (bpmSlider) {
      bpmSlider.addEventListener('input', function () {
        applyBpm(parseInt(this.value, 10) || 70);
      });
    }

    if (btnBpmMinus) {
      btnBpmMinus.addEventListener('click', function () {
        applyBpm(state.bpm - 5);
      });
    }

    if (btnBpmPlus) {
      btnBpmPlus.addEventListener('click', function () {
        applyBpm(state.bpm + 5);
      });
    }

    if (selectEx) {
      selectEx.addEventListener('change', function () {
        var id = this.value;
        var ex = state.catalogo.find(function (item) { return item.id === id; });
        if (ex) carregarExercicio(ex);
      });
    }

    if (chkSomLeitura) {
      state.somLeituraAtivo = !!chkSomLeitura.checked;
      chkSomLeitura.addEventListener('change', function () {
        state.somLeituraAtivo = !!this.checked;
      });
    }

    if (chkSomMetronomo) {
      state.somMetronomoAtivo = !!chkSomMetronomo.checked;
      chkSomMetronomo.addEventListener('change', function () {
        state.somMetronomoAtivo = !!this.checked;
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
    if (btnVoiceMasc) {
      btnVoiceMasc.addEventListener('click', function () {
        setVoiceGender('masc');
      });
    }

    window.addEventListener('resize', function () {
      if (!state.isPlaying) {
        posicionarNoPontoAnchor(0);
      }
    });
  }

  function onShowSection() {
    if (state.osmd && state.exercicioAtual) {
      setTimeout(function () {
        try {
          state.osmd.render();
          if (state.osmd.cursor) {
            state.osmd.cursor.show();
            state.osmd.cursor.reset();
          }
        } catch (e) {}
        posicionarNoPontoAnchor(0);
      }, 80);
    }
  }

  function init() {
    initEvents();
    loadCatalog();
    setVoiceGender(state.generoVoz);
    if (window.gemRefreshLucide) window.gemRefreshLucide();
  }

  window.MsaLeituraModule = {
    init: init,
    carregarExercicio: carregarExercicio,
    stopPlayback: stopPlayback,
    onShowSection: onShowSection
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
