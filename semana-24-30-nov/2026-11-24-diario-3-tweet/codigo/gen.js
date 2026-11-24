const {chromium} = require('playwright');
const fs = require('fs');
const av = 'data:image/png;base64,' + fs.readFileSync('avatar.png').toString('base64');
const slides = [
  `<p class="t"><b>Diário da Miyu #3</b> 🐾</p>
   <p>Tem afiliada me perguntando por que a Miyu tá <span class="pk">de graça</span> agora.</p>
   <p>A resposta é simples&nbsp;👇</p>`,
  `<p>Antes de cobrar qualquer coisa, eu quero afiliada de verdade usando a Miyu no dia a dia e me contando <b>o que ajuda e o que atrapalha.</b></p>
   <p>Pode me contar por formulário ou por áudio, como&nbsp;preferir.</p>`,
  `<p class="t"><b>O que vocês acharem vai mudar o app.</b></p>
   <p>Quem entra no beta usa de graça e garante um <b>cupom exclusivo de lançamento.</b></p>
   <p class="s">Precisa ter conta de afiliada Shopee. A aprovação da API leva alguns dias, mas eu te ajudo no passo a passo.</p>`,
  `<p>Comenta <span class="pk">QUERO</span> que eu te chamo na DM com um cadastro rapidinho&nbsp;🧡</p>
   <p>E segue a @miyuflix pra acompanhar o&nbsp;diário&nbsp;🐾</p>`,
];
const icons = `
<svg viewBox="0 0 24 24"><path d="M3.5 11.5a8 7.5 0 1 1 3.2 6L3.5 19l1.1-3.3a7.3 7.3 0 0 1-1.1-4.2z"/></svg>
<svg viewBox="0 0 24 24"><path d="M4 9.5V8a2 2 0 0 1 2-2h12l-3-3M20 14.5V16a2 2 0 0 1-2 2H6l3 3"/></svg>
<svg viewBox="0 0 24 24"><path d="M12 20s-8-4.9-8-10.3A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.7C20 15.1 12 20 12 20z"/></svg>
<svg viewBox="0 0 24 24"><path d="M6.5 3.5h11v17L12 16.5l-5.5 4z"/></svg>`;
const page = (body, i) => `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#fff;font-family:Inter,'Noto Color Emoji',sans-serif;color:#0F1419;display:flex;flex-direction:column;justify-content:center;padding:0 90px;position:relative}
.h{display:flex;align-items:center;gap:26px;margin-bottom:46px}
.h img{width:118px;height:118px;border-radius:50%}
.n{font-weight:800;font-size:44px;letter-spacing:-0.5px}
.u{font-size:38px;color:#536471;margin-top:2px}
.d{position:absolute;right:90px;font-size:44px;color:#536471;letter-spacing:4px}
p{font-size:58px;line-height:1.38;margin-bottom:34px;letter-spacing:-0.3px}
p.t{font-size:60px}
p.s{font-size:44px;color:#3A4651}
b{font-weight:800}
.pk{color:#E8457A;font-weight:800}
.ts{font-size:36px;color:#536471;margin-top:4px;padding-bottom:30px;border-bottom:2px solid #EFF3F4}
.ic{display:flex;justify-content:space-between;padding:32px 2px 0}
.ic svg{width:50px;height:50px;fill:none;stroke:#536471;stroke-width:1.8;stroke-linejoin:round;stroke-linecap:round}
.f{position:absolute;bottom:72px;left:90px;right:90px;display:flex;justify-content:space-between;font-weight:800;font-size:32px;color:#2E7D5B}
</style></head><body>
<div class="h" style="position:relative"><img src="${av}"><div><div class="n">MiyuFlix</div><div class="u">@miyuflix</div></div><div class="d" style="right:0">···</div></div>
${body}
<div class="ts">16:00 · 24 nov 2026</div>
<div class="ic">${icons}</div>
<div class="f"><span>${i === 0 ? 'arrasta pro lado →' : ''}</span><span>${i + 1}/${slides.length}</span></div>
</body></html>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 1});
  fs.mkdirSync('out', {recursive: true});
  for (let i = 0; i < slides.length; i++) {
    await p.setContent(page(slides[i], i));
    await p.waitForTimeout(150);
    const over = await p.evaluate(() => document.querySelector('.ic').getBoundingClientRect().bottom);
    console.log(i + 1, 'icons bottom', Math.round(over));
    await p.screenshot({path: `out/0${i + 1}.png`});
  }
  await b.close();
})();
