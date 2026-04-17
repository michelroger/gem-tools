# Arquitetura do App (Responsabilidades)

Este documento organiza o app por responsabilidade para facilitar manutencao sem mudar o comportamento atual.

## Visao Geral

- Entrada principal: `index.html`
- Registro de modulos em runtime: `window.OrquestraApp.modules`
- Objetivo: deixar facil localizar "onde mexer" por dominio.

## Modulos

- `config`
  - Constantes globais do app: versao, URLs, notas, instrumentos, tonalidades e claves.
  - Quando alterar: novos instrumentos, ajustes de afinacao, parametros base.

- `audio`
  - Inicializacao e reproducao de audio.
  - Funcoes principais: `getAudioContext()`, `loadInstrument()`, `playNoteSound()`.
  - Inclui suporte a trilha ambiente e limpeza de notas ativas.

- `player`
  - Player de partitura/MusicXML.
  - Funcoes principais: `ensurePlayerCatalogLoaded()`, `loadPlayerFromCatalogSelection()`, `startPlayerPlayback()`, `seekPlayerToTime()`.
  - Quando alterar: comportamento de execucao, loop, seek, UI de progresso do player.

- `tuner`
  - Afinador com microfone, analise e visualizacao.
  - Funcoes principais: `startTuner()`, `stopTuner()`, `drawTunerChart()`.
  - Quando alterar: permissao de microfone, estabilidade de leitura, UX do afinador.

- `metronome`
  - Logica e UI do metronomo.
  - Funcoes principais: `startMetronome()`, `stopMetronome()`, `initMetronomeUI()`.

- `game`
  - Fluxo principal de jogo e progresso.
  - Funcoes principais: `setMode()`, `newRound()`, `checkAnswer()`, `updateProgress()`, `restart()`.

- `ui`
  - Mensagens e estado visual global.
  - Funcoes principais: `setMessage()`, `updateBottomNavVisibility()`, `showSplashScreen()`, `hideSplashScreen()`.

- `catalog`
  - Normalizacao e consultas do catalogo do player.
  - Funcoes principais: `normalizePlayerCatalogJson()`, `getPlayerCatalogCollections()`, `getPlayerCatalogItems()`.

## Como usar no dia a dia

- Para descobrir onde mexer, abra o console e inspecione:
  - `window.OrquestraApp.modules`
- Para uma correcao pequena:
  1. Identifique o dominio (audio/player/tuner/etc.).
  2. Edite somente funcoes daquele modulo.
  3. Valide os modos mais sensiveis: Player, Afinador, Metronomo e Jogo.

## Proximo passo sugerido (sem pressa)

- Extrair cada dominio para arquivos JS separados (`assets/js/modules/*`) mantendo os mesmos nomes de funcao.
- Isso pode ser feito em etapas pequenas para minimizar risco de regressao.
