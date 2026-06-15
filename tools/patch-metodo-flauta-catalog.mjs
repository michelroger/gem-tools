/**
 * Atualiza xml/catalog.json na coleção metodo-inclusivo-ccb:
 * adiciona arquivosPorInstrumento.flauta a partir dos .musicxml em do/flauta.
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

function indexFlautaFiles() {
  if (!fs.existsSync(flautaDir)) {
    console.error(`Erro: Diretório da flauta não encontrado: ${flautaDir}`);
    return new Map();
  }

  /** @type {Map<number, { s: string, c: string, t: string, b: string }>} */
  const byNum = new Map();
  const names = fs.readdirSync(flautaDir, { withFileTypes: true });

  for (const ent of names) {
    if (!ent.isFile() || !ent.name.toLowerCase().endsWith('.musicxml')) continue;
    const filename = ent.name;
    const m = filename.match(PREFIX_RE);
    if (!m) {
      console.warn(`Aviso: Arquivo não segue o padrão de numeração: ${filename}`);
      continue;
    }
    const num = parseInt(m[1], 10);
    if (!Number.isFinite(num)) continue;

    let voice = 's';
    const rest = m[2];
    const vm = rest.match(VOICE_RE);
    if (vm) {
      voice = parseVoice(vm[1]);
    }

    const rel = `xml/colecoes/metodo-inclusivo-ccb/do/flauta/${filename}`;
    if (!byNum.has(num)) byNum.set(num, emptyVoices());
    const slot = byNum.get(num);
    slot[voice] = rel;
  }
  return byNum;
}

function main() {
  if (!fs.existsSync(catalogPath)) {
    console.error(`Erro: Arquivo do catálogo não encontrado em: ${catalogPath}`);
    return;
  }

  const raw = fs.readFileSync(catalogPath, 'utf8');
  const data = JSON.parse(raw);
  if (!data.colecoes || !Array.isArray(data.colecoes)) {
    throw new Error('catalog.json: sem colecoes[]');
  }

  const col = data.colecoes.find((c) => c && c.id === 'metodo-inclusivo-ccb');
  if (!col || !Array.isArray(col.items)) {
    throw new Error('Coleção metodo-inclusivo-ccb não encontrada');
  }

  const byNum = indexFlautaFiles();
  let added = 0;
  let empty = 0;

  for (const item of col.items) {
    // Apenas adicionar a flauta para itens de afinação 'do'
    if (item.afinacao !== 'do') continue;

    const n = Number(item.numero);
    if (!Number.isFinite(n)) continue;

    if (!item.arquivosPorInstrumento || typeof item.arquivosPorInstrumento !== 'object') {
      item.arquivosPorInstrumento = {};
    }

    const v = byNum.get(n) || emptyVoices();
    const hasAny = v.s || v.c || v.t || v.b;

    item.arquivosPorInstrumento.flauta = { s: v.s || '', c: v.c || '', t: v.t || '', b: v.b || '' };

    if (hasAny) {
      added++;
    } else {
      empty++;
    }
  }

  // Escrever de volta no catalog.json
  fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(
    `OK: ${col.items.length} itens no catálogo; flauta adicionada em: ${added} itens de afinação 'do'; flauta vazia (sem match na pasta): ${empty}`
  );
}

main();
