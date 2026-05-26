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
      videoUrl: "https://docs.google.com/uc?export=download&id=1zca3tCC0t-dYkiZFiH-_cQFq5fdJPPj9",
      audioUrl: "https://docs.google.com/uc?export=download&id=1xAm10Coim9J5BZvV7fAHa2sZnNyAI3Uo",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/af27b210-b90e-433b-b449-c0e4c9ee3597?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    2: {
      titulo: "Fase 2 - Figuras Musicais",
      descricao: "Figuras musicais de som (notas) e de silêncio (pausas), números de equivalência e a proporção de duração entre as figuras.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1iFEi-LpVMOoP70ZLzUmLinX2TkdcZfKd",
      audioUrl: "https://docs.google.com/uc?export=download&id=1AJJonIOQfZY69rh_5TNLf-Mpu5yZeJKg",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/c75ed3e0-3338-45df-8673-e531fadce57a?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    3: {
      titulo: "Fase 3 - Endecagrama, Leitura e Solfejo",
      descricao: "Estudo sobre o endecagrama (claves e alturas), leitura rítmica, leitura métrica, solfejo e os movimentos de condução da pulsação.",
      videoUrl: "https://docs.google.com/uc?export=download&id=195sp0v80pPIKpZTcN3RUx6UNzFoa_wnJ",
      audioUrl: "https://docs.google.com/uc?export=download&id=1e1HwQb--hb96sMUqvxvJCxx5t94vn2Xf",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/d7550b7d-be74-4e99-888e-a13812da7c16?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    4: {
      titulo: "Fase 4 - Ligadura, Ponto de Aumento e Intervalos",
      descricao: "Tipos de ligadura (valor e portamento), ponto de aumento (simples e duplo) e conceitos de intervalos (simples, compostos, melódicos e harmônicos).",
      videoUrl: "https://docs.google.com/uc?export=download&id=11CeR4ZqcbrLfjU7qLjw3Z5g08tqVUGOD",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/4920864b-7eac-4054-a5dd-d44cf632b8c3?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    5: {
      titulo: "Fase 5 - Tercinas",
      descricao: "Conceito de tercinas, grupos de três figuras no lugar de duas, e exercícios de solfejo com tercinas baseadas no hinário.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    6: {
      titulo: "Fase 6 - Tom, Semitom e Acidentes",
      descricao: "Estudo dos intervalos de tom e semitom (diatônico e cromático) e os acidentes musicais (sustenido, bemol e bequadro).",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    7: {
      titulo: "Fase 7 - Armadura de Clave",
      descricao: "Estudo da armadura de clave com sustenidos e bemóis, acidentes fixos e identificação rápida do nome das escalas maiores.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    8: {
      titulo: "Fase 8 - Tonalidade",
      descricao: "Conceito de tonalidade (maior e menor), organização em relação à tônica da escala (grau I) e identificação nos hinos.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    9: {
      titulo: "Fase 9 - Repetição (Ritornello)",
      descricao: "Estudo das barras de compasso de repetição (ritornello), casas de ritornello (1, 2 e 3) e execução de hinos com seção 'Final'.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    10: {
      titulo: "Fase 10 - Dinâmica",
      descricao: "Variação de intensidade do som de maneira gradual (crescendo e decrescendo), termos italianos e dinâmica natural nos hinos.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    11: {
      titulo: "Fase 11 - Acento Métrico e Compasso Simples",
      descricao: "Acentuação forte e fraca dos tempos do compasso (acento métrico) e estudo detalhado do compasso simples.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    12: {
      titulo: "Fase 12 - Síncopa e Contratempo",
      descricao: "Conceito e execução de síncopa (regular e irregular) e contratempo (regular e irregular) no estilo sacro.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    13: {
      titulo: "Fase 13 - Ritmos Iniciais",
      descricao: "Classificação dos ritmos iniciais na partitura: tético (início no tempo forte), anacrúsico e acéfalo.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    14: {
      titulo: "Fase 14 - Subdivisão de Notas Pontuadas",
      descricao: "Proporção e subdivisão correta de colcheia pontuada seguida de semicolcheia de acordo com a velocidade de execução.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    15: {
      titulo: "Fase 15 - Andamento e poco rallentando",
      descricao: "Indicação de velocidade (andamento), limites mínimos e máximos nos hinos e a modificação gradativa com o poco rallentando.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    16: {
      titulo: "Fase 16 - Interpretação e Indicações Interpretativas",
      descricao: "Compreensão e transmissão dos sentimentos da poesia (expressão musical) e as indicações: Solene, Majestoso, Com júbilo, Com veneração, Com submissão e Com humildade.",
      videoUrl: "https://docs.google.com/uc?export=download&id=1vj3BPCt6u6MWTI3LZtS8R_f1ir7ts52x",
      audioUrl: "https://docs.google.com/uc?export=download&id=1BdKqyTa-ThnuwNLLc84ccx2PHWd1Cv0j",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/93a7e51b-f67b-43e3-8552-4048d1036d7f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    }
  };

  window.MsaData = {
    getFases: function () { return msaFases; }
  };
})();
