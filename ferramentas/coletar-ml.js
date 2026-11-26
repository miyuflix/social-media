// Cole no javascript_tool da aba https://www.mercadolivre.com.br/afiliados/hub (logada).
// Antes, defina window.__termos (lista de ferramentas/termos.json).
// Para cada termo, busca em "Produtos selecionados para você" e guarda id MLB, nome, preço atual (Pix), % de ganhos e imagem.
// Demora ~5 min. Confira com ({feitos: window.__feitos, fim: window.__fim}).
// Depois rode: document.body.innerHTML='<article><pre>'+JSON.stringify(window.__outml)+'</pre></article>' e leia com get_page_text.
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  window.__ml = {}; window.__fim = false; window.__feitos = 0;
  const num = s => { const m = (s || '').match(/(\d[\d.]*) reais(?: com (\d+) centavos)?/); return m ? parseFloat(m[1].replace(/\./g, '') + '.' + (m[2] || '0').padStart(2, '0')) : null; };
  const grab = termo => document.querySelectorAll('.poly-card').forEach(c => {
    const a = [...c.querySelectorAll('a')].find(a => /MLB-?\d+/.test(a.href)); if (!a) return;
    const id = a.href.match(/MLB-?\d+/)[0].replace('-', '');
    const gm = c.textContent.match(/GANHOS(?:\s*EXTRAS)?\s*(\d+)%/);
    const cur = c.querySelector('.poly-price__current .andes-money-amount');
    if (!window.__ml[id]) window.__ml[id] = { id, termo, nome: ((c.querySelector('.poly-component__title') || a).textContent || '').trim().slice(0, 80), preco: num(cur && cur.getAttribute('aria-label')), ganhos: gm ? +gm[1] : 0, img: (c.querySelector('img') || {}).src };
  });
  const primeiro = () => { const a = document.querySelector('.poly-card a[href*="MLB"]'); return a ? a.href.slice(0, 60) : ''; };
  const buscar = async termo => {
    const inp = document.querySelector('input[placeholder="Busque produtos"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, termo);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    const f0 = primeiro(); const f = inp.closest('form');
    if (f) { f.requestSubmit ? f.requestSubmit() : f.submit(); } else inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
    for (let i = 0; i < 20 && primeiro() == f0; i++) await sleep(400);
    await sleep(2500);
    for (let i = 0; i < 4; i++) { grab(termo); window.scrollTo(0, document.body.scrollHeight); await sleep(900); }
    grab(termo); window.scrollTo(0, 0); window.__feitos++;
  };
  for (const t of (window.__termos || ['vestido feminino'])) await buscar(t);
  window.__outml = Object.values(window.__ml).filter(x => x.ganhos >= 11 && x.preco)
    .map(x => [x.id, x.nome, x.preco, x.ganhos, (x.img || '').replace('https://http2.mlstatic.com/', '')]);
  window.__fim = true;
})();
