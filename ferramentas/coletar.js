// Cole no javascript_tool da aba https://affiliate.shopee.com.br/offer/product_offer (logada).
// Antes de rodar, defina window.__termos (lista de ferramentas/termos.json) e window.__paginas (5).
// Busca cada termo, ordena por "Mais vendidos", lê 3 páginas e guarda em window.__base.
// Demora ~2 min: a chamada pode estourar o tempo, mas o script continua rodando na página.
// Confira com: Object.keys(window.__base).length (pare quando ficar estável e window.__fim === true).
// Depois rode: document.body.innerHTML='<article><pre>'+JSON.stringify(window.__out)+'</pre></article>'
// e leia com get_page_text (o retorno do javascript_tool corta textos longos).
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  window.__base = {}; window.__fim = false;
  const pct = s => parseFloat((s.match(/([\d,]+)%/) || [0, '0'])[1].replace(',', '.'));
  const grab = termo => document.querySelectorAll('.AffiliateItemCard').forEach(c => {
    const a = c.querySelector('a'); const id = (a.getAttribute('href').match(/product_offer\/(\d+)/) || [])[1]; if (!id) return;
    const t = s => ((c.querySelector(s) || {}).textContent || '').trim();
    if (!window.__base[id]) window.__base[id] = { id, termo, nome: t('.ItemCard__name'), preco: t('.ItemCardPrice__wrap .price'), vendas: t('.ItemCardSold__wrap'), comissao: pct(t('.commRate')), img: (c.querySelector('.ItemCard__image img') || {}).src };
  });
  const first = () => { const c = document.querySelector('.AffiliateItemCard a'); return c ? c.getAttribute('href').slice(0, 40) : ''; };
  const espera = async f0 => { for (let i = 0; i < 20 && first() == f0; i++) await sleep(400); await sleep(1300); };
  const buscar = async termo => {
    const inp = document.querySelector('input[placeholder^="Buscar por todos"]');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inp, termo);
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    const btn = document.querySelector('.custom-search-input .ant-input-group-addon');
    let f0 = first(); (btn.firstElementChild || btn).click(); await espera(f0);
    const opt = [...document.querySelectorAll('*')].find(e => e.children.length == 0 && e.textContent.trim() == 'Mais vendidos');
    if (opt) { f0 = first(); opt.click(); await espera(f0); }
    for (let p = 1; p <= (window.__paginas || 3); p++) {
      grab(termo);
      const nx = document.querySelector('.PaginationNoTotal__wrap .page-next');
      if (!nx || nx.className.includes('disabled')) break;
      f0 = first(); nx.click(); await espera(f0);
    }
  };
  const termos = window.__termos || ['vestido feminino', 'cropped feminino', 'blusa feminina', 'conjunto feminino', 'saia feminina', 'calça feminina', 'body feminino', 'short feminino', 'macacão feminino'];
  for (const t of termos) await buscar(t);
  window.__out = Object.values(window.__base).filter(x => x.comissao >= 11)
    .map(x => [x.id, x.termo.split(' ')[0], x.nome.slice(0, 80), x.preco, x.vendas, x.comissao, (x.img || '').replace('https://down-tx-br.img.susercontent.com/', '')]);
  window.__fim = true;
})();
