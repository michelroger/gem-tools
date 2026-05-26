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
      videoUrl: "https://www.dropbox.com/scl/fi/1dw0zlk7evki09hv763jt/msa_fase1.mp4?rlkey=xpr52wf3l3yaxwydhd49vgcxz&st=wa894fi4&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/6msoi6fs6cheq2uzg5h41/msa_fase1.m4a?rlkey=k2txp36q0vas755ty2ilrtay1&st=m5cjhf22&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/af27b210-b90e-433b-b449-c0e4c9ee3597?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    2: {
      titulo: "Fase 2 - Figuras Musicais",
      descricao: "Figuras musicais de som (notas) e de silêncio (pausas), números de equivalência e a proporção de duração entre as figuras.",
      videoUrl: "https://www.dropbox.com/scl/fi/x6q1rdlgh0utt3fn6rpoe/msa_fase2.mp4?rlkey=6frviq08iblb4l8500gxh69uz&st=z52bvhqh&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/84oljhtp90zxl8a3xtewk/msa_fase2.m4a?rlkey=bsbygg8wxo9ibcqriykxb00qb&st=lx7ot01f&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/c75ed3e0-3338-45df-8673-e531fadce57a?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    3: {
      titulo: "Fase 3 - Endecagrama, Leitura e Solfejo",
      descricao: "Estudo sobre o endecagrama (claves e alturas), leitura rítmica, leitura métrica, solfejo e os movimentos de condução da pulsação.",
      videoUrl: "https://www.dropbox.com/scl/fi/1qjmh1x34ovva9xi467ot/msa_fase3.mp4?rlkey=l7emmc7cgogk98oyll9fajphq&st=ly0tvswg&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/svwnopdju0y2yqitvazwa/msa_fase3.m4a?rlkey=bru3kgegf4t9em558o98daeea&st=4csrmu9g&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/d7550b7d-be74-4e99-888e-a13812da7c16?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    4: {
      titulo: "Fase 4 - Ligadura, Ponto de Aumento e Intervalos",
      descricao: "Tipos de ligadura (valor e portamento), ponto de aumento (simples e duplo) e conceitos de intervalos (simples, compostos, melódicos e harmônicos).",
      videoUrl: "https://www.dropbox.com/scl/fi/cj5fbkr7va46imdzxgdhp/msa_fase4.mp4?rlkey=4v3cj9k9q3iqi0m13mejqgwhr&st=f05ujxj7&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/vuhoa19hwvk75b746a4mf/msa_fase4.m4a?rlkey=0usa40rtbqwhbxgbahux54vfg&st=l13cxke3&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/4920864b-7eac-4054-a5dd-d44cf632b8c3?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
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
