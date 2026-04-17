    (function () {
      'use strict';

      const APP_VERSION = '1.2.0';
      const APP_VERSION_LABEL = 'Beta';
      /** MusicXML servido junto ao index (GitHub Pages ou servidor local). */
      const PLAYER_SCORE_URL = './xml/colecoes/hinario5-ccb/do/violino/441_s.musicxml';
      const PLAYER_CATALOG_URL = './xml/catalog.json';

      // ========== CONFIGURAÇÃO DAS NOTAS (Dó a Si) ==========
      const NOTAS = [
        { id: 'do', nome: 'Dó', solfa: 'Dó', cor: 'do', freq: 261.63 },
        { id: 're', nome: 'Ré', solfa: 'Ré', cor: 're', freq: 293.66 },
        { id: 'mi', nome: 'Mi', solfa: 'Mi', cor: 'mi', freq: 329.63 },
        { id: 'fa', nome: 'Fá', solfa: 'Fá', cor: 'fa', freq: 349.23 },
        { id: 'sol', nome: 'Sol', solfa: 'Sol', cor: 'sol', freq: 392.00 },
        { id: 'la', nome: 'Lá', solfa: 'Lá', cor: 'la', freq: 440.00 },
        { id: 'si', nome: 'Si', solfa: 'Si', cor: 'si', freq: 493.88 }
      ];

      // ========== INSTRUMENTOS DA ORQUESTRA CCB ==========
      const INSTRUMENTOS = [
        // CORDAS
        {
          id: 'violino',
          nome: 'Violino',
          emoji: '🎻',
          tipo: 'corda',
          soundfont: 'violin',
          descricao: '4 cordas: Sol, Ré, Lá, Mi — primeira posição',
          cordas: ['sol', 're', 'la', 'mi'],
          cordaClasses: { sol: 'string-sol', re: 'string-re', la: 'string-la', mi: 'string-mi' },
          fingerboard: [
            ['sol', 're', 'la', 'mi'],   // pos 0 — cordas soltas
            ['la', 'mi', 'si', 'fa'],    // pos 1
            ['si', 'fa', 'do', 'sol'],   // pos 2
            ['do', 'sol', 're', 'la'],   // pos 3
            ['re', 'la', 'mi', 'si']     // pos 4
          ],
          freqBoard: [
            [196.00, 293.66, 440.00, 659.25],   // pos 0: G3, D4, A4, E5
            [220.00, 329.63, 493.88, 698.46],   // pos 1: A3, E4, B4, F5
            [246.94, 349.23, 523.25, 783.99],   // pos 2: B3, F4, C5, G5
            [261.63, 392.00, 587.33, 880.00],   // pos 3: C4, G4, D5, A5
            [293.66, 440.00, 659.25, 987.77]    // pos 4: D4, A4, E5, B5
          ]
        },
        {
          id: 'viola',
          nome: 'Viola',
          emoji: '🎻',
          tipo: 'corda',
          soundfont: 'viola',
          descricao: '4 cordas: Dó, Sol, Ré, Lá — primeira posição',
          cordas: ['do', 'sol', 're', 'la'],
          cordaClasses: { do: 'string-do', sol: 'string-sol', re: 'string-re', la: 'string-la' },
          fingerboard: [
            ['do', 'sol', 're', 'la'],   // pos 0 — cordas soltas
            ['re', 'la', 'mi', 'si'],     // pos 1
            ['mi', 'si', 'fa', 'do'],     // pos 2
            ['fa', 'do', 'sol', 're'],    // pos 3
            ['sol', 're', 'la', 'mi']     // pos 4
          ],
          freqBoard: [
            [130.81, 196.00, 293.66, 440.00],   // pos 0: C3, G3, D4, A4
            [146.83, 220.00, 329.63, 493.88],   // pos 1: D3, A3, E4, B4
            [164.81, 246.94, 349.23, 523.25],   // pos 2: E3, B3, F4, C5
            [174.61, 261.63, 392.00, 587.33],   // pos 3: F3, C4, G4, D5
            [196.00, 293.66, 440.00, 659.25]    // pos 4: G3, D4, A4, E5
          ]
        },
        {
          id: 'violoncelo',
          nome: 'Violoncelo',
          emoji: '🎻',
          tipo: 'corda',
          soundfont: 'cello',
          descricao: '4 cordas: Dó, Sol, Ré, Lá — primeira posição',
          cordas: ['do', 'sol', 're', 'la'],
          cordaClasses: { do: 'string-do', sol: 'string-sol', re: 'string-re', la: 'string-la' },
          fingerboard: [
            ['do', 'sol', 're', 'la'],   // pos 0 — cordas soltas
            ['re', 'la', 'mi', 'si'],     // pos 1
            ['mi', 'si', 'fa', 'do'],     // pos 2
            ['fa', 'do', 'sol', 're'],    // pos 3
            ['sol', 're', 'la', 'mi']     // pos 4
          ],
          freqBoard: [
            [65.41, 98.00, 146.83, 220.00],   // pos 0: C2, G2, D3, A3
            [73.42, 110.00, 164.81, 246.94],   // pos 1: D2, A2, E3, B3
            [82.41, 123.47, 174.61, 261.63],   // pos 2: E2, B2, F3, C4
            [87.31, 130.81, 196.00, 293.66],   // pos 3: F2, C3, G3, D4
            [98.00, 146.83, 220.00, 329.63]    // pos 4: G2, D3, A3, E4
          ]
        },
        // SOPROS - MADEIRAS
        {
          id: 'flauta',
          nome: 'Flauta',
          emoji: '🎵',
          tipo: 'sopro',
          soundfont: 'flute',
          descricao: 'Dedilhado de flauta doce/barroca — Dó a Si',
          dedilhado: 'teclas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'E: 123 + p | D: 123',
            re: 'E: 123 + p | D: 12',
            mi: 'E: 123 + p | D: 1',
            fa: 'E: 123 + p | D: -',
            sol: 'E: 123 | D: -',
            la: 'E: 12 | D: -',
            si: 'E: 1 | D: -'
          },
          freqBoard: [
            [261.63], [293.66], [329.63], [349.23], [392.00], [440.00], [493.88]
          ]
        },
        {
          id: 'clarinete',
          nome: 'Clarinete',
          emoji: '🎵',
          tipo: 'sopro',
          soundfont: 'clarinet',
          descricao: 'Dedilhado de clarinete (registro base) — Dó a Si',
          dedilhado: 'teclas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'polegar + E123 D123',
            re: 'polegar + E123 D12',
            mi: 'polegar + E123 D1',
            fa: 'polegar + E123',
            sol: 'polegar + E12',
            la: 'polegar + E1',
            si: 'polegar + chave A'
          },
          freqBoard: [
            [261.63], [293.66], [329.63], [349.23], [392.00], [440.00], [493.88]
          ]
        },
        {
          id: 'oboe',
          nome: 'Oboé',
          emoji: '🎵',
          tipo: 'sopro',
          soundfont: 'oboe',
          descricao: 'Dedilhado de oboe (simplificado) — Dó a Si',
          dedilhado: 'teclas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'E123 | D123 + C grave',
            re: 'E123 | D123',
            mi: 'E123 | D12',
            fa: 'E123 | D1',
            sol: 'E123',
            la: 'E12',
            si: 'E1'
          },
          freqBoard: [
            [261.63], [293.66], [329.63], [349.23], [392.00], [440.00], [493.88]
          ]
        },
        {
          id: 'fagote',
          nome: 'Fagote',
          emoji: '🎵',
          tipo: 'sopro',
          soundfont: 'bassoon',
          descricao: 'Dedilhado de fagote (simplificado) — Dó a Si',
          dedilhado: 'teclas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'E123 | D123 + polegar',
            re: 'E123 | D123',
            mi: 'E123 | D12',
            fa: 'E123 | D1',
            sol: 'E123',
            la: 'E12',
            si: 'E1'
          },
          freqBoard: [
            [130.81], [146.83], [164.81], [174.61], [196.00], [220.00], [246.94]
          ]
        },
        // METais
        {
          id: 'trompete',
          nome: 'Trompete',
          emoji: '🎺',
          tipo: 'metal',
          soundfont: 'trumpet',
          descricao: 'Válvulas de trompete — Dó a Si',
          dedilhado: 'valvulas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'valvulas: 0',
            re: 'valvulas: 1+3',
            mi: 'valvulas: 1+2',
            fa: 'valvulas: 1',
            sol: 'valvulas: 0',
            la: 'valvulas: 1+2',
            si: 'valvulas: 2'
          },
          freqBoard: [
            [261.63], [293.66], [329.63], [349.23], [392.00], [440.00], [493.88]
          ]
        },
        {
          id: 'trompa',
          nome: 'Trompa',
          emoji: '🎺',
          tipo: 'metal',
          soundfont: 'french-horn',
          descricao: 'Válvulas de trompa (F) — Dó a Si',
          dedilhado: 'valvulas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'valvulas: 0',
            re: 'valvulas: 1',
            mi: 'valvulas: 1+2',
            fa: 'valvulas: 0',
            sol: 'valvulas: 2',
            la: 'valvulas: 1',
            si: 'valvulas: 2'
          },
          freqBoard: [
            [261.63], [293.66], [329.63], [349.23], [392.00], [440.00], [493.88]
          ]
        },
        {
          id: 'trombone',
          nome: 'Trombone',
          emoji: '🎺',
          tipo: 'metal',
          soundfont: 'trombone',
          descricao: 'Posições da vara (tenor) — Dó a Si',
          dedilhado: 'posicoes',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'vara: 6a pos.',
            re: 'vara: 4a pos.',
            mi: 'vara: 2a pos.',
            fa: 'vara: 1a pos.',
            sol: 'vara: 4a pos.',
            la: 'vara: 2a pos.',
            si: 'vara: 1a pos.'
          },
          freqBoard: [
            [130.81], [146.83], [164.81], [174.61], [196.00], [220.00], [246.94]
          ]
        },
        // VOZ (som GM + nome em solfejo na reprodução do player)
        {
          id: 'voz',
          nome: 'Voz',
          emoji: '🎤',
          tipo: 'voz',
          soundfont: 'voice_oohs',
          descricao: 'Coro (GM) + solfejo cantado (timbre mais agudo / feminino, sintético)',
          dedilhado: 'teclas',
          notas: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'],
          fingeringMap: {
            do: 'player: vogal cantada (som)',
            re: 'player: vogal cantada (som)',
            mi: 'player: vogal cantada (som)',
            fa: 'player: vogal cantada (som)',
            sol: 'player: vogal cantada (som)',
            la: 'player: vogal cantada (som)',
            si: 'player: vogal cantada (som)'
          },
          freqBoard: [
            [261.63], [293.66], [329.63], [349.23], [392.00], [440.00], [493.88]
          ]
        }
      ];

      // Variáveis globais para instrumento atual
      var currentInstrument = INSTRUMENTOS[0];
      var CORDAS = currentInstrument.cordas || [];
      var CORDA_CLASS = currentInstrument.cordaClasses || {};
      var FINGERBOARD = currentInstrument.fingerboard || [];
      var FREQ_BOARD = currentInstrument.freqBoard || [];

      const MENSAGENS_POSITIVAS = [
        'Muito bem!',
        'Você conseguiu!',
        'Isso aí!',
        'Parabéns!',
        'Excelente!',
        'Ótimo!',
        'Vamos tentar de novo?',
        'Quase lá!'
      ];

      // Tonalidades: acidentes por escala (sustenidos = #, bemóis = ♭)
      const TONALIDADES = [
        { id: 'do', nome: 'Dó M', sustenidos: [], bemolis: [] },
        { id: 'sol', nome: 'Sol M', sustenidos: ['fa'], bemolis: [] },
        { id: 're', nome: 'Ré M', sustenidos: ['fa', 'do'], bemolis: [] },
        { id: 'la', nome: 'Lá M', sustenidos: ['fa', 'do', 'sol'], bemolis: [] },
        { id: 'mi', nome: 'Mi M', sustenidos: ['fa', 'do', 'sol', 're'], bemolis: [] },
        { id: 'si', nome: 'Si M', sustenidos: ['fa', 'do', 'sol', 're', 'la'], bemolis: [] },
        { id: 'fa', nome: 'Fá M', sustenidos: [], bemolis: ['si'] },
        { id: 'sib', nome: 'Sib M', sustenidos: [], bemolis: ['si', 'mi'] },
        { id: 'mib', nome: 'Mib M', sustenidos: [], bemolis: ['si', 'mi', 'la'] }
      ];
      var currentKey = TONALIDADES[0];

      // ========== ESTADO GLOBAL ==========
      let audioCtx = null;
      let currentMode = 'hinos';
      let challengeTarget = null;
      let challengeTimeout = null;
      let challengeRound = 0;
      let challengeErrors = 0;
      let challengeStartTs = 0;
      let challengeTimerInterval = null;
      let confettiAnimationId = null;
      let challengeDiscardedAttempts = {};
      let score = 0;
      let totalChallenges = 0;
      let soundEnabled = true;
      let calmMode = false;
      /** Volume base das notas do instrumento (soundfont + síntese). Suba com moderação (ex.: 1.2–1.5) para evitar distorção. */
      var INSTRUMENT_OUTPUT_GAIN = 2;
      let narrationEnabled = false;
      let ambientEnabled = false;
      let ambientOsc = null;
      let ambientGain = null;
      let speechSynth = null;
      var currentInstrumentSound = null;
      var instrumentLoadPromises = {};
      var currentSustainedNoteStop = null;
      var activePointerNotes = {};
      let staffModeTarget = null;
      let staffAnswerLocked = false;
      let staffNoteEllipse = null;
      let staffClefElement = null;
      let currentClef = 'sol';

      // ========== PLAYER (MusicXML / OpenSheetMusicDisplay) ==========
      var playerOsmd = null;
      var playerOsmdLoading = false;
      var playerScoreData = null;
      var playerCatalog = null;
      var playerCatalogPromise = null;
      var playerSelectedCollectionId = 'hinario5-ccb';
      var playerSelectedAfinacao = 'do';
      var playerSelectedItemId = null;
      var playerSelectedHinoNumero = null;
      var playerSelectedVoices = ['s'];
      var playerCurrentScorePath = '';
      var playerPlayToken = 0;
      var playerPrepToken = 0;
      var playerPrepTimeouts = [];
      var playerPlaybackRate = 1;
      var playerMetronomeEnabled = false;
      var playerAutoScrollEnabled = false;
      var playerLoopEnabled = false;
      var playerColorizedNotes = false;
      var playerNoteNameLabels = false;
      var playerShowFingering = false;
      var playerAutoScrollLastTs = 0;
      var playerAutoScrollLastSystemTop = null;
      var playerAutoScrollLastCursorLeftInHost = null;
      var playerAutoScrollLastCursorTopDoc = null;
      var playerAutoScrollUserPausedUntil = 0;
      var playerAutoScrollProgrammaticUntil = 0;
      var playerAutoScrollNeedsInitial = false;
      var playerAutoScrollSystemChanges = 0;
      var playerAutoScrollReachedEnd = false;
      var playerNoteAnchors = [];
      var playerSpeedAdjusting = false;
      var playerSpeedResumeAfterAdjust = false;
      var playerSpeedFrozenSec = 0;
      var playerPlayback = {
        isPlaying: false,
        startedAtCtx: 0,
        positionSec: 0,
        nextEventIndex: 0,
        nextCursorIndex: 0,
        nextBeatIndex: 0,
        rafId: null,
        activeStops: []
      };

      /** Ponte para `player-load-bindings.js` (IIFE nao expoe `let`/`const` ao `window`). */
      window.PlayerLoadBindingAccess = {
        readPlayerOsmdLoading: function () { return playerOsmdLoading; },
        setPlayerOsmdLoading: function (v) { playerOsmdLoading = v; },
        setPlayerOsmd: function (v) { playerOsmd = v; },
        setPlayerScoreData: function (v) { playerScoreData = v; },
        setPlayerNoteAnchors: function (v) { playerNoteAnchors = v; },
        isPlayerMode: function () { return currentMode === 'player'; },
        setMessage: function (t) { setMessage(t); },
        updatePlayerUiNow: function (s) { updatePlayerUiNow(s); },
        stopPlayerPlayback: function (x) { stopPlayerPlayback(x); },
        resetPlayerCursorToCurrentPosition: function () { resetPlayerCursorToCurrentPosition(); },
        resizePlayerOsmdIfActive: function () { resizePlayerOsmdIfActive(); },
        buildPlayerNoteAnchorsFromDom: function () { buildPlayerNoteAnchorsFromDom(); },
        getPlayerPlayback: function () { return playerPlayback; },
        getAppVersion: function () { return APP_VERSION; },
        buildPlayerDisplayMusicXml: function (xml) { return buildPlayerDisplayMusicXml(xml); },
        trySkipScore: function (scoreKey, forceReload) {
          if (!forceReload && playerOsmd && playerCurrentScorePath === scoreKey) {
            resizePlayerOsmdIfActive();
            return true;
          }
          return false;
        },
        clearPreviousOsmd: function () {
          if (playerOsmd) {
            try { if (typeof playerOsmd.clear === 'function') playerOsmd.clear(); } catch (ePrev) {}
            playerOsmd = null;
          }
        },
        beginLoadState: function (host, scoreKey) {
          playerOsmdLoading = true;
          host.innerHTML = '';
          playerScoreData = null;
          stopPlayerPlayback(false);
          playerCurrentScorePath = scoreKey;
          setMessage('Carregando MusicXML…');
        },
        onOsmdConstructorFailed: function () {
          playerOsmdLoading = false;
          setMessage('Player: erro ao criar o visualizador.');
        },
        getHost: function () { return document.getElementById('playerOsmdContainer'); }
      };

      // ========== METRÔNOMO ==========
      var metroDom = {
        modalEl: null,
        dotsEl: null,
        visualFlashEl: null,
        bpmValueEl: null,
        bpmLabelEl: null,
        bpmSliderEl: null,
        accentCheckboxEl: null,
        beatsValueEl: null,
        subdivRowEl: null,
        solfejoWrapEl: null,
        solfejoBaseImgEl: null,
        solfejoHandImgEl: null,
        solfejoModeCheckboxEl: null,
        solfejoLeftHandCheckboxEl: null,
        visualPulseTimer: null
      };
      window.MetroUiRefs = metroDom;

      let metroAudioCtx = null;
      let metroSchedulerId = null;
      let metroNextClickTime = 0;
      let metroClickIndexInBar = 0;
      let metroIsRunning = false;

      let metroBpm = 60;
      let metroBeatsPerBar = 4;
      let metroSubdivision = 1; // cliques por batida
      let metroAccentFirst = false;
      let metroSolfejoMode = false;
      let metroSolfejoLeftHand = false;

      // Cache das posições (x,y) detectadas nos frames do movimento.
      // frames: index 0 = preparacao; index 1..N = posicoes.
      let metroSolfejoFramesCache = {};
      let metroSolfejoFramesPromises = {};
      let metroSolfejoCurrentFrame = 0;

      let metroSolfejoHandTipCache = {};
      let metroSolfejoHandTipPromises = {};

      // Tween (deslize) entre posições do solfejo
      let metroSolfejoTweenRafId = null;
      let metroSolfejoTweenFromPos = null;
      let metroSolfejoTweenToPos = null;
      let metroSolfejoTweenStartPerf = 0;
      let metroSolfejoTweenDurationMs = 0;
      let metroSolfejoTweenFromFrame = 0;
      let metroSolfejoTweenToFrame = 0;
      let metroNoiseBuffer = null;

      // ========== AFINADOR ==========
      var TUNER_NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      var TUNER_PRESETS = {
        violino: ['G3', 'D4', 'A4', 'E5'],
        viola: ['C3', 'G3', 'D4', 'A4'],
        violoncelo: ['C2', 'G2', 'D3', 'A3'],
        contrabaixo: ['E1', 'A1', 'D2', 'G2'],
        flauta: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        clarinete: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        oboe: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        fagote: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'],
        trompete: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        trompa: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        trombone: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'],
        chromatic: []
      };
      var tunerStream = null;
      var tunerAnalyzer = null;
      var tunerSource = null;
      var tunerData = null;
      var tunerFreqData = null;
      var tunerFrameId = 0;
      var tunerRunning = false;
      var tunerHistory = [];
      var tunerLastCents = 0;
      var tunerLastStatus = 'idle';
      var tunerLastNote = '--';
      var tunerLastTargetFreq = 0;
      var tunerLastFreq = 0;
      var tunerSmoothedFreq = 0;
      var tunerRawHistory = [];
      var tunerNoSignalFrames = 0;
      var wakeLockSentinel = null;
      var wakeLockBootstrapped = false;
      const STAFF_BOTTOM_LINE_Y = 118;
      const STAFF_STEP_PX = 6;
      const STAFF_MIN_DIFF = -5;
      const STAFF_MAX_DIFF = 11;
      const CHALLENGE_ROUNDS_LIMIT = 20;
      const CHALLENGE_ERRORS_LIMIT = 3;

      const HINOS_STORAGE_KEY = 'gem-tools-hinos-v1';
      const HINOS_TOTAL = 480;
      const HINOS_VOZES = ['S', 'C', 'T', 'B'];
      /** Hino/coro conta como “completo” quando tiver ao menos esta quantidade de vozes marcadas. */
      const HINOS_FULL_VOICES_REQUIRED = 2;
      const HINARIO_PDF_BY_AFIN = {
        do: 'Ficha Hinário 5 - Afinação em DÓ.pdf',
        mib: 'Ficha Hinário 5 - Afinação em MIb.pdf',
        sib: 'Ficha Hinário 5 - Afinação em SIb.pdf'
      };

      var hinosState = { version: 1, students: [], activeStudentId: null };
      var hinosActiveAfinação = 'do';
      /** Quando o instrumento muda, volta a sugerir a ficha; no mesmo instrumento, mantém a aba que o aluno escolheu. */
      var hinosLastSyncInstrumentId = null;
      var hinosCurriculum = null;
      /** Chave atual no editor: número do hino ("158") ou "coro-5". */
      var hinosSelectedKey = '1';
      var hinosFaseBuiltForAfin = null;
      /** Incrementar ao mudar a estrutura do grid (ex.: células com linha de vozes). */
      var HINOS_FASE_PANEL_VER = 8;

      function buildFallbackHinosCurriculum() {
        return window.HinosCurriculumUtils.buildFallbackCurriculum(HINOS_TOTAL);
      }

      function getHinosPhasesForAfin(afin) {
        if (!hinosCurriculum) return null;
        var p = hinosCurriculum[afin];
        return Array.isArray(p) && p.length ? p : null;
      }

      function hinosIsCoroKey(key) {
        return window.HinosCurriculumUtils.isCoroKey(key);
      }

      function hinosVoiceCountInEntry(ent) {
        return window.HinosCurriculumUtils.voiceCountInEntry(ent, HINOS_VOZES);
      }

      function hinosEntryFull(ent) {
        return window.HinosCurriculumUtils.entryFull(ent, HINOS_VOZES, HINOS_FULL_VOICES_REQUIRED);
      }

      function hinosGetStudentVozPrincipal(st) {
        return window.HinosCurriculumUtils.getStudentVozPrincipal(st, HINOS_VOZES);
      }

      function hinosFormatVoicesShort(ent) {
        return window.HinosCurriculumUtils.formatVoicesShort(ent, HINOS_VOZES);
      }

      function countHinosOverview(st, afin) {
        return window.HinosCurriculumUtils.countOverview(st, afin, HINOS_TOTAL, HINOS_VOZES, HINOS_FULL_VOICES_REQUIRED);
      }

      function hinosPhaseItemKeys(phase) {
        return window.HinosCurriculumUtils.phaseItemKeys(phase);
      }

      function countPhaseProgress(st, afin, phase) {
        return window.HinosCurriculumUtils.countPhaseProgress(st, afin, phase, HINOS_VOZES);
      }

      /** Mesma regra de `hinosSynthGrupos` em ensureHinosFasePanels — lista de grupos/itens da fase. */
      function hinosSynthGruposForPhase(ph) {
        return window.HinosCurriculumUtils.synthGruposForPhase(ph);
      }

      /** Marca a voz principal em todos os hinos de um grupo tonal (coros do grupo não entram). */
      function hinosBulkMarkPrincipalInGroup(phaseIndex, tonalidade) {
        var st = getActiveHinosStudent();
        if (!st) {
          setMessage('Adicione e selecione um aluno primeiro.');
          return;
        }
        var phases = getHinosPhasesForAfin(hinosActiveAfinação);
        if (!phases || phases[phaseIndex] === undefined) return;
        var grupos = hinosSynthGruposForPhase(phases[phaseIndex]);
        var ton = tonalidade || 'Geral';
        var gr = grupos.find(function (g) {
          return (g.tonalidade || 'Geral') === ton;
        });
        if (!gr) return;
        var nums = [];
        (gr.itens || []).forEach(function (it) {
          if (it.t === 'hino') nums.push(String(it.n));
        });
        if (!nums.length) {
          setMessage('Este grupo não tem hinos (apenas coros ou vazio).');
          return;
        }
        var vP = hinosGetStudentVozPrincipal(st);
        var vName = vP === 'S' ? 'Soprano' : vP === 'C' ? 'Contralto' : vP === 'T' ? 'Tenor' : 'Baixo';
        if (
          !window.confirm(
            'Marcar a voz principal (' +
              vName +
              ') em ' +
              nums.length +
              ' hino(s) do grupo "' +
              ton +
              '"?\n\n' +
              'Os coros deste grupo não são alterados. Você pode continuar abrindo cada hino para marcar ou desmarcar vozes individualmente.'
          )
        ) {
          return;
        }
        ensureStudentHinosShape(st);
        nums.forEach(function (key) {
          if (!st.hinos[hinosActiveAfinação][key]) {
            st.hinos[hinosActiveAfinação][key] = { S: false, C: false, T: false, B: false, E: false };
          }
          st.hinos[hinosActiveAfinação][key][vP] = true;
        });
        saveHinosState();
        refreshHinosVoiceButtons();
        setMessage('Voz principal marcada em ' + nums.length + ' hino(s) em "' + ton + '".');
      }

      function updateHinosOverviewBars() {
        var st = getActiveHinosStudent();
        var lblV = document.getElementById('hinosPctVoicesLbl');
        var barV = document.getElementById('hinosPctVoicesBar');
        var lblA = document.getElementById('hinosPctHinosAnyLbl');
        var barA = document.getElementById('hinosPctHinosAnyBar');
        var lblF = document.getElementById('hinosPctHinosFullLbl');
        var barF = document.getElementById('hinosPctHinosFullBar');
        var lblC = document.getElementById('hinosPctCorosLbl');
        var barC = document.getElementById('hinosPctCorosBar');
        if (!st) {
          if (lblV) lblV.textContent = '—';
          if (barV) barV.style.width = '0%';
          if (lblA) lblA.textContent = '—';
          if (barA) barA.style.width = '0%';
          if (lblF) lblF.textContent = '—';
          if (barF) barF.style.width = '0%';
          if (lblC) lblC.textContent = '—';
          if (barC) barC.style.width = '0%';
          var phases0 = getHinosPhasesForAfin(hinosActiveAfinação);
          if (phases0) {
            phases0.forEach(function (ph, idx) {
              var pctEl0 = document.getElementById('hinosFasePct-' + hinosActiveAfinação + '-' + idx);
              if (!pctEl0) return;
              var slots0 = hinosPhaseItemKeys(ph).length;
              pctEl0.textContent = '0% · 0/' + slots0;
              var bar0 = document.getElementById('hinosFasePctBar-' + hinosActiveAfinação + '-' + idx);
              if (bar0) bar0.style.width = '0%';
            });
          }
          return;
        }
        var o = countHinosOverview(st, hinosActiveAfinação);
        var pa = Math.round((o.hinosWithPrimary / HINOS_TOTAL) * 100);
        var pcorosVp = Math.round((o.corosWithPrimary / 6) * 100);
        var pf = Math.round((o.hinosFull / HINOS_TOTAL) * 100);
        var pc = Math.round((o.corosFull / 6) * 100);
        if (lblV) lblV.textContent = o.hinosWithPrimary + '/' + HINOS_TOTAL + ' · ' + pa + '%';
        if (barV) barV.style.width = pa + '%';
        if (lblA) lblA.textContent = o.corosWithPrimary + '/6 · ' + pcorosVp + '%';
        if (barA) barA.style.width = pcorosVp + '%';
        if (lblF) lblF.textContent = o.hinosFull + '/' + HINOS_TOTAL + ' · ' + pf + '%';
        if (barF) barF.style.width = pf + '%';
        if (lblC) lblC.textContent = o.corosFull + '/6 · ' + pc + '%';
        if (barC) barC.style.width = pc + '%';

        var phases = getHinosPhasesForAfin(hinosActiveAfinação);
        if (phases) {
          phases.forEach(function (ph, idx) {
            var pctEl = document.getElementById('hinosFasePct-' + hinosActiveAfinação + '-' + idx);
            if (!pctEl) return;
            var pr = countPhaseProgress(st, hinosActiveAfinação, ph);
            pctEl.textContent = pr.pct + '% · ' + pr.done + '/' + pr.slots;
            var bar = document.getElementById('hinosFasePctBar-' + hinosActiveAfinação + '-' + idx);
            if (bar) bar.style.width = pr.pct + '%';
          });
        }
      }

      function syncHinosDetailControlsFromKey() {
        var numIn = document.getElementById('hinosHinoNum');
        var prev = document.getElementById('hinosPrev');
        var next = document.getElementById('hinosNext');
        var lbl = document.getElementById('hinosDetailLabel');
        var ton = '';
        var qk = hinosIsCoroKey(hinosSelectedKey) ? hinosSelectedKey : String(clampHinoNum(hinosSelectedKey));
        var cel = document.querySelector('.hinos-cell[data-hinos-key="' + qk + '"]');
        if (cel) ton = cel.getAttribute('data-hinos-ton') || '';
        var suf = ton ? ' · ' + ton : '';
        if (hinosIsCoroKey(hinosSelectedKey)) {
          if (numIn) {
            numIn.disabled = true;
            numIn.value = '';
          }
          if (prev) prev.disabled = true;
          if (next) next.disabled = true;
          if (lbl) lbl.textContent = 'Coro ' + hinosSelectedKey.replace('coro-', '') + suf;
        } else {
          if (numIn) {
            numIn.disabled = false;
            numIn.value = String(clampHinoNum(hinosSelectedKey));
          }
          if (prev) prev.disabled = false;
          if (next) next.disabled = false;
          if (lbl) lbl.textContent = 'Hino ' + clampHinoNum(hinosSelectedKey) + suf;
        }
      }

      function setHinosSelectedKey(key) {
        if (hinosIsCoroKey(key)) {
          hinosSelectedKey = key;
        } else {
          hinosSelectedKey = String(clampHinoNum(key));
        }
      }

      function updateHinosFaseGridCellClasses() {
        var st = getActiveHinosStudent();
        var book = st && st.hinos && st.hinos[hinosActiveAfinação] ? st.hinos[hinosActiveAfinação] : {};
        document.querySelectorAll('.hinos-cell').forEach(function (el) {
          var k = el.getAttribute('data-hinos-key');
          if (!k) return;
          var ent = book[k];
          var vc = hinosVoiceCountInEntry(ent);
          el.classList.remove('empty', 'partial', 'full');
          if (vc === 0) el.classList.add('empty');
          else if (vc >= HINOS_FULL_VOICES_REQUIRED) el.classList.add('full');
          else el.classList.add('partial');
          var voEl = el.querySelector('.hinos-cell-voices');
          if (voEl) voEl.textContent = hinosFormatVoicesShort(ent);
          var studyEl = el.querySelector('.hinos-cell-study');
          if (studyEl) {
            var isStudy = !!(ent && ent.E);
            studyEl.classList.toggle('on', isStudy);
            studyEl.textContent = isStudy ? 'E' : '';
          }
        });
      }

      function ensureHinosFasePanels() {
        var container = document.getElementById('hinosFaseContainer');
        if (!container) return;
        var phases = getHinosPhasesForAfin(hinosActiveAfinação);
        if (!phases) return;
        var faseBuiltKey = hinosActiveAfinação + ':' + HINOS_FASE_PANEL_VER;
        if (hinosFaseBuiltForAfin === faseBuiltKey && container.children.length) {
          return;
        }
        container.innerHTML = '';
        hinosFaseBuiltForAfin = faseBuiltKey;

        function hinosSynthGrupos(ph) {
          if (ph.grupos && ph.grupos.length) return ph.grupos;
          var itens = [];
          (ph.hinos || []).slice().sort(function (a, b) { return a - b; }).forEach(function (n) {
            itens.push({ t: 'hino', n: n });
          });
          (ph.coros || []).forEach(function (c) {
            itens.push({ t: 'coro', id: c.id, label: c.label });
          });
          return [{ tonalidade: 'Geral', itens: itens }];
        }

        phases.forEach(function (ph, idx) {
          var det = document.createElement('details');
          det.className = 'hinos-fase-details';
          det.open = idx === 0;
          var sum = document.createElement('summary');
          var sp = document.createElement('span');
          sp.textContent = ph.titulo || ('Fase ' + (idx + 1));
          sum.appendChild(sp);
          var pct = document.createElement('span');
          pct.className = 'hinos-fase-pct';
          pct.id = 'hinosFasePct-' + hinosActiveAfinação + '-' + idx;
          pct.textContent = '0%';
          sum.appendChild(pct);
          var sumProg = document.createElement('div');
          sumProg.className = 'hinos-fase-prog';
          var sumProgFill = document.createElement('div');
          sumProgFill.className = 'hinos-fase-prog-fill';
          sumProgFill.id = 'hinosFasePctBar-' + hinosActiveAfinação + '-' + idx;
          sumProg.appendChild(sumProgFill);
          sum.appendChild(sumProg);
          det.appendChild(sum);

          var toolbar = document.createElement('div');
          toolbar.className = 'hinos-fase-toolbar';

          var labTon = document.createElement('label');
          labTon.className = 'hinos-filter-ton-wrap';
          var spTon = document.createElement('span');
          spTon.className = 'hinos-filter-label';
          spTon.textContent = 'Tonalidade';
          labTon.appendChild(spTon);
          var selTon = document.createElement('select');
          selTon.className = 'hinos-filter-ton';
          var optAll = document.createElement('option');
          optAll.value = '';
          optAll.textContent = 'Todas';
          selTon.appendChild(optAll);
          var tonSeen = {};
          hinosSynthGrupos(ph).forEach(function (g) {
            var t = g.tonalidade || 'Geral';
            tonSeen[t] = true;
          });
          Object.keys(tonSeen).sort(function (a, b) {
            return a.localeCompare(b, 'pt');
          }).forEach(function (t) {
            var o = document.createElement('option');
            o.value = t;
            o.textContent = t;
            selTon.appendChild(o);
          });
          labTon.appendChild(selTon);

          var labQ = document.createElement('label');
          labQ.className = 'hinos-filter-q-wrap';
          var spQ = document.createElement('span');
          spQ.className = 'hinos-filter-label';
          spQ.textContent = 'Buscar nº';
          labQ.appendChild(spQ);
          var inpQ = document.createElement('input');
          inpQ.type = 'search';
          inpQ.className = 'hinos-filter-q';
          inpQ.placeholder = 'ex.: 158';
          inpQ.setAttribute('inputmode', 'numeric');
          labQ.appendChild(inpQ);

          var btnClr = document.createElement('button');
          btnClr.type = 'button';
          btnClr.className = 'hinos-filter-clear';
          btnClr.setAttribute('aria-label', 'Limpar filtros');
          btnClr.title = 'Limpar tonalidade e busca';
          btnClr.innerHTML = '<i data-lucide="circle-x" aria-hidden="true"></i>';

          toolbar.appendChild(labTon);
          toolbar.appendChild(labQ);
          toolbar.appendChild(btnClr);
          det.appendChild(toolbar);

          var body = document.createElement('div');
          body.className = 'hinos-fase-body';

          var grupos = hinosSynthGrupos(ph);
          var onlyGeral = grupos.length === 1 && (grupos[0].tonalidade || '').indexOf('Geral') === 0;

          grupos.forEach(function (gr) {
            var tonName = gr.tonalidade || 'Geral';
            var wrap = document.createElement('div');
            wrap.className = 'hinos-grupo';
            wrap.setAttribute('data-ton-grupo', tonName);
            if (onlyGeral) wrap.setAttribute('data-only-geral', '1');
            var head = document.createElement('div');
            head.className = 'hinos-grupo-head';
            var gt = document.createElement('div');
            gt.className = 'hinos-grupo-title';
            gt.textContent = tonName;
            head.appendChild(gt);
            var hinoCountInGr = 0;
            (gr.itens || []).forEach(function (it) {
              if (it.t === 'hino') hinoCountInGr++;
            });
            if (hinoCountInGr > 0) {
              var bulkBtn = document.createElement('button');
              bulkBtn.type = 'button';
              bulkBtn.className = 'hinos-grupo-bulk';
              bulkBtn.setAttribute('aria-label', 'Marcar voz principal em todos os hinos deste grupo');
              bulkBtn.title =
                'Marca a voz principal do aluno em todos os hinos deste grupo. Coros não são alterados.';
              bulkBtn.innerHTML = '<i data-lucide="list-checks" aria-hidden="true"></i>';
              bulkBtn.setAttribute('data-hinos-bulk-phase', String(idx));
              bulkBtn.setAttribute('data-hinos-bulk-ton', tonName);
              head.appendChild(bulkBtn);
            }
            wrap.appendChild(head);
            var grid = document.createElement('div');
            grid.className = 'hinos-fase-grid';
            (gr.itens || []).forEach(function (item) {
              if (item.t === 'hino') {
                var b = document.createElement('button');
                b.type = 'button';
                b.className = 'hinos-cell empty';
                b.setAttribute('data-hinos-key', String(item.n));
                b.setAttribute('data-hinos-ton', tonName);
                var sn = document.createElement('span');
                sn.className = 'hinos-cell-num';
                sn.textContent = String(item.n);
                var sv = document.createElement('span');
                sv.className = 'hinos-cell-voices';
                b.appendChild(sn);
                b.appendChild(sv);
                var se = document.createElement('span');
                se.className = 'hinos-cell-study';
                se.setAttribute('aria-hidden', 'true');
                b.appendChild(se);
                grid.appendChild(b);
              } else if (item.t === 'coro') {
                var b2 = document.createElement('button');
                b2.type = 'button';
                b2.className = 'hinos-cell coro empty';
                b2.setAttribute('data-hinos-key', item.id);
                b2.setAttribute('data-hinos-ton', tonName);
                var sn2 = document.createElement('span');
                sn2.className = 'hinos-cell-num';
                sn2.textContent = item.label || item.id;
                var sv2 = document.createElement('span');
                sv2.className = 'hinos-cell-voices';
                b2.appendChild(sn2);
                b2.appendChild(sv2);
                var se2 = document.createElement('span');
                se2.className = 'hinos-cell-study';
                se2.setAttribute('aria-hidden', 'true');
                b2.appendChild(se2);
                grid.appendChild(b2);
              }
            });
            wrap.appendChild(grid);
            body.appendChild(wrap);
          });

          det.appendChild(body);
          container.appendChild(det);

          function applyHinosFaseFilters() {
            var ton = selTon.value || '';
            var q = (inpQ.value || '').trim().toLowerCase();
            body.querySelectorAll('.hinos-cell').forEach(function (cell) {
              var tCell = cell.getAttribute('data-hinos-ton') || '';
              var key = (cell.getAttribute('data-hinos-key') || '').toLowerCase();
              // Evita que o indicador E entre na busca (a busca é principalmente por nº/voz).
              var numEl = cell.querySelector('.hinos-cell-num');
              var voicesEl = cell.querySelector('.hinos-cell-voices');
              var lab = ((numEl ? numEl.textContent : '') + ' ' + (voicesEl ? voicesEl.textContent : '')).toLowerCase();
              var showTon = !ton || tCell === ton;
              var showQ = !q || key.indexOf(q) !== -1 || lab.indexOf(q) !== -1;
              cell.style.display = showTon && showQ ? '' : 'none';
            });
            body.querySelectorAll('.hinos-grupo').forEach(function (gw) {
              var anyVis = false;
              gw.querySelectorAll('.hinos-cell').forEach(function (c) {
                if (c.style.display !== 'none') anyVis = true;
              });
              gw.style.display = anyVis ? '' : 'none';
            });
          }

          selTon.addEventListener('change', applyHinosFaseFilters);
          inpQ.addEventListener('input', applyHinosFaseFilters);
          btnClr.addEventListener('click', function () {
            selTon.value = '';
            inpQ.value = '';
            applyHinosFaseFilters();
          });
        });

        if (typeof window.gemRefreshLucide === 'function') {
          window.gemRefreshLucide();
        }

        if (!container._hinosFaseGridClickBound) {
          container._hinosFaseGridClickBound = true;
          container.addEventListener('click', function (e) {
            var bulk = e.target.closest('.hinos-grupo-bulk');
            if (bulk && container.contains(bulk)) {
              e.preventDefault();
              e.stopPropagation();
              var phIdx = parseInt(bulk.getAttribute('data-hinos-bulk-phase'), 10);
              var ton = bulk.getAttribute('data-hinos-bulk-ton') || 'Geral';
              if (!isNaN(phIdx)) hinosBulkMarkPrincipalInGroup(phIdx, ton);
              return;
            }
            var t = e.target.closest('.hinos-cell');
            if (!t || !container.contains(t)) return;
            var k = t.getAttribute('data-hinos-key');
            if (k) {
              setHinosSelectedKey(k);
              refreshHinosVoiceButtonsCore();
              openHinosEditorModal();
            }
          });
        }
      }

      function closeHinosEditorModal() {
        var m = document.getElementById('hinosEditorModal');
        if (m) m.classList.add('hidden');
      }

      function closeHinosNewStudentModal() {
        var m = document.getElementById('hinosNewStudentModal');
        if (m) m.classList.add('hidden');
      }

      function openHinosNewStudentModal() {
        var m = document.getElementById('hinosNewStudentModal');
        if (!m || currentMode !== 'hinos') return;
        closeHinosEditorModal();
        var vozSel = document.getElementById('hinosNewStudentVoz');
        if (vozSel) vozSel.value = 'S';
        var inp = document.getElementById('hinosNewStudentName');
        if (inp) inp.value = '';
        m.classList.remove('hidden');
        if (inp) inp.focus();
      }

      function openHinosEditorModal() {
        var m = document.getElementById('hinosEditorModal');
        if (!m || currentMode !== 'hinos') return;
        closeHinosNewStudentModal();
        m.classList.remove('hidden');
        var btn = m.querySelector('.hinos-voz-btn');
        if (btn) btn.focus();
      }

      function loadHinosCurriculum(done) {
        if (hinosCurriculum) {
          done();
          return;
        }
        fetch('./hinario5-curriculum.json')
          .then(function (r) {
            if (!r.ok) throw new Error('no json');
            return r.json();
          })
          .then(function (data) {
            hinosCurriculum = data;
            done();
          })
          .catch(function () {
            hinosCurriculum = buildFallbackHinosCurriculum();
            done();
          });
      }

      function hinosGenerateId() {
        return window.HinosCurriculumUtils.generateStudentId();
      }

      function loadHinosState() {
        try {
          var raw = localStorage.getItem(HINOS_STORAGE_KEY);
          if (!raw) {
            hinosState = { version: 1, students: [], activeStudentId: null };
            return;
          }
          var parsed = JSON.parse(raw);
          if (!parsed || !Array.isArray(parsed.students)) {
            hinosState = { version: 1, students: [], activeStudentId: null };
            return;
          }
          hinosState = {
            version: parsed.version || 1,
            students: parsed.students,
            activeStudentId: parsed.activeStudentId || null
          };
          if (hinosState.students && hinosState.students.length) {
            hinosState.students.forEach(ensureStudentHinosShape);
            saveHinosState();
          }
        } catch (err) {
          hinosState = { version: 1, students: [], activeStudentId: null };
        }
      }

      function saveHinosState() {
        try {
          localStorage.setItem(HINOS_STORAGE_KEY, JSON.stringify(hinosState));
        } catch (err) {}
      }

      function parseHinosBackupJson(text) {
        return window.HinosCurriculumUtils.parseBackupJson(text);
      }

      function cloneStudentForHinos(st) {
        return window.HinosCurriculumUtils.cloneStudent(st, HINOS_VOZES);
      }

      function exportHinosBackup() {
        var payload = {
          version: hinosState.version || 1,
          students: hinosState.students,
          activeStudentId: hinosState.activeStudentId,
          exportedAt: new Date().toISOString(),
          app: 'gem-tools-hinos'
        };
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        var d = new Date();
        var pad = function (n) {
          return n < 10 ? '0' + n : '' + n;
        };
        a.download = 'gem-tools-hinos-backup-' + d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setMessage('Backup exportado. Transfira o arquivo para o outro aparelho e use Importar backup.');
      }

      function applyHinosBackupImport(parsed, mode) {
        var studentsIn = parsed.students.map(cloneStudentForHinos).filter(function (s) {
          return s !== null;
        });
        if (mode === 'replace') {
          hinosState = {
            version: parsed.version || 1,
            students: studentsIn,
            activeStudentId: parsed.activeStudentId || null
          };
        } else {
          studentsIn.forEach(function (incoming) {
            var idx = hinosState.students.findIndex(function (s) {
              return s.id === incoming.id;
            });
            if (idx >= 0) hinosState.students[idx] = incoming;
            else hinosState.students.push(incoming);
          });
          if (
            !hinosState.activeStudentId ||
            !hinosState.students.some(function (s) {
              return s.id === hinosState.activeStudentId;
            })
          ) {
            var aid = parsed.activeStudentId;
            hinosState.activeStudentId =
              aid && hinosState.students.some(function (s) {
                return s.id === aid;
              })
                ? aid
                : hinosState.students.length
                  ? hinosState.students[0].id
                  : null;
          }
        }
        if (
          hinosState.activeStudentId &&
          !hinosState.students.some(function (s) {
            return s.id === hinosState.activeStudentId;
          })
        ) {
          hinosState.activeStudentId = hinosState.students.length ? hinosState.students[0].id : null;
        }
        saveHinosState();
        renderHinosStudentSelect();
        syncHinosActiveStudentVozUI();
        refreshHinosVoiceButtons();
      }

      function ensureStudentHinosShape(st) {
        window.HinosCurriculumUtils.ensureStudentShape(st, HINOS_VOZES);
      }

      function getActiveHinosStudent() {
        if (!hinosState.activeStudentId) return null;
        return hinosState.students.find(function (s) { return s.id === hinosState.activeStudentId; }) || null;
      }

      /** Afinação sugerida da ficha conforme instrumento (aluno pode trocar a aba). */
      function getDefaultHinarioAfinação(inst) {
        return window.HinosCurriculumUtils.defaultAfinaçãoForInstrument(inst);
      }

      function setHinosAfinaçãoTab(afin) {
        if (afin !== 'do' && afin !== 'mib' && afin !== 'sib') afin = 'do';
        hinosActiveAfinação = afin;
        document.querySelectorAll('.hinos-afin-btn').forEach(function (btn) {
          var id = btn.getAttribute('data-hinos-afin');
          btn.classList.toggle('active', id === afin);
          btn.setAttribute('aria-selected', id === afin ? 'true' : 'false');
        });
      }

      function syncHinosAfinaçãoFromInstrument(inst) {
        setHinosAfinaçãoTab(getDefaultHinarioAfinação(inst || currentInstrument));
      }

      function clampHinoNum(n) {
        return window.HinosCurriculumUtils.clampHinoNumber(n, HINOS_TOTAL);
      }

      function syncHinosActiveStudentVozUI() {
        var edit = document.getElementById('hinosActiveStudentVoz');
        if (!edit) return;
        var st = getActiveHinosStudent();
        if (!st) {
          edit.disabled = true;
          edit.value = 'S';
          return;
        }
        edit.disabled = false;
        edit.value = hinosGetStudentVozPrincipal(st);
      }

      function renderHinosStudentSelect() {
        var sel = document.getElementById('hinosStudentSelect');
        if (!sel) return;
        var prev = hinosState.activeStudentId;
        sel.innerHTML = '';
        hinosState.students.forEach(function (st) {
          ensureStudentHinosShape(st);
          var opt = document.createElement('option');
          opt.value = st.id;
          opt.textContent = st.name || 'Aluno';
          sel.appendChild(opt);
        });
        if (!hinosState.students.length) {
          hinosState.activeStudentId = null;
          saveHinosState();
          syncHinosActiveStudentVozUI();
          return;
        }
        if (prev && hinosState.students.some(function (s) { return s.id === prev; })) {
          sel.value = prev;
        } else {
          hinosState.activeStudentId = hinosState.students[0].id;
          sel.value = hinosState.activeStudentId;
          saveHinosState();
        }
        syncHinosActiveStudentVozUI();
      }

      function refreshHinosVoiceButtonsCore() {
        var st = getActiveHinosStudent();
        if (!hinosIsCoroKey(hinosSelectedKey)) {
          hinosSelectedKey = String(clampHinoNum(hinosSelectedKey));
        }
        syncHinosDetailControlsFromKey();
        var key = hinosSelectedKey;
        document.querySelectorAll('.hinos-voz-btn').forEach(function (btn) {
          var v = btn.getAttribute('data-hinos-voice');
          var on = false;
          if (st && st.hinos && st.hinos[hinosActiveAfinação] && st.hinos[hinosActiveAfinação][key]) {
            on = !!st.hinos[hinosActiveAfinação][key][v];
          }
          btn.classList.toggle('on', on);
        });
        document.querySelectorAll('.hinos-study-btn').forEach(function (btn) {
          var flag = btn.getAttribute('data-hinos-study');
          var on = false;
          if (st && st.hinos && st.hinos[hinosActiveAfinação] && st.hinos[hinosActiveAfinação][key]) {
            on = !!st.hinos[hinosActiveAfinação][key][flag];
          }
          btn.classList.toggle('on', on);
        });
        var sumEl = document.getElementById('hinosSummary');
        if (sumEl) {
          if (!st) {
            sumEl.textContent = 'Adicione um aluno para começar a marcar os hinos.';
          } else {
            var book = st.hinos[hinosActiveAfinação] || {};
            var withAny = 0;
            var voices = 0;
            Object.keys(book).forEach(function (hk) {
              var ent = book[hk];
              var any = false;
              HINOS_VOZES.forEach(function (vv) {
                if (ent && ent[vv]) {
                  any = true;
                  voices++;
                }
              });
              if (any) withAny++;
            });
            var afinLbl = hinosActiveAfinação === 'do' ? 'Dó' : hinosActiveAfinação === 'mib' ? 'Mib' : 'Sib';
            var vP = hinosGetStudentVozPrincipal(st);
            var vName = vP === 'S' ? 'Soprano' : vP === 'C' ? 'Contralto' : vP === 'T' ? 'Tenor' : 'Baixo';
            sumEl.textContent = 'Nesta ficha (' + afinLbl + '), voz principal: ' + vName + ' — ' + withAny + ' itens com ao menos uma voz · ' + voices + ' marcações no total.';
          }
        }
        updateHinosOverviewBars();
        updateHinosFaseGridCellClasses();
        document.querySelectorAll('.hinos-cell').forEach(function (el) {
          el.classList.toggle('current', el.getAttribute('data-hinos-key') === hinosSelectedKey);
        });
      }

      function refreshHinosVoiceButtons() {
        loadHinosCurriculum(function () {
          ensureHinosFasePanels();
          refreshHinosVoiceButtonsCore();
        });
      }

      function toggleHinosVoice(voice) {
        var st = getActiveHinosStudent();
        if (!st) {
          setMessage('Adicione e selecione um aluno primeiro.');
          return false;
        }
        ensureStudentHinosShape(st);
        var key = hinosSelectedKey;
        if (!hinosIsCoroKey(key)) key = String(clampHinoNum(key));
        if (!st.hinos[hinosActiveAfinação][key]) {
          st.hinos[hinosActiveAfinação][key] = { S: false, C: false, T: false, B: false };
        }
        var cur = !!st.hinos[hinosActiveAfinação][key][voice];
        st.hinos[hinosActiveAfinação][key][voice] = !cur;
        saveHinosState();
        refreshHinosVoiceButtons();
        return true;
      }

      function toggleHinosStudyFlag(flag) {
        var st = getActiveHinosStudent();
        if (!st) {
          setMessage('Adicione e selecione um aluno primeiro.');
          return;
        }
        ensureStudentHinosShape(st);
        var key = hinosSelectedKey;
        if (!hinosIsCoroKey(key)) key = String(clampHinoNum(key));
        if (!st.hinos[hinosActiveAfinação][key]) {
          st.hinos[hinosActiveAfinação][key] = { S: false, C: false, T: false, B: false, E: false };
        }
        var cur = !!st.hinos[hinosActiveAfinação][key][flag];
        st.hinos[hinosActiveAfinação][key][flag] = !cur;
        saveHinosState();
        refreshHinosVoiceButtons();
      }

      function clearCurrentHinoVoices() {
        var st = getActiveHinosStudent();
        if (!st) return;
        ensureStudentHinosShape(st);
        var key = hinosSelectedKey;
        if (!hinosIsCoroKey(key)) key = String(clampHinoNum(key));
        delete st.hinos[hinosActiveAfinação][key];
        saveHinosState();
        refreshHinosVoiceButtons();
      }

      function bindHinosEvents() {
        window.HinosEvents.bindHinosEvents();
      }

      function initHinosUI() {
        loadHinosState();
        renderHinosStudentSelect();
        syncHinosAfinaçãoFromInstrument(currentInstrument);
        hinosLastSyncInstrumentId = currentInstrument.id;
        refreshHinosVoiceButtons();
      }

      /** Ponte para `hinos-events.js` (handlers permanecem no escopo do app). */
      window.HinosBindingAccess = {
        onStudentSelectChange: function (id) {
          hinosState.activeStudentId = id;
          saveHinosState();
          syncHinosActiveStudentVozUI();
          refreshHinosVoiceButtons();
        },
        onActiveStudentVozChange: function (value) {
          var st = getActiveHinosStudent();
          if (!st) return;
          var v = value;
          if (HINOS_VOZES.indexOf(v) === -1) return;
          st.vozPrincipal = v;
          saveHinosState();
          refreshHinosVoiceButtons();
        },
        tryAddStudentFromModal: function () {
          var inp = document.getElementById('hinosNewStudentName');
          var vozSel = document.getElementById('hinosNewStudentVoz');
          var name = inp && inp.value ? inp.value.trim() : '';
          if (!name) {
            setMessage('Digite o nome do aluno.');
            return;
          }
          var voz = vozSel && vozSel.value ? vozSel.value : 'S';
          if (HINOS_VOZES.indexOf(voz) === -1) voz = 'S';
          var st = { id: hinosGenerateId(), name: name, vozPrincipal: voz, hinos: { do: {}, mib: {}, sib: {} } };
          ensureStudentHinosShape(st);
          hinosState.students.push(st);
          hinosState.activeStudentId = st.id;
          saveHinosState();
          if (inp) inp.value = '';
          closeHinosNewStudentModal();
          renderHinosStudentSelect();
          refreshHinosVoiceButtons();
          setMessage('Aluno adicionado: ' + name + '.');
        },
        removeActiveStudentIfConfirmed: function () {
          var st = getActiveHinosStudent();
          if (!st) return;
          if (!window.confirm('Remover o aluno "' + (st.name || '') + '" e todo o progresso de hinos dele neste aparelho?')) return;
          hinosState.students = hinosState.students.filter(function (s) { return s.id !== st.id; });
          hinosState.activeStudentId = hinosState.students.length ? hinosState.students[0].id : null;
          saveHinosState();
          renderHinosStudentSelect();
          refreshHinosVoiceButtons();
        },
        exportBackup: function () {
          exportHinosBackup();
        },
        onImportBackupText: function (text) {
          try {
            var parsed = parseHinosBackupJson(text);
            var merge = !window.confirm(
              'Substituir todos os alunos e o progresso deste aparelho pelos dados do arquivo?\n\n' +
                'OK = substituir tudo pelo backup.\n' +
                'Cancelar = mesclar: mantém alunos que não estão no arquivo e atualiza quem tiver o mesmo ID.'
            );
            applyHinosBackupImport(parsed, merge ? 'merge' : 'replace');
            setMessage(merge ? 'Backup mesclado com os dados locais.' : 'Backup importado: dados substituídos.');
          } catch (e) {
            setMessage('Não foi possível importar: ' + (e && e.message ? e.message : 'arquivo inválido.'));
          }
        },
        onImportBackupReadError: function () {
          setMessage('Não foi possível ler o arquivo.');
        },
        onAfinaçãoTabClick: function (afin) {
          setHinosAfinaçãoTab(afin);
          refreshHinosVoiceButtons();
        },
        onHinoPrev: function (numIn) {
          if (hinosIsCoroKey(hinosSelectedKey)) return;
          var n = clampHinoNum(parseInt(numIn.value, 10) - 1);
          hinosSelectedKey = String(n);
          numIn.value = String(n);
          refreshHinosVoiceButtons();
        },
        onHinoNext: function (numIn) {
          if (hinosIsCoroKey(hinosSelectedKey)) return;
          var n = clampHinoNum(parseInt(numIn.value, 10) + 1);
          hinosSelectedKey = String(n);
          numIn.value = String(n);
          refreshHinosVoiceButtons();
        },
        onHinoNumChange: function (numIn) {
          var n = clampHinoNum(numIn.value);
          hinosSelectedKey = String(n);
          numIn.value = String(n);
          refreshHinosVoiceButtons();
        },
        onVoiceButtonClick: function (v) {
          if (!v) return;
          if (toggleHinosVoice(v)) closeHinosEditorModal();
        },
        onStudyFlagClick: function (flag) {
          toggleHinosStudyFlag(flag);
        },
        clearCurrentHinoVoices: function () {
          clearCurrentHinoVoices();
        },
        closeEditorModal: function () {
          closeHinosEditorModal();
        },
        closeNewStudentModal: function () {
          closeHinosNewStudentModal();
        },
        openNewStudentModal: function () {
          openHinosNewStudentModal();
        },
        onDocumentEscapeKey: function (e) {
          var newM = document.getElementById('hinosNewStudentModal');
          if (newM && !newM.classList.contains('hidden')) {
            e.preventDefault();
            closeHinosNewStudentModal();
            return;
          }
          var m = document.getElementById('hinosEditorModal');
          if (m && !m.classList.contains('hidden')) {
            e.preventDefault();
            closeHinosEditorModal();
          }
        }
      };

      // Coordenadas manuais do solfejo por imagem/mão.
      // Formato: chave "N-lado" -> array com N ou mais pontos:
      // [ponto1, ponto2, ...]
      // Sem "preparacao". O loop é: 1 -> 2 -> ... -> N -> 1.
      // Cada ponto usa coordenadas normalizadas (0..1) no tamanho natural da imagem.
      // Exemplo: x=0.5 / y=0.5 = centro da imagem.
      //
      // Ajuste manualmente estes valores para alinhar a ponta do dedo exatamente nas bolinhas.
      const SOLFEJO_MANUAL_POINTS = {
        '2-direita': [
          
        { x: 0.48, y: 0.72 }, // ponto 1
        { x: 0.70, y: 0.50 }, // ponto 1
        { x: 0.65, y: 0.22 }, // ponto 1
        { x: 0.48, y: 0.32 },  // ponto 2
        { x: 0.40, y: 0.22 },  // ponto 2
        { x: 0.42, y: 0.22 }  // ponto 2
          
        ],
        '2-esquerda': [
        { x: 0.50, y: 0.72}, //  ponto 1 
        { x: 0.35, y: 0.50 }, // ponto 1
        { x: 0.31, y: 0.22 }, // ponto 1

        { x: 0.48, y: 0.32 },  // ponto 2
        { x: 0.58, y: 0.24 },  // ponto 2
        { x: 0.50, y: 0.22} //  ponto 2

        ],
        '3-direita': [
          { x: 0.41, y: 0.71 }, //1
          { x: 0.55, y: 0.51 }, //1
          { x: 0.61, y: 0.48 }, //1
                   
          { x: 0.77, y: 0.54}, //2
          { x: 0.67, y: 0.29}, //2
          { x: 0.58, y: 0.25}, //2

          { x: 0.46, y: 0.34}, //3
          { x: 0.44, y: 0.20}, //3
          { x: 0.44, y: 0.71}, //3
           
        ],
        '3-esquerda': [
          { x: 0.59, y: 0.74 }, //1
          { x: 0.47, y: 0.55 }, //1
          { x: 0.37, y: 0.48 }, //1
                   
          { x: 0.23, y: 0.57}, //2
          { x: 0.28, y: 0.33}, //2
          { x: 0.41, y: 0.26}, //2
          

          { x: 0.55, y: 0.37}, //3
          { x: 0.58, y: 0.28}, //3
          { x: 0.54, y: 0.20}, //3
          
          
        ],
        '4-direita': [
          { x: 0.50, y: 0.73 }, //1
          { x: 0.44, y: 0.55 }, //1
          { x: 0.32, y: 0.52 }, //1
                   
          { x: 0.16, y: 0.58}, //2
          { x: 0.41, y: 0.42}, //2
          { x: 0.70, y: 0.42}, //2
          

          { x: 0.82, y: 0.49}, //3
          { x: 0.72, y: 0.26}, //3
          { x: 0.60, y: 0.25}, //3

          { x: 0.52, y: 0.33}, //4
          { x: 0.51, y: 0.28}, //4
          { x: 0.54, y: 0.20}, //4
        ],
        '4-esquerda': [
          { x: 0.46, y: 0.73 }, //1
          { x: 0.57, y: 0.52 }, //1
          { x: 0.70, y: 0.54 }, //1
                   
          { x: 0.80, y: 0.58}, //2
          { x: 0.48, y: 0.40}, //2
          { x: 0.32, y: 0.41}, //2
          

          { x: 0.16, y: 0.49}, //3
          { x: 0.22, y: 0.33}, //3
          { x: 0.33, y: 0.28}, //3

          { x: 0.44, y: 0.33}, //4
          { x: 0.45, y: 0.24}, //4
          { x: 0.43, y: 0.20}, //4
        ],
        '6-direita': [

          { x: 0.49, y: 0.74 }, //1
          { x: 0.45, y: 0.64 }, //1
          { x: 0.38, y: 0.63 }, //1
                   
          { x: 0.30, y: 0.68}, //2
          { x: 0.25, y: 0.58}, //2
          { x: 0.20, y: 0.54}, //2
          
          { x: 0.12, y: 0.60}, //3
          { x: 0.35, y: 0.44}, //3
          { x: 0.63, y: 0.45}, //3

          { x: 0.74, y: 0.55}, //4
          { x: 0.79, y: 0.46}, //4
          { x: 0.83, y: 0.46}, //4

          { x: 0.89, y: 0.51}, //5
          { x: 0.78, y: 0.26}, //5
          { x: 0.63, y: 0.28}, //5

          { x: 0.57, y: 0.35}, //6
          { x: 0.49, y: 0.20}, //6
          { x: 0.50, y: 0.50}, //6
        ],
        '6-esquerda': [
          { x: 0.49, y: 0.74 }, //1
          { x: 0.54, y: 0.64 }, //1
          { x: 0.64, y: 0.65 }, //1
                   
          { x: 0.69, y: 0.67}, //2
          { x: 0.73, y: 0.58}, //2
          { x: 0.78, y: 0.54}, //2
          
          { x: 0.87, y: 0.60}, //3
          { x: 0.63, y: 0.44}, //3
          { x: 0.40, y: 0.43}, //3

          { x: 0.24, y: 0.54}, //4
          { x: 0.20, y: 0.46}, //4
          { x: 0.14, y: 0.47}, //4

          { x: 0.08, y: 0.51}, //5
          { x: 0.18, y: 0.27}, //5
          { x: 0.35, y: 0.31}, //5

          { x: 0.40, y: 0.34}, //6
          { x: 0.49, y: 0.20}, //6
          { x: 0.46, y: 0.18}, //6
        ],
        '9-direita': [
          { x: 0.46, y: 0.73 }, //1
          { x: 0.41, y: 0.63 }, //1
          { x: 0.32, y: 0.60 }, //1

          { x: 0.29, y: 0.66}, //2
          { x: 0.23, y: 0.58}, //2
          { x: 0.16, y: 0.57}, //2
          

          { x: 0.12, y: 0.60}, //3
          { x: 0.37, y: 0.50}, //3
          { x: 0.50, y: 0.54}, //3

          { x: 0.62, y: 0.58}, //4
          { x: 0.66, y: 0.52}, //4
          { x: 0.69, y: 0.53}, //4

          { x: 0.74, y: 0.55}, //5
          { x: 0.79, y: 0.50}, //5
          { x: 0.81, y: 0.51}, //5

          { x: 0.87, y: 0.52}, //6
          { x: 0.84, y: 0.38}, //6
          { x: 0.78, y: 0.33}, //6

          { x: 0.73, y: 0.36}, //7
          { x: 0.70, y: 0.26}, //7
          { x: 0.65, y: 0.27}, //7

          { x: 0.60, y: 0.33}, //8
          { x: 0.55, y: 0.24}, //8
          { x: 0.50, y: 0.25}, //8

          { x: 0.44, y: 0.29}, //9
          { x: 0.42, y: 0.24}, //9
          { x: 0.44, y: 0.20}, //9

          
        ],
        '9-esquerda': [
          { x: 0.53, y: 0.71 }, //1
          { x: 0.58, y: 0.62 }, //1
          { x: 0.63, y: 0.61 }, //1

          { x: 0.69, y: 0.66}, //2
          { x: 0.74, y: 0.58}, //2
          { x: 0.80, y: 0.57}, //2

          { x: 0.85, y: 0.60}, //3
          { x: 0.63, y: 0.49}, //3
          { x: 0.50, y: 0.51}, //3

          { x: 0.36, y: 0.57}, //4
          { x: 0.32, y: 0.52}, //4
          { x: 0.29, y: 0.52}, //4

          { x: 0.23, y: 0.55}, //5
          { x: 0.18, y: 0.48}, //5
          { x: 0.13, y: 0.50}, //5

          { x: 0.09, y: 0.52}, //6
          { x: 0.11, y: 0.38}, //6
          { x: 0.16, y: 0.30}, //6

          { x: 0.24, y: 0.36}, //7
          { x: 0.28, y: 0.26}, //7
          { x: 0.32, y: 0.27}, //7

          { x: 0.38, y: 0.32}, //8
          { x: 0.41, y: 0.23}, //8
          { x: 0.49, y: 0.25}, //8

          { x: 0.52, y: 0.28}, //9
          { x: 0.55, y: 0.23}, //9
          { x: 0.54, y: 0.20}, //9
        ],
        '12-direita': [
         { x: 0.51, y: 0.79 }, //1
         { x: 0.55, y: 0.74 }, //1
                   
         { x: 0.60, y: 0.78}, //2
         { x: 0.64, y: 0.70}, //2

         { x: 0.70, y: 0.77}, //3
         { x: 0.54, y: 0.64}, //3

         { x: 0.39, y: 0.70}, //4
         { x: 0.35, y: 0.65}, //4

         { x: 0.30, y: 0.69}, //5
         { x: 0.28, y: 0.60}, //5

         { x: 0.22, y: 0.67}, //6
         { x: 0.40, y: 0.49}, //6

         { x: 0.67, y: 0.60}, //7
         { x: 0.71, y: 0.54}, //7

         { x: 0.76, y: 0.58}, //8
         { x: 0.81, y: 0.52}, //8

         { x: 0.87, y: 0.55}, //9
         { x: 0.52, y: 0.37}, //9

          { x: 0.35, y: 0.38}, //10
          { x: 0.50, y: 0.30}, //10

          { x: 0.64, y: 0.34}, //11
          { x: 0.60, y: 0.22}, //11

          { x: 0.48, y: 0.25}, //12
          { x: 0.47, y: 0.20}, //12
          
        ],
        '12-esquerda': [
         { x: 0.49, y: 0.80 }, //1
         { x: 0.45, y: 0.74 }, //1
                   
         { x: 0.41, y: 0.78}, //2
         { x: 0.37, y: 0.70}, //2

         { x: 0.31, y: 0.77}, //3
         { x: 0.54, y: 0.64}, //3

         { x: 0.64, y: 0.70}, //4
         { x: 0.67, y: 0.65}, //4

         { x: 0.72, y: 0.69}, //5
         { x: 0.74, y: 0.60}, //5

         { x: 0.81, y: 0.67}, //6
         { x: 0.65, y: 0.49}, //6

         { x: 0.35, y: 0.60}, //7
         { x: 0.30, y: 0.52}, //7

         { x: 0.25, y: 0.58}, //8
         { x: 0.20, y: 0.50}, //8

         { x: 0.15, y: 0.55}, //9
         { x: 0.50, y: 0.37}, //9

          { x: 0.69, y: 0.38}, //10
          { x: 0.49, y: 0.30}, //10

          { x: 0.37, y: 0.34}, //11
          { x: 0.42, y: 0.21}, //11

          { x: 0.52, y: 0.24}, //12
          { x: 0.55, y: 0.15}, //12
        ]
      };

      const CLAVES = [
        { id: 'sol', nome: 'Sol', simbolo: '𝄞', fontSize: '74', y: '116', x: '18', anchor: 'start', baseline: 'alphabetic' },
        // Clave de Dó (alto): o centro da clave marca o Dó na 3a linha.
        { id: 'do', nome: 'Dó', simbolo: '𝄡', fontSize: '50', y: '105.5', x: '50', anchor: 'middle', baseline: 'middle' },
        // Clave de Fá: os dois pontos devem "abraçar" a 4a linha (Fá).
        { id: 'fa', nome: 'Fá', simbolo: '𝄢', fontSize: '53', y: '103.5', x: '60', anchor: 'middle', baseline: 'middle' }
      ];

      const CLEF_BOTTOM_LINE = {
        sol: { noteId: 'mi', octave: 4 }, // Mi4 na 1a linha inferior
        do: { noteId: 'fa', octave: 3 },  // F3 na 1a linha inferior -> 3a linha = Dó4
        fa: { noteId: 'sol', octave: 2 }  // G2 na 1a linha inferior -> 4a linha = Fá3, 5a = Lá3
      };

      const NOTE_DEGREE = { do: 0, re: 1, mi: 2, fa: 3, sol: 4, la: 5, si: 6 };
      const DEGREE_NOTE_ID = ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
      const NOTE_SEMITONE = { do: 0, re: 2, mi: 4, fa: 5, sol: 7, la: 9, si: 11 };

      // ========== INICIALIZAÇÃO DO ÁUDIO ==========
      function getAudioContext() {
        if (!audioCtx) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
      }

      /** Converte frequência (Hz) em nome da nota MIDI (ex.: 440 -> 'A4'). */
      function freqToMidiNoteName(freq) {
        var midi = Math.round(69 + 12 * Math.log2(freq / 440));
        midi = Math.max(0, Math.min(127, midi));
        var names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return names[midi % 12] + Math.floor(midi / 12);
      }

      /**
       * Formantes base (neutro) + ajuste “voz feminina / mais aguda” no timbre (não muda a afinação da nota).
       */
      function vowelFormantsForPitchClass(pc) {
        var rows = [
          { f1: 780, bw1: 130, f2: 1180, bw2: 200, w1: 0.62, w2: 0.48, br: 0.42 },
          { f1: 520, bw1: 110, f2: 1680, bw2: 240, w1: 0.5, w2: 0.62, br: 0.35 },
          { f1: 520, bw1: 115, f2: 1760, bw2: 250, w1: 0.52, w2: 0.6, br: 0.34 },
          { f1: 360, bw1: 100, f2: 2200, bw2: 280, w1: 0.42, w2: 0.72, br: 0.38 },
          { f1: 300, bw1: 95, f2: 2320, bw2: 300, w1: 0.38, w2: 0.78, br: 0.4 },
          { f1: 720, bw1: 140, f2: 1120, bw2: 190, w1: 0.65, w2: 0.46, br: 0.44 },
          { f1: 580, bw1: 120, f2: 920, bw2: 170, w1: 0.58, w2: 0.5, br: 0.36 },
          { f1: 540, bw1: 125, f2: 880, bw2: 165, w1: 0.56, w2: 0.52, br: 0.35 },
          { f1: 470, bw1: 105, f2: 1080, bw2: 210, w1: 0.48, w2: 0.58, br: 0.33 },
          { f1: 760, bw1: 135, f2: 1200, bw2: 195, w1: 0.64, w2: 0.5, br: 0.45 },
          { f1: 380, bw1: 105, f2: 2100, bw2: 290, w1: 0.44, w2: 0.7, br: 0.37 },
          { f1: 320, bw1: 100, f2: 2240, bw2: 300, w1: 0.4, w2: 0.76, br: 0.39 }
        ];
        var base = rows[((pc % 12) + 12) % 12];
        var f1 = Math.min(960, base.f1 * 1.09);
        var f2 = Math.min(2900, base.f2 * 1.11);
        var f3 = Math.min(3800, Math.max(2680, f2 * 1.36 + 180));
        return {
          f1: f1,
          bw1: Math.max(80, base.bw1 * 0.9),
          f2: f2,
          bw2: Math.max(150, base.bw2 * 0.88),
          f3: f3,
          bw3: Math.max(280, Math.min(520, f3 * 0.13 + 120)),
          w1: base.w1 * 0.93,
          w2: Math.min(0.88, base.w2 * 1.06),
          w3: Math.min(0.33, 0.22 + Math.min(0.1, Math.max(0, f2 - 1000) / 8000)),
          br: base.br * 0.9
        };
      }

      /**
       * “Laaaa / miii” sem TTS: pulso suave (triângulo) + sopro no ataque + dois formantes em paralelo (bandpass largo).
       */
      function schedulePlayerSungSolfejo(ctx, startAtCtx, freqHz, durationSec, playbackToken) {
        if (!ctx || !soundEnabled) return;
        if (playbackToken !== playerPlayToken || !playerPlayback.isPlaying) return;
        if (!freqHz || !isFinite(freqHz) || freqHz <= 0) return;

        var f = Math.max(90, Math.min(1800, freqHz));
        var dur = Math.max(0.16, Math.min(durationSec || 0.35, 5));
        var midi = Math.round(69 + 12 * Math.log2(f / 440));
        midi = Math.max(0, Math.min(127, midi));
        var pc = ((midi % 12) + 12) % 12;
        var fm = vowelFormantsForPitchClass(pc);

        var atk = Math.min(0.32, Math.max(0.08, dur * 0.24));
        var rel = Math.min(0.42, Math.max(0.1, dur * 0.26));
        var sustain = Math.max(0.05, dur - atk - rel);
        var endT = startAtCtx + atk + sustain + rel + 0.06;

        var peak = (calmMode ? 0.36 : 0.5) * INSTRUMENT_OUTPUT_GAIN;
        if (peak > 0.68) peak = 0.68;

        var master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, startAtCtx);
        master.gain.exponentialRampToValueAtTime(peak, startAtCtx + atk);
        master.gain.setValueAtTime(peak * 0.88, startAtCtx + atk + sustain);
        master.gain.exponentialRampToValueAtTime(0.0001, startAtCtx + atk + sustain + rel);

        function qFromBw(centerHz, bwHz) {
          var bw = Math.max(40, bwHz);
          var c = Math.max(80, centerHz);
          return Math.max(0.9, Math.min(4.5, c / bw));
        }

        // --- Excitação periódica (menos “pure tone” que senoides + peaking) ---
        var tri1 = ctx.createOscillator();
        tri1.type = 'triangle';
        tri1.frequency.setValueAtTime(f, startAtCtx);

        var tri2 = ctx.createOscillator();
        tri2.type = 'triangle';
        tri2.frequency.setValueAtTime(f * 2, startAtCtx);
        var gTri2 = ctx.createGain();
        gTri2.gain.value = 0.095;

        var tri3 = ctx.createOscillator();
        tri3.type = 'triangle';
        tri3.frequency.setValueAtTime(f * 3, startAtCtx);
        var gTri3 = ctx.createGain();
        gTri3.gain.value = 0.038;

        var buzzMix = ctx.createGain();
        buzzMix.gain.value = 1;
        tri1.connect(buzzMix);
        tri2.connect(gTri2);
        gTri2.connect(buzzMix);
        tri3.connect(gTri3);
        gTri3.connect(buzzMix);

        var buzzLp = ctx.createBiquadFilter();
        buzzLp.type = 'lowpass';
        buzzLp.frequency.setValueAtTime(Math.min(5200, Math.max(1900, f * 10)), startAtCtx);
        buzzLp.Q.value = 0.65;
        buzzMix.connect(buzzLp);

        // --- Sopro (ruído) forte no começo, depois baixo — ajuda “fala” sem virar oboé ---
        var nLen = Math.min(48000, Math.max(8000, Math.ceil(ctx.sampleRate * Math.min(0.55, dur + 0.12))));
        var nBuf = ctx.createBuffer(1, nLen, ctx.sampleRate);
        var nd = nBuf.getChannelData(0);
        var zi;
        for (zi = 0; zi < nLen; zi++) nd[zi] = (Math.random() * 2 - 1) * 0.42;
        var noise = ctx.createBufferSource();
        noise.buffer = nBuf;
        noise.loop = false;

        var nHp = ctx.createBiquadFilter();
        nHp.type = 'highpass';
        nHp.frequency.value = 440;
        nHp.Q.value = 0.65;
        var nLp = ctx.createBiquadFilter();
        nLp.type = 'lowpass';
        nLp.frequency.value = 7800;
        nLp.Q.value = 0.7;
        noise.connect(nHp);
        nHp.connect(nLp);

        var breathGain = ctx.createGain();
        breathGain.gain.setValueAtTime(0.0001, startAtCtx);
        breathGain.gain.exponentialRampToValueAtTime(fm.br * (calmMode ? 0.85 : 1), startAtCtx + Math.min(0.07, atk * 0.45));
        breathGain.gain.exponentialRampToValueAtTime(fm.br * 0.22, startAtCtx + atk + 0.02);
        breathGain.gain.setValueAtTime(fm.br * 0.18, startAtCtx + atk + sustain * 0.5);
        breathGain.gain.exponentialRampToValueAtTime(0.0001, startAtCtx + atk + sustain + rel);
        nLp.connect(breathGain);

        var excite = ctx.createGain();
        excite.gain.value = 1;
        buzzLp.connect(excite);
        breathGain.connect(excite);

        var bp1 = ctx.createBiquadFilter();
        bp1.type = 'bandpass';
        bp1.frequency.value = fm.f1;
        bp1.Q.value = qFromBw(fm.f1, fm.bw1);

        var bp2 = ctx.createBiquadFilter();
        bp2.type = 'bandpass';
        bp2.frequency.value = fm.f2;
        bp2.Q.value = qFromBw(fm.f2, fm.bw2);

        var bp3 = ctx.createBiquadFilter();
        bp3.type = 'bandpass';
        bp3.frequency.value = fm.f3;
        bp3.Q.value = qFromBw(fm.f3, fm.bw3);

        var w1 = ctx.createGain();
        w1.gain.value = fm.w1;
        var w2 = ctx.createGain();
        w2.gain.value = fm.w2;
        var w3 = ctx.createGain();
        w3.gain.value = fm.w3;

        var formantSum = ctx.createGain();
        formantSum.gain.value = 1;
        excite.connect(bp1);
        excite.connect(bp2);
        excite.connect(bp3);
        bp1.connect(w1);
        bp2.connect(w2);
        bp3.connect(w3);
        w1.connect(formantSum);
        w2.connect(formantSum);
        w3.connect(formantSum);

        var body = ctx.createBiquadFilter();
        body.type = 'peaking';
        body.frequency.value = 2550;
        body.Q.value = 0.72;
        body.gain.value = calmMode ? 2.0 : 3.4;

        formantSum.connect(body);
        body.connect(master);
        master.connect(ctx.destination);

        var vibStart = startAtCtx + Math.min(atk * 0.55, 0.1);
        var lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(5.1, startAtCtx);
        var lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0, startAtCtx);
        lfoGain.gain.linearRampToValueAtTime(calmMode ? 13 : 19, vibStart + 0.06);
        lfo.connect(lfoGain);
        lfoGain.connect(tri1.detune);

        var nodes = [
          tri1, tri2, tri3, gTri2, gTri3, buzzMix, buzzLp, noise, nHp, nLp, breathGain,
          excite, bp1, bp2, bp3, w1, w2, w3, formantSum, body, master, lfo, lfoGain
        ];

        try {
          tri1.start(startAtCtx);
          tri2.start(startAtCtx);
          tri3.start(startAtCtx);
          noise.start(startAtCtx);
          lfo.start(startAtCtx);
          tri1.stop(endT);
          tri2.stop(endT);
          tri3.stop(endT);
          noise.stop(endT);
          lfo.stop(endT);
        } catch (eStart) {
          return;
        }

        playerPlayback.activeStops.push(function (now) {
          var t = typeof now === 'number' ? now : ctx.currentTime;
          try {
            master.gain.cancelScheduledValues(t);
            master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), t);
            master.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
          } catch (eG) {}
          try {
            tri1.stop(t + 0.05);
            tri2.stop(t + 0.05);
            tri3.stop(t + 0.05);
            noise.stop(t + 0.05);
            lfo.stop(t + 0.05);
          } catch (eS) {}
          setTimeout(function () {
            nodes.forEach(function (n) {
              try {
                n.disconnect();
              } catch (eD) {}
            });
          }, 140);
        });
      }

      /** Opções de reprodução para deixar o timbre menos "seco". */
      function buildSoundfontPlayOptions(durationSec, gainValue) {
        var g =
          (typeof gainValue === 'number' && isFinite(gainValue) ? gainValue : 0.5) *
          INSTRUMENT_OUTPUT_GAIN;
        if (g > 0.95) g = 0.95;
        return {
          duration: durationSec,
          gain: g,
          attack: 0.004,
          release: 0.22
        };
      }

      /** Ajusta a frequência conforme a tonalidade: sustenido = +1 semitom, bemol = -1 semitom. */
      function getFreqInKey(noteId, baseFreq, key) {
        if (!key || !baseFreq) return baseFreq;
        if (key.sustenidos && key.sustenidos.indexOf(noteId) >= 0)
          return baseFreq * Math.pow(2, 1 / 12);
        if (key.bemolis && key.bemolis.indexOf(noteId) >= 0)
          return baseFreq * Math.pow(2, -1 / 12);
        return baseFreq;
      }

      /** Carrega o instrumento (amostras reais) do soundfont MusyngKite. */
      function loadInstrument(instrumentId) {
        var inst = INSTRUMENTOS.find(function(i) { return i.id === instrumentId; });
        if (!inst) return Promise.resolve(null);
        
        if (instrumentLoadPromises[instrumentId]) {
          return instrumentLoadPromises[instrumentId];
        }
        
        var ctx = getAudioContext();
        if (typeof Soundfont === 'undefined') {
          instrumentLoadPromises[instrumentId] = Promise.resolve(null);
          return instrumentLoadPromises[instrumentId];
        }

        instrumentLoadPromises[instrumentId] = Soundfont.instrument(ctx, inst.soundfont, {
          from: 'https://gleitz.github.io/midi-js-soundfonts/MusyngKite/'
        }).then(function (loadedInst) {
          return loadedInst;
        }).catch(function () {
          return null;
        });
        
        return instrumentLoadPromises[instrumentId];
      }

      /** Fallback: som por síntese (duração fixa). */
      function playNoteSoundFallback(freq) {
        var ctx = getAudioContext();
        var now = ctx.currentTime;
        var vol = (calmMode ? 0.12 : 0.25) * INSTRUMENT_OUTPUT_GAIN;
        if (vol > 0.38) vol = 0.38;
        var osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        var g = ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(vol, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.75);
      }

      function playGameSfx(type) {
        if (!soundEnabled) return;
        var ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();
        var now = ctx.currentTime;
        var baseVol = calmMode ? 0.07 : 0.14;

        function tone(freq, startOffset, duration, wave) {
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.type = wave || 'triangle';
          osc.frequency.setValueAtTime(freq, now + startOffset);
          g.gain.setValueAtTime(0.0001, now + startOffset);
          g.gain.exponentialRampToValueAtTime(baseVol, now + startOffset + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + startOffset);
          osc.stop(now + startOffset + duration + 0.01);
        }

        if (type === 'correct') {
          tone(523.25, 0.00, 0.10, 'triangle'); // C5
          tone(659.25, 0.11, 0.12, 'triangle'); // E5
          tone(783.99, 0.24, 0.14, 'triangle'); // G5
        } else if (type === 'wrong') {
          tone(329.63, 0.00, 0.10, 'sawtooth'); // E4
          tone(277.18, 0.10, 0.12, 'sawtooth'); // C#4
          tone(220.00, 0.22, 0.16, 'sawtooth'); // A3
        }
      }

      /** Para a nota que está tocando sustentada (enquanto o botão está pressionado). */
      function stopNoteSound() {
        if (currentSustainedNoteStop) {
          try { currentSustainedNoteStop(); } catch (e) {}
          currentSustainedNoteStop = null;
        }
        Object.keys(activePointerNotes).forEach(function (pid) {
          var p = activePointerNotes[pid];
          if (!p) return;
          if (p.cancelInit) {
            try { p.cancelInit(); } catch (e) {}
          }
          if (p.stop) {
            try { p.stop(); } catch (e) {}
          }
          if (p.cell) p.cell.classList.remove('playing');
        });
        activePointerNotes = {};
      }

      /**
       * Inicia a nota em modo sustentado: toca enquanto não chamar stopNoteSound().
       * Usado quando o botão fica pressionado.
       */
      function startNoteSound(noteId, freqHz) {
        if (!soundEnabled) return;
        stopNoteSound();
        var nota = NOTAS.find(function (n) { return n.id === noteId; });
        if (!nota) return;
        var freq = (freqHz != null && freqHz > 0) ? freqHz : nota.freq;
        freq = getFreqInKey(noteId, freq, currentKey);

        var ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        loadInstrument(currentInstrument.id).then(function (inst) {
          if (inst) {
            var noteName = freqToMidiNoteName(freq);
            var note = inst.play(noteName, 0, buildSoundfontPlayOptions(60, calmMode ? 0.36 : 0.58));
            if (note && typeof note.stop === 'function') {
              currentSustainedNoteStop = function () { note.stop(ctx.currentTime); };
            }
          } else {
            var now = ctx.currentTime;
            var vol = (calmMode ? 0.12 : 0.25) * INSTRUMENT_OUTPUT_GAIN;
            if (vol > 0.38) vol = 0.38;
            var osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            var g = ctx.createGain();
            g.gain.setValueAtTime(0, now);
            g.gain.linearRampToValueAtTime(vol, now + 0.05);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(now);
            currentSustainedNoteStop = function () {
              var t = ctx.currentTime;
              g.gain.linearRampToValueAtTime(0, t + 0.05);
              osc.stop(t + 0.06);
            };
          }
        }).catch(function () {
          var now = ctx.currentTime;
          var vol = (calmMode ? 0.12 : 0.25) * INSTRUMENT_OUTPUT_GAIN;
          if (vol > 0.38) vol = 0.38;
          var osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          var g = ctx.createGain();
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(vol, now + 0.05);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          currentSustainedNoteStop = function () {
            var t = ctx.currentTime;
            g.gain.linearRampToValueAtTime(0, t + 0.05);
            osc.stop(t + 0.06);
          };
        });
      }

      /** Inicia nota sustentada por ponteiro (suporta múltiplos toques). */
      function startNoteSoundForPointer(noteId, freqHz, onReady) {
        if (!soundEnabled) return function () {};
        var nota = NOTAS.find(function (n) { return n.id === noteId; });
        if (!nota) return function () {};
        var freq = (freqHz != null && freqHz > 0) ? freqHz : nota.freq;
        freq = getFreqInKey(noteId, freq, currentKey);
        var ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        var cancelled = false;
        var stopFn = null;
        function setStop(fn) {
          if (cancelled) {
            try { fn(); } catch (e) {}
            return;
          }
          stopFn = fn;
          if (typeof onReady === 'function') onReady(fn);
        }

        loadInstrument(currentInstrument.id).then(function (inst) {
          if (cancelled) return;
          if (inst) {
            var noteName = freqToMidiNoteName(freq);
            var note = inst.play(noteName, 0, buildSoundfontPlayOptions(60, calmMode ? 0.36 : 0.58));
            if (note && typeof note.stop === 'function') {
              setStop(function () { note.stop(ctx.currentTime); });
            }
          } else {
            var now = ctx.currentTime;
            var vol = (calmMode ? 0.12 : 0.25) * INSTRUMENT_OUTPUT_GAIN;
            if (vol > 0.38) vol = 0.38;
            var osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            var g = ctx.createGain();
            g.gain.setValueAtTime(0, now);
            g.gain.linearRampToValueAtTime(vol, now + 0.05);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(now);
            setStop(function () {
              var t = ctx.currentTime;
              g.gain.linearRampToValueAtTime(0, t + 0.05);
              osc.stop(t + 0.06);
            });
          }
        }).catch(function () {
          if (cancelled) return;
          var now = ctx.currentTime;
          var vol = (calmMode ? 0.12 : 0.25) * INSTRUMENT_OUTPUT_GAIN;
          if (vol > 0.38) vol = 0.38;
          var osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          var g = ctx.createGain();
          g.gain.setValueAtTime(0, now);
          g.gain.linearRampToValueAtTime(vol, now + 0.05);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          setStop(function () {
            var t = ctx.currentTime;
            g.gain.linearRampToValueAtTime(0, t + 0.05);
            osc.stop(t + 0.06);
          });
        });

        return function () {
          cancelled = true;
          if (stopFn) {
            try { stopFn(); } catch (e) {}
            stopFn = null;
          }
        };
      }

      /**
       * Toca a nota por tempo fixo (usado no modo Desafio quando o jogo toca a nota).
       */
      function playNoteSound(noteId, freqHz) {
        if (!soundEnabled) return;
        var nota = NOTAS.find(function (n) { return n.id === noteId; });
        if (!nota) return;
        var freq = (freqHz != null && freqHz > 0) ? freqHz : nota.freq;
        freq = getFreqInKey(noteId, freq, currentKey);

        var ctx = getAudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        loadInstrument(currentInstrument.id).then(function (inst) {
          if (inst) {
            var noteName = freqToMidiNoteName(freq);
            inst.play(noteName, 0, buildSoundfontPlayOptions(1.25, calmMode ? 0.33 : 0.52));
          } else {
            playNoteSoundFallback(freq);
          }
        }).catch(function () {
          playNoteSoundFallback(freq);
        });
      }

      // ========== NARRAÇÃO (WEB SPEECH API) ==========
      function speak(text, force) {
        if (!force && !narrationEnabled) return;
        if (!('speechSynthesis' in window)) return;
        speechSynth = window.speechSynthesis;
        speechSynth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'pt-BR';
        u.rate = 0.9;
        u.pitch = 1;
        u.volume = calmMode ? 0.6 : 1;
        speechSynth.speak(u);
      }

      function repeatInstruction() {
        const msg = document.getElementById('instructionText');
        if (msg && msg.textContent) speak(msg.textContent, true);
      }

      // ========== TRILHA AMBIENTE SUAVE (OPCIONAL) ==========
      function startAmbient() {
        if (!ambientEnabled || !soundEnabled) return;
        const ctx = getAudioContext();
        if (ambientOsc) return;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(calmMode ? 0.02 : 0.04, ctx.currentTime + 1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        ambientOsc = osc;
        ambientGain = gain;
      }

      function stopAmbient() {
        if (!ambientOsc || !ambientGain) return;
        const ctx = getAudioContext();
        ambientGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        ambientOsc.stop(ctx.currentTime + 0.6);
        ambientOsc = null;
        ambientGain = null;
      }

      function toggleAmbient() {
        ambientEnabled = !ambientEnabled;
        const btn = document.getElementById('btnAmbient');
        if (btn) btn.textContent = ambientEnabled ? '🎵 Ambiente ligado' : '🎵 Ambiente';
        if (ambientEnabled) startAmbient(); else stopAmbient();
      }

      function updateFullscreenButton() {
        return window.UiCoreModule.updateFullscreenButton();
      }

      function toggleFullscreen() {
        return window.UiCoreModule.toggleFullscreen();
      }

      // ========== UI: MENSAGEM E MASCOTE ==========
      function setMessage(text) {
        return window.UiCoreModule.setMessage(text);
      }

      function showPositiveFeedback() {
        const mascot = document.getElementById('mascot');
        if (mascot) {
          mascot.classList.add('happy');
          setTimeout(function () { mascot.classList.remove('happy'); }, 800);
        }
        const msg = MENSAGENS_POSITIVAS[Math.floor(Math.random() * MENSAGENS_POSITIVAS.length)];
        setMessage(msg);
        speak(msg);
      }

      // ========== VIOLINO: DESTAQUE DA POSIÇÃO (todas as células com essa nota) ==========
      function highlightViolinPosition(noteId) {
        document.querySelectorAll('.finger-cell[data-note-id="' + noteId + '"]').forEach(function (cell) {
          cell.classList.add('highlight');
        });
      }

      // Destaque apenas uma célula específica no espelho (ex.: nota esperada no desafio).
      // Para cordas usa `data-string-key` e `data-position` para evitar destacar todas as ocorrências da mesma nota.
      function highlightViolinCellByTarget(target) {
        if (!target || !target.id) return;

        var selector = '.finger-cell[data-note-id="' + target.id + '"]';

        if (target.stringKey) selector += '[data-string-key="' + target.stringKey + '"]';
        if (typeof target.pos !== 'undefined' && target.pos !== null) selector += '[data-position="' + String(target.pos) + '"]';

        var cells = document.querySelectorAll(selector);
        if (!cells || cells.length === 0) {
          // Fallback: caso a célula exata não exista (ex.: instrumentos sem string/pos), destaca por nota.
          highlightViolinPosition(target.id);
          return;
        }

        cells.forEach(function (cell) {
          cell.classList.add('highlight');
        });
      }

      function clearViolinHighlight() {
        document.querySelectorAll('.finger-cell.highlight').forEach(function (cell) {
          cell.classList.remove('highlight');
        });
      }

      // ========== TONALIDADE: nome da nota na escala atual (ex.: Fá M → Sib) ==========
      function getNoteNameInKey(noteId, key) {
        return window.NoteUtils.getNoteNameInKey(noteId, key);
      }

      function getNoteName(noteId) {
        return getNoteNameInKey(noteId, currentKey);
      }

      function freqClose(a, b) {
        return window.NoteUtils.freqClose(a, b, 0.5);
      }

      function buildChallengeTargetLabel(target) {
        return window.NoteUtils.buildChallengeTargetLabel(target, currentKey);
      }

      function diatonicValue(noteId, octave) {
        return window.StaffMathUtils.diatonicValue(noteId, octave, NOTE_DEGREE);
      }

      function noteFromDiatonic(value) {
        return window.StaffMathUtils.noteFromDiatonic(value, DEGREE_NOTE_ID);
      }

      function naturalMidi(noteId, octave) {
        return window.StaffMathUtils.naturalMidi(noteId, octave, NOTE_SEMITONE);
      }

      function midiToFreq(midi) {
        return window.StaffMathUtils.midiToFreq(midi);
      }

      function getLedgerLineDiffs(diff) {
        return window.StaffMathUtils.getLedgerLineDiffs(diff);
      }

      function buildStaffPositionsForClef(clefId) {
        var bottom = CLEF_BOTTOM_LINE[clefId] || CLEF_BOTTOM_LINE.sol;
        var bottomDiatonic = diatonicValue(bottom.noteId, bottom.octave);
        var positions = [];
        for (var diff = STAFF_MIN_DIFF; diff <= STAFF_MAX_DIFF; diff++) {
          var current = noteFromDiatonic(bottomDiatonic + diff);
          var midi = naturalMidi(current.noteId, current.octave);
          var y = STAFF_BOTTOM_LINE_Y - (diff * STAFF_STEP_PX);
          var ledgerDiffs = getLedgerLineDiffs(diff);
          var ledgerYs = ledgerDiffs.map(function (ledgerDiff) {
            return STAFF_BOTTOM_LINE_Y - (ledgerDiff * STAFF_STEP_PX);
          });
          positions.push({
            noteId: current.noteId,
            octave: current.octave,
            y: y,
            freq: midiToFreq(midi),
            ledgerYs: ledgerYs
          });
        }
        return positions;
      }

      function updateViolinBoardLabels() {
        document.querySelectorAll('.finger-cell').forEach(function (cell) {
          var noteId = cell.dataset.noteId;
          if (noteId) {
            var noteName = getNoteNameInKey(noteId, currentKey);
            var noteMain = cell.querySelector('.finger-note');
            if (noteMain) {
              noteMain.textContent = noteName;
            } else {
              cell.textContent = noteName;
            }
            var pos = cell.dataset.freq ? ' (freq: ' + Math.round(parseFloat(cell.dataset.freq)) + 'Hz)' : '';
            var fingering = cell.dataset.fingering ? ', ' + cell.dataset.fingering : '';
            cell.setAttribute('aria-label', 'Nota ' + noteName + pos + fingering);
          }
        });
        document.querySelectorAll('.violin-board .string-label').forEach(function (el, i) {
          if (CORDAS && CORDAS[i]) el.textContent = getNoteNameInKey(CORDAS[i], currentKey);
        });
      }

      function createViolinBoard() {
        const board = document.getElementById('violinBoard');
        if (!board) return;
        board.innerHTML = '';
        board.classList.remove('wind-layout');
        
        // Atualiza variáveis globais com o instrumento atual
        CORDAS = currentInstrument.cordas || [];
        CORDA_CLASS = currentInstrument.cordaClasses || {};
        FINGERBOARD = currentInstrument.fingerboard || [];
        FREQ_BOARD = currentInstrument.freqBoard || [];
        
        // Atualiza título
        var titleEl = document.getElementById('instrumentTitle');
        if (titleEl) {
          titleEl.textContent = currentInstrument.descricao || 'Espelho do instrumento';
        }
        
        // Atualiza mascote
        var mascot = document.getElementById('mascot');
        if (mascot) mascot.textContent = currentInstrument.emoji || '🎻';
        
        // Instrumentos de corda: grade de cordas × posições
        if (currentInstrument.tipo === 'corda' && CORDAS.length > 0 && FINGERBOARD.length > 0) {
          board.style.gridTemplateColumns = '40px ' + '1fr '.repeat(5);
          board.style.gridTemplateRows = 'auto '.repeat(CORDAS.length + 1);
          
          // Cabeçalho: posições
          var empty = document.createElement('div');
          empty.className = 'pos-label';
          empty.setAttribute('aria-hidden', 'true');
          board.appendChild(empty);
          
          for (var pos = 4; pos >= 0; pos--) {
            var pl = document.createElement('div');
            pl.className = 'pos-label';
            pl.setAttribute('aria-hidden', 'true');
            pl.textContent = pos;
            board.appendChild(pl);
          }
          
          // Linhas: uma por corda
          for (var s = 0; s < CORDAS.length; s++) {
            var stringKey = CORDAS[s];
            var sl = document.createElement('div');
            sl.className = 'string-label';
            sl.setAttribute('aria-hidden', 'true');
            sl.textContent = getNoteNameInKey(stringKey, currentKey);
            board.appendChild(sl);
            
            for (var pos = 4; pos >= 0; pos--) {
              var noteId = FINGERBOARD[pos][s];
              var freq = FREQ_BOARD[pos] ? FREQ_BOARD[pos][s] : undefined;
              var cell = document.createElement('button');
              cell.type = 'button';
              cell.className = 'finger-cell pos-' + pos + ' ' + (CORDA_CLASS[stringKey] || '');
              cell.dataset.noteId = noteId;
              if (freq) cell.dataset.freq = String(freq);
              cell.dataset.stringKey = stringKey;
              cell.dataset.position = String(pos);
              cell.setAttribute('aria-label', 'Nota ' + getNoteNameInKey(noteId, currentKey) + ', posição ' + pos);
              cell.textContent = getNoteNameInKey(noteId, currentKey);
              board.appendChild(cell);
            }
          }
        }
        // Instrumentos de sopro/metal: teclas/válvulas simples (notas em linha)
        else if ((currentInstrument.tipo === 'sopro' || currentInstrument.tipo === 'metal' || currentInstrument.tipo === 'voz') && currentInstrument.notas) {
          board.classList.add('wind-layout');
          board.style.gridTemplateColumns = '1fr '.repeat(currentInstrument.notas.length);
          board.style.gridTemplateRows = 'auto';
          
          for (var i = 0; i < currentInstrument.notas.length; i++) {
            var noteId = currentInstrument.notas[i];
            var freq = currentInstrument.freqBoard[i] ? currentInstrument.freqBoard[i][0] : NOTAS.find(function(n) { return n.id === noteId; }).freq;
            var fingeringText = currentInstrument.fingeringMap && currentInstrument.fingeringMap[noteId]
              ? currentInstrument.fingeringMap[noteId]
              : 'dedilhado basico';
            var cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'finger-cell pos-' + i;
            cell.dataset.noteId = noteId;
            cell.dataset.freq = String(freq);
            cell.dataset.fingering = fingeringText;
            cell.setAttribute('aria-label', 'Nota ' + getNoteNameInKey(noteId, currentKey) + ', ' + fingeringText);
            cell.innerHTML = '<span class="finger-note">' + getNoteNameInKey(noteId, currentKey) + '</span><span class="finger-meta">' + fingeringText + '</span>';
            board.appendChild(cell);
          }
        }
      }
      
      // ========== SELEÇÃO DE INSTRUMENTO ==========
      function setInstrument(instrumentId) {
        var inst = INSTRUMENTOS.find(function(i) { return i.id === instrumentId; });
        if (!inst) return;
        
        currentInstrument = inst;
        createViolinBoard();
        updateViolinBoardLabels();
        clearViolinHighlight();
        document.getElementById('currentNoteDisplay').textContent = '\u00A0';
        
        // Atualiza botões de instrumentos
        document.querySelectorAll('.instrument-btn').forEach(function (btn) {
          var active = btn.dataset.instrumentId === instrumentId;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        
        var instMsgSuffix = 'Escolha um modo.';
        if (currentMode === 'learn') instMsgSuffix = 'Mantenha pressionado numa nota para ouvir.';
        else if (currentMode === 'player') instMsgSuffix = '';
        if (currentMode !== 'player') {
          setMessage('Instrumento: ' + inst.nome + '. ' + instMsgSuffix);
        }
        if (currentMode === 'hinos') {
          syncHinosAfinaçãoFromInstrument(inst);
          hinosLastSyncInstrumentId = inst.id;
          refreshHinosVoiceButtons();
        }
        if (currentMode === 'player') {
          renderPlayerCatalogControls();
          loadPlayerSelectionFromCatalog(false).catch(function () { });
        }
      }
      
      function createInstrumentButtons() {
        var container = document.getElementById('instrumentTabs');
        if (!container) return;
        container.innerHTML = '';
        
        INSTRUMENTOS.forEach(function (inst) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'instrument-btn' + (inst.id === currentInstrument.id ? ' active' : '');
          btn.dataset.instrumentId = inst.id;
          btn.setAttribute('aria-pressed', inst.id === currentInstrument.id ? 'true' : 'false');
          btn.textContent = inst.emoji + ' ' + inst.nome;
          container.appendChild(btn);
        });
      }

      function updateBottomNavVisibility(forceVisible) {
        return window.UiCoreModule.updateBottomNavVisibility(forceVisible);
      }

      function initBottomNavObserver() {
        var sentinel = document.getElementById('bottomNavSentinel');
        if (!sentinel) return;
        if ('IntersectionObserver' in window) {
          var observer = new IntersectionObserver(function () {
            /* Nunca forçar true/false pelo IO: isIntersecting pode ficar false no fim do scroll em alguns layouts. Só recalcula. */
            updateBottomNavVisibility();
          }, {
            root: null,
            threshold: 0,
            rootMargin: '0px 0px 80px 0px'
          });
          observer.observe(sentinel);
          return;
        }
        updateBottomNavVisibility();
      }

      function setMoreMenuOpen(isOpen) {
        var menu = document.getElementById('modeMoreMenu');
        var btn = document.getElementById('btnMoreMenu');
        if (!menu || !btn) return;
        window.UiCoreModule.toggleClass(menu, 'hidden', !isOpen);
        window.UiCoreModule.setAriaExpanded(btn, isOpen);
      }

      function openSettingsPanel() {
        var modal = document.getElementById('settingsModal');
        var btn = document.getElementById('btnMoreSettings');
        var btnMoreMenu = document.getElementById('btnMoreMenu');
        if (!modal) return;
        setMoreMenuOpen(false);
        modal.classList.remove('hidden');
        if (btnMoreMenu) btnMoreMenu.classList.add('active');
        if (btn) {
          btn.classList.add('active');
          window.UiCoreModule.setAriaExpanded(btn, true);
        }
      }

      function closeSettingsPanel() {
        var modal = document.getElementById('settingsModal');
        var btn = document.getElementById('btnMoreSettings');
        var btnMoreMenu = document.getElementById('btnMoreMenu');
        if (!modal) return;
        modal.classList.add('hidden');
        if (btn) {
          btn.classList.remove('active');
          window.UiCoreModule.setAriaExpanded(btn, false);
        }
        if (btnMoreMenu && currentMode !== 'tuner') btnMoreMenu.classList.remove('active');
      }

      function tunerNoteToMidi(noteName) {
        return window.TunerUtils.noteToMidi(noteName);
      }

      function tunerMidiToName(midi) {
        return window.TunerUtils.midiToName(midi);
      }

      function tunerHumanNoteLabel(noteName) {
        return window.TunerUtils.humanNoteLabel(noteName);
      }

      function tunerHumanNoteWithOctave(noteName) {
        return window.TunerUtils.humanNoteWithOctave(noteName);
      }

      function tunerAdjacentHumanLabels(noteName) {
        return window.TunerUtils.adjacentHumanLabels(noteName);
      }

      function tunerFreqToMidi(freq) {
        return window.TunerUtils.freqToMidi(freq);
      }

      /** Detector com autocorrelacao normalizada, priorizando a fundamental real. */
      function tunerDetectPitch(buf, sampleRate) {
        var size = buf.length;
        if (!size) return -1;
        var rms = 0;
        for (var i = 0; i < size; i++) rms += buf[i] * buf[i];
        rms = Math.sqrt(rms / size);
        if (rms < 0.0018) return -1;

        var minFreq = 35;
        var maxFreq = 1200;
        var minOffset = Math.floor(sampleRate / maxFreq);
        var maxOffset = Math.floor(sampleRate / minFreq);
        if (maxOffset >= size) maxOffset = size - 1;
        if (minOffset < 2) minOffset = 2;
        if (maxOffset <= minOffset) return -1;

        var correlations = new Float32Array(maxOffset + 1);
        var bestOffset = -1;
        var bestCorrelation = 0;
        for (var offset = minOffset; offset <= maxOffset; offset++) {
          var correlation = 0;
          var energy1 = 0;
          var energy2 = 0;
          var samples = size - offset;
          for (var j = 0; j < samples; j++) {
            var a = buf[j];
            var b = buf[j + offset];
            correlation += a * b;
            energy1 += a * a;
            energy2 += b * b;
          }
          var denom = Math.sqrt(energy1 * energy2);
          correlation = denom > 0 ? correlation / denom : 0;
          correlations[offset] = correlation;
          if (correlation > bestCorrelation) {
            bestCorrelation = correlation;
            bestOffset = offset;
          }
        }

        var foundDip = false;
        for (var t = minOffset + 1; t < maxOffset - 1; t++) {
          var corr = correlations[t];
          if (!foundDip) {
            if (corr < 0.65) foundDip = true;
            continue;
          }
          if (corr > 0.78 && corr >= correlations[t - 1] && corr >= correlations[t + 1]) {
            bestOffset = t;
            bestCorrelation = corr;
            break;
          }
        }

        if (bestOffset < 0 || bestCorrelation < 0.68) return -1;

        var refinedOffset = bestOffset;
        if (bestOffset > minOffset && bestOffset < maxOffset) {
          var prevCorr = correlations[bestOffset - 1];
          var currCorr = correlations[bestOffset];
          var nextCorr = correlations[bestOffset + 1];
          var denom2 = prevCorr - 2 * currCorr + nextCorr;
          if (Math.abs(denom2) > 1e-9) {
            refinedOffset = bestOffset + (prevCorr - nextCorr) / (2 * denom2);
          }
        }

        if (!isFinite(refinedOffset) || refinedOffset <= 0) return -1;
        var freq = sampleRate / refinedOffset;
        if (!isFinite(freq) || freq < minFreq || freq > maxFreq) return -1;
        return freq;
      }

      function tunerNormalizeFrequency(freq) {
        var sel = document.getElementById('tunerInstrumentSelect');
        var presetId = sel ? sel.value : 'chromatic';
        var notes = TUNER_PRESETS[presetId] || [];
        return window.TunerUtils.normalizeFrequency(freq, notes, {
          freqToMidi: tunerFreqToMidi,
          midiToFreq: midiToFreq,
          noteToMidi: tunerNoteToMidi,
          presetTargetForFreq: function (f, n, noteToMidiFn, midiToFreqFn) {
            return window.TunerUtils.presetTargetForFreq(f, n, noteToMidiFn, midiToFreqFn);
          }
        });
      }

      function tunerPresetTargetForFreq(freq) {
        var sel = document.getElementById('tunerInstrumentSelect');
        var presetId = sel ? sel.value : 'chromatic';
        var notes = TUNER_PRESETS[presetId] || [];
        return window.TunerUtils.presetTargetForFreq(freq, notes, tunerNoteToMidi, midiToFreq);
      }

      function renderTunerPresetDynamicInfo() {
        var sel = document.getElementById('tunerInstrumentSelect');
        var listEl = document.getElementById('tunerPresetDynamicList');
        if (!sel || !listEl) return;
        var presetId = sel.value || 'chromatic';
        var notes = TUNER_PRESETS[presetId] || [];
        listEl.innerHTML = '';
        if (!notes.length) {
          var empty = document.createElement('span');
          empty.className = 'tuner-preset-dynamic-empty';
          empty.textContent = 'Modo cromático: qualquer nota é válida.';
          listEl.appendChild(empty);
          return;
        }
        notes.forEach(function (noteName) {
          var hz = window.TunerUtils.noteFrequency(noteName, tunerNoteToMidi, midiToFreq);
          if (hz === null) return;
          var chip = document.createElement('span');
          chip.className = 'tuner-preset-dynamic-item';
          var hzText = window.TunerUtils.formatHz(hz, 1);
          chip.textContent = noteName + ' \u00b7 ' + hzText;
          listEl.appendChild(chip);
        });
      }

      function updateTunerUINoSignal() {
        var noteEl = document.getElementById('tunerDetectedNote');
        var statusEl = document.getElementById('tunerStatus');
        var fEl = document.getElementById('tunerFreqValue');
        var tEl = document.getElementById('tunerTargetValue');
        var cEl = document.getElementById('tunerCentsValue');
        var placeholders = window.TunerUtils.noSignalPlaceholders();
        window.UiCoreModule.setText(noteEl, placeholders.note);
        if (statusEl) {
          window.UiCoreModule.replaceStatusClasses(statusEl, ['ok', 'flat', 'sharp'], '');
          statusEl.textContent = placeholders.statusText;
        }
        if (fEl) {
          fEl.textContent = window.TunerUtils.formatHz(tunerLastFreq, 2);
        }
        window.UiCoreModule.setText(tEl, placeholders.target);
        window.UiCoreModule.setText(cEl, placeholders.deviation);
        var idleState = window.TunerUtils.idleUiState();
        tunerLastCents = idleState.cents;
        tunerLastStatus = idleState.status;
        tunerLastNote = idleState.note;
        tunerLastTargetFreq = idleState.targetFreq;
        tunerRawHistory = idleState.rawHistory;
        drawTunerGauge(0, 'idle');
      }

      function resizeCanvasToDisplay(canvas) {
        return window.UiCoreModule.resizeCanvasToDisplay(canvas);
      }

      function getTunerSmoothingConfig() {
        return window.TunerUtils.getSmoothingConfig();
      }

      function tunerMedian(values) {
        return window.TunerUtils.median(values);
      }

      function drawTunerGauge(deviationHz, statusMode) {
        var canvas = document.getElementById('tunerGauge');
        if (!canvas) return;
        resizeCanvasToDisplay(canvas);
        var ctx = canvas.getContext('2d');
        if (!ctx) return;
        var w = canvas.width;
        var h = canvas.height;
        if (w < 60 || h < 60) return;
        ctx.clearRect(0, 0, w, h);
        var s = Math.max(0.2, Math.min(1.6, w / 540));

        var cx = w * 0.5;
        var cy = h * 0.84;
        var radius = Math.min(w * 0.44, h * 0.62);
        var deviationRangeHz = 50;

        function degToRad(deg) {
          return deg * Math.PI / 180;
        }

        // Geometria da regua: -50 (esquerda/baixo) -> 0 (topo) -> +50 (direita/baixo)
        // No canvas, para cruzar pelo topo precisamos usar o angulo final equivalente em 340deg.
        var startAng = degToRad(200);
        var endAng = degToRad(340);
        var span = endAng - startAng;

        // Arco azul (laterais)
        ctx.lineWidth = 9 * s;
        ctx.strokeStyle = '#88b5de';
        var leftEnd = startAng + ((-10 + deviationRangeHz) / (2 * deviationRangeHz)) * span;
        var rightStart = startAng + ((10 + deviationRangeHz) / (2 * deviationRangeHz)) * span;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, startAng, leftEnd, false);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, rightStart, endAng, false);
        ctx.stroke();

        // Faixa afinada central (verde)
        ctx.lineWidth = 9 * s;
        ctx.strokeStyle = '#9ed948';
        ctx.beginPath();
        ctx.arc(cx, cy, radius, leftEnd, rightStart, false);
        ctx.stroke();

        // Leque discreto central (fundo escuro transparente)
        ctx.fillStyle = 'rgba(78, 104, 129, 0.24)';
        ctx.beginPath();
        ctx.moveTo(cx, cy + 2 * s);
        ctx.arc(cx, cy, radius - 32 * s, leftEnd, rightStart, false);
        ctx.closePath();
        ctx.fill();

        // Regua de desvio em Hz: -50 .. 0 .. +50 (de 10 em 10)
        ctx.lineWidth = 1.2 * s;
        ctx.font = '700 ' + Math.round(9 * s) + 'px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (var t = -deviationRangeHz; t <= deviationRangeHz; t += 10) {
          var normalizedTick = (t + deviationRangeHz) / (2 * deviationRangeHz);
          var a = startAng + normalizedTick * span;
          var x1 = cx + (radius - 1) * Math.cos(a);
          var y1 = cy + (radius - 1) * Math.sin(a);
          var len = t % 50 === 0 ? 12 : Math.abs(t) <= 10 ? 11 : 7;
          var x2 = cx + (radius - len) * Math.cos(a);
          var y2 = cy + (radius - len) * Math.sin(a);
          var isCenterBand = Math.abs(t) <= 10;
          ctx.strokeStyle = isCenterBand ? '#9ed948' : '#88b5de';
          ctx.fillStyle = isCenterBand ? '#9ed948' : '#88b5de';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          if (t % 10 === 0) {
            var lx = cx + (radius + 14) * Math.cos(a);
            var ly = cy + (radius + 14) * Math.sin(a);
            var lab = String(t);
            ctx.fillText(lab, lx, ly);
          }
        }

        // Ponteiro
        var clamped = Math.max(-deviationRangeHz, Math.min(deviationRangeHz, deviationHz));
        var normalized = (clamped + deviationRangeHz) / (2 * deviationRangeHz);
        var ang = startAng + normalized * span;
        var nx = cx + (radius - 16) * Math.cos(ang);
        var ny = cy + (radius - 16) * Math.sin(ang);
        ctx.strokeStyle = '#db2730';
        ctx.lineWidth = 3.2 * s;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        var isInTune = statusMode === 'ok';
        var statusR = 18 * s;
        ctx.fillStyle = isInTune ? '#95ff17' : '#2a3344';
        ctx.beginPath();
        ctx.arc(cx, cy, statusR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = isInTune ? '#678735' : '#5d6b85';
        ctx.lineWidth = 1.6 * s;
        ctx.stroke();
        ctx.fillStyle = isInTune ? '#1f7240' : '#ff6c79';
        ctx.font = '900 ' + Math.round(22 * s) + 'px Segoe UI';
        ctx.textBaseline = 'middle';
        ctx.fillText(isInTune ? '✓' : 'X', cx, cy);
        ctx.textBaseline = 'alphabetic';

        // Nota atual com oitava no topo
        var adjacent = tunerAdjacentHumanLabels(tunerLastNote);
        ctx.fillStyle = '#7fa8d3';
        ctx.font = '700 ' + Math.round(13 * s) + 'px Segoe UI';
        ctx.fillText(tunerHumanNoteWithOctave(tunerLastNote) + (tunerLastTargetFreq ? ': ' + Math.round(tunerLastTargetFreq) + 'Hz' : ''), cx, 18 * s);

        // Nota anterior e proxima nas laterais da regua
        ctx.fillStyle = '#7fa8d3';
        ctx.font = '700 ' + Math.round(12 * s) + 'px Segoe UI';
        ctx.fillText(adjacent.prev, cx - radius * 0.93, cy - radius * 0.13);
        ctx.fillText(adjacent.next, cx + radius * 0.93, cy - radius * 0.13);

        // Badge de cents no lado direito (como apps de tuner)
        var badgeX = cx + radius * 0.48;
        var badgeY = cy - radius * 0.30;
        var liveHz = tunerLastFreq && isFinite(tunerLastFreq) ? tunerLastFreq.toFixed(1) : '--';
        var badgeText = liveHz + 'Hz';
        ctx.fillStyle = 'rgba(47, 71, 104, 0.9)';
        ctx.strokeStyle = 'rgba(106, 145, 196, 0.9)';
        ctx.lineWidth = 1 * s;
        var bw = 78 * s;
        var bh = 38 * s;
        ctx.beginPath();
        ctx.roundRect(badgeX - bw / 2, badgeY - bh / 2, bw, bh, 5 * s);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#8ab8f1';
        ctx.font = '700 ' + Math.round(20 * s) + 'px Segoe UI';
        ctx.fillText(badgeText, badgeX, badgeY + 1);
      }

      function drawTunerChart() {
        var canvas = document.getElementById('tunerHzChart');
        if (!canvas) return;
        resizeCanvasToDisplay(canvas);
        var ctx = canvas.getContext('2d');
        if (!ctx) return;
        var w = canvas.width;
        var h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillRect(0, 0, w, h);

        if (!tunerHistory.length) return;
        var bounds = window.TunerUtils.chartBounds(tunerHistory, 2);
        if (!bounds) return;
        var min = bounds.min;
        var max = bounds.max;

        ctx.strokeStyle = 'rgba(125,157,122,0.25)';
        ctx.lineWidth = 1;
        for (var g = 1; g <= 3; g++) {
          var gy = (h / 4) * g;
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        }

        ctx.strokeStyle = '#5f9f77';
        ctx.lineWidth = 2;
        ctx.beginPath();
        tunerHistory.forEach(function (v, i) {
          var x = (i / Math.max(1, tunerHistory.length - 1)) * w;
          var y = h - ((v - min) / (max - min)) * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      }

      function updateTunerUI(freq) {
        var analysis = window.TunerUtils.analyzeFrequency(freq, {
          freqToMidi: tunerFreqToMidi,
          midiToFreq: midiToFreq,
          midiToName: tunerMidiToName,
          presetTargetForFreq: tunerPresetTargetForFreq
        });
        var targetFreq = analysis.targetFreq;
        var deviationHz = analysis.deviationHz;
        var noteName = analysis.noteName;

        var noteEl = document.getElementById('tunerDetectedNote');
        var statusEl = document.getElementById('tunerStatus');
        var fEl = document.getElementById('tunerFreqValue');
        var tEl = document.getElementById('tunerTargetValue');
        var cEl = document.getElementById('tunerCentsValue');
        window.UiCoreModule.setText(noteEl, tunerHumanNoteLabel(noteName));
        if (fEl) fEl.textContent = window.TunerUtils.formatHz(freq, 2);
        if (tEl) tEl.textContent = window.TunerUtils.formatHz(targetFreq, 2);
        if (cEl) {
          cEl.textContent = window.TunerUtils.formatSignedHz(deviationHz, 1);
        }
        tunerLastCents = deviationHz;
        tunerLastNote = noteName;
        tunerLastTargetFreq = targetFreq;
        tunerLastFreq = freq;
        if (statusEl) {
          var statusInfo = window.TunerUtils.statusFromDeviation(deviationHz, 0.8);
          window.UiCoreModule.replaceStatusClasses(statusEl, ['ok', 'flat', 'sharp'], statusInfo.mode);
          tunerLastStatus = statusInfo.mode;
          statusEl.textContent = statusInfo.text;
        }
        drawTunerGauge(deviationHz, tunerLastStatus);
      }

      function tunerLoop() {
        if (!tunerRunning || !tunerAnalyzer || !tunerData) return;
        tunerAnalyzer.getFloatTimeDomainData(tunerData);
        var raw = tunerDetectPitch(tunerData, tunerAnalyzer.context.sampleRate);
        if (raw > 0) {
          tunerNoSignalFrames = 0;
          var cfg = getTunerSmoothingConfig();
          var normalizedRaw = tunerNormalizeFrequency(raw);
          window.TunerUtils.pushWithLimit(tunerRawHistory, normalizedRaw, 6);
          var win = Math.min(cfg.medianWindow, tunerRawHistory.length);
          var filtered = tunerMedian(tunerRawHistory.slice(-win));
          tunerSmoothedFreq = window.TunerUtils.nextSmoothedFrequency(tunerSmoothedFreq, filtered, cfg.alpha);
          updateTunerUI(tunerSmoothedFreq);
          window.TunerUtils.pushWithLimit(tunerHistory, tunerSmoothedFreq, 90);
        } else {
          tunerNoSignalFrames += 1;
          if (tunerSmoothedFreq > 0) {
            window.TunerUtils.pushWithLimit(tunerHistory, tunerSmoothedFreq, 90);
            var holdFreqEl = document.getElementById('tunerFreqValue');
            if (holdFreqEl) {
              holdFreqEl.textContent = window.TunerUtils.formatHz(tunerSmoothedFreq, 2);
            }
            tunerLastFreq = tunerSmoothedFreq;
            drawTunerGauge(tunerLastCents, tunerLastStatus);
          }
          if (tunerNoSignalFrames > 16) {
            tunerSmoothedFreq = 0;
            updateTunerUINoSignal();
          }
        }
        drawTunerChart();
        tunerFrameId = requestAnimationFrame(tunerLoop);
      }

      function requestScreenWakeLock() {
        if (!('wakeLock' in navigator) || wakeLockSentinel) return;
        navigator.wakeLock.request('screen').then(function (lock) {
          wakeLockSentinel = lock;
          lock.addEventListener('release', function () {
            wakeLockSentinel = null;
          });
        }).catch(function () {});
      }

      function bootstrapScreenWakeLock() {
        if (wakeLockBootstrapped) return;
        wakeLockBootstrapped = true;
        requestScreenWakeLock();
        ['pointerdown', 'touchstart', 'keydown'].forEach(function (eventName) {
          window.addEventListener(eventName, requestScreenWakeLock, { passive: true });
        });
      }

      function releaseScreenWakeLock() {
        if (!wakeLockSentinel) return;
        wakeLockSentinel.release().catch(function () {});
        wakeLockSentinel = null;
      }

      function ensureMicrophonePermission() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          return Promise.resolve(false);
        }
        return navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        }).then(function (stream) {
          return stream;
        });
      }

      function setTunerMicDeniedVisible(visible) {
        var wrap = document.getElementById('tunerMicDeniedWrap');
        window.UiCoreModule.setHiddenClass(wrap, !visible);
      }

      function guessAndroidBrowserPackage() {
        var ua = navigator.userAgent || '';
        if (/SamsungBrowser/i.test(ua)) return 'com.sec.android.app.sbrowser';
        if (/Firefox/i.test(ua)) return 'org.mozilla.firefox';
        if (/EdgA/i.test(ua)) return 'com.microsoft.emmx';
        if (/Brave/i.test(ua)) return 'com.brave.browser';
        if (/OPR|Opera/i.test(ua)) return 'com.opera.browser';
        return 'com.android.chrome';
      }

      /** Android: tenta abrir a tela de detalhes do app do navegador (onde ficam as permissões). iOS/desktop: não há URL universal; abre o passo a passo. */
      function tryOpenTunerMicrophoneSettings() {
        var ua = navigator.userAgent || '';
        if (/Android/i.test(ua)) {
          var pkg = guessAndroidBrowserPackage();
          var intentUrl = 'intent://#Intent;action=android.settings.APPLICATION_DETAILS_SETTINGS;data=package:' + pkg + ';end';
          try {
            window.location.href = intentUrl;
          } catch (e) {}
          return;
        }
        openTunerMicHelpModal();
      }

      function buildTunerMicHelpHtml() {
        var ua = navigator.userAgent || '';
        if (/Android/i.test(ua)) {
          return (
            '<p><strong>Android</strong></p>' +
            '<ol>' +
            '<li>Abra <strong>Configurações</strong> do aparelho.</li>' +
            '<li><strong>Aplicativos</strong> (ou Apps) → encontre o <strong>navegador</strong> que você usa (Chrome, Samsung Internet, Firefox…).</li>' +
            '<li><strong>Permissões</strong> → <strong>Microfone</strong> → <strong>Permitir</strong>.</li>' +
            '</ol>' +
            '<p>O botão <strong>Abrir configurações</strong> tenta levar direto à página desse app. Se não abrir, siga os passos acima.</p>' +
            '<p>No próprio site: toque no <strong>cadeado</strong> ou <strong>⋮</strong> na barra de endereço → <strong>Permissões</strong> → Microfone.</p>'
          );
        }
        if (/iPhone|iPad|iPod/i.test(ua)) {
          return (
            '<p><strong>iPhone / iPad</strong></p>' +
            '<p>O Safari não permite abrir Ajustes a partir de um site. Faça manualmente:</p>' +
            '<ul style="margin:0 0 0.65rem 1rem;padding:0;">' +
            '<li><strong>Safari:</strong> Ajustes → Safari → Microfone; ou Ajustes → Privacidade e segurança → Microfone.</li>' +
            '<li>No site: toque em <strong>Aa</strong> à esquerda do endereço → <strong>Configurações do site</strong> → Microfone.</li>' +
            '<li><strong>App na tela inicial (PWA):</strong> Ajustes → role até <strong>GEM Tools</strong> → Microfone.</li>' +
            '</ul>'
          );
        }
        return (
          '<p><strong>Computador (Chrome / Edge / Firefox)</strong></p>' +
          '<ol>' +
          '<li>Clique no <strong>cadeado</strong> ou no ícone à esquerda do endereço.</li>' +
          '<li><strong>Permissões do site</strong> ou <strong>Configurações do site</strong> → Microfone → <strong>Permitir</strong>.</li>' +
          '</ol>' +
          '<p>Ou: menu do navegador → Configurações → Privacidade e segurança → Configurações do site → Microfone.</p>'
        );
      }

      function openTunerMicHelpModal() {
        var modal = document.getElementById('tunerMicHelpModal');
        var body = document.getElementById('tunerMicHelpContent');
        if (body) body.innerHTML = buildTunerMicHelpHtml();
        if (modal) modal.classList.remove('hidden');
      }

      function closeTunerMicHelpModal() {
        var modal = document.getElementById('tunerMicHelpModal');
        if (modal) modal.classList.add('hidden');
      }

      function stopTuner() {
        tunerRunning = false;
        tunerNoSignalFrames = 0;
        if (tunerFrameId) {
          cancelAnimationFrame(tunerFrameId);
          tunerFrameId = 0;
        }
        if (tunerSource) {
          try {
            tunerSource.disconnect();
          } catch (e) {}
          tunerSource = null;
        }
        if (tunerStream) {
          tunerStream.getTracks().forEach(function (t) {
            try {
              t.stop();
            } catch (e) {}
          });
          tunerStream = null;
        }
        tunerData = null;
        tunerFreqData = null;
        var st = document.getElementById('tunerStatus');
        if (st) {
          st.classList.remove('ok', 'flat', 'sharp');
          st.textContent = 'Microfone parado';
        }
        var startBtn = document.getElementById('tunerStartBtn');
        var stopBtn = document.getElementById('tunerStopBtn');
        window.UiCoreModule.setDisabled(startBtn, false);
        window.UiCoreModule.setDisabled(stopBtn, true);
      }

      function startTuner() {
        if (tunerRunning) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setMessage('Este navegador não suporta acesso ao microfone.');
          return;
        }
        ensureMicrophonePermission().then(function (stream) {
          var ctx = getAudioContext();
          if (!ctx) {
            stream.getTracks().forEach(function (t) { t.stop(); });
            return;
          }
          tunerStream = stream;
          tunerAnalyzer = ctx.createAnalyser();
          tunerAnalyzer.fftSize = 8192;
          tunerAnalyzer.smoothingTimeConstant = 0;
          tunerSource = ctx.createMediaStreamSource(stream);
          tunerSource.connect(tunerAnalyzer);
          tunerData = new Float32Array(tunerAnalyzer.fftSize);
          tunerFreqData = new Uint8Array(tunerAnalyzer.frequencyBinCount);
          tunerHistory = [];
          tunerRawHistory = [];
          tunerSmoothedFreq = 0;
          tunerNoSignalFrames = 0;
          tunerRunning = true;
          setTunerMicDeniedVisible(false);
          var startBtn = document.getElementById('tunerStartBtn');
          var stopBtn = document.getElementById('tunerStopBtn');
          window.UiCoreModule.setDisabled(startBtn, true);
          window.UiCoreModule.setDisabled(stopBtn, false);
          requestScreenWakeLock();
          setMessage('Afinador ativo. Toque uma corda/nota do instrumento.');
          tunerLoop();
        }).catch(function () {
          var st = document.getElementById('tunerStatus');
          if (st) st.textContent = 'Permissão do microfone bloqueada';
          setMessage('Não foi possível acessar o microfone para o afinador.');
          setTunerMicDeniedVisible(true);
        });
      }

      function resizePlayerOsmdIfActive() {
        if (currentMode !== 'player' || !playerOsmd) return;
        try {
          if (typeof playerOsmd.resize === 'function') playerOsmd.resize();
        } catch (e) {}
        requestAnimationFrame(function () {
          if (currentMode === 'player') buildPlayerNoteAnchorsFromDom();
        });
      }

      function playerClientToSvgPoint(svg, clientX, clientY) {
        try {
          if (!svg || typeof svg.createSVGPoint !== 'function') return null;
          var pt = svg.createSVGPoint();
          pt.x = clientX;
          pt.y = clientY;
          var m = svg.getScreenCTM();
          if (!m || typeof m.inverse !== 'function') return null;
          return pt.matrixTransform(m.inverse());
        } catch (ePt) {
          return null;
        }
      }

      /** Retângulo na tela que cobre a cabeça da nota (path costuma ter bbox minúsculo → usa só o pai imediato se for plausível). */
      function playerNoteheadScreenRect(el) {
        if (!el || !el.getBoundingClientRect) return null;
        var tag = String(el.tagName || '').toLowerCase();
        var r = el.getBoundingClientRect();
        if (!r || r.width <= 0 || r.height <= 0) return null;
        var best = { left: r.left, top: r.top, width: r.width, height: r.height };

        if (tag === 'path') {
          var p = el.parentElement;
          if (p && p.getBoundingClientRect) {
            var rp = p.getBoundingClientRect();
            if (rp && rp.width > 0 && rp.height > 0) {
              var nw = rp.width;
              var nh = rp.height;
              if (
                nw >= best.width * 1.06 &&
                nw <= Math.max(best.width * 10, 56) &&
                nh <= Math.max(best.height * 5, 40)
              ) {
                best = { left: rp.left, top: rp.top, width: nw, height: nh };
              }
            }
          }
        }

        if (best.width < 3 || best.height < 3) return null;
        return best;
      }

      /** Converte nome OSMD/Vex (ex. A#4, Bb4, C4) em MIDI cromático padrão. */
      function playerOsmdPitchStringToMidi(short) {
        var t = String(short || '').trim();
        if (!t || t === 'rest') return null;
        if (window.TunerUtils) {
          var direct = window.TunerUtils.noteToMidi(t);
          if (direct != null) return direct;
        }
        var m = /^([A-G])(#|b|bb|##|n)?(-?\d+)$/.exec(t);
        if (!m) return null;
        var letter = m[1];
        var acc = m[2] || '';
        var oct = parseInt(m[3], 10);
        var baseMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
        var base = baseMap[letter];
        if (base == null || isNaN(oct)) return null;
        var off = 0;
        if (acc === '#') off = 1;
        else if (acc === 'b') off = -1;
        else if (acc === '##') off = 2;
        else if (acc === 'bb') off = -2;
        else if (acc === 'n') off = 0;
        var midiVal = (oct + 1) * 12 + base + off;
        if (midiVal < 0 || midiVal > 127) return null;
        return midiVal;
      }

      /**
       * Posições e alturas a partir do modelo gráfico do OSMD (respeita clave, armadura e notação).
       * Fallback: timeline + DOM (menos fiável em partituras longas / várias pautas).
       */
      function collectPlayerOsmdNoteLabelPlacements(osmd) {
        var placements = [];
        if (!osmd) return placements;
        var sheet = osmd.graphic || osmd.GraphicSheet;
        if (!sheet) return placements;
        var measureList = sheet.measureList || sheet.MeasureList;
        if (!measureList || !measureList.length) return placements;

        var i;
        for (i = 0; i < measureList.length; i++) {
          var measures = measureList[i];
          if (!measures) continue;
          if (!Array.isArray(measures)) measures = [measures];
          var j;
          for (j = 0; j < measures.length; j++) {
            var measure = measures[j];
            if (!measure || !measure.staffEntries) continue;
            var k;
            for (k = 0; k < measure.staffEntries.length; k++) {
              var se = measure.staffEntries[k];
              if (!se || !se.graphicalVoiceEntries) continue;
              var l;
              for (l = 0; l < se.graphicalVoiceEntries.length; l++) {
                var gve = se.graphicalVoiceEntries[l];
                if (!gve || !gve.notes) continue;
                var mn;
                for (mn = 0; mn < gve.notes.length; mn++) {
                  var gn = gve.notes[mn];
                  var sn = gn && gn.sourceNote;
                  if (!sn) continue;
                  if (typeof sn.isRest === 'function' && sn.isRest()) continue;
                  if (sn.IsGraceNote || sn.isGraceNote) continue;
                  try {
                    if (sn.PrintObject === false) continue;
                  } catch (ePo) {}

                  var pitch = sn.TransposedPitch || sn.Pitch;
                  if (!pitch) continue;
                  var shortStr = null;
                  try {
                    if (typeof pitch.ToStringShort === 'function') shortStr = pitch.ToStringShort(0);
                  } catch (eTs) {}
                  if (!shortStr) continue;

                  var midi = playerOsmdPitchStringToMidi(shortStr);
                  if (midi == null) continue;

                  var el = null;
                  if (typeof gn.getSVGGElement === 'function') {
                    try {
                      el = gn.getSVGGElement();
                    } catch (eSvg) {}
                  }
                  if (!el || !el.getBoundingClientRect) continue;
                  var r = el.getBoundingClientRect();
                  if (!r || r.width < 2 || r.height < 2) continue;

                  placements.push({
                    cx: r.left + r.width * 0.5,
                    noteBottom: r.top + r.height,
                    midi: midi,
                    dPx: Math.max(r.width, r.height)
                  });
                }
              }
            }
          }
        }

        placements.sort(function (a, b) {
          var ay = a.noteBottom != null ? a.noteBottom : a.cy;
          var by = b.noteBottom != null ? b.noteBottom : b.cy;
          var dy = ay - by;
          if (Math.abs(dy) > 8) return dy;
          return a.cx - b.cx;
        });
        return placements;
      }

      function collectPlayerNoteLabelPlacementsFromDomFallback() {
        var placements = [];
        if (!playerScoreData || !playerScoreData.events || !playerScoreData.events.length) return placements;
        var host = document.getElementById('playerOsmdContainer');
        if (!host) return placements;

        var nonChordEvents = playerScoreData.events.filter(function (ev) {
          return !ev.isChord;
        });
        if (!nonChordEvents.length) return placements;

        var nodes = host.querySelectorAll(
          '.vf-stavenote .vf-notehead, g.vf-notehead, path.vf-notehead, .vf-notehead, g[class*="notehead"]'
        );
        if (!nodes || !nodes.length) return placements;

        var usableNodes = [];
        nodes.forEach(function (n) {
          var rect = playerNoteheadScreenRect(n);
          if (!rect) return;
          usableNodes.push({ rect: rect });
        });
        if (!usableNodes.length) return placements;

        usableNodes.sort(function (a, b) {
          var dy = a.rect.top - b.rect.top;
          if (Math.abs(dy) > 8) return dy;
          return a.rect.left - b.rect.left;
        });

        var max = Math.min(nonChordEvents.length, usableNodes.length);
        var pi;
        for (pi = 0; pi < max; pi++) {
          var ev = nonChordEvents[pi];
          if (!ev || ev.isRest || ev.midi == null) continue;
          var rr = usableNodes[pi].rect;
          placements.push({
            cx: rr.left + rr.width * 0.5,
            noteBottom: rr.top + rr.height,
            midi: ev.midi,
            dPx: Math.max(rr.width, rr.height)
          });
        }
        return placements;
      }

      /** Reduz sobreposição em colcheias / notas lado a lado (nudge vertical + fonte menor). */
      function applyPlayerNoteLabelCrowdingAdjustments(arr) {
        if (!arr || arr.length < 2) return;
        var i;
        for (i = 0; i < arr.length; i++) {
          arr[i].cyNudgePx = 0;
          arr[i].fontMult = 1;
        }
        var run = 0;
        for (i = 1; i < arr.length; i++) {
          var a = arr[i - 1];
          var b = arr[i];
          var ay = a.noteBottom != null ? a.noteBottom : a.cy;
          var by = b.noteBottom != null ? b.noteBottom : b.cy;
          var dy = Math.abs(by - ay);
          var dx = b.cx - a.cx;
          if (dy < 11 && dx < 36 && dx >= -3) {
            run++;
            b.cyNudgePx = run % 2 === 1 ? -4 : 4;
            b.fontMult = 0.74;
          } else {
            run = 0;
          }
        }
      }

      /** Rótulos Dó/Ré/Sol dentro das cabeças (SVG). */
      function syncPlayerNoteNameLabelOverlays() {
        var host = document.getElementById('playerOsmdContainer');
        if (host) {
          var prev = host.querySelector('#gem-player-note-labels');
          if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
        }
        if (!playerNoteNameLabels || !host) return;
        var svg = host.querySelector('svg');
        if (!svg) return;

        var placements = collectPlayerOsmdNoteLabelPlacements(playerOsmd);
        if (!placements || !placements.length) placements = collectPlayerNoteLabelPlacementsFromDomFallback();
        if (!placements || !placements.length) return;
        applyPlayerNoteLabelCrowdingAdjustments(placements);

        var layer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        layer.setAttribute('id', 'gem-player-note-labels');
        layer.setAttribute('pointer-events', 'none');
        var ns = 'http://www.w3.org/2000/svg';
        var pi;
        for (pi = 0; pi < placements.length; pi++) {
          var pl = placements[pi];
          if (!pl || pl.midi == null) continue;

          var rawLabel = tunerHumanNoteLabel(tunerMidiToName(pl.midi));
          if (!rawLabel) continue;
          var shortLabel = rawLabel.replace('♯', '#').replace('♭', 'b');
          if (shortLabel.length > 5) shortLabel = shortLabel.slice(0, 5);

          var dPx = Math.max(10, pl.dPx != null && isFinite(pl.dPx) ? pl.dPx : 14);
          var fontMult = (pl.fontMult != null && isFinite(pl.fontMult) ? pl.fontMult : 1) * (shortLabel.length > 2 ? 0.84 : 1);
          var fontPx = Math.max(5.2, Math.min(12, dPx * 0.34 * fontMult));
          var noteBottom =
            pl.noteBottom != null && isFinite(pl.noteBottom) ? pl.noteBottom : pl.cy + dPx * 0.35;
          var gapPx = 1.5 + fontPx * 0.1;
          var nudge = pl.cyNudgePx || 0;
          var cyScreen = noteBottom + gapPx + nudge;
          var p = playerClientToSvgPoint(svg, pl.cx, cyScreen);
          if (!p || !isFinite(p.x) || !isFinite(p.y)) continue;

          var strokeW = Math.max(0.7, fontPx * 0.15);
          var letterSp = shortLabel.length > 3 ? '-0.06em' : '-0.03em';
          var text = document.createElementNS(ns, 'text');
          text.setAttribute('x', String(Math.round(p.x * 100) / 100));
          text.setAttribute('y', String(Math.round(p.y * 100) / 100));
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'hanging');
          text.setAttribute('fill', '#ffffff');
          text.setAttribute(
            'style',
            'font-family: Nunito, "Segoe UI", system-ui, sans-serif; font-weight: 800; font-size: ' +
              fontPx +
              'px; letter-spacing: ' +
              letterSp +
              '; paint-order: stroke fill; stroke: #e87328; stroke-width: ' +
              strokeW +
              'px; filter: drop-shadow(0 0 1.5px rgba(232,115,40,0.95)) drop-shadow(0 1px 2px rgba(160,70,10,0.35));'
          );
          text.textContent = shortLabel;
          layer.appendChild(text);
        }

        if (layer.childNodes.length) svg.appendChild(layer);
      }

      function formatPlayerTime(seconds) {
        return window.AppUtils.formatMmSs(seconds);
      }

      function findPlayerEventIndexByTime(seconds) {
        return window.PlayerTimelineUtils.findEventIndexByTime(
          playerScoreData ? playerScoreData.events : [],
          seconds
        );
      }

      function findPlayerCursorIndexByTime(seconds) {
        return window.PlayerTimelineUtils.findCursorIndexByTime(
          playerScoreData ? playerScoreData.cursorStarts : [],
          seconds
        );
      }

      function findPlayerBeatIndexByTime(seconds) {
        return window.PlayerTimelineUtils.findBeatIndexByTime(
          playerScoreData ? playerScoreData.beatEvents : [],
          seconds
        );
      }

      function getPlayerSpeedPercent() {
        return window.PlayerSpeedUtils.rateToPercent(playerPlaybackRate || 1);
      }

      function setPlayerSpeedPopoverOpen(open) {
        var pop = document.getElementById('playerSpeedPopover');
        var btn = document.getElementById('btnPlayerSpeed');
        if (!pop || !btn) return;
        window.UiCoreModule.setHiddenClass(pop, !open);
        window.UiCoreModule.setAriaExpanded(btn, open);
      }

      function syncPlayerSpeedUi() {
        var pct = getPlayerSpeedPercent();
        var btn = document.getElementById('btnPlayerSpeed');
        var inp = document.getElementById('playerSpeedInput');
        var slider = document.getElementById('playerSpeedSlider');
        if (btn) {
          var t = window.PlayerSpeedUtils.formatSpeedLabel(pct);
          window.UiCoreModule.setAriaLabelAndTitle(btn, t);
        }
        if (inp) inp.value = String(pct);
        if (slider) slider.value = String(pct);
      }

      function syncPlayerLeverUi() {
        var metroToggle = document.getElementById('playerMetronomeToggle');
        window.UiCoreModule.setAriaPressed(metroToggle, playerMetronomeEnabled);
        var scrollToggle = document.getElementById('playerAutoScrollToggle');
        window.UiCoreModule.setAriaPressed(scrollToggle, playerAutoScrollEnabled);
        var loopToggle = document.getElementById('playerLoopToggle');
        window.UiCoreModule.setAriaPressed(loopToggle, playerLoopEnabled);
        var colorToggle = document.getElementById('playerColorToggle');
        window.UiCoreModule.setAriaPressed(colorToggle, playerColorizedNotes);
        var noteNamesToggle = document.getElementById('playerNoteNamesToggle');
        window.UiCoreModule.setAriaPressed(noteNamesToggle, playerNoteNameLabels);
        var fingeringToggle = document.getElementById('playerFingeringToggle');
        window.UiCoreModule.setAriaPressed(fingeringToggle, playerShowFingering);
      }

      function buildPlayerDisplayMusicXml(xmlText) {
        return window.PlayerMusicXmlUtils.buildDisplayMusicXml(xmlText, {
          colorizedNotes: !!playerColorizedNotes,
          showFingering: !!playerShowFingering
        });
      }

      function previewPlayerSpeedPercent(percent) {
        var pct = window.PlayerSpeedUtils.clampSpeedPercent(percent);
        var btn = document.getElementById('btnPlayerSpeed');
        var inp = document.getElementById('playerSpeedInput');
        var slider = document.getElementById('playerSpeedSlider');
        if (btn) {
          var t2 = window.PlayerSpeedUtils.formatSpeedLabel(pct);
          window.UiCoreModule.setAriaLabelAndTitle(btn, t2);
        }
        if (inp) inp.value = String(pct);
        if (slider) slider.value = String(pct);
      }

      function applyPlayerSpeedPercent(percent, fromUser) {
        var pct = window.PlayerSpeedUtils.clampSpeedPercent(percent);
        var nextRate = window.PlayerSpeedUtils.percentToRate(pct);
        if (!isFinite(nextRate) || nextRate <= 0) nextRate = 1;
        var changed = Math.abs(nextRate - playerPlaybackRate) > 0.0001;
        playerPlaybackRate = nextRate;
        syncPlayerSpeedUi();
        if (!changed) return;
        var wasPlaying = playerPlayback.isPlaying;
        if (wasPlaying) stopPlayerPlayback(true);
        updatePlayerUiNow(playerPlayback.positionSec);
        if (wasPlaying) startPlayerPlayback();
        if (fromUser) setMessage('Velocidade ajustada para ' + pct + '%.');
      }

      function beginPlayerSpeedAdjust() {
        if (playerSpeedAdjusting) return;
        playerSpeedAdjusting = true;
        playerSpeedResumeAfterAdjust = playerPlayback.isPlaying;
        if (playerPlayback.isPlaying) {
          stopPlayerPlayback(true);
        }
        playerSpeedFrozenSec = Math.max(0, playerPlayback.positionSec || 0);
      }

      function endPlayerSpeedAdjust(percent) {
        var pct = parseInt(percent || String(getPlayerSpeedPercent()), 10);
        if (!isFinite(pct)) pct = getPlayerSpeedPercent();
        applyPlayerSpeedPercent(pct, true);
        if (!playerSpeedAdjusting) return;
        // Garante retomada exatamente no mesmo ponto congelado.
        seekPlayerToTime(playerSpeedFrozenSec, false);
        if (playerSpeedResumeAfterAdjust) startPlayerPlayback();
        playerSpeedAdjusting = false;
        playerSpeedResumeAfterAdjust = false;
      }

      function playerVoiceLabel(voice) {
        return window.PlayerViewUtils.voiceLabel(voice);
      }

      function normalizePlayerCatalogJson(json) {
        return window.PlayerCatalogModule.normalizeCatalogJson(json);
      }

      function getPlayerCatalogCollections() {
        return window.PlayerCatalogModule.getCollections(playerCatalog);
      }

      function getCurrentPlayerCollection() {
        return window.PlayerCatalogModule.getCurrentCollection(playerCatalog, playerSelectedCollectionId);
      }

      function getPlayerCatalogItems() {
        return window.PlayerCatalogModule.getItems(playerCatalog, playerSelectedCollectionId);
      }

      function getPlayerCatalogItemByNumero(numero) {
        return window.PlayerCatalogModule.getItemByNumero(playerCatalog, playerSelectedCollectionId, numero);
      }

      function getPlayerCatalogItemById(itemId) {
        return window.PlayerCatalogModule.getItemById(playerCatalog, playerSelectedCollectionId, itemId);
      }

      function normalizePlayerSearchText(text) {
        return window.AppUtils.normalizeSearchText(text);
      }

      function parsePlayerNumeroFromInputValue(value) {
        var parsed = window.AppUtils.parseNumeroInput(value);
        return parsed === null ? NaN : parsed;
      }

      function getPlayerInstrumentFiles(item) {
        var instrumentId = currentInstrument && currentInstrument.id ? String(currentInstrument.id) : '';
        return window.PlayerSelectionModule.getInstrumentFiles(item, instrumentId);
      }

      function getPlayerAvailableVoices(item) {
        var instrumentId = currentInstrument && currentInstrument.id ? String(currentInstrument.id) : '';
        return window.PlayerSelectionModule.getAvailableVoices(item, instrumentId);
      }

      function syncPlayerHeaderTitle(item, voice) {
        var titleEl = document.getElementById('playerSectionTitle');
        if (!titleEl) return;
        var col = getCurrentPlayerCollection();
        var colName = col && col.nome ? String(col.nome) : 'Coleção';
        titleEl.textContent = window.PlayerViewUtils.buildHeaderTitle(colName, item, voice);
      }

      function normalizePlayerSelectedVoices(availableVoices) {
        playerSelectedVoices = window.PlayerSelectionModule.normalizeSelectedVoices(playerSelectedVoices, availableVoices);
      }

      function resolvePlayerCurrentSelection() {
        var item = getPlayerCatalogItemById(playerSelectedItemId);
        if (!item) item = getPlayerCatalogItemByNumero(playerSelectedHinoNumero);
        if (!item) {
          var items = getPlayerCatalogItems();
          if (!items.length) return null;
          item = items[0];
          playerSelectedItemId = String(item.id || '');
          playerSelectedHinoNumero = Number(item.numero);
        }
        var availableVoices = getPlayerAvailableVoices(item);
        if (!availableVoices.length) return null;
        normalizePlayerSelectedVoices(availableVoices);
        var files = getPlayerInstrumentFiles(item);
        var paths = null;
        paths = window.PlayerSelectionModule.buildVoicePaths(files, playerSelectedVoices || []);
        if (!paths.length) return null;
        return {
          item: item,
          voices: playerSelectedVoices.slice(),
          path: paths[0],
          paths: paths
        };
      }

      function renderPlayerCatalogControls() {
        var selCollection = document.getElementById('playerSelectCollection');
        var selAfin = document.getElementById('playerSelectAfinacao');
        var selHino = document.getElementById('playerSelectHino');
        var hinoSuggestions = document.getElementById('playerHinoSuggestions');
        var voiceChecks = document.getElementById('playerVoiceChecks');
        var collections = getPlayerCatalogCollections();

        if (!selCollection || !selAfin || !selHino || !hinoSuggestions || !voiceChecks) return;
        if (!collections.length) {
          var collectionEmptyHtml = window.PlayerRenderUtils.buildSingleOption('', 'Sem coleção');
          window.UiCoreModule.setHtml(selCollection, collectionEmptyHtml);
        } else {
          collections = window.PlayerFilterUtils.sortCollectionsByOrder(collections);
          var resolvedCollectionId = window.PlayerFilterUtils.resolveSelectedCollectionId(collections, playerSelectedCollectionId);
          if (resolvedCollectionId !== String(playerSelectedCollectionId || '')) {
            playerSelectedCollectionId = resolvedCollectionId;
            playerSelectedItemId = null;
            playerSelectedHinoNumero = null;
          }
          var collectionOptionsHtml = window.PlayerRenderUtils.buildCollectionOptions(collections);
          window.UiCoreModule.setHtml(selCollection, collectionOptionsHtml);
          window.UiCoreModule.setSelectValue(selCollection, playerSelectedCollectionId);
        }

        var items = getPlayerCatalogItems();
        if (!items.length) {
          var afinEmptyHtml = window.PlayerRenderUtils.buildSingleOption('', 'Sem catálogo');
          window.UiCoreModule.setHtml(selAfin, afinEmptyHtml);
          window.UiCoreModule.setHtml(hinoSuggestions, '');
          hinoSuggestions.classList.add('hidden');
          window.UiCoreModule.setInputValue(selHino, '');
          window.UiCoreModule.setPlaceholder(selHino, 'Sem itens');
          voiceChecks.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            var checkedDefault = cb.value === 's';
            window.UiCoreModule.setCheckboxState(cb, false, checkedDefault);
          });
          syncPlayerHeaderTitle(null, 's');
          return;
        }

        var afinacoes = window.PlayerFilterUtils.getAfinacoes(items);
        if (afinacoes.indexOf(playerSelectedAfinacao) === -1) playerSelectedAfinacao = afinacoes[0];

        var afinOptionsHtml = afinacoes.map(function (a) {
          var label = window.PlayerFilterUtils.afinacaoLabel(a);
          return '<option value="' + a + '">' + label + '</option>';
        }).join('');
        window.UiCoreModule.setHtml(selAfin, afinOptionsHtml);
        window.UiCoreModule.setSelectValue(selAfin, playerSelectedAfinacao);

        var hinosFiltrados = window.PlayerFilterUtils.filterByAfinacao(items, playerSelectedAfinacao);
        if (!hinosFiltrados.length) hinosFiltrados = items.slice();

        var forceShowAll = selHino.dataset.openAll === '1';
        var searchTerm = forceShowAll ? '' : normalizePlayerSearchText(selHino.value);
        if (searchTerm) {
          hinosFiltrados = window.PlayerFilterUtils.filterBySearch(hinosFiltrados, searchTerm, normalizePlayerSearchText);
        }
        if (!hinosFiltrados.length) {
          window.UiCoreModule.setHtml(hinoSuggestions, '');
          hinoSuggestions.classList.add('hidden');
          window.UiCoreModule.setPlaceholder(selHino, 'Nenhum hino encontrado');
          voiceChecks.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            cb.disabled = true;
          });
          syncPlayerHeaderTitle(null, 's');
          return;
        }
        var selectedResolved = window.PlayerFilterUtils.resolveSelectedItem(hinosFiltrados, playerSelectedHinoNumero, playerSelectedItemId);
        playerSelectedHinoNumero = selectedResolved.numero;
        if (selectedResolved.itemId) playerSelectedItemId = selectedResolved.itemId;

        window.UiCoreModule.setPlaceholder(selHino, 'Digite número ou título');
        var suggestionsHtml = window.PlayerRenderUtils.buildHinoSuggestions(hinosFiltrados);
        window.UiCoreModule.setHtml(hinoSuggestions, suggestionsHtml);
        var selectedItem = getPlayerCatalogItemById(playerSelectedItemId) || getPlayerCatalogItemByNumero(playerSelectedHinoNumero);
        if (selectedItem && !searchTerm) {
          playerSelectedItemId = String(selectedItem.id || '');
          playerSelectedHinoNumero = Number(selectedItem.numero || 0);
          var selectedLabel = window.PlayerRenderUtils.buildSelectedHinoLabel(selectedItem);
          window.UiCoreModule.setInputValue(selHino, selectedLabel);
        }

        var currentItem = getPlayerCatalogItemById(playerSelectedItemId) || getPlayerCatalogItemByNumero(playerSelectedHinoNumero);
        var voices = getPlayerAvailableVoices(currentItem);
        if (!voices.length) voices = ['s'];
        normalizePlayerSelectedVoices(voices);
        voiceChecks.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          var v = String(cb.value || '').toLowerCase();
          var enabled = voices.indexOf(v) >= 0;
          var checked = enabled && playerSelectedVoices.indexOf(v) >= 0;
          window.UiCoreModule.setCheckboxState(cb, enabled, checked);
        });

        syncPlayerHeaderTitle(currentItem, playerSelectedVoices);
      }

      function ensurePlayerCatalogLoaded(forceReload) {
        if (forceReload) playerCatalog = null;
        if (!forceReload && playerCatalog && Array.isArray(playerCatalog.colecoes)) return Promise.resolve(playerCatalog);
        if (playerCatalogPromise) return playerCatalogPromise;
        var cacheBust = forceReload ? ('&ts=' + Date.now()) : '';
        var url = PLAYER_CATALOG_URL + '?v=' + encodeURIComponent(APP_VERSION) + cacheBust;
        playerCatalogPromise = fetch(url, { cache: 'no-store' }).then(function (res) {
          if (!res.ok) throw new Error('http ' + res.status);
          return res.json();
        }).then(function (json) {
          playerCatalog = normalizePlayerCatalogJson(json);
          renderPlayerCatalogControls();
          return playerCatalog;
        }).catch(function () {
          playerCatalog = { colecoes: [] };
          renderPlayerCatalogControls();
          return playerCatalog;
        }).finally(function () {
          playerCatalogPromise = null;
        });
        return playerCatalogPromise;
      }

      function seekPlayerToTime(targetSec, resumeIfPlaying) {
        if (!playerScoreData || !playerScoreData.totalDurationSec) return;
        var clamped = Math.max(0, Math.min(playerScoreData.totalDurationSec, targetSec || 0));
        var wasPlaying = !!resumeIfPlaying && playerPlayback.isPlaying;
        if (playerPlayback.isPlaying) stopPlayerPlayback(true);
        playerPlayback.positionSec = clamped;
        playerPlayback.nextEventIndex = findPlayerEventIndexByTime(clamped);
        playerPlayback.nextCursorIndex = Math.max(1, findPlayerCursorIndexByTime(clamped));
        playerPlayback.nextBeatIndex = findPlayerBeatIndexByTime(clamped);
        playerAutoScrollNeedsInitial = false;
        resetPlayerCursorToCurrentPosition();
        updatePlayerUiNow(clamped);
        if (wasPlaying) startPlayerPlayback();
      }

      function buildPlayerNoteAnchorsFromDom() {
        playerNoteAnchors = [];
        if (!playerScoreData || !playerScoreData.events || !playerScoreData.events.length) return;
        var host = document.getElementById('playerOsmdContainer');
        if (!host) return;

        var nonChordEvents = playerScoreData.events.filter(function (ev) {
          return !ev.isChord;
        });
        if (!nonChordEvents.length) return;

        var nodes = host.querySelectorAll(
          '.vf-stavenote .vf-notehead, g.vf-notehead, path.vf-notehead, .vf-notehead, g[class*="notehead"]'
        );
        if (!nodes || !nodes.length) return;

        var usableNodes = [];
        nodes.forEach(function (n) {
          var r = playerNoteheadScreenRect(n);
          if (!r) return;
          usableNodes.push({ el: n, rect: r });
        });
        if (!usableNodes.length) return;

        // Ordena visualmente (linha por linha) para casar com timeline da partitura.
        usableNodes.sort(function (a, b) {
          var dy = a.rect.top - b.rect.top;
          if (Math.abs(dy) > 8) return dy;
          return a.rect.left - b.rect.left;
        });

        var max = Math.min(nonChordEvents.length, usableNodes.length);
        for (var i = 0; i < max; i++) {
          var rr = usableNodes[i].rect;
          playerNoteAnchors.push({
            sec: nonChordEvents[i].startSec,
            x: rr.left + (rr.width / 2),
            y: rr.top + (rr.height / 2)
          });
        }
        syncPlayerNoteNameLabelOverlays();
      }

      function seekPlayerFromClick(clientX, clientY) {
        if (!playerNoteAnchors || playerNoteAnchors.length === 0) return false;
        var best = null;
        var bestD = Infinity;
        for (var i = 0; i < playerNoteAnchors.length; i++) {
          var a = playerNoteAnchors[i];
          var dx = a.x - clientX;
          var dy = a.y - clientY;
          var d2 = (dx * dx) + (dy * dy);
          if (d2 < bestD) {
            bestD = d2;
            best = a;
          }
        }
        if (!best) return false;
        // Limite: evita seek quando clique estiver muito fora da região útil.
        if (bestD > (220 * 220)) return false;
        seekPlayerToTime(best.sec, true);
        return true;
      }

      function getPlayerCursorElement() {
        var host = document.getElementById('playerOsmdContainer');
        if (!host) return null;
        return host.querySelector('.osmd-cursor, .cursor, [class*="osmdCursor"], [class*="Cursor"], [class*="cursor"]');
      }

      function getPlayerViewportSize() {
        var vv = window.visualViewport;
        var w = vv && vv.width ? vv.width : (window.innerWidth || document.documentElement.clientWidth || 0);
        var h = vv && vv.height ? vv.height : (window.innerHeight || document.documentElement.clientHeight || 0);
        return { width: Math.max(1, w), height: Math.max(1, h) };
      }

      function scrollPlayerCursorToViewportCenter(curRect, viewportHeight) {
        if (!curRect || !viewportHeight) return;
        var markerCenterY = curRect.top + (curRect.height * 0.5);
        var viewportCenterY = viewportHeight * 0.5;
        var deltaY = markerCenterY - viewportCenterY;
        if (Math.abs(deltaY) <= 6) return;
        var currentY = window.scrollY || 0;
        var docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        var maxY = Math.max(0, docHeight - viewportHeight);
        var nextY = Math.max(0, Math.min(maxY, currentY + deltaY));
        if (nextY >= maxY - 4) playerAutoScrollReachedEnd = true;
        playerAutoScrollProgrammaticUntil = Date.now() + 280;
        try {
          window.scrollTo({ top: nextY, behavior: 'auto' });
        } catch (e) {
          window.scrollTo(0, nextY);
        }
      }

      function autoScrollPlayerFollowingCursor(musicSec) {
        if (!playerAutoScrollEnabled || currentMode !== 'player') return;
        if (Date.now() < playerAutoScrollUserPausedUntil) return;
        if (playerAutoScrollReachedEnd) return;
        if (playerScoreData && playerScoreData.totalDurationSec && musicSec >= (playerScoreData.totalDurationSec - 0.15)) {
          playerAutoScrollReachedEnd = true;
          return;
        }
        var docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        var viewportBottom = (window.scrollY || 0) + (window.innerHeight || 0);
        if (viewportBottom >= docHeight - 6) {
          playerAutoScrollReachedEnd = true;
          return;
        }
        var nowTs = performance.now();
        if (nowTs - playerAutoScrollLastTs < 120) return;
        playerAutoScrollLastTs = nowTs;

        var scoreHost = document.getElementById('playerScoreHost');
        var cursorEl = getPlayerCursorElement();

        if (scoreHost && cursorEl) {
          var viewport = getPlayerViewportSize();
          // Horizontal: mantém a nota no centro da área visível da partitura.
          var hostRect = scoreHost.getBoundingClientRect();
          var curRect = cursorEl.getBoundingClientRect();
          var curLeftInHost = (curRect.left - hostRect.left) + scoreHost.scrollLeft;
          var curTopDoc = (window.scrollY || 0) + curRect.top;
          var maxLeft = Math.max(0, scoreHost.scrollWidth - scoreHost.clientWidth);
          var desiredLeft = Math.max(0, Math.min(maxLeft, curLeftInHost - (scoreHost.clientWidth * 0.5)));
          if (Math.abs(scoreHost.scrollLeft - desiredLeft) > 14) {
            try {
              scoreHost.scrollTo({ left: desiredLeft, behavior: 'smooth' });
            } catch (e) {
              scoreHost.scrollLeft = desiredLeft;
            }
          }

          // Alinhamento inicial (importante no mobile e em rotação):
          // já posiciona a nota atual no centro da tela.
          if (playerAutoScrollNeedsInitial) {
            playerAutoScrollNeedsInitial = false;
            scrollPlayerCursorToViewportCenter(curRect, viewport.height);
            playerAutoScrollLastSystemTop = Math.round(curRect.top / 18) * 18;
            playerAutoScrollSystemChanges = 0;
            playerAutoScrollLastCursorLeftInHost = curLeftInHost;
            playerAutoScrollLastCursorTopDoc = curTopDoc;
            return;
          }

          // Vertical: segue o marcador verde.
          // Sempre que o marcador descer no documento, recentraliza no viewport.
          var prevLeftInHost = playerAutoScrollLastCursorLeftInHost;
          var prevTopDoc = playerAutoScrollLastCursorTopDoc;
          var movedDown = (prevTopDoc != null) && ((curTopDoc - prevTopDoc) > 3);

          playerAutoScrollLastCursorLeftInHost = curLeftInHost;
          playerAutoScrollLastCursorTopDoc = curTopDoc;

          if (movedDown) {
            // Ajuste direto quando desce: marcador sempre no centro visível real.
            scrollPlayerCursorToViewportCenter(curRect, viewport.height);
          }
          return;
        }

        // Fallback: sem cursor DOM detectável, usa progresso para manter a área da partitura em foco.
        if (!scoreHost || !playerScoreData || !playerScoreData.totalDurationSec) return;
        var ratio = Math.max(0, Math.min(1, musicSec / playerScoreData.totalDurationSec));
        var hostBox = scoreHost.getBoundingClientRect();
        var viewportFallback = getPlayerViewportSize();
        var targetYFallback = window.scrollY + hostBox.top + (hostBox.height * ratio) - (viewportFallback.height * 0.5);
        if (Math.abs(window.scrollY - targetYFallback) > 42) {
          playerAutoScrollProgrammaticUntil = Date.now() + 520;
          try {
            window.scrollTo({ top: Math.max(0, targetYFallback), behavior: 'smooth' });
          } catch (e3) {
            window.scrollTo(0, Math.max(0, targetYFallback));
          }
        }
      }

      function stopAllPlayerNotes() {
        if (!playerPlayback.activeStops || playerPlayback.activeStops.length === 0) return;
        var ctx = getAudioContext();
        while (playerPlayback.activeStops.length) {
          var fn = playerPlayback.activeStops.pop();
          if (typeof fn !== 'function') continue;
          try {
            fn(ctx ? ctx.currentTime : undefined);
          } catch (e) {}
        }
      }

      function clearPlayerPreparation() {
        while (playerPrepTimeouts.length) {
          var tm = playerPrepTimeouts.pop();
          try { clearTimeout(tm); } catch (e) {}
        }
        playerPrepToken = 0;
      }

      function resetPlayerCursorToCurrentPosition() {
        if (!playerOsmd || !playerOsmd.cursor) return;
        try {
          playerOsmd.cursor.show();
          playerOsmd.cursor.reset();
          var steps = findPlayerCursorIndexByTime(playerPlayback.positionSec);
          for (var i = 0; i < steps; i++) playerOsmd.cursor.next();
        } catch (e) {}
      }

      function schedulePlayerMetronomeClick(startAtCtx, isAccent) {
        var ctx = getAudioContext();
        if (!ctx || !playerMetronomeEnabled) return;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var freq = isAccent ? 1080 : 820;
        var vol = calmMode ? 0.045 : 0.08;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startAtCtx);
        gain.gain.setValueAtTime(0.0001, startAtCtx);
        gain.gain.exponentialRampToValueAtTime(vol, startAtCtx + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAtCtx + 0.055);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAtCtx);
        osc.stop(startAtCtx + 0.07);
      }

      function schedulePlayerPreparationClick(startAtCtx, isAccent) {
        var ctx = getAudioContext();
        if (!ctx || !soundEnabled) return;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var freq = isAccent ? 1600 : 1250;
        var vol = calmMode ? 0.07 : 0.12;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, startAtCtx);
        gain.gain.setValueAtTime(0.0001, startAtCtx);
        gain.gain.exponentialRampToValueAtTime(vol, startAtCtx + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAtCtx + 0.045);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAtCtx);
        osc.stop(startAtCtx + 0.06);
      }

      function getPlayerPreparationBeatSec() {
        if (playerScoreData && playerScoreData.beatEvents && playerScoreData.beatEvents.length > 1) {
          var i;
          for (i = 1; i < playerScoreData.beatEvents.length; i++) {
            var d = (playerScoreData.beatEvents[i].sec || 0) - (playerScoreData.beatEvents[i - 1].sec || 0);
            if (isFinite(d) && d > 0.2 && d < 2.0) return d;
          }
        }
        return 0.6;
      }

      function beginPlayerPlaybackNow(ctx, instrument, fallbackMessage) {
        playerPlayback.isPlaying = true;
        playerPlayback.nextEventIndex = findPlayerEventIndexByTime(playerPlayback.positionSec);
        playerPlayback.nextCursorIndex = Math.max(1, findPlayerCursorIndexByTime(playerPlayback.positionSec));
        playerPlayback.nextBeatIndex = findPlayerBeatIndexByTime(playerPlayback.positionSec);
        playerPlayback.startedAtCtx = ctx.currentTime - (Math.max(0, playerPlayback.positionSec) / Math.max(0.4, playerPlaybackRate || 1));
        playerAutoScrollNeedsInitial = true;
        resetPlayerCursorToCurrentPosition();
        updatePlayerUiNow(playerPlayback.positionSec);
        playerTickPlaybackLoop(instrument || null);
        setMessage(fallbackMessage ? 'Playback em andamento (modo síntese).' : 'Playback em andamento.');
      }

      function updatePlayerUiNow(nowSec) {
        var total = (playerScoreData && playerScoreData.totalDurationSec) ? playerScoreData.totalDurationSec : 0;
        var current = Math.max(0, nowSec != null ? nowSec : playerPlayback.positionSec || 0);
        var seek = document.getElementById('playerSeek');
        var lbl = document.getElementById('playerTimeLabel');
        var playBtn = document.getElementById('btnPlayerPlay');
        var pauseBtn = document.getElementById('btnPlayerPause');
        var stopBtn = document.getElementById('btnPlayerStop');
        var hasScore = !!(playerScoreData && playerScoreData.events && playerScoreData.events.length);

        if (seek) {
          seek.disabled = !hasScore;
          var ratio = total > 0 ? Math.max(0, Math.min(1, current / total)) : 0;
          seek.value = String(Math.round(ratio * 1000));
        }
        if (lbl) lbl.textContent = formatPlayerTime(current) + ' / ' + formatPlayerTime(total);
        window.UiCoreModule.setDisabled(playBtn, !hasScore || playerPlayback.isPlaying);
        window.UiCoreModule.setDisabled(pauseBtn, !playerPlayback.isPlaying);
        window.UiCoreModule.setDisabled(stopBtn, !hasScore || (!playerPlayback.isPlaying && current <= 0.01));
      }

      function scheduleFallbackPlayerNote(freq, startAtCtx, durationSec) {
        var ctx = getAudioContext();
        if (!ctx) return;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var vol = (calmMode ? 0.12 : 0.23) * INSTRUMENT_OUTPUT_GAIN;
        if (vol > 0.35) vol = 0.35;
        var dur = Math.max(0.06, durationSec || 0.16);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startAtCtx);
        gain.gain.setValueAtTime(0.0001, startAtCtx);
        gain.gain.exponentialRampToValueAtTime(vol, startAtCtx + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, startAtCtx + Math.max(0.03, dur));
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startAtCtx);
        osc.stop(startAtCtx + Math.max(0.05, dur) + 0.02);
        playerPlayback.activeStops.push(function () {
          try {
            var t = ctx.currentTime;
            gain.gain.cancelScheduledValues(t);
            gain.gain.setValueAtTime(gain.gain.value, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            osc.stop(t + 0.06);
          } catch (e) {}
        });
      }

      function schedulePlayerNote(event, startAtCtx, instrument) {
        if (!event || event.isRest || !event.freq || event.freq <= 0) return;
        var rate = Math.max(0.4, playerPlaybackRate || 1);
        var dur = Math.max(0.06, (event.durationSec * 0.96) / rate);
        if (instrument) {
          var noteName = freqToMidiNoteName(event.freq);
          var isVoiceInstrument = currentInstrument && currentInstrument.id === 'voz';
          var gain = calmMode ? 0.36 : 0.56;
          if (isVoiceInstrument) gain = calmMode ? 0.02 : 0.035;
          var note = instrument.play(noteName, startAtCtx, buildSoundfontPlayOptions(dur, gain));
          if (isVoiceInstrument) {
            var ctxSf = getAudioContext();
            if (ctxSf) schedulePlayerSungSolfejo(ctxSf, startAtCtx, event.freq, dur, playerPlayToken);
          }
          if (note && typeof note.stop === 'function') {
            playerPlayback.activeStops.push(function (now) {
              try {
                note.stop(typeof now === 'number' ? now : getAudioContext().currentTime);
              } catch (e) {}
            });
          }
          return;
        }
        scheduleFallbackPlayerNote(event.freq, startAtCtx, dur);
      }

      function stopPlayerPlayback(keepPosition) {
        clearPlayerPreparation();
        playerPlayToken = 0;
        if (playerPlayback.rafId) {
          cancelAnimationFrame(playerPlayback.rafId);
          playerPlayback.rafId = null;
        }
        if (playerPlayback.isPlaying) {
          try {
            var ctx = getAudioContext();
            if (ctx) {
              var rate = Math.max(0.4, playerPlaybackRate || 1);
              playerPlayback.positionSec = Math.max(0, (ctx.currentTime - playerPlayback.startedAtCtx) * rate);
            }
          } catch (e) {}
        }
        playerPlayback.isPlaying = false;
        stopAllPlayerNotes();
        if (!keepPosition) playerPlayback.positionSec = 0;
        playerAutoScrollLastTs = 0;
        playerAutoScrollLastSystemTop = null;
        playerAutoScrollLastCursorLeftInHost = null;
        playerAutoScrollLastCursorTopDoc = null;
        playerAutoScrollUserPausedUntil = 0;
        playerAutoScrollProgrammaticUntil = 0;
        playerAutoScrollNeedsInitial = false;
        playerAutoScrollSystemChanges = 0;
        playerAutoScrollReachedEnd = false;
        if (!keepPosition && playerScoreData) {
          playerNoteAnchors = playerNoteAnchors || [];
        }
        playerPlayback.nextEventIndex = findPlayerEventIndexByTime(playerPlayback.positionSec);
        playerPlayback.nextCursorIndex = Math.max(1, findPlayerCursorIndexByTime(playerPlayback.positionSec));
        playerPlayback.nextBeatIndex = findPlayerBeatIndexByTime(playerPlayback.positionSec);
        resetPlayerCursorToCurrentPosition();
        updatePlayerUiNow(playerPlayback.positionSec);
      }

      function playerTickPlaybackLoop(instrument) {
        if (!playerPlayback.isPlaying || !playerScoreData) return;
        var ctx = getAudioContext();
        if (!ctx) {
          stopPlayerPlayback(true);
          return;
        }
        var rate = Math.max(0.4, playerPlaybackRate || 1);
        var elapsed = Math.max(0, (ctx.currentTime - playerPlayback.startedAtCtx) * rate);
        var total = playerScoreData.totalDurationSec || 0;
        var lookAhead = 0.22 * rate;

        if (elapsed >= total + 0.03) {
          stopPlayerPlayback(false);
          if (playerLoopEnabled && currentMode === 'player') {
            startPlayerPlayback();
            setMessage('Loop da partitura reiniciado.');
            return;
          }
          if (currentMode !== 'player') setMessage('Playback concluído.');
          return;
        }

        while (playerPlayback.nextEventIndex < playerScoreData.events.length) {
          var ev = playerScoreData.events[playerPlayback.nextEventIndex];
          if (!ev || ev.startSec > elapsed + lookAhead) break;
          if (ev.startSec >= elapsed - 0.03) {
            var when = playerPlayback.startedAtCtx + (ev.startSec / rate);
            schedulePlayerNote(ev, when, instrument);
          }
          playerPlayback.nextEventIndex += 1;
        }

        if (playerMetronomeEnabled && playerScoreData.beatEvents && playerScoreData.beatEvents.length) {
          while (playerPlayback.nextBeatIndex < playerScoreData.beatEvents.length) {
            var beatEv = playerScoreData.beatEvents[playerPlayback.nextBeatIndex];
            var beatAt = beatEv ? beatEv.sec : 0;
            if (beatAt > elapsed + lookAhead) break;
            if (beatAt >= elapsed - 0.03) {
              var whenBeat = playerPlayback.startedAtCtx + (beatAt / rate);
              schedulePlayerMetronomeClick(whenBeat, !!(beatEv && beatEv.accent));
            }
            playerPlayback.nextBeatIndex += 1;
          }
        }

        if (playerOsmd && playerOsmd.cursor && playerScoreData.cursorStarts) {
          while (playerPlayback.nextCursorIndex < playerScoreData.cursorStarts.length &&
                 playerScoreData.cursorStarts[playerPlayback.nextCursorIndex] <= elapsed + 0.005) {
            try { playerOsmd.cursor.next(); } catch (e) { break; }
            playerPlayback.nextCursorIndex += 1;
          }
        }

        playerPlayback.positionSec = elapsed;
        updatePlayerUiNow(elapsed);
        autoScrollPlayerFollowingCursor(elapsed);
        playerPlayback.rafId = requestAnimationFrame(function () {
          playerTickPlaybackLoop(instrument);
        });
      }

      function startPlayerPlayback() {
        if (!playerScoreData || !playerScoreData.events || playerScoreData.events.length === 0) {
          setMessage('Player: sem notas válidas no MusicXML.');
          updatePlayerUiNow(0);
          return;
        }
        if (playerPlayback.isPlaying || playerPrepToken) return;
        var ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        var token = Date.now();
        playerPlayToken = token;
        var requestedInstrumentId = currentInstrument && currentInstrument.id ? currentInstrument.id : 'violin';
        loadInstrument(requestedInstrumentId).then(function (instrument) {
          if (playerPlayToken !== token) return;
          if (!playerScoreData) return;
          clearPlayerPreparation();
          playerPrepToken = token;
          var prepBeatSec = getPlayerPreparationBeatSec();
          var prepTotal = 3;
          var i;
          for (i = 0; i < prepTotal; i++) {
            (function (idx) {
              var tm = setTimeout(function () {
                if (playerPlayToken !== token || playerPrepToken !== token) return;
                var remaining = prepTotal - idx;
                var prepCtx = getAudioContext();
                if (prepCtx) schedulePlayerPreparationClick(prepCtx.currentTime + 0.01, idx === 0);
                setMessage('Preparação: ' + remaining + '...');
              }, Math.round(idx * prepBeatSec * 1000));
              playerPrepTimeouts.push(tm);
            })(i);
          }
          var startTm = setTimeout(function () {
            if (playerPlayToken !== token || playerPrepToken !== token) return;
            clearPlayerPreparation();
            beginPlayerPlaybackNow(ctx, instrument || null, false);
          }, Math.round(prepTotal * prepBeatSec * 1000));
          playerPrepTimeouts.push(startTm);
        }).catch(function () {
          if (playerPlayToken !== token) return;
          clearPlayerPreparation();
          playerPrepToken = token;
          var prepBeatSec = getPlayerPreparationBeatSec();
          var prepTotal = 3;
          var i;
          for (i = 0; i < prepTotal; i++) {
            (function (idx) {
              var tm = setTimeout(function () {
                if (playerPlayToken !== token || playerPrepToken !== token) return;
                var remaining = prepTotal - idx;
                var prepCtx = getAudioContext();
                if (prepCtx) schedulePlayerPreparationClick(prepCtx.currentTime + 0.01, idx === 0);
                setMessage('Preparação: ' + remaining + '...');
              }, Math.round(idx * prepBeatSec * 1000));
              playerPrepTimeouts.push(tm);
            })(i);
          }
          var startTm = setTimeout(function () {
            if (playerPlayToken !== token || playerPrepToken !== token) return;
            clearPlayerPreparation();
            beginPlayerPlaybackNow(ctx, null, true);
          }, Math.round(prepTotal * prepBeatSec * 1000));
          playerPrepTimeouts.push(startTm);
        });
      }

      /** Carrega e desenha um MusicXML específico no Player. */
      function loadPlayerMusicXml(scorePath, titleLabel, forceReload) {
        window.PlayerOsmdLoadUtils.runLoadPlayerMusicXml(
          scorePath,
          titleLabel,
          forceReload,
          window.PlayerLoadBindings.getPlayerMusicXmlLoadContext()
        );
      }

      function loadPlayerFromCatalogSelection(forceReload) {
        var resolved = resolvePlayerCurrentSelection();
        if (!resolved) {
          syncPlayerHeaderTitle(null, 's');
          loadPlayerMusicXml(PLAYER_SCORE_URL, 'Partitura padrão', !!forceReload);
          return;
        }
        renderPlayerCatalogControls();
        var label = String(resolved.item.numero) + ' · ' + (resolved.item.titulo || 'Sem título') + ' · ' + playerVoiceLabel(resolved.voices);
        loadPlayerMusicXml(resolved.paths && resolved.paths.length ? resolved.paths : resolved.path, label, !!forceReload);
      }

      // ========== MODOS DE JOGO ==========
      function setMode(mode) {
        if (metroIsRunning) stopMetronome();
        if (currentMode === 'staff' && mode !== 'staff') stopChallengeTimer();
        if (currentMode === 'tuner' && mode !== 'tuner') stopTuner();
        if (currentMode === 'player' && mode !== 'player') stopPlayerPlayback(true);
        currentMode = mode;
        setMoreMenuOpen(false);
        setPlayerSpeedPopoverOpen(false);
        closeSettingsPanel();
        document.querySelectorAll('.mode-btn').forEach(function (btn) {
          btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        var btnMoreMenu = document.getElementById('btnMoreMenu');
        if (btnMoreMenu) btnMoreMenu.classList.toggle('active', mode === 'tuner' || mode === 'metronome' || mode === 'player');
        var btnMoreTuner = document.getElementById('btnMoreTuner');
        var btnMoreMetronome = document.getElementById('btnMoreMetronome');
        var btnMorePlayer = document.getElementById('btnMorePlayer');
        var btnMoreSettings = document.getElementById('btnMoreSettings');
        if (btnMoreTuner) btnMoreTuner.classList.toggle('active', mode === 'tuner');
        if (btnMoreMetronome) btnMoreMetronome.classList.toggle('active', mode === 'metronome');
        if (btnMorePlayer) btnMorePlayer.classList.toggle('active', mode === 'player');
        if (btnMoreSettings) btnMoreSettings.classList.remove('active');
        clearViolinHighlight();
        document.getElementById('currentNoteDisplay').textContent = '\u00A0';

        var violinSection = document.getElementById('violinSection');
        var staffSectionEl = document.getElementById('staffSection');
        var hinosSectionEl = document.getElementById('hinosSection');
        var tunerSectionEl = document.getElementById('tunerSection');
        var metroSectionEl = document.getElementById('metroSection');
        var playerSectionEl = document.getElementById('playerSection');
        var playerSourceRowEl = document.getElementById('playerSourceRow');
        var messageBoxEl = document.getElementById('messageBox');
        if (violinSection && staffSectionEl && hinosSectionEl && tunerSectionEl && metroSectionEl && playerSectionEl) {
          if (mode === 'hinos') {
            violinSection.classList.add('hidden');
            staffSectionEl.classList.add('hidden');
            tunerSectionEl.classList.add('hidden');
            metroSectionEl.classList.add('hidden');
            playerSectionEl.classList.add('hidden');
            hinosSectionEl.classList.remove('hidden');
          } else if (mode === 'staff') {
            violinSection.classList.add('hidden');
            staffSectionEl.classList.remove('hidden');
            tunerSectionEl.classList.add('hidden');
            metroSectionEl.classList.add('hidden');
            playerSectionEl.classList.add('hidden');
            hinosSectionEl.classList.add('hidden');
            closeHinosEditorModal();
            closeHinosNewStudentModal();
          } else if (mode === 'tuner') {
            violinSection.classList.add('hidden');
            staffSectionEl.classList.add('hidden');
            tunerSectionEl.classList.remove('hidden');
            metroSectionEl.classList.add('hidden');
            playerSectionEl.classList.add('hidden');
            hinosSectionEl.classList.add('hidden');
            closeHinosEditorModal();
            closeHinosNewStudentModal();
          } else if (mode === 'metronome') {
            violinSection.classList.add('hidden');
            staffSectionEl.classList.add('hidden');
            tunerSectionEl.classList.add('hidden');
            metroSectionEl.classList.remove('hidden');
            playerSectionEl.classList.add('hidden');
            hinosSectionEl.classList.add('hidden');
            closeHinosEditorModal();
            closeHinosNewStudentModal();
          } else if (mode === 'player') {
            violinSection.classList.add('hidden');
            staffSectionEl.classList.add('hidden');
            tunerSectionEl.classList.add('hidden');
            metroSectionEl.classList.add('hidden');
            playerSectionEl.classList.remove('hidden');
            hinosSectionEl.classList.add('hidden');
            closeHinosEditorModal();
            closeHinosNewStudentModal();
            if (playerSourceRowEl) playerSourceRowEl.classList.remove('hidden');
            if (messageBoxEl) messageBoxEl.classList.add('hidden');
          } else {
            violinSection.classList.remove('hidden');
            staffSectionEl.classList.add('hidden');
            tunerSectionEl.classList.add('hidden');
            metroSectionEl.classList.add('hidden');
            playerSectionEl.classList.add('hidden');
            hinosSectionEl.classList.add('hidden');
            closeHinosEditorModal();
            closeHinosNewStudentModal();
            if (playerSourceRowEl) playerSourceRowEl.classList.remove('hidden');
            if (messageBoxEl) messageBoxEl.classList.remove('hidden');
          }
        }
        var progressSectionEl = document.getElementById('progressSection');
        if (progressSectionEl) {
          progressSectionEl.classList.toggle('hidden', mode === 'hinos' || mode === 'tuner' || mode === 'metronome' || mode === 'player');
        }

        if (mode === 'learn') {
          updateChallengeStats();
          setMessage('Mantenha o dedo pressionado numa nota para ouvir o som.');
        } else if (mode === 'challenge') {
          updateChallengeStats();
          totalChallenges = 0;
          score = 0;
          updateProgress();
          startChallenge();
        } else if (mode === 'staff') {
          resetChallengeSession(true);
          score = 0;
          totalChallenges = 0;
          updateProgress();
          startStaffRound();
        } else if (mode === 'tuner') {
          updateChallengeStats();
          updateProgress();
          setMessage('Afinador pronto. Selecione o preset e toque em Iniciar.');
          if (!tunerRunning) startTuner();
        } else if (mode === 'metronome') {
          updateChallengeStats();
          updateProgress();
          updateMetronomeModeUI();
          setMessage('Escolha um ritmo no metrônomo.');
          if (metroIsRunning) updateMetroButtons();
        } else if (mode === 'hinos') {
          updateChallengeStats();
          if (hinosLastSyncInstrumentId !== currentInstrument.id) {
            syncHinosAfinaçãoFromInstrument(currentInstrument);
            hinosLastSyncInstrumentId = currentInstrument.id;
          } else {
            setHinosAfinaçãoTab(hinosActiveAfinação);
          }
          renderHinosStudentSelect();
          refreshHinosVoiceButtons();
          setMessage('Escolha o aluno e a afinação da ficha; toque num hino para marcar as vozes.');
        } else if (mode === 'player') {
          updateChallengeStats();
          updateProgress();
          ensurePlayerCatalogLoaded(true).then(function () {
            loadPlayerFromCatalogSelection(false);
          }).catch(function () {
            loadPlayerMusicXml(PLAYER_SCORE_URL, 'Partitura padrão', false);
          });
        }
        setTimeout(updateBottomNavVisibility, 0);
      }

      function formatChallengeTime(ms) {
        var totalSeconds = Math.max(0, Math.floor(ms / 1000));
        var mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        var ss = String(totalSeconds % 60).padStart(2, '0');
        return mm + ':' + ss;
      }

      /** Confetes ao concluir o desafio do pentagrama (20/20). Canvas em tela cheia, sem bloquear cliques. */
      function launchStaffConfetti() {
        try {
          if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        } catch (e) {}
        var prev = document.getElementById('confettiCanvas');
        if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
        if (confettiAnimationId) {
          cancelAnimationFrame(confettiAnimationId);
          confettiAnimationId = null;
        }
        var canvas = document.createElement('canvas');
        canvas.id = 'confettiCanvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:2500;';
        document.body.appendChild(canvas);
        var w = Math.max(1, window.innerWidth);
        var h = Math.max(1, window.innerHeight);
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        if (!ctx) return;
        var colors = ['#7d9d7a', '#81c784', '#a5d6a7', '#e8b4bc', '#f5d6a8', '#b3e5fc', '#d1c4e9', '#ffd54f', '#ffcc80', '#ce93d8', '#90caf9'];
        var count = Math.min(150, Math.max(60, Math.floor(w / 5)));
        var particles = [];
        var i;
        for (i = 0; i < count; i++) {
          particles.push({
            x: w * 0.5 + (Math.random() - 0.5) * w * 0.95,
            y: -40 - Math.random() * h * 0.25,
            w: 5 + Math.random() * 8,
            h: 3 + Math.random() * 6,
            vx: -3 + Math.random() * 6,
            vy: 2 + Math.random() * 4,
            rot: Math.random() * Math.PI * 2,
            vr: -0.2 + Math.random() * 0.4,
            c: colors[Math.floor(Math.random() * colors.length)]
          });
        }
        var start = performance.now();
        var duration = 4200;
        function frame(now) {
          var elapsed = now - start;
          ctx.clearRect(0, 0, w, h);
          var j;
          for (j = 0; j < particles.length; j++) {
            var p = particles[j];
            p.vy += 0.11;
            p.vx *= 0.997;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
            ctx.restore();
          }
          if (elapsed < duration) {
            confettiAnimationId = requestAnimationFrame(frame);
          } else {
            confettiAnimationId = null;
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
          }
        }
        confettiAnimationId = requestAnimationFrame(frame);
      }

      function stopChallengeTimer() {
        if (challengeTimerInterval) {
          clearInterval(challengeTimerInterval);
          challengeTimerInterval = null;
        }
      }

      function startChallengeTimer() {
        challengeStartTs = Date.now();
        stopChallengeTimer();
        challengeTimerInterval = setInterval(updateChallengeStats, 250);
      }

      function getChallengeAttemptKey(noteId, stringKey, position) {
        return String(noteId || '');
      }

      function clearChallengeDiscardedCells() {
        document.querySelectorAll('.note-option-btn.challenge-discarded').forEach(function (cell) {
          cell.classList.remove('challenge-discarded');
        });
      }

      function resetChallengeSession(shouldRestartTimer) {
        challengeRound = 0;
        challengeErrors = 0;
        challengeDiscardedAttempts = {};
        clearChallengeDiscardedCells();
        if (shouldRestartTimer) {
          startChallengeTimer();
        } else {
          stopChallengeTimer();
        }
        updateChallengeStats();
      }

      function updateChallengeStats() {
        var statsEl = document.getElementById('challengeStats');
        if (!statsEl) return;
        var isChallengeMode = currentMode === 'staff';
        statsEl.classList.toggle('hidden', !isChallengeMode);
        if (!isChallengeMode) return;

        var timerEl = document.getElementById('challengeTimer');
        var roundEl = document.getElementById('challengeRound');
        var errorsEl = document.getElementById('challengeErrors');
        if (timerEl) {
          var elapsed = challengeStartTs ? (Date.now() - challengeStartTs) : 0;
          timerEl.textContent = '⏱️ ' + formatChallengeTime(elapsed);
        }
        if (roundEl) roundEl.textContent = 'Rodada ' + challengeRound + '/' + CHALLENGE_ROUNDS_LIMIT;
        if (errorsEl) errorsEl.textContent = '❌ ' + challengeErrors + '/' + CHALLENGE_ERRORS_LIMIT;
      }

      function startChallenge() {
        var noteId, freq, nome, stringKey = null, pos = null;
        
        // Instrumentos de corda: escolhe corda e posição aleatória
        if (currentInstrument.tipo === 'corda' && FINGERBOARD.length > 0 && CORDAS.length > 0) {
          pos = Math.floor(Math.random() * FINGERBOARD.length);
          var s = Math.floor(Math.random() * CORDAS.length);
          stringKey = CORDAS[s];
          noteId = FINGERBOARD[pos][s];
          freq = FREQ_BOARD[pos] ? FREQ_BOARD[pos][s] : undefined;
        }
        // Instrumentos de sopro/metal: escolhe nota aleatória
        else if ((currentInstrument.tipo === 'sopro' || currentInstrument.tipo === 'metal' || currentInstrument.tipo === 'voz') && currentInstrument.notas) {
          var idx = Math.floor(Math.random() * currentInstrument.notas.length);
          noteId = currentInstrument.notas[idx];
          freq = currentInstrument.freqBoard[idx] ? currentInstrument.freqBoard[idx][0] : NOTAS.find(function(n) { return n.id === noteId; }).freq;
        }
        else {
          // Fallback: escolhe nota aleatória básica
          var randomNote = NOTAS[Math.floor(Math.random() * NOTAS.length)];
          noteId = randomNote.id;
          freq = randomNote.freq;
        }
        
        nome = getNoteNameInKey(noteId, currentKey);
        challengeTarget = { id: noteId, nome: nome, freq: freq, stringKey: stringKey, pos: pos };
        setMessage('Qual é esta nota? Ouça com atenção.');
        playNoteSound(challengeTarget.id, challengeTarget.freq);
        document.getElementById('currentNoteDisplay').textContent = '?';
        if (challengeTimeout) clearTimeout(challengeTimeout);
        challengeTimeout = setTimeout(function () {
          setMessage('Escolha a nota que você ouviu.');
        }, 1200);
      }

      /** Chamado ao soltar o botão: para a nota e aplica a lógica do modo (desafio/learn/free). */
      function onNoteEnd(noteId, freqHz, stringKey, position) {
        var nota = NOTAS.find(function (n) { return n.id === noteId; });
        if (!nota) return;

        var nomeNaTonalidade = getNoteNameInKey(noteId, currentKey);
        if (currentMode === 'learn') {
          setMessage('Esta é a nota ' + nomeNaTonalidade + '. Mantenha pressionado para ouvir de novo.');
          speak('Nota ' + nomeNaTonalidade);
        } else if (currentMode === 'challenge' && challengeTarget) {
          totalChallenges++;
          var noteMatch = noteId === challengeTarget.id;
          var stringMatch = challengeTarget.stringKey ? (stringKey === challengeTarget.stringKey) : true;
          // Equivalência entre 4º dedo e corda seguinte solta:
          // Ré(4º dedo na Sol) == Ré(corda Ré solta), etc.
          var equivalentOpenStringMatch = false;
          if (
            currentInstrument &&
            currentInstrument.tipo === 'corda' &&
            challengeTarget.stringKey &&
            typeof challengeTarget.pos === 'number' &&
            stringKey &&
            typeof position === 'number'
          ) {
            var targetStringIdx = CORDAS.indexOf(challengeTarget.stringKey);
            var attemptStringIdx = CORDAS.indexOf(stringKey);
            if (targetStringIdx >= 0 && attemptStringIdx >= 0) {
              var targetIsFourth = challengeTarget.pos === 4;
              var targetIsOpen = challengeTarget.pos === 0;
              var attemptIsOpen = position === 0;
              var attemptIsFourth = position === 4;

              // alvo no 4º dedo <-> tentativa corda seguinte solta
              if (targetIsFourth && attemptIsOpen && attemptStringIdx === targetStringIdx + 1) {
                equivalentOpenStringMatch = true;
              }
              // alvo corda solta <-> tentativa no 4º dedo da corda anterior
              if (targetIsOpen && attemptIsFourth && attemptStringIdx === targetStringIdx - 1) {
                equivalentOpenStringMatch = true;
              }
            }
          }

          // No desafio, valida nota + corda, aceitando equivalência 4º dedo <-> corda solta.
          var isCorrect = noteMatch && (stringMatch || equivalentOpenStringMatch);
          var targetLabel = buildChallengeTargetLabel(challengeTarget);
          if (isCorrect) {
            score++;
            playGameSfx('correct');
            document.getElementById('currentNoteDisplay').textContent = targetLabel;
            showPositiveFeedback();
            updateProgress();
            setTimeout(startChallenge, 1800);
          } else {
            playGameSfx('wrong');
            document.getElementById('currentNoteDisplay').textContent = targetLabel;
            var attemptedLabel = nomeNaTonalidade;
            if (stringKey) attemptedLabel += ' da corda ' + getNoteNameInKey(stringKey, currentKey);
            setMessage('Você tocou ' + attemptedLabel + '. A esperada era ' + targetLabel + '. Vamos tentar de novo!');
            speak('Vamos tentar de novo. A nota era ' + targetLabel);
            // Mostra qual era a nota esperada no espelho do instrumento (para feedback).
            highlightViolinCellByTarget(challengeTarget);
            // Remove o destaque antes do próximo desafio (para não entregar a próxima resposta).
            setTimeout(function () {
              clearViolinHighlight();
              startChallenge();
            }, 2200);
          }
        }

        // Em modos livres, remove destaque ao soltar o botão.
        // No desafio, o destaque da nota-alvo continua ativo.
        if (currentMode !== 'challenge') {
          clearViolinHighlight();
        }
      }

      // ========== PENTAGRAMA: DESENHO E LÓGICA DO GAME ==========
      function initStaff() {
        var svg = document.getElementById('staffSvg');
        if (!svg) return;
        var NS = 'http://www.w3.org/2000/svg';
        svg.setAttribute('viewBox', '0 0 300 160');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.innerHTML = '';

        for (var i = 0; i < 5; i++) {
          var y = 70 + i * 12;
          var line = document.createElementNS(NS, 'line');
          line.setAttribute('x1', '40');
          line.setAttribute('x2', '280');
          line.setAttribute('y1', String(y));
          line.setAttribute('y2', String(y));
          line.setAttribute('stroke', '#444');
          line.setAttribute('stroke-width', '2');
          svg.appendChild(line);
        }

        staffClefElement = document.createElementNS(NS, 'text');
        staffClefElement.setAttribute('x', '18');
        staffClefElement.setAttribute('fill', '#444');
        svg.appendChild(staffClefElement);

        staffNoteEllipse = document.createElementNS(NS, 'ellipse');
        staffNoteEllipse.setAttribute('cx', '200');
        staffNoteEllipse.setAttribute('cy', '100');
        staffNoteEllipse.setAttribute('rx', '10');
        staffNoteEllipse.setAttribute('ry', '7');
        staffNoteEllipse.setAttribute('fill', '#222');
        svg.appendChild(staffNoteEllipse);
        updateStaffClefVisual();
      }

      function updateStaffClefVisual() {
        if (!staffClefElement) return;
        var clef = CLAVES.find(function (c) { return c.id === currentClef; }) || CLAVES[0];
        staffClefElement.textContent = clef.simbolo;
        staffClefElement.setAttribute('y', clef.y);
        staffClefElement.setAttribute('x', clef.x);
        staffClefElement.setAttribute('font-size', clef.fontSize);
        staffClefElement.setAttribute('font-family', '"Noto Music", serif');
        staffClefElement.setAttribute('text-anchor', clef.anchor || 'start');
        staffClefElement.setAttribute('dominant-baseline', clef.baseline || 'alphabetic');
      }

      function setStaffNote(position) {
        if (!staffNoteEllipse || !position) return;
        staffNoteEllipse.setAttribute('cy', String(position.y));
        staffNoteEllipse.setAttribute('cx', '200');

        var svg = document.getElementById('staffSvg');
        if (!svg) return;

        // Remove linhas suplementares antigas
        var old = svg.querySelectorAll('.ledger-line');
        old.forEach(function (l) { svg.removeChild(l); });

        // Desenha linhas suplementares necessárias (inclusive quando a nota fica entre elas).
        if (position.ledgerYs && position.ledgerYs.length) {
          var NS = 'http://www.w3.org/2000/svg';
          position.ledgerYs.forEach(function (ledgerY) {
            var line = document.createElementNS(NS, 'line');
            line.setAttribute('x1', '180');
            line.setAttribute('x2', '220');
            line.setAttribute('y1', String(ledgerY));
            line.setAttribute('y2', String(ledgerY));
            line.setAttribute('stroke', '#444');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('class', 'ledger-line');
            svg.insertBefore(line, staffNoteEllipse);
          });
        }
      }

      function startStaffRound() {
        if (!staffNoteEllipse) initStaff();
        var positions = buildStaffPositionsForClef(currentClef);
        if (!positions.length) return;
        staffAnswerLocked = false;
        challengeDiscardedAttempts = {};
        clearChallengeDiscardedCells();
        var index = Math.floor(Math.random() * positions.length);
        var pos = positions[index];
        staffModeTarget = { id: pos.noteId, index: index };
        setStaffNote(pos);
        document.getElementById('currentNoteDisplay').textContent = '?';
        setMessage('Qual é esta nota no pentagrama? Toque o nome correto.');
        playNoteSound(pos.noteId, pos.freq);
      }

      function handleNoteOptionClick(selectedId, buttonEl) {
        var nomeSelecionada = getNoteNameInKey(selectedId, currentKey);

        if (currentMode !== 'staff' || !staffModeTarget) {
          setMessage('Esta é a nota ' + nomeSelecionada + '.');
          speak('Nota ' + nomeSelecionada);
          return;
        }

        if (staffAnswerLocked) {
          return;
        }

        if (challengeRound >= CHALLENGE_ROUNDS_LIMIT) {
          var restartWrapDone = document.getElementById('staffRestartWrap');
          if (restartWrapDone) restartWrapDone.classList.remove('hidden');
          setMessage('Desafio do pentagrama concluído. Toque em Reiniciar para jogar novamente.');
          return;
        }

        var attemptKey = getChallengeAttemptKey(selectedId);
        if (challengeDiscardedAttempts[attemptKey]) {
          setMessage('Você já tentou essa opção nesta rodada. Escolha outra nota.');
          return;
        }

        var corretaNome = getNoteNameInKey(staffModeTarget.id, currentKey);

        document.querySelectorAll('.note-option-btn').forEach(function (btn) {
          btn.classList.remove('correct', 'wrong');
        });

        if (selectedId === staffModeTarget.id) {
          staffAnswerLocked = true;
          score++;
          challengeRound++;
          totalChallenges = challengeRound;
          playGameSfx('correct');
          buttonEl.classList.add('correct');
          showPositiveFeedback();
          updateChallengeStats();
          updateProgress();
          if (challengeRound >= CHALLENGE_ROUNDS_LIMIT) {
            stopChallengeTimer();
            var finalElapsed = challengeStartTs ? (Date.now() - challengeStartTs) : 0;
            var restartWrap = document.getElementById('staffRestartWrap');
            if (restartWrap) restartWrap.classList.remove('hidden');
            launchStaffConfetti();
            setMessage('Parabéns! Você concluiu 20/20 no pentagrama em ' + formatChallengeTime(finalElapsed) + ' com ' + challengeErrors + ' erro(s).');
            speak('Parabéns! Você concluiu o pentagrama.');
            return;
          }
        } else {
          staffAnswerLocked = true;
          playGameSfx('wrong');
          challengeDiscardedAttempts[attemptKey] = true;
          if (buttonEl) buttonEl.classList.add('challenge-discarded');
          challengeErrors++;
          buttonEl.classList.add('wrong');
          var correctBtn = document.querySelector('.note-option-btn[data-note-id="' + staffModeTarget.id + '"]');
          if (correctBtn) correctBtn.classList.add('correct');
          var remainingErrors = Math.max(CHALLENGE_ERRORS_LIMIT - challengeErrors, 0);
          setMessage('Você escolheu ' + nomeSelecionada + '. A nota correta era ' + corretaNome + '. Erros restantes: ' + remainingErrors + '.');
          speak('A nota correta era ' + corretaNome);
          updateChallengeStats();
          if (challengeErrors >= CHALLENGE_ERRORS_LIMIT) {
            stopChallengeTimer();
            setTimeout(function () {
              setMessage('Você chegou a 3 erros. A partida do pentagrama foi reiniciada em 1/20.');
              speak('Partida reiniciada.');
              resetChallengeSession(true);
              staffAnswerLocked = false;
              score = 0;
              totalChallenges = 0;
              updateProgress();
              startStaffRound();
            }, 900);
            return;
          }
        }

        setTimeout(function () {
          document.querySelectorAll('.note-option-btn').forEach(function (btn) {
            btn.classList.remove('correct', 'wrong');
          });
          updateProgress();
          startStaffRound();
        }, 1800);
      }

      // ========== PROGRESSO E ESTRELAS ==========
      function updateProgress() {
        const progressTotal = currentMode === 'staff' ? CHALLENGE_ROUNDS_LIMIT : Math.max(totalChallenges, 1);
        const pct = totalChallenges === 0 ? 0 : Math.round((totalChallenges / progressTotal) * 100);
        document.getElementById('progressFill').style.width = pct + '%';
        if (currentMode === 'staff') {
          document.getElementById('progressText').textContent = challengeRound + ' / ' + CHALLENGE_ROUNDS_LIMIT;
        } else {
          document.getElementById('progressText').textContent = score + ' / ' + totalChallenges;
        }

        const stars = document.querySelectorAll('.star');
        const accuracy = totalChallenges === 0 ? 0 : Math.round((score / totalChallenges) * 100);
        const level = accuracy >= 90 ? 5 : accuracy >= 70 ? 4 : accuracy >= 50 ? 3 : accuracy >= 30 ? 2 : accuracy >= 10 ? 1 : 0;
        stars.forEach(function (star, i) {
          star.classList.toggle('earned', i < level);
        });
      }

      // ========== REINICIAR ==========
      function restart() {
        stopChallengeTimer();
        score = 0;
        totalChallenges = 0;
        challengeRound = 0;
        challengeErrors = 0;
        challengeDiscardedAttempts = {};
        staffAnswerLocked = false;
        challengeTarget = null;
        if (challengeTimeout) clearTimeout(challengeTimeout);
        updateProgress();
        updateChallengeStats();
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('progressText').textContent = '0 / 0';
        document.querySelectorAll('.star').forEach(function (s) { s.classList.remove('earned'); });
        setMessage('Pronto para começar de novo! Escolha um modo.');
        document.getElementById('currentNoteDisplay').textContent = '\u00A0';
        clearViolinHighlight();
        clearChallengeDiscardedCells();
        var staffRestartWrap = document.getElementById('staffRestartWrap');
        if (staffRestartWrap) staffRestartWrap.classList.add('hidden');
        if (currentMode === 'challenge') startChallenge();
        if (currentMode === 'staff') {
          resetChallengeSession(true);
          startStaffRound();
        }
      }

      // ========== EVENTOS ==========
      function bindEvents() {
        var btnSettingsClose = document.getElementById('btnSettingsClose');
        if (btnSettingsClose) btnSettingsClose.addEventListener('click', closeSettingsPanel);
        var settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
          settingsModal.addEventListener('click', function (e) {
            if (e.target === settingsModal) closeSettingsPanel();
          });
        }

        document.querySelectorAll('.instrument-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            setInstrument(this.dataset.instrumentId);
          });
        });

        document.querySelectorAll('.key-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            setKey(this.dataset.keyId);
          });
        });

        document.querySelectorAll('.clef-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            setClef(this.dataset.clefId);
          });
        });

        var btnAbout = document.getElementById('btnAbout');
        if (btnAbout) btnAbout.addEventListener('click', openAboutModal);
        var btnAboutClose = document.getElementById('btnAboutClose');
        if (btnAboutClose) btnAboutClose.addEventListener('click', closeAboutModal);
        var btnAboutOk = document.getElementById('btnAboutOk');
        if (btnAboutOk) btnAboutOk.addEventListener('click', closeAboutModal);

        var aboutModal = document.getElementById('aboutModal');
        if (aboutModal) {
          aboutModal.addEventListener('click', function (e) {
            if (e.target === aboutModal) closeAboutModal();
          });
        }

        // Espelho: nota toca enquanto o ponteiro/touch estiver pressionado.
        var board = document.getElementById('violinBoard');
        function pointerStartOnCell(pointerId, cell) {
          if (!cell || !cell.dataset.noteId) return;
          var noteId = cell.dataset.noteId;
          var freq = cell.dataset.freq ? parseFloat(cell.dataset.freq) : undefined;
          var stringKey = cell.dataset.stringKey || null;
          var position = cell.dataset.position != null ? parseInt(cell.dataset.position, 10) : null;
          var nota = NOTAS.find(function (n) { return n.id === noteId; });
          if (!nota) return;

          if (activePointerNotes[pointerId]) {
            var prev = activePointerNotes[pointerId];
            if (prev.cancelInit) prev.cancelInit();
            if (prev.stop) prev.stop();
            if (prev.cell) prev.cell.classList.remove('playing');
            onNoteEnd(prev.noteId, prev.freq, prev.stringKey, prev.position);
          }

          var data = { noteId: noteId, freq: freq, stringKey: stringKey, position: position, cell: cell, stop: null, cancelInit: null };
          data.cancelInit = startNoteSoundForPointer(noteId, freq, function (fn) {
            data.stop = fn;
          });
          activePointerNotes[pointerId] = data;

          if (currentMode === 'challenge') {
            document.getElementById('currentNoteDisplay').textContent = '?';
          } else {
            document.getElementById('currentNoteDisplay').textContent = getNoteNameInKey(noteId, currentKey);
            clearViolinHighlight();
            cell.classList.add('highlight');
          }
          cell.classList.add('playing');
        }

        function pointerEnd(pointerId) {
          var data = activePointerNotes[pointerId];
          if (!data) return;
          if (data.cancelInit) data.cancelInit();
          if (data.stop) data.stop();
          if (data.cell) data.cell.classList.remove('playing');
          onNoteEnd(data.noteId, data.freq, data.stringKey, data.position);
          delete activePointerNotes[pointerId];
        }

        if (board) {
          board.addEventListener('contextmenu', function (e) {
            e.preventDefault();
          });
          board.addEventListener('touchstart', function (e) {
            if (e.target && e.target.closest && e.target.closest('.finger-cell')) e.preventDefault();
          }, { passive: false });
          board.addEventListener('touchmove', function (e) {
            if (e.target && e.target.closest && e.target.closest('.finger-cell')) e.preventDefault();
          }, { passive: false });
          board.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            var cell = e.target.closest('.finger-cell');
            if (!cell || !board.contains(cell)) return;
            e.preventDefault();
            pointerStartOnCell(e.pointerId, cell);
            if (cell.setPointerCapture) {
              try { cell.setPointerCapture(e.pointerId); } catch (err) {}
            }
          });
          board.addEventListener('pointermove', function (e) {
            if (!activePointerNotes[e.pointerId]) return;
            var under = document.elementFromPoint(e.clientX, e.clientY);
            var cell = under ? under.closest('.finger-cell') : null;
            if (!cell || !board.contains(cell)) return;
            if (activePointerNotes[e.pointerId].cell === cell) return;
            pointerStartOnCell(e.pointerId, cell);
          });
          board.addEventListener('pointerup', function (e) {
            pointerEnd(e.pointerId);
          });
          board.addEventListener('pointercancel', function (e) {
            pointerEnd(e.pointerId);
          });
          board.addEventListener('pointerleave', function (e) {
            if (e.pointerType === 'mouse') pointerEnd(e.pointerId);
          });
        }

        document.querySelectorAll('.mode-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (this.dataset && this.dataset.mode) {
              setMode(this.dataset.mode);
            } else if (this.id === 'btnMoreMenu') {
              var menu = document.getElementById('modeMoreMenu');
              setMoreMenuOpen(!menu || menu.classList.contains('hidden'));
            }
          });
        });
        var btnMoreTuner = document.getElementById('btnMoreTuner');
        if (btnMoreTuner) {
          btnMoreTuner.addEventListener('click', function () {
            setMode('tuner');
          });
        }
        var btnMoreMetronome = document.getElementById('btnMoreMetronome');
        if (btnMoreMetronome) {
          btnMoreMetronome.addEventListener('click', function () {
            openMetronomeModal();
          });
        }
        var btnMorePlayer = document.getElementById('btnMorePlayer');
        if (btnMorePlayer) {
          btnMorePlayer.addEventListener('click', function () {
            setMode('player');
          });
        }
        var btnPlayerPlay = document.getElementById('btnPlayerPlay');
        if (btnPlayerPlay) {
          btnPlayerPlay.addEventListener('click', function () {
            startPlayerPlayback();
          });
        }
        var btnPlayerPause = document.getElementById('btnPlayerPause');
        if (btnPlayerPause) {
          btnPlayerPause.addEventListener('click', function () {
            if (!playerPlayback.isPlaying) return;
            stopPlayerPlayback(true);
            setMessage('Playback pausado.');
          });
        }
        var btnPlayerStop = document.getElementById('btnPlayerStop');
        if (btnPlayerStop) {
          btnPlayerStop.addEventListener('click', function () {
            stopPlayerPlayback(false);
            setMessage('Playback parado.');
          });
        }
        var btnPlayerSpeed = document.getElementById('btnPlayerSpeed');
        var playerSpeedPopover = document.getElementById('playerSpeedPopover');
        var playerSpeedInput = document.getElementById('playerSpeedInput');
        var playerSpeedSlider = document.getElementById('playerSpeedSlider');
        if (btnPlayerSpeed) {
          btnPlayerSpeed.addEventListener('click', function (e) {
            e.stopPropagation();
            var willOpen = !playerSpeedPopover || playerSpeedPopover.classList.contains('hidden');
            setPlayerSpeedPopoverOpen(willOpen);
          });
        }
        if (playerSpeedPopover) {
          playerSpeedPopover.addEventListener('click', function (e) {
            e.stopPropagation();
          });
        }
        if (playerSpeedInput) {
          playerSpeedInput.addEventListener('focus', function () {
            beginPlayerSpeedAdjust();
          });
          playerSpeedInput.addEventListener('input', function () {
            var pct = parseInt(this.value || '100', 10);
            if (!isFinite(pct)) pct = 100;
            previewPlayerSpeedPercent(pct);
          });
          playerSpeedInput.addEventListener('change', function () {
            var pct = parseInt(this.value || '100', 10);
            if (!isFinite(pct)) pct = 100;
            endPlayerSpeedAdjust(pct);
          });
          playerSpeedInput.addEventListener('blur', function () {
            if (!playerSpeedAdjusting) return;
            var pct = parseInt(this.value || '100', 10);
            if (!isFinite(pct)) pct = getPlayerSpeedPercent();
            endPlayerSpeedAdjust(pct);
          });
        }
        if (playerSpeedSlider) {
          playerSpeedSlider.addEventListener('pointerdown', function () {
            beginPlayerSpeedAdjust();
          });
          playerSpeedSlider.addEventListener('mousedown', function () {
            beginPlayerSpeedAdjust();
          });
          playerSpeedSlider.addEventListener('touchstart', function () {
            beginPlayerSpeedAdjust();
          }, { passive: true });
          playerSpeedSlider.addEventListener('input', function () {
            var pct = parseInt(this.value || '100', 10);
            if (!isFinite(pct)) pct = 100;
            previewPlayerSpeedPercent(pct);
          });
          playerSpeedSlider.addEventListener('change', function () {
            var pct = parseInt(this.value || '100', 10);
            if (!isFinite(pct)) pct = 100;
            endPlayerSpeedAdjust(pct);
          });
        }
        var playerSelectCollection = document.getElementById('playerSelectCollection');
        if (playerSelectCollection) {
          playerSelectCollection.addEventListener('change', function () {
            playerSelectedCollectionId = String(this.value || '');
            playerSelectedItemId = null;
            playerSelectedHinoNumero = null;
            renderPlayerCatalogControls();
            loadPlayerFromCatalogSelection(true);
          });
        }
        var playerSelectAfinacao = document.getElementById('playerSelectAfinacao');
        if (playerSelectAfinacao) {
          playerSelectAfinacao.addEventListener('change', function () {
            playerSelectedAfinacao = String(this.value || 'do').toLowerCase();
            renderPlayerCatalogControls();
            loadPlayerFromCatalogSelection(true);
          });
        }
        var playerSelectHino = document.getElementById('playerSelectHino');
        var playerHinoSuggestions = document.getElementById('playerHinoSuggestions');
        var playerHinoPicker = document.getElementById('playerHinoPicker');
        if (playerSelectHino) {
          function applyPlayerHinoFromInput() {
            var typed = String(playerSelectHino.value || '');
            var parsedNumero = parsePlayerNumeroFromInputValue(typed);
            if (isFinite(parsedNumero) && parsedNumero > 0) {
              var found = getPlayerCatalogItemByNumero(parsedNumero);
              if (found) {
                playerSelectedItemId = String(found.id || '');
                playerSelectedHinoNumero = Number(found.numero || parsedNumero);
              } else {
                playerSelectedItemId = null;
                playerSelectedHinoNumero = parsedNumero;
              }
            }
            renderPlayerCatalogControls();
            loadPlayerFromCatalogSelection(true);
          }
          playerSelectHino.addEventListener('input', function () {
            this.dataset.openAll = '0';
            var parsedNumero = parsePlayerNumeroFromInputValue(this.value);
            if (isFinite(parsedNumero) && parsedNumero > 0) playerSelectedHinoNumero = parsedNumero;
            renderPlayerCatalogControls();
            if (playerHinoSuggestions && playerHinoSuggestions.innerHTML.trim()) {
              playerHinoSuggestions.classList.remove('hidden');
            }
          });
          playerSelectHino.addEventListener('focus', function () {
            this.dataset.openAll = '1';
            renderPlayerCatalogControls();
            if (playerHinoSuggestions && playerHinoSuggestions.innerHTML.trim()) {
              playerHinoSuggestions.classList.remove('hidden');
            }
          });
          playerSelectHino.addEventListener('click', function () {
            this.dataset.openAll = '1';
            renderPlayerCatalogControls();
            if (playerHinoSuggestions && playerHinoSuggestions.innerHTML.trim()) {
              playerHinoSuggestions.classList.remove('hidden');
            }
          });
          playerSelectHino.addEventListener('change', applyPlayerHinoFromInput);
          playerSelectHino.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            this.dataset.openAll = '0';
            applyPlayerHinoFromInput();
          });
        }
        if (playerHinoSuggestions) {
          playerHinoSuggestions.addEventListener('click', function (e) {
            var btn = e.target && e.target.closest ? e.target.closest('.player-hino-suggestion') : null;
            if (!btn) return;
            var itemId = String(btn.getAttribute('data-item-id') || '');
            var n = parseInt(btn.getAttribute('data-hino-numero') || '0', 10);
            if (!itemId && (!isFinite(n) || n <= 0)) return;
            var item = itemId ? getPlayerCatalogItemById(itemId) : getPlayerCatalogItemByNumero(n);
            if (item) {
              playerSelectedItemId = String(item.id || '');
              playerSelectedHinoNumero = Number(item.numero || 0);
            } else {
              playerSelectedItemId = null;
              playerSelectedHinoNumero = n;
            }
            if (item && playerSelectHino) playerSelectHino.value = String(item.numero) + ' · ' + (item.titulo || 'Sem título');
            if (playerSelectHino) playerSelectHino.dataset.openAll = '0';
            playerHinoSuggestions.classList.add('hidden');
            renderPlayerCatalogControls();
            loadPlayerFromCatalogSelection(true);
          });
        }
        document.addEventListener('click', function (e) {
          if (!playerHinoPicker || !playerHinoSuggestions) return;
          if (!playerHinoPicker.contains(e.target)) {
            playerHinoSuggestions.classList.add('hidden');
          }
        });
        var playerVoiceChecks = document.getElementById('playerVoiceChecks');
        if (playerVoiceChecks) {
          playerVoiceChecks.addEventListener('change', function (e) {
            var target = e && e.target;
            if (!target || target.type !== 'checkbox') return;
            var values = [];
            playerVoiceChecks.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
              values.push(String(cb.value || '').toLowerCase());
            });
            if (!values.length) {
              target.checked = true;
              values = [String(target.value || 's').toLowerCase()];
            }
            playerSelectedVoices = values;
            renderPlayerCatalogControls();
            loadPlayerFromCatalogSelection(true);
          });
        }
        var playerMetronomeToggle = document.getElementById('playerMetronomeToggle');
        if (playerMetronomeToggle) {
          playerMetronomeToggle.addEventListener('click', function () {
            playerMetronomeEnabled = !playerMetronomeEnabled;
            syncPlayerLeverUi();
            setMessage(playerMetronomeEnabled ? 'Metrônomo do player ligado.' : 'Metrônomo do player desligado.');
          });
        }
        var playerAutoScrollToggle = document.getElementById('playerAutoScrollToggle');
        if (playerAutoScrollToggle) {
          playerAutoScrollToggle.addEventListener('click', function () {
            playerAutoScrollEnabled = !playerAutoScrollEnabled;
            syncPlayerLeverUi();
            setMessage(playerAutoScrollEnabled ? 'Rolagem automática ligada.' : 'Rolagem automática desligada.');
          });
        }
        var playerLoopToggle = document.getElementById('playerLoopToggle');
        if (playerLoopToggle) {
          playerLoopToggle.addEventListener('click', function () {
            playerLoopEnabled = !playerLoopEnabled;
            syncPlayerLeverUi();
            setMessage(playerLoopEnabled ? 'Loop da partitura ligado.' : 'Loop da partitura desligado.');
          });
        }
        var playerColorToggle = document.getElementById('playerColorToggle');
        if (playerColorToggle) {
          playerColorToggle.addEventListener('click', function () {
            playerColorizedNotes = !playerColorizedNotes;
            syncPlayerLeverUi();
            loadPlayerFromCatalogSelection(true);
            setMessage(playerColorizedNotes ? 'Partitura colorida ligada.' : 'Partitura em preto (padrão).');
          });
        }
        var playerNoteNamesToggle = document.getElementById('playerNoteNamesToggle');
        if (playerNoteNamesToggle) {
          playerNoteNamesToggle.addEventListener('click', function () {
            playerNoteNameLabels = !playerNoteNameLabels;
            syncPlayerLeverUi();
            if (playerOsmd && playerScoreData) {
              syncPlayerNoteNameLabelOverlays();
            }
            setMessage(
              playerNoteNameLabels ? 'Nomes nas notas ligados.' : 'Nomes nas notas desligados.'
            );
          });
        }
        var playerFingeringToggle = document.getElementById('playerFingeringToggle');
        if (playerFingeringToggle) {
          playerFingeringToggle.addEventListener('click', function () {
            playerShowFingering = !playerShowFingering;
            syncPlayerLeverUi();
            loadPlayerFromCatalogSelection(true);
            setMessage(playerShowFingering ? 'Dedilhado ligado.' : 'Dedilhado desligado.');
          });
        }
        var playerSeek = document.getElementById('playerSeek');
        if (playerSeek) {
          playerSeek.addEventListener('input', function () {
            if (!playerScoreData || !playerScoreData.totalDurationSec) return;
            var ratio = Math.max(0, Math.min(1, (parseFloat(this.value) || 0) / 1000));
            var targetSec = ratio * playerScoreData.totalDurationSec;
            updatePlayerUiNow(targetSec);
          });
          playerSeek.addEventListener('change', function () {
            if (!playerScoreData || !playerScoreData.totalDurationSec) return;
            var ratio = Math.max(0, Math.min(1, (parseFloat(this.value) || 0) / 1000));
            var targetSec = ratio * playerScoreData.totalDurationSec;
            seekPlayerToTime(targetSec, true);
          });
        }
        var playerHost = document.getElementById('playerScoreHost');
        if (playerHost) {
          playerHost.addEventListener('click', function (e) {
            if (currentMode !== 'player' || !playerScoreData) return;
            var acted = seekPlayerFromClick(e.clientX, e.clientY);
            if (acted) {
              setMessage('Posição ajustada na partitura.');
            }
          });
        }
        var btnPlayerSettings = document.getElementById('btnPlayerSettings');
        if (btnPlayerSettings) {
          btnPlayerSettings.addEventListener('click', function () {
            openSettingsPanel();
          });
        }
        var btnMoreSettings = document.getElementById('btnMoreSettings');
        if (btnMoreSettings) {
          btnMoreSettings.addEventListener('click', function () {
            openSettingsPanel();
          });
        }
        document.addEventListener('click', function (e) {
          var menu = document.getElementById('modeMoreMenu');
          var wrap = document.querySelector('.mode-more-wrap');
          if (!menu || !wrap) return;
          if (!wrap.contains(e.target)) setMoreMenuOpen(false);
          var speedWrap = document.getElementById('playerControls');
          if (!speedWrap || !speedWrap.contains(e.target)) setPlayerSpeedPopoverOpen(false);
        });
        function pausePlayerAutoScrollByUser() {
          if (currentMode !== 'player') return;
          if (Date.now() < playerAutoScrollProgrammaticUntil) return;
          playerAutoScrollUserPausedUntil = Date.now() + 2200;
        }
        window.addEventListener('wheel', pausePlayerAutoScrollByUser, { passive: true });
        window.addEventListener('touchmove', pausePlayerAutoScrollByUser, { passive: true });
        window.addEventListener('keydown', function (e) {
          var keys = ['PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'Home', 'End', ' '];
          if (keys.indexOf(e.key) >= 0) pausePlayerAutoScrollByUser();
        });
        window.addEventListener('keydown', function (e) {
          var isSpace = e.key === ' ' || e.code === 'Space' || e.key === 'Spacebar';
          if (!isSpace) return;
          if (currentMode !== 'player') return;
          var target = e.target;
          var tag = target && target.tagName ? String(target.tagName).toUpperCase() : '';
          var typing = !!(target && (target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'));
          if (typing) return;
          if (!playerScoreData || !playerScoreData.events || !playerScoreData.events.length) return;
          e.preventDefault();
          if (playerPlayback.isPlaying || playerPrepToken) {
            stopPlayerPlayback(true);
            setMessage('Playback pausado.');
            return;
          }
          startPlayerPlayback();
        });

        var tunerStartBtn = document.getElementById('tunerStartBtn');
        var tunerStopBtn = document.getElementById('tunerStopBtn');
        var tunerPresetSel = document.getElementById('tunerInstrumentSelect');
        if (tunerStartBtn) {
          tunerStartBtn.addEventListener('click', function () {
            startTuner();
          });
        }
        if (tunerStopBtn) {
          tunerStopBtn.addEventListener('click', function () {
            stopTuner();
          });
        }
        if (tunerPresetSel) {
          renderTunerPresetDynamicInfo();
          tunerPresetSel.addEventListener('change', function () {
            renderTunerPresetDynamicInfo();
            tunerSmoothedFreq = 0;
            tunerRawHistory = [];
            if (!tunerRunning) return;
            setMessage('Preset alterado para ' + tunerPresetSel.options[tunerPresetSel.selectedIndex].text + '.');
          });
        }
        var tunerMicOpenSettingsBtn = document.getElementById('tunerMicOpenSettingsBtn');
        var tunerMicInstructionsBtn = document.getElementById('tunerMicInstructionsBtn');
        var tunerMicHelpOk = document.getElementById('tunerMicHelpOk');
        var tunerMicHelpCloseX = document.getElementById('tunerMicHelpCloseX');
        var tunerMicHelpModal = document.getElementById('tunerMicHelpModal');
        if (tunerMicOpenSettingsBtn) {
          tunerMicOpenSettingsBtn.addEventListener('click', function () {
            tryOpenTunerMicrophoneSettings();
          });
        }
        if (tunerMicInstructionsBtn) {
          tunerMicInstructionsBtn.addEventListener('click', function () {
            openTunerMicHelpModal();
          });
        }
        if (tunerMicHelpOk) tunerMicHelpOk.addEventListener('click', closeTunerMicHelpModal);
        if (tunerMicHelpCloseX) tunerMicHelpCloseX.addEventListener('click', closeTunerMicHelpModal);
        if (tunerMicHelpModal) {
          tunerMicHelpModal.addEventListener('click', function (e) {
            if (e.target === tunerMicHelpModal) closeTunerMicHelpModal();
          });
        }
        document.addEventListener('keydown', function (e) {
          if (e.key !== 'Escape') return;
          var tm = document.getElementById('tunerMicHelpModal');
          if (tm && !tm.classList.contains('hidden')) {
            e.preventDefault();
            closeTunerMicHelpModal();
          }
        });
        var btnStaffRestart = document.getElementById('btnStaffRestart');
        if (btnStaffRestart) {
          btnStaffRestart.addEventListener('click', function () {
            restart();
          });
        }
        window.addEventListener('resize', function () {
          drawTunerGauge(tunerLastCents, tunerLastStatus);
          drawTunerChart();
        });
        document.addEventListener('visibilitychange', function () {
          if (document.visibilityState === 'visible') {
            requestScreenWakeLock();
          }
        });
        window.addEventListener('beforeunload', function () {
          stopTuner();
          releaseScreenWakeLock();
        });

        bindHinosEvents();

        document.getElementById('btnRepeatInstruction').addEventListener('click', repeatInstruction);

        document.getElementById('btnNarration').addEventListener('click', function () {
          narrationEnabled = !narrationEnabled;
          this.textContent = narrationEnabled ? '🗣️ Narração ligada' : '🗣️ Narração';
          if (narrationEnabled) repeatInstruction();
        });

        document.getElementById('btnAmbient').addEventListener('click', toggleAmbient);

        document.getElementById('btnCalmMode').addEventListener('click', function () {
          calmMode = !calmMode;
          document.body.classList.toggle('calm-mode', calmMode);
          this.textContent = calmMode ? '🔉 Modo calmo' : '🔊 Modo calmo';
          if (ambientGain) {
            const ctx = getAudioContext();
            ambientGain.gain.linearRampToValueAtTime(calmMode ? 0.02 : 0.04, ctx.currentTime + 0.3);
          }
        });

        document.getElementById('btnSound').addEventListener('click', function () {
          soundEnabled = !soundEnabled;
          this.textContent = soundEnabled ? '🔈 Som' : '🔇 Som';
          if (!soundEnabled && ambientOsc) stopAmbient();
          if (!soundEnabled && metroIsRunning) stopMetronome();
          if (soundEnabled && ambientEnabled) startAmbient();
        });

        var btnFullscreen = document.getElementById('btnFullscreen');
        if (btnFullscreen) {
          btnFullscreen.addEventListener('click', toggleFullscreen);
          document.addEventListener('fullscreenchange', updateFullscreenButton);
        }

        document.getElementById('btnRestart').addEventListener('click', restart);
      }

      // ========== INICIALIZAÇÃO ==========
      function createClefButtons() {
        var container = document.getElementById('clefTabs');
        if (!container) return;
        container.innerHTML = '';
        CLAVES.forEach(function (clef) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'clef-btn' + (clef.id === currentClef ? ' active' : '');
          btn.dataset.clefId = clef.id;
          btn.setAttribute('aria-pressed', clef.id === currentClef ? 'true' : 'false');
          btn.textContent = clef.simbolo + ' ' + clef.nome;
          container.appendChild(btn);
        });
      }

      function setClef(clefId) {
        var clef = CLAVES.find(function (c) { return c.id === clefId; });
        if (!clef) return;
        currentClef = clef.id;
        document.querySelectorAll('.clef-btn').forEach(function (btn) {
          var active = btn.dataset.clefId === clefId;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        updateStaffClefVisual();
        if (currentMode === 'staff') startStaffRound();
      }

      // ========== METRÔNOMO ==========
      function playMetroClick(accent, whenTime) {
        window.MetronomeUiCore.playMetroClick(accent, whenTime);
      }

      function renderMetroDots() {
        window.MetronomeUiCore.renderMetroDots();
      }

      function highlightMetroBeat(beatIndex) {
        window.MetronomeUiCore.highlightMetroBeat(beatIndex);
      }

      /** Disparo visual extra para acessibilidade: flash horizontal sincronizado com cada batida. */
      function triggerMetroVisualPulse(isAccent) {
        window.MetronomeUiCore.triggerMetroVisualPulse(isAccent);
      }

      function stopMetronome() {
        window.MetronomeUiSchedule.stopMetronome();
      }

      function metroScheduleLoop() {
        window.MetronomeUiSchedule.metroScheduleLoop();
      }

      function startMetronome() {
        window.MetronomeUiSchedule.startMetronome();
      }

      function updateMetroButtons() {
        var btnStop = document.getElementById('btnMetroStop');
        var btnStart = document.getElementById('btnMetroStart');
        if (!btnStop || !btnStart) return;
        btnStop.disabled = !metroIsRunning;
        btnStart.disabled = metroIsRunning;
      }

      function setMetroBpm(bpm, restartIfRunning) {
        var n = parseInt(bpm, 10);
        if (isNaN(n)) return;
        metroBpm = Math.max(30, Math.min(220, n));
        if (metroDom.bpmValueEl) metroDom.bpmValueEl.textContent = String(metroBpm);
        if (metroDom.bpmLabelEl) metroDom.bpmLabelEl.textContent = window.MetronomeUiCore.tempoLabel(metroBpm);
        if (metroDom.bpmSliderEl) metroDom.bpmSliderEl.value = String(metroBpm);
        if (restartIfRunning && metroIsRunning) {
          stopMetronome();
          startMetronome();
        }
      }

      function setMetroBeatsPerBar(beats, restartIfRunning) {
        var n = parseInt(beats, 10);
        if (isNaN(n)) return;
        metroBeatsPerBar = Math.max(1, Math.min(12, n));
        if (metroDom.beatsValueEl) metroDom.beatsValueEl.textContent = String(metroBeatsPerBar);
        var supportedBeats = [2, 3, 4, 6, 9, 12];
        if (supportedBeats.indexOf(metroBeatsPerBar) === -1 && metroSolfejoMode) {
          metroSolfejoMode = false;
          if (metroDom.solfejoModeCheckboxEl) metroDom.solfejoModeCheckboxEl.checked = false;
          if (metroDom.solfejoWrapEl) metroDom.solfejoWrapEl.classList.add('hidden');
          if (metroDom.solfejoBaseImgEl) metroDom.solfejoBaseImgEl.removeAttribute('src');
          if (metroDom.solfejoHandImgEl) metroDom.solfejoHandImgEl.removeAttribute('src');
        }
        renderMetroDots();
        updateMetronomeModeUI();
        if (restartIfRunning && metroIsRunning) {
          stopMetronome();
          startMetronome();
        } else {
          highlightMetroBeat(1);
        }
      }

      function setMetroSubdivision(subdiv, restartIfRunning) {
        var n = parseInt(subdiv, 10);
        if (isNaN(n)) return;
        // 1,2,3,4
        if (n < 1 || n > 4) n = 1;
        metroSubdivision = n;
        if (restartIfRunning && metroIsRunning) {
          stopMetronome();
          startMetronome();
        }
      }

      /** Ponte para `metronome-ui-init.js` (estado BPM/batidas fica no IIFE). */
      window.MetronomeUiBindingAccess = {
        bootstrapMetroUiDefaults: function () {
          metroBeatsPerBar = 4;
          metroSubdivision = 1;
          metroAccentFirst = false;
          metroSolfejoMode = false;
        },
        syncMetroBpmFromSlider: function () {
          var d = window.MetroUiRefs;
          metroBpm = parseInt(d.bpmSliderEl.value, 10) || metroBpm;
        },
        refreshMetroBpmLabels: function () {
          var d = window.MetroUiRefs;
          if (d.bpmValueEl) d.bpmValueEl.textContent = String(metroBpm);
          if (d.bpmLabelEl) d.bpmLabelEl.textContent = window.MetronomeUiCore.tempoLabel(metroBpm);
        },
        syncMetroCheckboxDom: function () {
          var d = window.MetroUiRefs;
          if (d.accentCheckboxEl) d.accentCheckboxEl.checked = metroAccentFirst;
          if (d.solfejoModeCheckboxEl) d.solfejoModeCheckboxEl.checked = metroSolfejoMode;
          if (d.solfejoLeftHandCheckboxEl) d.solfejoLeftHandCheckboxEl.checked = metroSolfejoLeftHand;
        },
        refreshMetroBeatsValueLabel: function () {
          var d = window.MetroUiRefs;
          if (d.beatsValueEl) d.beatsValueEl.textContent = String(metroBeatsPerBar);
        },
        runMetroInitialLayoutRefresh: function () {
          renderMetroDots();
          highlightMetroBeat(1);
          updateMetroButtons();
          updateMetronomeModeUI();
          updateSolfejoImagesSrc();
        },
        invokeSetMetroBpm: function (v, restart) {
          setMetroBpm(v, restart);
        },
        invokeSetMetroBeatsPerBar: function (v, restart) {
          setMetroBeatsPerBar(v, restart);
        },
        invokeSetMetroSubdivision: function (v, restart) {
          setMetroSubdivision(v, restart);
        },
        invokeStopMetronome: function () {
          window.MetronomeUiSchedule.stopMetronome();
        },
        invokeStartMetronome: function () {
          window.MetronomeUiSchedule.startMetronome();
        },
        schedGetIsRunning: function () {
          return metroIsRunning;
        },
        schedSetIsRunning: function (v) {
          metroIsRunning = v;
        },
        schedGetSchedulerId: function () {
          return metroSchedulerId;
        },
        schedSetSchedulerId: function (id) {
          metroSchedulerId = id;
        },
        schedGetNextClickTime: function () {
          return metroNextClickTime;
        },
        schedSetNextClickTime: function (t) {
          metroNextClickTime = t;
        },
        schedGetClickIndexInBar: function () {
          return metroClickIndexInBar;
        },
        schedSetClickIndexInBar: function (n) {
          metroClickIndexInBar = n;
        },
        schedGetSubdivision: function () {
          return metroSubdivision;
        },
        schedGetAudioCtx: function () {
          return metroAudioCtx;
        },
        schedGetSolfejoCurrentFrame: function () {
          return metroSolfejoCurrentFrame;
        },
        schedSetSolfejoCurrentFrame: function (n) {
          metroSolfejoCurrentFrame = n;
        },
        schedClearSolfejoCaches: function () {
          metroSolfejoFramesCache = {};
          metroSolfejoFramesPromises = {};
        },
        schedClearMetroVisualPulseDom: function () {
          if (metroDom.visualPulseTimer) clearTimeout(metroDom.visualPulseTimer);
          metroDom.visualPulseTimer = null;
          if (metroDom.visualFlashEl) metroDom.visualFlashEl.classList.remove('pulse', 'accent');
        },
        schedInvokeCancelSolfejoTween: function () {
          cancelSolfejoTween();
        },
        schedInvokeSetSolfejoHandToFrame: function (n) {
          setSolfejoHandToFrame(n);
        },
        schedInvokeStartSolfejoHandTween: function (to) {
          startSolfejoHandTween(to);
        },
        schedInvokeTriggerSolfejoHandTap: function () {
          triggerSolfejoHandTap();
        },
        schedInvokeHighlightMetroBeat: function (i) {
          highlightMetroBeat(i);
        },
        schedInvokeTriggerMetroVisualPulse: function (a) {
          triggerMetroVisualPulse(a);
        },
        schedInvokePlayMetroClick: function (a, t) {
          playMetroClick(a, t);
        },
        schedInvokeUpdateMetroButtons: function () {
          updateMetroButtons();
        },
        schedInvokeUpdateMetronomeModeUI: function () {
          updateMetronomeModeUI();
        },
        schedInvokeSetMessage: function (t) {
          setMessage(t);
        },
        schedSetSolfejoMode: function (v) {
          metroSolfejoMode = v;
        },
        schedSetSolfejoModeCheckboxChecked: function (checked) {
          if (metroDom.solfejoModeCheckboxEl) metroDom.solfejoModeCheckboxEl.checked = checked;
        },
        schedInvokeEnsureHandTipCalibrated: function () {
          return ensureHandTipCalibrated();
        },
        schedInvokeEnsureSolfejoFramesLoaded: function () {
          return ensureSolfejoFramesLoaded();
        },
        getMetroBpm: function () {
          return metroBpm;
        },
        getMetroBeatsPerBar: function () {
          return metroBeatsPerBar;
        },
        getMetroIsRunning: function () {
          return metroIsRunning;
        },
        getMetroSolfejoMode: function () {
          return metroSolfejoMode;
        },
        getMetroAccentFirst: function () {
          return metroAccentFirst;
        },
        isSoundEnabled: function () {
          return soundEnabled;
        },
        isCalmMode: function () {
          return calmMode;
        },
        ensureMetroAudioCtx: function () {
          if (!metroAudioCtx) metroAudioCtx = getAudioContext();
          return metroAudioCtx;
        },
        setMetroAccentFirst: function (v) {
          metroAccentFirst = v;
        },
        setMetroSolfejoLeftHand: function (v) {
          metroSolfejoLeftHand = v;
        },
        onSolfejoModeCheckboxChange: function (checkboxEl) {
          var supportedBeats = [2, 3, 4, 6, 9, 12];
          if (checkboxEl.checked && supportedBeats.indexOf(metroBeatsPerBar) === -1) {
            metroSolfejoMode = false;
            checkboxEl.checked = false;
            if (metroDom.solfejoBaseImgEl) metroDom.solfejoBaseImgEl.removeAttribute('src');
            if (metroDom.solfejoHandImgEl) metroDom.solfejoHandImgEl.removeAttribute('src');
          } else {
            metroSolfejoMode = !!checkboxEl.checked;
          }
          updateMetronomeModeUI();
          if (metroIsRunning) {
            stopMetronome();
            startMetronome();
          }
        }
      };

      function openMetronomeModal() {
        setMode('metronome');
      }

      function closeMetronomeModal() {
        if (metroIsRunning) stopMetronome();
        setMode('hinos');
      }

      function updateMetronomeModeUI() {
        if (!metroDom.solfejoWrapEl) return;
        var supportedBeats = [2, 3, 4, 6, 9, 12];
        var canShowSolfejo = metroSolfejoMode && (supportedBeats.indexOf(metroBeatsPerBar) !== -1);
        metroDom.solfejoWrapEl.classList.toggle('hidden', !canShowSolfejo);
        if (canShowSolfejo) updateSolfejoImagesSrc();
      }

      function getSolfejoSide() {
        return metroSolfejoLeftHand ? 'esquerda' : 'direita';
      }

      function updateSolfejoImagesSrc() {
        if (!metroDom.solfejoBaseImgEl || !metroDom.solfejoHandImgEl) return;

        var supportedBeats = [2, 3, 4, 6, 9, 12];
        var side = getSolfejoSide();
        var beatsOk = supportedBeats.indexOf(metroBeatsPerBar) !== -1;

        if (!beatsOk) {
          metroDom.solfejoBaseImgEl.removeAttribute('src');
          metroDom.solfejoHandImgEl.removeAttribute('src');
          return;
        }

        metroDom.solfejoBaseImgEl.src = './imgs/movimento-' + metroBeatsPerBar + '-' + side + '.png';

        metroDom.solfejoHandImgEl.onload = function () {
          // Assim que a imagem da mão carregar, reaplica o frame atual
          // para evitar posição errada por naturalWidth ainda não disponível.
          setSolfejoHandToFrame(metroSolfejoCurrentFrame);
        };
        metroDom.solfejoHandImgEl.src = './imgs/mao-' + side + '.png';
      }

      function getSolfejoBaseUrl() {
        // Ex.: ./imgs/movimento-4-direita.png
        var side = getSolfejoSide();
        return './imgs/movimento-' + metroBeatsPerBar + '-' + side + '.png';
      }

      function setSolfejoHandToFrame(frameIndex) {
        if (!metroDom.solfejoHandImgEl) return;
        if (!metroDom.solfejoBaseImgEl) return;

        var frames = metroSolfejoFramesCache[metroBeatsPerBar + '-' + getSolfejoSide()];
        if (!frames || !frames.length) return;
        if (frameIndex < 0) frameIndex = 0;
        if (frameIndex >= frames.length) frameIndex = frames.length - 1;

        var pos = frames[frameIndex];
        setSolfejoHandToPosNatural(pos);
      }

      function setSolfejoHandToPosNatural(pos) {
        if (!metroDom.solfejoHandImgEl) return;
        if (!metroDom.solfejoBaseImgEl) return;
        if (!pos) return;
        if (!metroDom.solfejoBaseImgEl.complete || !metroDom.solfejoBaseImgEl.naturalWidth) return;
        if (!metroDom.solfejoHandImgEl.complete || !metroDom.solfejoHandImgEl.naturalWidth) return;

        // pos.x/pos.y está no sistema natural da imagem; vamos converter para display.
        var rect = metroDom.solfejoBaseImgEl.getBoundingClientRect();
        var naturalW = metroDom.solfejoBaseImgEl.naturalWidth || 1;
        var naturalH = metroDom.solfejoBaseImgEl.naturalHeight || 1;
        var scaleX = rect.width / naturalW;
        var scaleY = rect.height / naturalH;

        // Faz a mão escalar junto com a imagem do movimento (mantém o mesmo visual ao redimensionar).
        var baseDisplayW = metroDom.solfejoBaseImgEl.offsetWidth || rect.width || 1;
        var handDisplayW = baseDisplayW * 0.28; // calibração visual (aprox. 110px quando base ~ 380px)
        metroDom.solfejoHandImgEl.style.width = handDisplayW + 'px';

        var tip = metroSolfejoHandTipCache[getSolfejoSide()];
        if (!tip) {
          // Se ainda não calibramos a ponta, não posiciona (evita ficar "errado").
          return;
        }

        var handNaturalW = metroDom.solfejoHandImgEl.naturalWidth || 1;
        if (!handNaturalW || handNaturalW <= 1) return;
        var handScale = handDisplayW / handNaturalW;
        var tipDisplayX = tip.x * handScale;
        var tipDisplayY = tip.y * handScale;

        var baseX = metroDom.solfejoBaseImgEl.offsetLeft + (pos.x * scaleX);
        var baseY = metroDom.solfejoBaseImgEl.offsetTop + (pos.y * scaleY);

        // Posiciona a ponta do dedo exatamente na marcação (coord do baseX/baseY).
        var finalLeft = (baseX - tipDisplayX);
        var finalTop = (baseY - tipDisplayY);
        metroDom.solfejoHandImgEl.style.left = finalLeft + 'px';
        metroDom.solfejoHandImgEl.style.top = finalTop + 'px';

      }

      function cancelSolfejoTween() {
        if (metroSolfejoTweenRafId) {
          cancelAnimationFrame(metroSolfejoTweenRafId);
          metroSolfejoTweenRafId = null;
        }
        metroSolfejoTweenFromPos = null;
        metroSolfejoTweenToPos = null;
        metroSolfejoTweenFromFrame = 0;
        metroSolfejoTweenToFrame = 0;
      }

      function triggerSolfejoHandTap() {
        if (!metroSolfejoMode) return;
        if (!metroDom.solfejoHandImgEl) return;
        metroDom.solfejoHandImgEl.classList.remove('tapping-right', 'tapping-left');
        // força reflow para reiniciar animação a cada bip
        void metroDom.solfejoHandImgEl.offsetWidth;
        if (getSolfejoSide() === 'esquerda') {
          metroDom.solfejoHandImgEl.classList.add('tapping-left');
        } else {
          metroDom.solfejoHandImgEl.classList.add('tapping-right');
        }
      }

      function startSolfejoHandTween(toFrameIndex) {
        if (!metroSolfejoMode) return;
        if (!metroIsRunning) return;
        if (!metroDom.solfejoHandImgEl) return;
        if (!metroDom.solfejoBaseImgEl) return;
        if (!metroSolfejoFramesCache[metroBeatsPerBar + '-' + getSolfejoSide()]) return;

        var frames = metroSolfejoFramesCache[metroBeatsPerBar + '-' + getSolfejoSide()];
        if (!frames || !frames.length) return;

        if (toFrameIndex < 0) toFrameIndex = 0;
        if (toFrameIndex >= frames.length) toFrameIndex = frames.length - 1;

        var fromIndex = metroSolfejoCurrentFrame;
        if (fromIndex < 0) fromIndex = 0;
        if (fromIndex >= frames.length) fromIndex = frames.length - 1;

        // Mapeia batidas (0..N-1) para âncoras dentro da trilha manual (frames).
        // Isso permite usar pontos extras e percorrer TODOS em loop.
        var fromFrameForPath = fromIndex;
        var toFrameForPath = toFrameIndex;
        if (frames.length > metroBeatsPerBar) {
          var anchors = [];
          for (var ai = 0; ai < metroBeatsPerBar; ai++) {
            var idx = Math.round((ai * frames.length) / metroBeatsPerBar);
            if (idx >= frames.length) idx = frames.length - 1;
            anchors.push(idx);
          }
          fromFrameForPath = anchors[fromIndex] != null ? anchors[fromIndex] : fromIndex;
          toFrameForPath = anchors[toFrameIndex] != null ? anchors[toFrameIndex] : toFrameIndex;
        }

        var fromPos = frames[fromFrameForPath];
        var toPos = frames[toFrameForPath];
        if (!fromPos || !toPos) {
          metroSolfejoCurrentFrame = toFrameIndex;
          setSolfejoHandToFrame(toFrameIndex);
          return;
        }

        // Garante que o tween comece exatamente no ponto anterior (evita desvio
        // quando a rotina do metronomo agenda múltiplos bips em um mesmo tick).
        setSolfejoHandToPosNatural(fromPos);

        metroSolfejoCurrentFrame = toFrameIndex;

        metroSolfejoTweenFromPos = fromPos;
        metroSolfejoTweenToPos = toPos;
        metroSolfejoTweenFromFrame = fromFrameForPath;
        metroSolfejoTweenToFrame = toFrameForPath;
        metroSolfejoTweenStartPerf = performance.now();
        metroSolfejoTweenDurationMs = (60 / metroBpm) * 1000;
        if (!metroSolfejoTweenDurationMs || metroSolfejoTweenDurationMs < 50) metroSolfejoTweenDurationMs = 250;

        // Constrói caminho forward cíclico entre from -> to passando por todos os pontos intermediários.
        var pathPoints = [];
        var pi = fromFrameForPath;
        var guard = 0;
        while (guard < (frames.length + 2)) {
          pathPoints.push(frames[pi]);
          if (pi === toFrameForPath) break;
          pi = (pi + 1) % frames.length;
          guard++;
        }
        if (pathPoints.length < 2) pathPoints = [fromPos, toPos];

        // Pré-cálculo de comprimentos acumulados para interpolar ao longo da polyline.
        var cumulative = [0];
        for (var si = 1; si < pathPoints.length; si++) {
          var pdx = pathPoints[si].x - pathPoints[si - 1].x;
          var pdy = pathPoints[si].y - pathPoints[si - 1].y;
          cumulative.push(cumulative[si - 1] + Math.sqrt(pdx * pdx + pdy * pdy));
        }
        var totalLen = cumulative[cumulative.length - 1] || 1;

        cancelSolfejoTween();

        function easeInOutCubic(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function loop(nowPerf) {
          if (!metroIsRunning || !metroSolfejoMode) return;
          var elapsed = nowPerf - metroSolfejoTweenStartPerf;
          var t = elapsed / metroSolfejoTweenDurationMs;
          if (t >= 1) {
            metroSolfejoTweenRafId = null;
            setSolfejoHandToPosNatural(toPos);
            return;
          }

          // Movimento contínuo durante toda a batida (sem freeze no ponto).
          var e = easeInOutCubic(Math.max(0, Math.min(1, t)));
          // Interpola por comprimento ao longo de todo o caminho.
          var targetLen = totalLen * e;
          var seg = 0;
          while (seg < cumulative.length - 1 && cumulative[seg + 1] < targetLen) seg++;
          var l0 = cumulative[seg];
          var l1 = cumulative[seg + 1] || l0;
          var span = (l1 - l0) || 1;
          var tt = (targetLen - l0) / span;
          var p0 = pathPoints[seg];
          var p1 = pathPoints[seg + 1] || p0;
          var ix = p0.x + (p1.x - p0.x) * tt;
          var iy = p0.y + (p1.y - p0.y) * tt;
          setSolfejoHandToPosNatural({ x: ix, y: iy });
          metroSolfejoTweenRafId = requestAnimationFrame(loop);
        }

        metroSolfejoTweenRafId = requestAnimationFrame(loop);
      }

      function analyzeSolfejoFramesFromImage(imgEl, beatsPerBar) {
        // Detecta os pontos (preparacao + posicoes) dentro da imagem do movimento.
        // Resultado: array de tamanho beatsPerBar+1 no sistema natural (naturalWidth/naturalHeight).
        return new Promise(function (resolve) {
          try {
            var K = beatsPerBar + 1;
            var targetW = 260;
            var scale = targetW / (imgEl.naturalWidth || 1);
            var targetH = Math.max(1, Math.round((imgEl.naturalHeight || 1) * scale));

            var canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            var ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;

            // Fundo: média dos cantos (quando tiver pixel não-transparente).
            function sampleCorner(x, y) {
              var idx = (y * canvas.width + x) * 4;
              return { r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3] };
            }

            var c1 = sampleCorner(0, 0);
            var c2 = sampleCorner(canvas.width - 1, 0);
            var c3 = sampleCorner(0, canvas.height - 1);
            var c4 = sampleCorner(canvas.width - 1, canvas.height - 1);

            var bgR = 0, bgG = 0, bgB = 0, bgCount = 0;
            [c1, c2, c3, c4].forEach(function (c) {
              if (c.a > 10) { bgR += c.r; bgG += c.g; bgB += c.b; bgCount++; }
            });
            if (bgCount > 0) { bgR /= bgCount; bgG /= bgCount; bgB /= bgCount; }
            else { bgR = 255; bgG = 255; bgB = 255; }

            var candidates = [];
            var maxPoints = 8500;
            var step = 2; // performance

            for (var y = 0; y < canvas.height; y += step) {
              for (var x = 0; x < canvas.width; x += step) {
                var idx = (y * canvas.width + x) * 4;
                var a = data[idx + 3];
                if (a < 30) continue;

                var r = data[idx];
                var g = data[idx + 1];
                var b = data[idx + 2];

                var dr = r - bgR;
                var dg = g - bgG;
                var db = b - bgB;
                var dist = Math.sqrt(dr * dr + dg * dg + db * db);
                if (dist < 70) continue;

                var max = Math.max(r, g, b);
                var min = Math.min(r, g, b);
                var sat = max > 0 ? (max - min) / max : 0;
                var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255

                if (sat > 0.22 || luma < 90) {
                  candidates.push({ x: x, y: y, w: dist });
                  if (candidates.length >= maxPoints) break;
                }
              }
              if (candidates.length >= maxPoints) break;
            }

            if (!candidates.length || candidates.length < K) {
              resolve([]);
              return;
            }

            // Reduz candidatos (amostragem) para k-means.
            if (candidates.length > maxPoints) {
              candidates = candidates.slice(0, maxPoints);
            }

            // Inicializa centros com os pontos mais "fortes".
            candidates.sort(function (a, b) { return b.w - a.w; });
            var centers = [];
            for (var i = 0; i < K; i++) {
              centers.push({ x: candidates[Math.floor((i / K) * (candidates.length - 1))].x, y: candidates[Math.floor((i / K) * (candidates.length - 1))].y });
            }

            var iterations = 8;
            for (var it = 0; it < iterations; it++) {
              var sumX = new Array(K).fill(0);
              var sumY = new Array(K).fill(0);
              var sumW = new Array(K).fill(0);

              candidates.forEach(function (p) {
                var best = 0;
                var bestD = Infinity;
                for (var c = 0; c < K; c++) {
                  var dx = p.x - centers[c].x;
                  var dy = p.y - centers[c].y;
                  var d2 = dx * dx + dy * dy;
                  if (d2 < bestD) { bestD = d2; best = c; }
                }
                sumX[best] += p.x * p.w;
                sumY[best] += p.y * p.w;
                sumW[best] += p.w;
              });

              for (var c = 0; c < K; c++) {
                if (sumW[c] > 0) {
                  centers[c].x = sumX[c] / sumW[c];
                  centers[c].y = sumY[c] / sumW[c];
                }
              }
            }

            // Escolhe "preparacao" como centro mais ciano/aproximado do eixo central.
            var prepIndex = 0;
            var bestPrepScore = -Infinity;
            for (var c = 0; c < K; c++) {
              var cx = Math.max(0, Math.min(canvas.width - 1, Math.round(centers[c].x)));
              var cy = Math.max(0, Math.min(canvas.height - 1, Math.round(centers[c].y)));
              var ci = (cy * canvas.width + cx) * 4;
              var r2 = data[ci];
              var g2 = data[ci + 1];
              var b2 = data[ci + 2];
              var score = (g2 + b2) - 2 * r2; // ciano => maior
              if (score > bestPrepScore) { bestPrepScore = score; prepIndex = c; }
            }

            var prep = centers[prepIndex];
            var remaining = centers.filter(function (_, idx) { return idx !== prepIndex; });
            var ordered = [];
            var current = { x: prep.x, y: prep.y };
            for (var i = 0; i < beatsPerBar && remaining.length; i++) {
              var bestIdx = 0;
              var bestD = Infinity;
              for (var j = 0; j < remaining.length; j++) {
                var dx = remaining[j].x - current.x;
                var dy = remaining[j].y - current.y;
                var d2 = dx * dx + dy * dy;
                if (d2 < bestD) { bestD = d2; bestIdx = j; }
              }
              var next = remaining.splice(bestIdx, 1)[0];
              ordered.push(next);
              current = next;
            }

            var sx = (imgEl.naturalWidth || 1) / canvas.width;
            var sy = (imgEl.naturalHeight || 1) / canvas.height;
            var frames = [prep].concat(ordered).slice(0, beatsPerBar + 1).map(function (p) {
              return { x: p.x * sx, y: p.y * sy };
            });

            resolve(frames);
          } catch (e) {
            resolve([]);
          }
        });
      }

      function analyzeSolfejoFramesFromImageV2(imgEl, beatsPerBar, side) {
        // Mais robusto: detecta componentes conectados (tende a pegar só os "círculos"/marcadores)
        // e calcula centróides. Depois ordena via caminho mais próximo a partir da preparação.
        return new Promise(function (resolve) {
          try {
            var K = beatsPerBar + 1;
            var targetW = 260;
            var scale = targetW / (imgEl.naturalWidth || 1);
            var targetH = Math.max(1, Math.round((imgEl.naturalHeight || 1) * scale));

            var canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            var ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);

            var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var data = imgData.data;

            function sampleCorner(x, y) {
              var idx = (y * canvas.width + x) * 4;
              return { r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3] };
            }

            var c1 = sampleCorner(0, 0);
            var c2 = sampleCorner(canvas.width - 1, 0);
            var c3 = sampleCorner(0, canvas.height - 1);
            var c4 = sampleCorner(canvas.width - 1, canvas.height - 1);

            var bgR = 255, bgG = 255, bgB = 255, bgCount = 0;
            [c1, c2, c3, c4].forEach(function (c) {
              if (c.a > 10) { bgR += c.r; bgG += c.g; bgB += c.b; bgCount++; }
            });
            if (bgCount > 0) { bgR /= bgCount; bgG /= bgCount; bgB /= bgCount; }

            var W = canvas.width;
            var H = canvas.height;
            var N = W * H;

            // Máscara de "pixels de interesse" (marcadores e setas coloridas).
            var mask = new Uint8Array(N);
            var alphaThreshold = 40;
            var satThreshold = 0.25;
            var distThreshold = 60;

            for (var y = 0; y < H; y++) {
              for (var x = 0; x < W; x++) {
                var i = y * W + x;
                var idx = i * 4;
                var a = data[idx + 3];
                if (a < alphaThreshold) continue;

                var r = data[idx], g = data[idx + 1], b = data[idx + 2];
                var dr = r - bgR, dg = g - bgG, db = b - bgB;
                var dist = Math.sqrt(dr * dr + dg * dg + db * db);
                if (dist < distThreshold) continue;

                var max = Math.max(r, g, b);
                var min = Math.min(r, g, b);
                var sat = max > 0 ? (max - min) / max : 0;
                if (sat < satThreshold) continue;

                mask[i] = 1;
              }
            }

            var visited = new Uint8Array(N);
            var components = [];
            var minArea = Math.round((W * H) * 0.00035); // ajusta sensibilidade

            var qx = new Int32Array(N);
            var qy = new Int32Array(N);

            for (var yy = 0; yy < H; yy++) {
              for (var xx = 0; xx < W; xx++) {
                var start = yy * W + xx;
                if (!mask[start] || visited[start]) continue;

                // BFS
                var head = 0, tail = 0;
                visited[start] = 1;
                qx[tail] = xx;
                qy[tail] = yy;
                tail++;

                var area = 0;
                var sumX = 0;
                var sumY = 0;
                var sumR = 0;
                var sumG = 0;
                var sumB = 0;

                while (head < tail) {
                  var cx = qx[head];
                  var cy = qy[head];
                  head++;

                  var ci = cy * W + cx;
                  area++;
                  sumX += cx;
                  sumY += cy;

                  var cidx = ci * 4;
                  sumR += data[cidx];
                  sumG += data[cidx + 1];
                  sumB += data[cidx + 2];

                  // 4-neighbors
                  if (cx > 0) {
                    var n = ci - 1;
                    if (mask[n] && !visited[n]) { visited[n] = 1; qx[tail] = cx - 1; qy[tail] = cy; tail++; }
                  }
                  if (cx < W - 1) {
                    var n2 = ci + 1;
                    if (mask[n2] && !visited[n2]) { visited[n2] = 1; qx[tail] = cx + 1; qy[tail] = cy; tail++; }
                  }
                  if (cy > 0) {
                    var n3 = ci - W;
                    if (mask[n3] && !visited[n3]) { visited[n3] = 1; qx[tail] = cx; qy[tail] = cy - 1; tail++; }
                  }
                  if (cy < H - 1) {
                    var n4 = ci + W;
                    if (mask[n4] && !visited[n4]) { visited[n4] = 1; qx[tail] = cx; qy[tail] = cy + 1; tail++; }
                  }
                }

                if (area >= minArea) {
                  components.push({
                    x: sumX / area,
                    y: sumY / area,
                    area: area,
                    avgR: sumR / area,
                    avgG: sumG / area,
                    avgB: sumB / area
                  });
                }
              }
            }

            if (!components.length) {
              resolve([]);
              return;
            }

            components.sort(function (a, b2) { return b2.area - a.area; });
            var chosen = components.slice(0, K);
            if (chosen.length < K) {
              resolve([]);
              return;
            }

            // Preparacao: ciano (G+B alto, R baixo) e próximo do centro.
            var centerX = W / 2;
            var bestPrepIdx = 0;
            var bestScore = -Infinity;
            for (var ci2 = 0; ci2 < chosen.length; ci2++) {
              var c = chosen[ci2];
              var cyanScore = (c.avgG + c.avgB - 2 * c.avgR) - 0.15 * Math.abs(c.x - centerX);
              if (cyanScore > bestScore) { bestScore = cyanScore; bestPrepIdx = ci2; }
            }

            var prep = chosen[bestPrepIdx];
            var remaining = chosen.filter(function (_, idx) { return idx !== bestPrepIdx; });

            // Ordena pelos ângulos ao redor do centro, começando no ponto 1 (dot mais "baixo" em y).
            // Isso reduz o erro de mapeamento beatIndex -> posição.
            var centerX2 = W / 2;
            var centerY2 = H / 2;

            var startDotIdx = 0;
            var maxY = -Infinity;
            for (var sd = 0; sd < remaining.length; sd++) {
              if (remaining[sd].y > maxY) { maxY = remaining[sd].y; startDotIdx = sd; }
            }
            var startDot = remaining[startDotIdx];
            var startAngle = Math.atan2(startDot.y - centerY2, startDot.x - centerX2);
            if (startAngle < 0) startAngle += Math.PI * 2;

            var clockwise = (side === 'direita');
            function normAngle(a) {
              if (a < 0) a += Math.PI * 2;
              if (a >= Math.PI * 2) a -= Math.PI * 2;
              return a;
            }

            var ordered = remaining.map(function (p) {
              var ang = Math.atan2(p.y - centerY2, p.x - centerX2);
              ang = normAngle(ang);
              var dist = clockwise ? (startAngle - ang) : (ang - startAngle);
              dist = dist % (Math.PI * 2);
              if (dist < 0) dist += Math.PI * 2;
              return { p: p, dist: dist };
            });

            ordered.sort(function (a, b2) { return a.dist - b2.dist; });

            var sx = (imgEl.naturalWidth || 1) / W;
            var sy = (imgEl.naturalHeight || 1) / H;
            var frames = [{ x: prep.x * sx, y: prep.y * sy }];
            for (var oi2 = 0; oi2 < beatsPerBar; oi2++) {
              var it = ordered[oi2];
              if (!it) break;
              frames.push({ x: it.p.x * sx, y: it.p.y * sy });
            }

            // Garante tamanho esperado
            while (frames.length < beatsPerBar + 1) {
              frames.push({ x: prep.x * sx, y: prep.y * sy });
            }

            resolve(frames);
          } catch (e) {
            resolve([]);
          }
        });
      }
      function analyzeHandTipFromImage(imgEl) {
        // Encontra a "ponta" (menor Y) de pixels não-transparentes.
        // Retorna coordenadas no sistema natural da imagem (top-left = origem).
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
            var samples = [];
            var alphaThreshold = 40;

            for (var y = 0; y < h; y++) {
              for (var x = 0; x < w; x++) {
                var idx = (y * w + x) * 4;
                var a = data[idx + 3];
                if (a < alphaThreshold) continue;
                minY = Math.min(minY, y);
              }
            }
            if (minY === Infinity) {
              resolve({ x: w / 2, y: h / 2 });
              return;
            }

            // Media do X onde está a ponta (minY).
            var sumX = 0;
            var countX = 0;
            var yBand = minY + 1; // tolerancia
            for (var y2 = minY; y2 <= yBand; y2++) {
              for (var x2 = 0; x2 < w; x2++) {
                var idx2 = (y2 * w + x2) * 4;
                var a2 = data[idx2 + 3];
                if (a2 < alphaThreshold) continue;
                sumX += x2;
                countX++;
              }
            }

            var tipX = countX > 0 ? (sumX / countX) : (w / 2);
            resolve({ x: tipX, y: minY });
          } catch (e) {
            resolve({ x: (imgEl.naturalWidth || 1) / 2, y: (imgEl.naturalHeight || 1) / 3 });
          }
        });
      }

      function ensureHandTipCalibrated() {
        if (!metroDom.solfejoHandImgEl) return Promise.resolve();
        var side = getSolfejoSide();
        if (metroSolfejoHandTipCache[side]) return Promise.resolve(metroSolfejoHandTipCache[side]);
        if (metroSolfejoHandTipPromises[side]) return metroSolfejoHandTipPromises[side];

        metroSolfejoHandTipPromises[side] = new Promise(function (resolve) {
          // Se ainda não carregou, espera o onload.
          function finish() {
            analyzeHandTipFromImage(metroDom.solfejoHandImgEl).then(function (tip) {
              metroSolfejoHandTipCache[side] = tip;
              resolve(tip);
            });
          }

          if (metroDom.solfejoHandImgEl.complete && metroDom.solfejoHandImgEl.naturalWidth > 0) {
            finish();
          } else {
            metroDom.solfejoHandImgEl.onload = function () {
              finish();
            };
            metroDom.solfejoHandImgEl.onerror = function () {
              metroSolfejoHandTipCache[side] = { x: (metroDom.solfejoHandImgEl.naturalWidth || 1) / 2, y: 0 };
              resolve(metroSolfejoHandTipCache[side]);
            };
          }
        });

        return metroSolfejoHandTipPromises[side];
      }

      function getManualSolfejoFrames(beatsPerBar, side, naturalW, naturalH) {
        var key = beatsPerBar + '-' + side;
        var points = SOLFEJO_MANUAL_POINTS[key];
        var minExpected = beatsPerBar;
        if (!points || points.length === 0) return null;

        var frames = [];
        for (var i = 0; i < points.length; i++) {
          var p = points[i];
          if (!p || typeof p.x !== 'number' || typeof p.y !== 'number') return null;
          frames.push({
            x: p.x * naturalW,
            y: p.y * naturalH
          });
        }

        // Se vier menos pontos do que o mínimo necessário para o compasso,
        // completa repetindo o último ponto informado (comportamento previsível no ajuste manual).
        while (frames.length < minExpected) {
          var last = frames[frames.length - 1];
          frames.push({ x: last.x, y: last.y });
        }

        return frames;
      }

      function ensureSolfejoFramesLoaded() {
        var key = metroBeatsPerBar + '-' + getSolfejoSide();
        var minExpectedLen = metroBeatsPerBar;
        // Sempre recalcula no modo manual para evitar usar trilha antiga em cache
        // durante calibração (edições frequentes de pontos).
        delete metroSolfejoFramesCache[key];
        delete metroSolfejoFramesPromises[key];

        if (metroSolfejoFramesPromises[key]) return metroSolfejoFramesPromises[key];

        var baseSrc = getSolfejoBaseUrl();
        var handSide = getSolfejoSide();
        metroDom.solfejoHandImgEl.src = './imgs/mao-' + handSide + '.png';
        metroDom.solfejoBaseImgEl.src = baseSrc;

        metroSolfejoFramesPromises[key] = new Promise(function (resolve) {
          metroDom.solfejoBaseImgEl.onload = function () {
            var manualFrames = getManualSolfejoFrames(
              metroBeatsPerBar,
              handSide,
              (metroDom.solfejoBaseImgEl.naturalWidth || 1),
              (metroDom.solfejoBaseImgEl.naturalHeight || 1)
            );

            if (manualFrames && manualFrames.length >= minExpectedLen) {
              metroSolfejoFramesCache[key] = manualFrames;
              setSolfejoHandToFrame(metroSolfejoCurrentFrame);
              resolve(manualFrames);
              return;
            }

            // Sem detecção automática: somente pontos manuais.
            // Se não houver configuração válida, mantém a mão parada no centro.
            var cxM = (metroDom.solfejoBaseImgEl.naturalWidth || 1) / 2;
            var cyM = (metroDom.solfejoBaseImgEl.naturalHeight || 1) / 2;
            var manualFallback = [];
            for (var mi = 0; mi < minExpectedLen; mi++) manualFallback.push({ x: cxM, y: cyM });
            metroSolfejoFramesCache[key] = manualFallback;
            setSolfejoHandToFrame(metroSolfejoCurrentFrame);
            resolve(manualFallback);
          };
          metroDom.solfejoBaseImgEl.onerror = function () {
            // se não carregar, fallback imediato
            var cx = (metroDom.solfejoBaseImgEl.naturalWidth || 1) / 2;
            var cy = (metroDom.solfejoBaseImgEl.naturalHeight || 1) / 2;
            var frames = [];
            var minExpectedLen2 = metroBeatsPerBar + 1;
            for (var i = 0; i < minExpectedLen2; i++) frames.push({ x: cx, y: cy });
            metroSolfejoFramesCache[key] = frames;
            resolve(frames);
          };
        });

        return metroSolfejoFramesPromises[key];
      }

      function initMetronomeUI() {
        window.MetronomeUiInit.initMetronomeUI();
      }

      // ========== SOBRE ==========
      function openAboutModal() {
        return window.UiCoreModule.openAboutModal();
      }

      function closeAboutModal() {
        return window.UiCoreModule.closeAboutModal();
      }

      function createKeyButtons() {
        var container = document.getElementById('keyTabs');
        if (!container) return;
        container.innerHTML = '';
        TONALIDADES.forEach(function (k) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'key-btn' + (k.id === currentKey.id ? ' active' : '');
          btn.dataset.keyId = k.id;
          btn.setAttribute('aria-pressed', k.id === currentKey.id ? 'true' : 'false');
          btn.textContent = k.nome;
          container.appendChild(btn);
        });
      }

      function createNoteButtons() {
        var container = document.getElementById('noteOptions');
        if (!container) return;
        container.innerHTML = '';
        NOTAS.forEach(function (nota) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'note-option-btn';
          btn.dataset.noteId = nota.id;
          btn.textContent = nota.nome;
          btn.addEventListener('click', function () {
            handleNoteOptionClick(nota.id, btn);
          });
          container.appendChild(btn);
        });
      }

      function setKey(keyId) {
        var key = TONALIDADES.find(function (k) { return k.id === keyId; });
        if (!key) return;
        currentKey = key;
        document.querySelectorAll('.key-btn').forEach(function (btn) {
          var active = btn.dataset.keyId === keyId;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        updateViolinBoardLabels();
      }

      function hideSplashScreen() {
        return window.UiCoreModule.hideSplashScreen();
      }

      function registerServiceWorkerAutoUpdate() {
        if (!('serviceWorker' in navigator)) return;
        var hasReloadedForUpdate = false;

        navigator.serviceWorker.addEventListener('controllerchange', function () {
          // Evita loop de recarga caso o browser dispare o evento mais de uma vez.
          if (hasReloadedForUpdate) return;
          hasReloadedForUpdate = true;
          window.location.reload();
        });

        navigator.serviceWorker.register('./sw.js').then(function (registration) {
          function watchInstallingWorker(worker) {
            if (!worker) return;
            worker.addEventListener('statechange', function () {
              // Se já existia SW controlando, isso é update. Recarrega ao ativar.
              if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                if (registration.waiting) {
                  registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                } else if (registration.active) {
                  window.location.reload();
                }
              }
            });
          }

          if (registration.installing) {
            watchInstallingWorker(registration.installing);
          }

          registration.addEventListener('updatefound', function () {
            watchInstallingWorker(registration.installing);
          });

          // Força checagem de atualização ao abrir.
          registration.update().catch(function () {});
        }).catch(function () {});
      }

      // ========== MAPA DE MÓDULOS (separação de responsabilidades) ==========
      /**
       * Registro central para facilitar manutenção e descoberta de código.
       * Não altera o fluxo atual; apenas organiza os domínios do app.
       */
      var APP_MODULES = {
        config: {
          APP_VERSION: APP_VERSION,
          APP_VERSION_LABEL: APP_VERSION_LABEL,
          PLAYER_SCORE_URL: PLAYER_SCORE_URL,
          PLAYER_CATALOG_URL: PLAYER_CATALOG_URL,
          NOTAS: NOTAS,
          INSTRUMENTOS: INSTRUMENTOS,
          TONALIDADES: TONALIDADES,
          CLAVES: CLAVES
        },
        audio: {
          getAudioContext: getAudioContext,
          loadInstrument: loadInstrument,
          playNoteSound: playNoteSound,
          stopAllPlayerNotes: stopAllPlayerNotes,
          startAmbient: startAmbient,
          stopAmbient: stopAmbient
        },
        player: {
          ensurePlayerCatalogLoaded: ensurePlayerCatalogLoaded,
          loadPlayerFromCatalogSelection: loadPlayerFromCatalogSelection,
          loadPlayerMusicXml: loadPlayerMusicXml,
          getPlayerMusicXmlLoadContext: function () {
            return window.PlayerLoadBindings.getPlayerMusicXmlLoadContext();
          },
          startPlayerPlayback: startPlayerPlayback,
          stopPlayerPlayback: stopPlayerPlayback,
          seekPlayerToTime: seekPlayerToTime,
          updatePlayerUiNow: updatePlayerUiNow
        },
        tuner: {
          startTuner: startTuner,
          stopTuner: stopTuner,
          drawTunerChart: drawTunerChart,
          openTunerMicHelpModal: openTunerMicHelpModal,
          closeTunerMicHelpModal: closeTunerMicHelpModal
        },
        metronome: {
          startMetronome: startMetronome,
          stopMetronome: stopMetronome,
          initMetronomeUI: initMetronomeUI
        },
        game: {
          setMode: setMode,
          updateProgress: updateProgress,
          restart: restart
        },
        ui: {
          setMessage: setMessage,
          updateFullscreenButton: updateFullscreenButton,
          updateBottomNavVisibility: updateBottomNavVisibility,
          hideSplashScreen: hideSplashScreen
        },
        catalog: {
          normalizePlayerCatalogJson: normalizePlayerCatalogJson,
          getPlayerCatalogCollections: getPlayerCatalogCollections,
          getPlayerCatalogItems: getPlayerCatalogItems,
          getPlayerCatalogItemByNumero: getPlayerCatalogItemByNumero
        },
        hinos: {
          initHinosUI: initHinosUI,
          bindHinosEvents: bindHinosEvents,
          curriculumUtils: function () {
            return window.HinosCurriculumUtils;
          }
        }
      };

      // Exposição controlada para debug e documentação viva no browser.
      window.OrquestraApp = window.OrquestraApp || {};
      window.OrquestraApp.modules = APP_MODULES;

      function init() {
        var aboutVersionNumber = document.getElementById('aboutVersionNumber');
        var aboutVersionLabel = document.getElementById('aboutVersion');
        var splashVersion = document.getElementById('splashVersion');
        if (aboutVersionNumber) aboutVersionNumber.textContent = APP_VERSION;
        if (aboutVersionLabel) aboutVersionLabel.textContent = APP_VERSION_LABEL;
        if (splashVersion) splashVersion.textContent = 'v' + APP_VERSION;
        bootstrapScreenWakeLock();
        createInstrumentButtons();
        createKeyButtons();
        createClefButtons();
        createViolinBoard();
        initStaff();
        createNoteButtons();
        initMetronomeUI();
        bindEvents();
        updatePlayerUiNow(0);
        syncPlayerSpeedUi();
        syncPlayerLeverUi();
        renderPlayerCatalogControls();
        initHinosUI();
        updateTunerUINoSignal();
        drawTunerGauge(0, 'idle');
        drawTunerChart();
        setMode(currentMode);
        updateFullscreenButton();
        initBottomNavObserver();
        updateBottomNavVisibility();
        window.addEventListener('scroll', updateBottomNavVisibility, { passive: true });
        document.addEventListener('scroll', updateBottomNavVisibility, { passive: true, capture: true });
        window.addEventListener('resize', function onWindowResizePlayerAndNav() {
          updateBottomNavVisibility();
          resizePlayerOsmdIfActive();
          buildPlayerNoteAnchorsFromDom();
          playerAutoScrollNeedsInitial = true;
        });
        window.addEventListener('orientationchange', function onOrientationChangePlayer() {
          resizePlayerOsmdIfActive();
          buildPlayerNoteAnchorsFromDom();
          playerAutoScrollNeedsInitial = true;
        });
        if (window.visualViewport && typeof window.visualViewport.addEventListener === 'function') {
          window.visualViewport.addEventListener('resize', function onVisualViewportResizePlayer() {
            playerAutoScrollNeedsInitial = true;
            updateBottomNavVisibility();
          });
          window.visualViewport.addEventListener('scroll', function onVisualViewportScrollNav() {
            updateBottomNavVisibility();
          });
        }
        // PWA: registra o SW com atualização automática para a versão mais recente.
        registerServiceWorkerAutoUpdate();
        if (currentMode !== 'hinos') {
          setMessage('Use o botão de configurações para escolher instrumento, tonalidade, clave e áudio.');
        }
        // Pequeno atraso para a transição de entrada ficar suave.
        setTimeout(hideSplashScreen, 700);
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
    })();