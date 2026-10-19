/**
 * Base de Dados Oficial de Casas de Oração da CCB - Presidente Prudente e Região
 * Atualizada conforme lista oficial de congregações do setor.
 */
(function () {
  'use strict';

  var CONGREGACOES_DATA = [
    // ==========================================
    // --- 1. PRESIDENTE PRUDENTE ---
    // ==========================================
    { id: 'pp-bongiovani', cidade: 'Presidente Prudente', nome: 'Jardim Bongiovani' },
    { id: 'pp-ameliopolis', cidade: 'Presidente Prudente', nome: 'Ameliópolis' },
    { id: 'pp-ana-jacinta', cidade: 'Presidente Prudente', nome: 'Cj. Habitacional Ana Jacinta' },
    { id: 'pp-brasil-novo', cidade: 'Presidente Prudente', nome: 'Cj. Habitacional Brasil Novo' },
    { id: 'pp-humberto-salvador', cidade: 'Presidente Prudente', nome: 'Cj. Habitacional Jardim Humberto Salvador' },
    { id: 'pp-joao-domingos', cidade: 'Presidente Prudente', nome: 'Cj. Habitacional João Domingos Neto' },
    { id: 'pp-floresta-sul', cidade: 'Presidente Prudente', nome: 'Floresta do Sul' },
    { id: 'pp-brasilia', cidade: 'Presidente Prudente', nome: 'Jardim Brasília' },
    { id: 'pp-cobral', cidade: 'Presidente Prudente', nome: 'Jardim Cobral' },
    { id: 'pp-colina', cidade: 'Presidente Prudente', nome: 'Jardim Colina' },
    { id: 'pp-estoril', cidade: 'Presidente Prudente', nome: 'Jardim Estoril' },
    { id: 'pp-morada-sol', cidade: 'Presidente Prudente', nome: 'Jardim Morada do Sol' },
    { id: 'pp-ouro-verde', cidade: 'Presidente Prudente', nome: 'Jardim Ouro Verde' },
    { id: 'pp-paraiso', cidade: 'Presidente Prudente', nome: 'Jardim Paraíso' },
    { id: 'pp-planalto', cidade: 'Presidente Prudente', nome: 'Jardim Planalto' },
    { id: 'pp-santa-clara', cidade: 'Presidente Prudente', nome: 'Jardim Santa Clara' },
    { id: 'pp-santa-fe', cidade: 'Presidente Prudente', nome: 'Jardim Santa Fé' },
    { id: 'pp-sao-gabriel', cidade: 'Presidente Prudente', nome: 'Jardim São Gabriel' },
    { id: 'pp-vale-do-sol', cidade: 'Presidente Prudente', nome: 'Jardim Vale do Sol' },
    { id: 'pp-taquarussu', cidade: 'Presidente Prudente', nome: 'Km 15 - Córrego Taquarussu' },
    { id: 'pp-montalvao', cidade: 'Presidente Prudente', nome: 'Montalvão' },
    { id: 'pp-alvorada', cidade: 'Presidente Prudente', nome: 'Parque Alvorada' },
    { id: 'pp-imperial', cidade: 'Presidente Prudente', nome: 'Parque Imperial' },
    { id: 'pp-sao-matheus', cidade: 'Presidente Prudente', nome: 'Parque São Matheus' },
    { id: 'pp-watal-ishibashi', cidade: 'Presidente Prudente', nome: 'Parque Watal Ishibashi' },
    { id: 'pp-pacaembu', cidade: 'Presidente Prudente', nome: 'Vida Nova Pacaembú' },
    { id: 'pp-furquim', cidade: 'Presidente Prudente', nome: 'Vila Furquim' },
    { id: 'pp-vila-nova', cidade: 'Presidente Prudente', nome: 'Vila Nova Prudente' },

    // ==========================================
    // --- 2. ALFREDO MARCONDES ---
    // ==========================================
    { id: 'amc-centro', cidade: 'Alfredo Marcondes', nome: 'Centro' },

    // ==========================================
    // --- 3. ÁLVARES MACHADO ---
    // ==========================================
    { id: 'am-centro', cidade: 'Álvares Machado', nome: 'Centro' },
    { id: 'am-coronel-goulart', cidade: 'Álvares Machado', nome: 'Distrito Coronel Goulart' },
    { id: 'am-bela-vista', cidade: 'Álvares Machado', nome: 'Jardim Bela Vista' },
    { id: 'am-panorama', cidade: 'Álvares Machado', nome: 'Jardim Panorama' },
    { id: 'am-pinheiros', cidade: 'Álvares Machado', nome: 'Parque dos Pinheiros' },

    // ==========================================
    // --- 4. EMILIANÓPOLIS ---
    // ==========================================
    { id: 'emi-centro', cidade: 'Emilianópolis', nome: 'Centro' },

    // ==========================================
    // --- 5. PRESIDENTE BERNARDES ---
    // ==========================================
    { id: 'pb-centro', cidade: 'Presidente Bernardes', nome: 'Centro' },
    { id: 'pb-agua-limpa', cidade: 'Presidente Bernardes', nome: 'Assentamento Água Limpa' },
    { id: 'pb-florestan', cidade: 'Presidente Bernardes', nome: 'Assentamento Florestan Fernandes' },
    { id: 'pb-palu', cidade: 'Presidente Bernardes', nome: 'Assentamento Palu' },
    { id: 'pb-rodeio', cidade: 'Presidente Bernardes', nome: 'Assentamento Rodeio' },
    { id: 'pb-santa-elisabete', cidade: 'Presidente Bernardes', nome: 'Jardim Santa Elisabete' },
    { id: 'pb-nova-patria', cidade: 'Presidente Bernardes', nome: 'Nova Pátria' },

    // ==========================================
    // --- 6. SANTO EXPEDITO ---
    // ==========================================
    { id: 'se-centro', cidade: 'Santo Expedito', nome: 'Centro' },

    // ==========================================
    // --- DEMAIS CIDADES DA REGIÃO ---
    // ==========================================
    // Pirapozinho
    { id: 'pz-centro', cidade: 'Pirapozinho', nome: 'Centro' },
    { id: 'pz-padre-hilario', cidade: 'Pirapozinho', nome: 'Residencial Padre Hilário' },
    { id: 'pz-novo-horizonte', cidade: 'Pirapozinho', nome: 'Jardim Novo Horizonte' },
    { id: 'pz-itororo', cidade: 'Pirapozinho', nome: 'Distrito Itororó do Paranapanema' },

    // Regente Feijó
    { id: 'rf-centro', cidade: 'Regente Feijó', nome: 'Centro / Vila Assunção' },
    { id: 'rf-tropical', cidade: 'Regente Feijó', nome: 'Jardim Tropical' },
    { id: 'rf-canaa', cidade: 'Regente Feijó', nome: 'Jardim Canaã' },
    { id: 'rf-espigao', cidade: 'Regente Feijó', nome: 'Distrito de Espigão' },

    // Martinópolis
    { id: 'mt-central', cidade: 'Martinópolis', nome: 'Central' },
    { id: 'mt-bela-vista', cidade: 'Martinópolis', nome: 'Jardim Bela Vista' },
    { id: 'mt-grevilhas', cidade: 'Martinópolis', nome: 'Parque das Grevilhas' },
    { id: 'mt-santa-luzia', cidade: 'Martinópolis', nome: 'Santa Luzia' },
    { id: 'mt-vila-scocia', cidade: 'Martinópolis', nome: 'Vila Escócia' },
    { id: 'mt-vila-alegrete', cidade: 'Martinópolis', nome: 'Vila Alegrete' },

    // Santo Anastácio
    { id: 'sa-central', cidade: 'Santo Anastácio', nome: 'Central' },
    { id: 'sa-vila-moreno', cidade: 'Santo Anastácio', nome: 'Vila Moreno' },
    { id: 'sa-ipiranga', cidade: 'Santo Anastácio', nome: 'Jardim Ipiranga' },

    // Presidente Venceslau
    { id: 'pv-central', cidade: 'Presidente Venceslau', nome: 'Central' },
    { id: 'pv-jardim-arlete', cidade: 'Presidente Venceslau', nome: 'Jardim Arlete' },
    { id: 'pv-vila-carmem', cidade: 'Presidente Venceslau', nome: 'Vila Carmem' },
    { id: 'pv-vila-luiza', cidade: 'Presidente Venceslau', nome: 'Vila Luiza' },

    // Presidente Epitácio
    { id: 'pe-central', cidade: 'Presidente Epitácio', nome: 'Central' },
    { id: 'pe-tibirica', cidade: 'Presidente Epitácio', nome: 'Vila Tibiriçá' },
    { id: 'pe-jardim-real', cidade: 'Presidente Epitácio', nome: 'Jardim Real' },

    // Rancharia
    { id: 'rc-central', cidade: 'Rancharia', nome: 'Central' },
    { id: 'rc-cantizani', cidade: 'Rancharia', nome: 'Vila Cantizani' },
    { id: 'rc-primavera', cidade: 'Rancharia', nome: 'Jardim Primavera' },

    // Outros municípios vizinhos
    { id: 'in-centro', cidade: 'Indiana', nome: 'Centro' },
    { id: 'cb-centro', cidade: 'Caiabu', nome: 'Centro' },
    { id: 'ah-centro', cidade: 'Anhumas', nome: 'Centro' },
    { id: 'tc-centro', cidade: 'Taciba', nome: 'Centro' },
    { id: 'tb-centro', cidade: 'Tarabai', nome: 'Centro' },
    { id: 'nd-centro', cidade: 'Narandiba', nome: 'Centro' },
    { id: 'en-centro', cidade: 'Estrela do Norte', nome: 'Centro' },
    { id: 'sd-centro', cidade: 'Sandovalina', nome: 'Centro' },
    { id: 'mp-central', cidade: 'Mirante do Paranapanema', nome: 'Central' },
    { id: 'ts-central', cidade: 'Teodoro Sampaio', nome: 'Central' }
  ];

  // Formata o rótulo completo: "Cidade - Nome da Congregação"
  CONGREGACOES_DATA.forEach(function (c) {
    c.label = c.cidade + ' - ' + c.nome;
  });

  // Lista ordenada de cidades dando prioridade às do setor oficial
  var PRIORIDADE_CIDADES = [
    'Presidente Prudente',
    'Álvares Machado',
    'Alfredo Marcondes',
    'Emilianópolis',
    'Presidente Bernardes',
    'Santo Expedito'
  ];

  var TODAS_CIDADES = Array.from(new Set(CONGREGACOES_DATA.map(function (c) { return c.cidade; })));

  var CIDADES = TODAS_CIDADES.sort(function (a, b) {
    var idxA = PRIORIDADE_CIDADES.indexOf(a);
    var idxB = PRIORIDADE_CIDADES.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });

  window.CongregacoesModule = {
    getAll: function () {
      return CONGREGACOES_DATA.slice();
    },
    getCidades: function () {
      return CIDADES.slice();
    },
    getByCidade: function (cidade) {
      if (!cidade) return CONGREGACOES_DATA.slice();
      return CONGREGACOES_DATA.filter(function (c) {
        return c.cidade.toLowerCase() === cidade.toLowerCase();
      });
    },
    findById: function (id) {
      return CONGREGACOES_DATA.find(function (c) { return c.id === id; }) || null;
    },
    findByLabel: function (label) {
      if (!label) return null;
      var clean = label.trim().toLowerCase();
      return CONGREGACOES_DATA.find(function (c) {
        return c.label.toLowerCase() === clean || c.nome.toLowerCase() === clean;
      }) || null;
    }
  };
})();
