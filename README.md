## GEM Tools (PWA)

Orquestra para Crianças — uma PWA para aprender notas e praticar com metrônomo.

### Arquivos principais
- `index.html`: página principal
- `manifest.webmanifest`: manifesto da PWA (instalação)
- `sw.js`: service worker (cache/offline)
- `icon-192.png` / `icon-512.png`: ícones

### Publicação (recomendado: `https`)
Para que o service worker funcione corretamente em produção, hospede este app em `https`.
O caminho mais simples é:

1. Fazer push deste repositório no GitHub
2. Ativar **GitHub Pages**
3. Usar a saída de Pages (URL `https://...`)

Depois de publicar, abra a URL no navegador e use a opção de instalar (quando disponível).

