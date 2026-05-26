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
      titulo: "Fase 1 - Música e Som",
      descricao: "Música e som, elementos da música (melodia, harmonia e ritmo) e propriedades do som (timbre, duração, altura e intensidade).",
      videoUrl: "https://docs.google.com/uc?export=download&id=1cGUTseN2gKMKb3p2GshbeHwt_8QF7L72",
      audioUrl: "https://docs.google.com/uc?export=download&id=1XHx8sehbQVY867g1cf80t2xjqmRNvOSQ"
    },
    2: {
      titulo: "Fase 2 - Figuras Musicais",
      descricao: "Figuras musicais de som (notas) e de silêncio (pausas), números de equivalência e a proporção de duração entre as figuras.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j"
    },
    3: {
      titulo: "Fase 3 - Endecagrama, Leitura e Solfejo",
      descricao: "Estudo sobre o endecagrama (claves e alturas), leitura rítmica, leitura métrica, solfejo e os movimentos de condução da pulsação."
    },
    4: {
      titulo: "Fase 4 - Ligadura, Ponto de Aumento e Intervalos",
      descricao: "Tipos de ligadura (valor e portamento), ponto de aumento (simples e duplo) e conceitos de intervalos (simples, compostos, melódicos e harmônicos)."
    },
    5: {
      titulo: "Fase 5 - Tercinas",
      descricao: "Conceito de tercinas, grupos de três figuras no lugar de duas, e exercícios de solfejo com tercinas baseadas no hinário."
    },
    6: {
      titulo: "Fase 6 - Tom, Semitom e Acidentes",
      descricao: "Estudo dos intervalos de tom e semitom (diatônico e cromático) e os acidentes musicais (sustenido, bemol e bequadro)."
    },
    7: {
      titulo: "Fase 7 - Armadura de Clave",
      descricao: "Estudo da armadura de clave com sustenidos e bemóis, acidentes fixos e identificação rápida do nome das escalas maiores."
    },
    8: {
      titulo: "Fase 8 - Tonalidade",
      descricao: "Conceito de tonalidade (maior e menor), organização em relação à tônica da escala (grau I) e identificação nos hinos."
    },
    9: {
      titulo: "Fase 9 - Repetição (Ritornello)",
      descricao: "Estudo das barras de compasso de repetição (ritornello), casas de ritornello (1, 2 e 3) e execução de hinos com seção 'Final'."
    },
    10: {
      titulo: "Fase 10 - Dinâmica",
      descricao: "Variação de intensidade do som de maneira gradual (crescendo e decrescendo), termos italianos e dinâmica natural nos hinos."
    },
    11: {
      titulo: "Fase 11 - Acento Métrico e Compasso Simples",
      descricao: "Acentuação forte e fraca dos tempos do compasso (acento métrico) e estudo detalhado do compasso simples."
    },
    12: {
      titulo: "Fase 12 - Síncopa e Contratempo",
      descricao: "Conceito e execução de síncopa (regular e irregular) e contratempo (regular e irregular) no estilo sacro."
    },
    13: {
      titulo: "Fase 13 - Ritmos Iniciais",
      descricao: "Classificação dos ritmos iniciais na partitura: tético (início no tempo forte), anacrúsico e acéfalo."
    },
    14: {
      titulo: "Fase 14 - Subdivisão de Notas Pontuadas",
      descricao: "Proporção e subdivisão correta de colcheia pontuada seguida de semicolcheia de acordo com a velocidade de execução."
    },
    15: {
      titulo: "Fase 15 - Andamento e poco rallentando",
      descricao: "Indicação de velocidade (andamento), limites mínimos e máximos nos hinos e a modificação gradativa com o poco rallentando."
    },
    16: {
      titulo: "Fase 16 - Interpretação e Indicações Interpretativas",
      descricao: "Compreensão e transmissão dos sentimentos da poesia (expressão musical) e as indicações: Solene, Majestoso, Com júbilo, Com veneração, Com submissão e Com humildade."
    }
  };

  window.MsaData = {
    getFases: function () { return msaFases; }
  };
})();
