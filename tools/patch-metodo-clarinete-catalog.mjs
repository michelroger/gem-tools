/**
 * Atualiza xml/catalog.json:
 * 1. Remove inteiramente a coleção extra 'metodo-clarinete-ccb' (se existir).
 * 2. Limpa os itens de afinação 'sib' que possam existir na coleção 'metodo-inclusivo-ccb'.
 * 3. Cria os itens do clarinete (afinação 'sib') a partir dos arquivos XML.
 * 4. Insere esses novos itens diretamente no array 'items' da coleção principal 'metodo-inclusivo-ccb'.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const catalogPath = path.join(root, 'xml', 'catalog.json');
const clarineteDir = path.join(
  root,
  'xml',
  'colecoes',
  'metodo-inclusivo-ccb',
  'sib',
  'clarineta'
);

const PREFIX_RE = /^(\d+)\s*[-–]?\s*/i;
const VOICE_RE = /\s*-\s*(Sop|Ctr|Ten|Bax|s|c|t|b)$/i;

function emptyVoices() {
  return { s: '', c: '', t: '', b: '' };
}

function parseVoice(voiceStr) {
  const v = voiceStr.toLowerCase();
  if (v === 'sop' || v === 's') return 's';
  if (v === 'ctr' || v === 'c') return 'c';
  if (v === 'ten' || v === 't') return 't';
  if (v === 'bax' || v === 'b') return 'b';
  return 's';
}

function buildClarineteItems() {
  if (!fs.existsSync(clarineteDir)) {
    console.error(`Erro: Diretório do clarinete não encontrado: ${clarineteDir}`);
    return [];
  }

  const files = fs.readdirSync(clarineteDir);
  /** @type {Map<number, { title: string, voices: Record<string, string> }>} */
  const itemsMap = new Map();

  for (const filename of files) {
    if (!filename.toLowerCase().endsWith('.musicxml')) continue;

    // Remove extensão e espaços extras
    let base = filename.replace(/\.musicxml$/i, '').trim();

    // Identifica e remove o sufixo de voz, se houver
    let voice = 's';
    const voiceMatch = base.match(VOICE_RE);
    if (voiceMatch) {
      voice = parseVoice(voiceMatch[1]);
      base = base.substring(0, voiceMatch.index).trim();
    }

    // Identifica e remove o número do exercício do início do nome
    const numMatch = base.match(PREFIX_RE);
    if (!numMatch) {
      console.warn(`Aviso: Arquivo não segue o padrão de numeração: ${filename}`);
      continue;
    }

    const num = parseInt(numMatch[1], 10);
    const title = base.substring(numMatch[0].length).trim();
    const relPath = `xml/colecoes/metodo-inclusivo-ccb/sib/clarineta/${filename}`;

    if (!itemsMap.has(num)) {
      itemsMap.set(num, {
        title: title || `Exercício ${num}`,
        voices: emptyVoices()
      });
    }

    const itemData = itemsMap.get(num);
    itemData.voices[voice] = relPath;
    
    // Se encontramos uma versão com título mais descritivo, atualiza
    if (title && title.length > itemData.title.length) {
      itemData.title = title;
    }
  }

  const sortedNumbers = Array.from(itemsMap.keys()).sort((a, b) => a - b);
  const items = sortedNumbers.map((num) => {
    const data = itemsMap.get(num);
    return {
      numero: num,
      titulo: data.title,
      afinacao: 'sib',
      compasso: '',
      bpm: 0,
      arquivosPorInstrumento: {
        clarinete: data.voices
      },
      id: `metodo-clarinete-${num}`
    };
  });

  return items;
}

function main() {
  if (!fs.existsSync(catalogPath)) {
    console.error(`Erro: Arquivo do catálogo não encontrado em: ${catalogPath}`);
    return;
  }

  const raw = fs.readFileSync(catalogPath, 'utf8');
  const data = JSON.parse(raw);

  if (!data.colecoes || !Array.isArray(data.colecoes)) {
    console.error('Erro: Estrutura inválida em catalog.json (colecoes ausente ou inválido)');
    return;
  }

  // 1. Remover a coleção extra metodo-clarinete-ccb, se existir
  const originalCount = data.colecoes.length;
  data.colecoes = data.colecoes.filter((c) => c && c.id !== 'metodo-clarinete-ccb');
  if (data.colecoes.length < originalCount) {
    console.log('Coleção extra metodo-clarinete-ccb removida do catálogo.');
  }

  // 2. Encontrar a coleção principal
  const mainCol = data.colecoes.find((c) => c && c.id === 'metodo-inclusivo-ccb');
  if (!mainCol) {
    console.error('Erro: Coleção principal metodo-inclusivo-ccb não encontrada!');
    return;
  }

  if (!Array.isArray(mainCol.items)) {
    mainCol.items = [];
  }

  // 3. Limpar os itens com afinacao 'sib' (antigos ou misturados) na coleção principal
  const beforeCount = mainCol.items.length;
  mainCol.items = mainCol.items.filter((item) => item && item.afinacao !== 'sib');
  const clearedCount = beforeCount - mainCol.items.length;
  console.log(`Limpou ${clearedCount} itens antigos de afinação 'sib' da coleção metodo-inclusivo-ccb.`);

  // 4. Também limpar qualquer propriedade 'clarinete' residual nos itens que sobraram (os de 'do')
  let cleanedResidual = 0;
  for (const item of mainCol.items) {
    if (item.arquivosPorInstrumento && item.arquivosPorInstrumento.clarinete) {
      delete item.arquivosPorInstrumento.clarinete;
      cleanedResidual++;
    }
  }
  if (cleanedResidual > 0) {
    console.log(`Limpou chave 'clarinete' residual em ${cleanedResidual} itens de cordas.`);
  }

  // 5. Gerar os novos itens de clarinete
  const clarineteItems = buildClarineteItems();
  console.log(`Gerados ${clarineteItems.length} novos itens para o Clarinete (Sib).`);

  if (clarineteItems.length === 0) {
    console.error('Nenhum item do clarinete foi processado. Abortando escrita.');
    return;
  }

  // 6. Integrar os itens na coleção metodo-inclusivo-ccb
  mainCol.items.push(...clarineteItems);
  console.log(`Coleção metodo-inclusivo-ccb agora possui um total de ${mainCol.items.length} itens.`);

  // Escreve de volta no catalog.json
  fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Arquivo xml/catalog.json atualizado com sucesso!');
}

main();
