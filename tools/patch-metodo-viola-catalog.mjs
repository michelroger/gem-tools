/**
 * Atualiza xml/catalog.json na coleção metodo-inclusivo-ccb:
 * adiciona arquivosPorInstrumento.viola a partir dos .musicxml em do/viola.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const catalogPath = path.join(root, 'xml', 'catalog.json');
const violaDir = path.join(
  root,
  'xml',
  'colecoes',
  'metodo-inclusivo-ccb',
  'do',
  'viola'
);

const PREFIX_RE = /^(\d+)\s*[-–]\s*(.+)\.musicxml$/i;
const VOICE_SUFFIX_RE = /_([sctb])$/i;

function emptyVoices() {
  return { s: '', c: '', t: '', b: '' };
}

function indexViolaFiles() {
  /** @type {Map<number, { s: string, c: string, t: string, b: string }>} */
  const byNum = new Map();
  const names = fs.readdirSync(violaDir, { withFileTypes: true });
  for (const ent of names) {
    if (!ent.isFile() || !ent.name.toLowerCase().endsWith('.musicxml')) continue;
    const filename = ent.name;
    const m = filename.match(PREFIX_RE);
    if (!m) continue;
    const num = parseInt(m[1], 10);
    if (!Number.isFinite(num)) continue;
    let voice = 's';
    let rest = m[2];
    const vm = rest.match(VOICE_SUFFIX_RE);
    if (vm) {
      voice = String(vm[1]).toLowerCase();
      if (!'sctb'.includes(voice)) voice = 's';
    }
    const rel = `xml/colecoes/metodo-inclusivo-ccb/do/viola/${filename}`;
    if (!byNum.has(num)) byNum.set(num, emptyVoices());
    const slot = byNum.get(num);
    slot[voice] = rel;
  }
  return byNum;
}

function main() {
  const raw = fs.readFileSync(catalogPath, 'utf8');
  const data = JSON.parse(raw);
  if (!data.colecoes || !Array.isArray(data.colecoes)) {
    throw new Error('catalog.json: sem colecoes[]');
  }
  const col = data.colecoes.find((c) => c && c.id === 'metodo-inclusivo-ccb');
  if (!col || !Array.isArray(col.items)) {
    throw new Error('Coleção metodo-inclusivo-ccb não encontrada');
  }
  const byNum = indexViolaFiles();
  let added = 0;
  let empty = 0;
  for (const item of col.items) {
    const n = Number(item.numero);
    if (!Number.isFinite(n)) continue;
    if (!item.arquivosPorInstrumento || typeof item.arquivosPorInstrumento !== 'object') {
      item.arquivosPorInstrumento = {};
    }
    const v = byNum.get(n) || emptyVoices();
    const hasAny = v.s || v.c || v.t || v.b;
    item.arquivosPorInstrumento.viola = { s: v.s || '', c: v.c || '', t: v.t || '', b: v.b || '' };
    if (hasAny) added++;
    else empty++;
  }
  fs.writeFileSync(catalogPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(
    `OK: ${col.items.length} itens; viola com arquivo: ${added}; viola vazio (sem match na pasta): ${empty}`
  );
}

main();
