(function () {
  'use strict';

  /*
   * INSTRUÇÕES PARA LINKS DE MÍDIA DA NUVEM:
   * Para que o player do navegador toque as mídias da nuvem, use links de DOWNLOAD DIRETO:
   * 
   * - DROPBOX: Gere o link de compartilhamento e mude o final de "?dl=0" para "?raw=1"
   *   Exemplo: "https://www.dropbox.com/.../video.mp4?raw=1"
   * 
   * - GOOGLE DRIVE: Obtenha o ID do arquivo público e monte a URL neste formato:
   *   Exemplo: "https://docs.google.com/uc?export=download&id=ID_DO_ARQUIVO"
   */

  var msaFases = {
    1: {
      titulo: "Fase 1 - Ritmo e Som",
      descricao: "Pulsação e tempo, som e silêncio, figuras musicais de som (semibreve, mínima e semínima) e suas respectivas pausas. Abrange os Exercícios 1 a 11.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1cGUTseN2gKMKb3p2GshbeHwt_8QF7L72",
      audioUrl: "./assets/audio/msa_fase1.mp3"
    },
    2: {
      titulo: "Fase 2 - Pentagrama e Claves",
      descricao: "Pauta ou pentagrama, linhas e espaços, conceito de claves e estudo aprofundado da Clave de Sol. Abrange os Exercícios 12 a 20.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "./assets/audio/msa_fase2.mp3"
    },
    3: {
      titulo: "Fase 3 - Clave de Fá e Leitura",
      descricao: "A Clave de Fá na quarta linha, a Clave de Dó, localização e leitura das notas na pauta. Abrange os Exercícios 21 a 28."
    },
    4: {
      titulo: "Fase 4 - Compassos Simples",
      descricao: "Fórmulas de compasso binário, ternário e quaternário simples, uso da barra de compasso e a acentuação métrica (tempo forte e fraco). Abrange os Exercícios 29 a 37."
    },
    5: {
      titulo: "Fase 5 - Solfejo e Marcação",
      descricao: "Estudo sobre a marcação de tempo por meio de gestos de solfejo (padrões de regência) e leitura rítmica. Abrange os Exercícios 38 a 44."
    },
    6: {
      titulo: "Fase 6 - Ligadura de Valor",
      descricao: "Conceito e aplicação da ligadura de valor (prolongamento de som de notas de mesma altura), ligadura de portamento e de fraseado. Abrange os Exercícios 45 a 52."
    },
    7: {
      titulo: "Fase 7 - Ponto de Aumento",
      descricao: "A nota pontuada e a pausa pontuada, aplicação do ponto de aumento e duplo ponto. Abrange os Exercícios 53 a 59."
    },
    8: {
      titulo: "Fase 8 - Síncope e Contratempo",
      descricao: "O ritmo sincopado (deslocamento do acento forte) e a execução em contratempo (notas nos tempos fracos e pausas nos fortes). Abrange os Exercícios 60 a 68."
    },
    9: {
      titulo: "Fase 9 - Compassos Compostos",
      descricao: "Fórmulas de compasso composto, subdivisão ternária do tempo, unidade de tempo (UT) e unidade de compasso (UC). Abrange os Exercícios 69 a 77."
    },
    10: {
      titulo: "Fase 10 - Quiálteras",
      descricao: "Conceito de quiálteras, com foco prático nas tercinas (divisão ternária de um tempo em compassos simples). Abrange os Exercícios 78 a 84."
    },
    11: {
      titulo: "Fase 11 - Escalas Maiores",
      descricao: "Formação de escalas diatônicas maiores, semitom diatônico, semitom cromático, tom e a escala de Dó Maior. Abrange os Exercícios 85 a 91."
    },
    12: {
      titulo: "Fase 12 - Armadura de Clave",
      descricao: "O uso da armadura de clave para definir tonalidades, ordem dos acidentes (sustenidos e bemóis) e acidentes ocorrentes. Abrange os Exercícios 92 a 95."
    },
    13: {
      titulo: "Fase 13 - Intervalos",
      descricao: "Estudo sobre intervalos (distâncias entre notas), classificação dos intervalos em tons, semitons e uníssono. Abrange os Exercícios 96 a 98."
    },
    14: {
      titulo: "Fase 14 - Dinâmica e Articulação",
      descricao: "Sinais de intensidade (pianíssimo, piano, meio-forte, forte, fortíssimo), dinâmica gradual (crescendo e decrescendo) e acentuações. Abrange os Exercícios 99 a 105."
    },
    15: {
      titulo: "Fase 15 - Andamento e Modificações",
      descricao: "Estudo sobre o andamento e uso do metrônomo, modificação de andamento (poco rallentando) e andamento indevido. Abrange os Exercícios 106 a 107."
    },
    16: {
      titulo: "Fase 16 - Fraseologia e Interpretação",
      descricao: "Conceito de frases, semifrases e motivos, interpretação musical e indicações interpretativas finais do método. Abrange os Exercícios 108 a 113."
    }
  };

  window.MsaData = {
    getFases: function () { return msaFases; }
  };
})();
