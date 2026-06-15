/**
 * Atualiza xml/catalog.json:
 * 1. Limpa os itens de flauta antigos (id metodo-flauta-X) na coleção 'metodo-inclusivo-ccb'.
 * 2. Limpa qualquer propriedade 'flauta' residual nos itens de corda originais.
 * 3. Cria os itens de flauta separados (afinação 'do') a partir dos arquivos XML da flauta.
 * 4. Insere esses novos itens diretamente no array 'items' da coleção principal 'metodo-inclusivo-ccb'.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const catalogPath = path.join(root, 'xml', 'catalog.json');
const flautaDir = path.join(
  root,
  'xml',
  'colecoes',
  'metodo-inclusivo-ccb',
  'do',
  'flauta'
);

const PREFIX_RE = /^(\d+)\s*[-–]?\s*(.+)\.musicxml$/i;
const VOICE_RE = /\s*-\s*(Sop8|Sop|Ctr|Ten|Bax|s|c|t|b)$/i;

function emptyVoices() {
  return { s: '', c: '', t: '', b: '' };
}

function parseVoice(voiceStr) {
  const v = voiceStr.toLowerCase();
  if (v === 'sop' || v === 'sop8' || v === 's') return 's';
  if (v === 'ctr' || v === 'c') return 'c';
  if (v === 'ten' || v === 't') return 't';
  if (v === 'bax' || v === 'b') return 'b';
  return 's';
}

function buildFlautaItems() {
  if (!fs.existsSync(flautaDir)) {
    console.error(`Erro: Diretório da flauta não encontrado: ${flautaDir}`);
    return [];
  }

  const files = fs.readdirSync(flautaDir);
  /** @type {Map<number, { title: string, voices: Record<string, string> }>} */
  const itemsMap = new Map();

  for (const filename of files) {
    if (!filename.toLowerCase().endsWith('.musicxml')) continue;

    // Identifica e remove o número do exercício e a extensão do nome
    const numMatch = filename.match(PREFIX_RE);
    if (!numMatch) {
      console.warn(`Aviso: Arquivo não segue o padrão de numeração: ${filename}`);
      continue;
    }

    const num = parseInt(numMatch[1], 10);
    let rest = numMatch[2].trim();

    // Identifica e remove o sufixo de voz, se houver
    let voice = 's';
    const voiceMatch = rest.match(VOICE_RE);
    if (voiceMatch) {
      voice = parseVoice(voiceMatch[1]);
      rest = rest.substring(0, voiceMatch.index).trim();
    }

    const relPath = `xml/colecoes/metodo-inclusivo-ccb/do/flauta/${filename}`;

    if (!itemsMap.has(num)) {
      itemsMap.set(num, {
        title: rest || `Exercício ${num}`,
        voices: emptyVoices()
      });
    }

    const itemData = itemsMap.get(num);
    itemData.voices[voice] = relPath;
    
    // Se encontramos uma versão com título mais descritivo, atualiza
    if (rest && rest.length > itemData.title.length) {
      itemData.title = rest;
    }
  }

  const sortedNumbers = Array.from(itemsMap.keys()).sort((a, b) => a - b);
  const items = sortedNumbers.map((num) => {
    const data = itemsMap.get(num);
    return {
      id: `metodo-flauta-${num}`,
      numero: num,
      titulo: data.title,
      afinacao: 'do',
      compasso: '',
      bpm: 0,
      arquivosPorInstrumento: {
        flauta: data.voices
      }
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

  // Encontrar a coleção principal
  const mainCol = data.colecoes.find((c) => c && c.id === 'metodo-inclusivo-ccb');
  if (!mainCol) {
    console.error('Erro: Coleção principal metodo-inclusivo-ccb não encontrada!');
    return;
  }

  if (!Array.isArray(mainCol.items)) {
    mainCol.items = [];
  }

  // 1. Limpar os itens de flauta antigos (metodo-flauta-X)
  const beforeCount = mainCol.items.length;
  mainCol.items = mainCol.items.filter((item) => item && !String(item.id || '').startsWith('metodo-flauta-'));
  const clearedFlautaCount = beforeCount - mainCol.items.length;
  console.log(`Limpou ${clearedFlautaCount} itens antigos de flauta da coleção.`);

  // 2. Limpar qualquer propriedade 'flauta' residual nos itens de cordas que sobraram
  let cleanedResidual = 0;
  for (const item of mainCol.items) {
    if (item.arquivosPorInstrumento && item.arquivosPorInstrumento.flauta) {
      delete item.arquivosPorInstrumento.flauta;
      cleanedResidual++;
    }
  }
  if (cleanedResidual > 0) {
    console.log(`Limpou chave 'flauta' residual em ${cleanedResidual} itens de cordas.`);
  }

  // 3. Gerar os novos itens de flauta separados
  const flautaItems = buildFlautaItems();
  console.log(`Gerados ${flautaItems.length} novos itens para a Flauta (Do).`);

  if (flautaItems.length === 0) {
    console.error('Nenhum item da flauta foi processado. Abortando escrita.');
    return;
  }

  // 4. Integrar os itens na coleção metodo-inclusivo-ccb
  mainCol.items.push(...flautaItems);
  console.log(`Coleção metodo-inclusivo-ccb agora possui um total de ${mainCol.items.length} itens.`);

  // Escreve de volta no catalog.json
  fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Arquivo xml/catalog.json atualizado com sucesso!');
}

main();
