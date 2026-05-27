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
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/0a64c366-862f-4c96-8110-74ae883946b8?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
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
      descricao: "Conceito de tercinas, grupos de três figuras no lugar de duas, e exercícios de solfejo com tercinas baseadas no hinário.",
      videoUrl: "https://www.dropbox.com/scl/fi/h1wt71zaf3fafja0re5r3/msa_fase5.mp4?rlkey=mpov0dr5anw4ay7j0kkrv17is&st=ihb3wfrs&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/ymngfnz56qiixxsvusjoo/msa_fase5.m4a?rlkey=n6rxzrtvi2mj77niid1cyzmmr&st=z0hj5yu1&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/e2945bc2-6c3d-4774-8a44-fee07645f888?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    6: {
      titulo: "Fase 6 - Tom, Semitom e Acidentes",
      descricao: "Estudo dos intervalos de tom e semitom (diatônico e cromático) e os acidentes musicais (sustenido, bemol e bequadro).",
      videoUrl: "https://www.dropbox.com/scl/fi/q6myzqmtv4y9ho8p7lqg9/msa_fase6.mp4?rlkey=rntn7a0y2lscnd41oxacqi5ti&st=2dlfwrsb&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/9r0ya2y6st1g3dqt2gs4u/msa_fase6.m4a?rlkey=e5hpu1f1gew7wwgonhg0k8qzm&st=xvpiqkkk&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/9644d89f-1feb-48ab-9346-2eca22661536?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"

    },
    7: {
      titulo: "Fase 7 - Armadura de Clave",
      descricao: "Estudo da armadura de clave com sustenidos e bemóis, acidentes fixos e identificação rápida do nome das escalas maiores.",
      videoUrl: "https://www.dropbox.com/scl/fi/0ablwchkznzsktp8vnkka/msa_fase7.mp4?rlkey=nc3gvq8vlbbntpmtt90ugeetf&st=e9xw4qhd&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/thnzlmpjqj2asp99zrnw7/msa_fase7.m4a?rlkey=oouqtb6cx57gnto96skkq77w4&st=oi62yhpn&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/6df54de3-2181-4dde-b10d-d91e45783376?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    8: {
      titulo: "Fase 8 - Tonalidade",
      descricao: "Conceito de tonalidade (maior e menor), organização em relação à tônica da escala (grau I) e identificação nos hinos.",
      videoUrl: "https://www.dropbox.com/scl/fi/y8srxqdlhtl843yect4s0/msa_fase8.mp4?rlkey=cvlpe9hs0zvyyoqb92757y3mf&st=aey95zzm&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/bkgluguvqqycg9jklbln6/msa_fase8.m4a?rlkey=60y0182y59qs4ucod0x6u0wnu&st=7q3nyjqc&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/e0951b72-a71f-4cee-bd38-4dd9180c57b4?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    9: {
      titulo: "Fase 9 - Repetição (Ritornello)",
      descricao: "Estudo das barras de compasso de repetição (ritornello), casas de ritornello (1, 2 e 3) e execução de hinos com seção 'Final'.",
      videoUrl: "https://www.dropbox.com/scl/fi/xfhcpdgctour4r8ywv7yn/msa_fase9.mp4?rlkey=a66bag673oh2p07pydqyjrxch&st=kjao3n5f&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/ia4qaojflzd2ega6ntk2q/msa_fase9.m4a?rlkey=jios9l18wovyw1jftlisj0kod&st=x8rznbpj&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/2ae8cdbb-e28b-4928-baa6-03faf66253bf?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"

    },
    10: {
      titulo: "Fase 10 - Dinâmica",
      descricao: "Variação de intensidade do som de maneira gradual (crescendo e decrescendo), termos italianos e dinâmica natural nos hinos.",
      videoUrl: "https://www.dropbox.com/scl/fi/9owoly87i4ressqssnlqp/msa_fase10.mp4?rlkey=3dp9q060jqsojamfia47snp8a&st=2r0ysa6i&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/woqxhqstj8xgtjxuc7tbu/msa_fase10.m4a?rlkey=d1qhdxcxyi3z7vw1ku7bd6fo9&st=j5cmdlui&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/efb3c1cc-152f-4567-85ab-59adb21b1ac3?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    11: {
      titulo: "Fase 11 - Acento Métrico e Compasso Simples",
      descricao: "Acentuação forte e fraca dos tempos do compasso (acento métrico) e estudo detalhado do compasso simples.",
      videoUrl: "https://www.dropbox.com/scl/fi/qhazdrfdka272w1um7hqg/msa_fase11.mp4?rlkey=b1fmn4l7j7pjv4m15i8ff7cwy&st=nmlg0s67&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/g26v7vaujjkirzlc6iaio/msa_fase11.m4a?rlkey=20r1954gyhxqfcjf3ij9w9cyt&st=8cn7ysx1&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/ae5ce1bb-672c-494a-b784-83c2d48e54ca?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    12: {
      titulo: "Fase 12 - Síncopa e Contratempo",
      descricao: "Conceito e execução de síncopa (regular e irregular) e contratempo (regular e irregular) no estilo sacro.",
      videoUrl: "https://www.dropbox.com/scl/fi/tgo035h0dkvg85ovkpi8k/msa_fase12.mp4?rlkey=iif3llqr4cxphs2033r24yoxb&st=w3bzi7xs&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/d3auhql6luuzcnzxez8y1/msa_fase12.m4a?rlkey=lehher4008t4nsdh6ht5qytk5&st=hhh068hr&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/b51909be-3727-4d7b-b70b-d84de91a9380?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    13: {
      titulo: "Fase 13 - Ritmos Iniciais",
      descricao: "Classificação dos ritmos iniciais na partitura: tético (início no tempo forte), anacrúsico e acéfalo.",
      videoUrl: "https://www.dropbox.com/scl/fi/2wc85fiik9mm6shp6ctte/msa_fase13.mp4?rlkey=unsdusccvkl3lut8zai2p1sbe&st=9cct8ck7&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/a92o2rjceowdi7oktpggi/msa_fase13.m4a?rlkey=e8rlovy1qzlii9jlnkwz4o90w&st=3uxo2pxz&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/ce5ef693-caa3-44cb-b26a-4f131268bb96?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"

    },
    14: {
      titulo: "Fase 14 - Subdivisão de Notas Pontuadas",
      descricao: "Proporção e subdivisão correta de colcheia pontuada seguida de semicolcheia de acordo com a velocidade de execução.",
      videoUrl: "https://www.dropbox.com/scl/fi/ftfolil1mv7i3lrgwr7vd/msa_fase14.mp4?rlkey=omkjsdbcnnla5zn5onvl4c30t&st=6eazvw0t&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/3f8v39j2f6d2yzedtn86w/msa_fase14.m4a?rlkey=w7y81sx4iutl6lj9a9uysksmi&st=hr8iw9qu&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/b9daf518-64ad-40c4-a0a6-9af910252987?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    },
    15: {
      titulo: "Fase 15 - Andamento e poco rallentando",
      descricao: "Indicação de velocidade (andamento), limites mínimos e máximos nos hinos e a modificação gradativa com o poco rallentando.",
      videoUrl: "https://www.dropbox.com/scl/fi/2ihks3a9c533jugobe6ce/msa_fase15.mp4?rlkey=0e9u7f25ju65mlbbnpvh59hgc&st=3vmqtk9d&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/ig2zduoir457phgfo575i/msa_fase15.m4a?rlkey=25o6v1pj2xq8g7qjoadmqz4fm&st=b4vy8acp&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/c9fa20f4-c3e5-4122-9584-79f828501c83?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"

    },
    16: {
      titulo: "Fase 16 - Interpretação e Indicações Interpretativas",
      descricao: "Compreensão e transmissão dos sentimentos da poesia (expressão musical) e as indicações: Solene, Majestoso, Com júbilo, Com veneração, Com submissão e Com humildade.",
      videoUrl: "https://www.dropbox.com/scl/fi/5733ospjj3obo0ftga9jd/msa_fase16.mp4?rlkey=kfyderg821mali9ldytzbv8cd&st=dwgss9um&dl=0",
      audioUrl: "https://www.dropbox.com/scl/fi/wnspn9fdqz07vzuhdk8l6/msa_fase16.m4a?rlkey=r8t5skzxjssfjl3k032wzht91&st=52u6lkn6&dl=0",
      quizUrl: "https://notebooklm.google.com/notebook/9d1e54ce-2221-4909-a1fc-b8422c2dc6fe/artifact/afb2ebbb-69f7-45ff-978e-caa3509f70e5?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_2&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_2_"
    }
  };

  window.MsaData = {
    getFases: function () { return msaFases; }
  };
})();
