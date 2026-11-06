# Modelo de vídeo — achadinhos da @afiliadamiyu (identidade Pistache)

Remotion 4. Um único componente orientado por JSON:
- `products` com 3–4 itens = vídeo de lista (com `n` para contagem regressiva)
- `products` com 1 item (+ `bullets`) = vídeo de produto único (~12 s)

Fotos da afiliada em `public/`: `afiliada-sorrindo.png` (lista/achado), `afiliada-preocupada.png` (gancho "para de rolar"/alerta), `afiliada-telefone.png` ("te conto no direct").
Fotos dos produtos: salvar 1092×1092 em `public/<nome>.png`.

```bash
npm ci
B=$(find / -name chrome-headless-shell -type f 2>/dev/null | head -1)   # ou headless_shell
./node_modules/.bin/remotion render src/index.ts Achadinhos out/<nome>.mp4 --props=props/<arquivo>.json --browser-executable=$B
```
Exemplos: `props/exemplo-lista.json`, `props/exemplo-produto.json`.
Título: `\n` quebra linha; `*palavra*` vira destaque rosa em Fraunces itálico.
