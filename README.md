# GEM Tools (PWA)

Aplicativo educacional musical em formato **PWA** (Progressive Web App), pensado para apoio ao estudo de notas, leitura em pentagrama, ritmo e **partituras com playback** no navegador ou instalado no celular e no desktop.

## Acesso rápido

- **App online** (GitHub Pages): [https://michelroger.github.io/gem-tools/](https://michelroger.github.io/gem-tools/)
- **Repositório**: [https://github.com/michelroger/gem-tools](https://github.com/michelroger/gem-tools)

## Sobre o projeto

O **GEM Tools** reúne exercícios interativos e um **player de partituras** (MusicXML) com visualização em pauta, áudio e opções de estudo por voz. O app abre por padrão no **Player**; instrumento, tonalidade, clave e áudio ficam em **Ajustes** (menu **Mais**).

Funciona no navegador e pode ser **instalado** como aplicativo, com **cache** para uso offline conforme o service worker da versão.

## Navegação (barra inferior)

| Área | Descrição |
|------|-----------|
| **Player** | Catálogo de coleções/itens, afinação, vozes (soprano, contralto, tenor, baixo), transporte e partitura (OpenSheetMusicDisplay). |
| **Aprender** | Espelho do instrumento: explorar notas e ouvir o som. |
| **Desafio** | Jogo de identificação de notas com pontuação e feedback. |
| **Penta** | Leitura no pentagrama com rodadas e estatísticas. |
| **Mais** | **Afinador** (microfone), **Metrônomo** (BPM, batidas, solfejo animado opcional), **Controle** (ficha do hinário por aluno, vozes e progresso) e **Ajustes** (instrumento, tonalidade, clave, som, tela cheia, sobre). |

## Principais funcionalidades

- **Player de partituras**: seleção por coleção e item, múltiplas vozes, partitura sincronizada com reprodução e ferramentas de estudo (metrônomo da peça, rolagem, loop, cores, nomes nas notas, dedilhado, compassos).
- **Controle (hinário)**: alunos, afinação da ficha, marcação de vozes por hino e visão geral de progresso.
- **Modos Aprender, Desafio e Pentagrama**: treino de notas e leitura rítmica/melódica.
- **Afinador e metrônomo**: apoio à afinação e ao ritmo.
- **PWA**: instalação, tema e atualização de versão com cache busting do catálogo e dos assets.

## Stack (resumo)

- HTML, CSS e JavaScript no cliente.
- **OpenSheetMusicDisplay** para renderização de MusicXML no Player.
- **soundfont-player** para sons de instrumento GM.
- Catálogo e partituras servidos como arquivos estáticos (por exemplo `xml/catalog.json` e coleções MusicXML).

## Licença

Projeto educacional sem fins lucrativos.
