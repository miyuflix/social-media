#!/usr/bin/env python3
"""Gera black-friday/index.html a partir de dados/achados.json. Uso: python3 gerar.py"""
import json, html, datetime
from pathlib import Path

RAIZ = Path(__file__).resolve().parent
URL = "https://miyuflix.github.io/social-media/black-friday/"
ORDEM = ["Vestidos", "Conjuntos e macacões", "Cropped e blusas", "Bodies", "Saias", "Calças e shorts"]
SUB = {
    "Vestidos": "Vestido que vai do tênis ao salto, do trabalho ao Réveillon.",
    "Conjuntos e macacões": "Look pronto numa peça só: veste e sai.",
    "Cropped e blusas": "Peça de cima com detalhe é o jeito mais barato de parecer arrumada.",
    "Bodies": "Não sai de dentro da calça e deixa qualquer look mais alinhado.",
    "Saias": "Da midi à plissada, pra trabalho, culto e passeio.",
    "Calças e shorts": "Wide leg, pantalona e alfaiataria que alongam.",
}
FAQ = [
    ("Quando é a Black Friday 2026?", "A Black Friday oficial de 2026 é na sexta-feira, 27 de novembro. A Shopee e o Mercado Livre já vinham soltando ofertas e cupons durante o mês."),
    ("Como vocês sabem que o desconto é de verdade?", "Anotamos o preço de cada peça no dia 26/11 e, de hora em hora, comparamos com o preço atual. Só entra no selo \"baixou de preço\" a peça que ficou mais barata do que estava antes da Black. Nada de metade do dobro."),
    ("Por que não aparece o preço?", "Porque na Black o preço muda várias vezes no mesmo dia. Toque no botão pra ver o valor atualizado direto na loja."),
    ("Comprar pelo link da Afiliada Miyu fica mais caro?", "Não. O preço é o mesmo da loja. A Afiliada Miyu pode ganhar uma pequena comissão, sem custo extra pra você."),
]

e = lambda s: html.escape(str(s), quote=True)


def card(it, i):
    ml = it["loja"] == "Mercado Livre"
    selo = ""
    if it.get("queda"):
        selo = f'<span class="queda">baixou {int(it["queda"])}% desde ontem</span>'
    novo = '<span class="novo">novo</span>' if it.get("novo") else ""
    return f'''
      <article class="card" style="--i:{i}">
        <div class="foto">{selo}{novo}<img src="{e(it["img"])}" alt="{e(it["nome"])} {e("no Mercado Livre" if ml else "na Shopee")}" width="600" height="600" loading="{"eager" if i < 4 else "lazy"}" referrerpolicy="no-referrer"></div>
        <div class="c">
          <span class="loja">{e(it["loja"])}</span>
          <h3>{e(it["nome"])}</h3>
          <p>{e(it.get("texto", ""))}</p>
          {'<p class="corre">Corre que tá no menor preço 🔥</p>' if it.get("queda") else ""}
          <a class="btn{" ml" if ml else ""}" href="{e(it["link"])}" rel="sponsored nofollow noopener" target="_blank">Ver {"no Mercado Livre" if ml else "na Shopee"}</a>
        </div>
      </article>'''


def main():
    d = json.loads((RAIZ / "dados/achados.json").read_text())
    at = datetime.datetime.fromisoformat(d["atualizado"])
    vivo = d.get("modo") == "ao-vivo"
    itens = d["itens"]
    cats = [c for c in ORDEM if any(x["categoria"] == c for x in itens)] + sorted({x["categoria"] for x in itens} - set(ORDEM))
    secoes, n = [], 0
    for c in cats:
        slug = c.lower().replace(" e ", "-").replace(" ", "-").replace("ç", "c").replace("õ", "o")
        cards = ""
        for it in [x for x in itens if x["categoria"] == c]:
            cards += card(it, n); n += 1
        secoes.append((slug, c, f'''
  <section id="{slug}">
    <h2 class="rev">{e(c)}</h2>
    <p class="sub rev">{e(SUB.get(c, ""))}</p>
    <div class="grade">{cards}
    </div>
  </section>'''))
    hora = at.strftime("%Hh%M").replace("h00", "h")
    status = (f'<span class="aovivo"><i></i>AO VIVO</span> Atualizado às {hora} de {at.strftime("%d/%m")} · próxima em <b id="cont">--</b>'
              if vivo else f'<span class="aovivo esq"><i></i>ESQUENTA</span> A partir de 00h a lista atualiza de hora em hora')
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "name": "Achadinhos Black Friday 2026: moda feminina com desconto de verdade", "url": URL, "inLanguage": "pt-BR", "dateModified": at.isoformat(), "author": {"@type": "Person", "name": "Afiliada Miyu", "url": "https://instagram.com/afiliadamiyu"}},
        {"@type": "ItemList", "name": "Achadinhos de moda feminina da Black Friday 2026", "itemListElement": [{"@type": "ListItem", "position": k + 1, "name": x["nome"], "url": x["link"]} for k, x in enumerate(itens)]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}]}
    nav = "".join(f'<a href="#{s}">{e(c)}</a>' for s, c, _ in secoes) + '<a href="#duvidas">Dúvidas</a>'
    faq = "".join(f'<details{" open" if k == 0 else ""}><summary>{e(q)}</summary><p>{e(a)}</p></details>' for k, (q, a) in enumerate(FAQ))
    proxima = (at.replace(minute=5, second=0) + datetime.timedelta(hours=1)).isoformat()
    tem_ia = False
    pagina = f'''<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Achadinhos Black Friday 2026: moda feminina com desconto de verdade | Afiliada Miyu</title>
<meta name="description" content="Vestidos, croppeds, bodies, conjuntos e calças da Shopee e do Mercado Livre que baixaram de preço de verdade na Black Friday 2026. Lista atualizada de hora em hora pela Afiliada Miyu.">
<link rel="canonical" href="{URL}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR">
<meta property="og:title" content="Achadinhos Black Friday 2026 | Afiliada Miyu">
<meta property="og:description" content="Moda feminina com desconto de verdade, atualizada de hora em hora.">
<meta property="og:url" content="{URL}"><meta property="og:image" content="{URL}img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#18392B">
<link rel="icon" href="img/corgi.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Fraunces:ital,wght@1,600&display=swap" rel="stylesheet">
<style>
:root{{--vm:#2E7D5B;--vn:#18392B;--pi:#DDEFC9;--ro:#FF5A87;--br:#fff;--cz:#5E7468}}
*{{box-sizing:border-box;margin:0;padding:0}}
html{{scroll-behavior:smooth}}
body{{font-family:"Bricolage Grotesque",system-ui,sans-serif;background:var(--pi);color:var(--vn);line-height:1.5;overflow-x:hidden}}
a{{color:inherit}}
.wrap{{max-width:1120px;margin:0 auto;padding:0 20px}}
.faixa{{background:var(--ro);color:var(--br);font-weight:800;text-transform:uppercase;letter-spacing:.02em;white-space:nowrap;overflow:hidden;font-size:15px;padding:9px 0}}
.faixa div{{display:inline-block;animation:corre 28s linear infinite}}
.faixa span{{margin:0 22px}}
@keyframes corre{{to{{transform:translateX(-50%)}}}}
header{{background:var(--vn);color:var(--br);padding:22px 0 60px;position:relative;overflow:hidden}}
header:after{{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(221,239,201,.16),transparent 65%);animation:pulsa 6s ease-in-out infinite}}
@keyframes pulsa{{50%{{transform:scale(1.25)}}}}
.selo{{display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.08);border-radius:999px;padding:6px 16px 6px 6px;font-weight:700;text-decoration:none}}
.selo img{{width:36px;height:36px;border-radius:50%;background:var(--pi);padding:4px;animation:balanca 3s ease-in-out infinite}}
@keyframes balanca{{0%,100%{{transform:rotate(0)}}50%{{transform:rotate(-10deg)}}}}
h1{{font-weight:800;text-transform:uppercase;letter-spacing:-.035em;line-height:.92;font-size:clamp(46px,9vw,108px);color:var(--pi);margin:34px 0 14px;text-shadow:5px 6px 0 var(--vm)}}
h1 .l{{display:block;opacity:0;transform:translateY(40px);animation:sobe .7s cubic-bezier(.2,.8,.2,1) forwards}}
h1 .l:nth-child(2){{animation-delay:.12s}}h1 .l:nth-child(3){{animation-delay:.24s}}
@keyframes sobe{{to{{opacity:1;transform:none}}}}
h1 em{{font-family:Fraunces,serif;font-style:italic;font-weight:600;text-transform:none;letter-spacing:0;color:var(--br);text-shadow:none}}
.lead{{font-size:clamp(18px,2.4vw,22px);max-width:660px;opacity:.92}}
.status{{margin-top:20px;display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-weight:700;font-size:16px}}
.aovivo{{display:inline-flex;align-items:center;gap:8px;background:var(--ro);border-radius:999px;padding:6px 14px;font-weight:800;letter-spacing:.04em}}
.aovivo.esq{{background:var(--vm)}}
.aovivo i{{width:10px;height:10px;border-radius:50%;background:var(--br);animation:pisca 1.2s infinite}}
@keyframes pisca{{50%{{opacity:.2;transform:scale(.6)}}}}
nav{{position:sticky;top:0;z-index:5;background:var(--br);border-bottom:2px solid var(--vn)}}
nav .wrap{{display:flex;gap:8px;overflow-x:auto;padding-top:12px;padding-bottom:12px;scrollbar-width:none}}
nav a{{white-space:nowrap;text-decoration:none;font-weight:700;font-size:15px;border:2px solid var(--vn);border-radius:999px;padding:6px 14px;transition:.2s}}
nav a:hover{{background:var(--vn);color:var(--pi)}}
section{{padding:48px 0 8px}}
h2{{font-weight:800;text-transform:uppercase;letter-spacing:-.035em;line-height:.95;font-size:clamp(32px,5vw,54px);margin-bottom:6px}}
.sub{{color:var(--cz);margin-bottom:24px;max-width:640px}}
.grade{{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:22px}}
.card{{background:var(--br);border-radius:22px;overflow:hidden;box-shadow:6px 7px 0 var(--vn);display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s}}
.card:hover{{transform:translate(-3px,-4px) rotate(-.6deg);box-shadow:10px 12px 0 var(--vn)}}
.rev,.card{{opacity:0;transform:translateY(28px)}}
.vis{{opacity:1!important;transform:none!important;transition:opacity .6s,transform .6s cubic-bezier(.2,.8,.2,1);transition-delay:calc(var(--d,0)*70ms)}}
.foto{{position:relative;aspect-ratio:1;background:#f3f6f1;overflow:hidden}}
.foto img{{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s}}
.card:hover .foto img{{transform:scale(1.06)}}
.queda{{position:absolute;left:10px;top:10px;z-index:2;background:var(--ro);color:var(--br);font-weight:800;font-size:14px;border-radius:999px;padding:5px 12px;animation:pula 1.6s ease-in-out infinite;box-shadow:2px 3px 0 var(--vn)}}
@keyframes pula{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-4px)}}}}
.novo{{position:absolute;right:10px;top:10px;z-index:2;background:var(--pi);color:var(--vn);font-weight:800;font-size:13px;border-radius:999px;padding:4px 11px;text-transform:uppercase}}
.c{{padding:16px 18px 20px;display:flex;flex-direction:column;gap:8px;flex:1}}
.loja{{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--vm)}}
.card h3{{font-size:20px;line-height:1.15;font-weight:800}}
.card p{{font-size:16px;color:#33493f}}
.c p:not(.corre){{flex:1}}
.corre{{font-weight:800;color:var(--ro)!important}}
.btn{{display:block;text-align:center;text-decoration:none;font-weight:800;background:var(--vn);color:var(--pi);border-radius:999px;padding:12px;margin-top:6px;transition:.2s}}
.btn:hover{{background:var(--vm);color:var(--br);transform:scale(1.03)}}
.btn.ml{{background:var(--ro);color:var(--br)}}
.dica{{background:var(--vn);color:var(--br);border-radius:22px;padding:24px;margin-top:40px}}
.dica b{{color:var(--pi)}}
.faq details{{background:var(--br);border-radius:16px;padding:16px 20px;margin-bottom:12px;border:2px solid var(--vn)}}
.faq summary{{font-weight:800;cursor:pointer;font-size:18px}}
.faq p{{margin-top:10px}}
footer{{margin-top:56px;background:var(--vn);color:var(--br);padding:36px 0;font-size:15px}}
footer p{{margin-bottom:8px;opacity:.9}}
footer a{{color:var(--pi);font-weight:700}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important;transition:none!important}}.rev,.card,h1 .l{{opacity:1!important;transform:none!important}}}}
</style>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body>
<div class="faixa" aria-hidden="true"><div>{"".join("<span>Black Friday 2026</span><span>★</span><span>Desconto de verdade</span><span>★</span><span>Atualiza de hora em hora</span><span>★</span><span>Nada de metade do dobro</span><span>★</span>" for _ in range(4))}</div></div>
<header>
  <div class="wrap">
    <a class="selo" href="https://instagram.com/afiliadamiyu" rel="me"><img src="img/corgi.png" alt="Corgi Miyu, mascote da Afiliada Miyu">@afiliadamiyu</a>
    <h1><span class="l">Black Friday</span><span class="l">dos achadinhos</span><span class="l"><em>com desconto de verdade</em></span></h1>
    <p class="lead">Anotei o preço das peças antes da Black e fico comparando de hora em hora. Aqui só entra moda feminina da Shopee e do Mercado Livre que baixou de verdade. Toca no botão e vê o preço do momento direto na loja.</p>
    <p class="status">{status}</p>
  </div>
</header>
<nav aria-label="Categorias"><div class="wrap">{nav}</div></nav>
<main class="wrap">
{"".join(s for _, _, s in secoes)}
  <div class="dica rev"><b>Dica da Miyu:</b> na Black o preço muda toda hora. Coloca no carrinho, resgata os cupons e só então finaliza. E confere sempre a tabela de medidas da loja.</div>
  <section id="duvidas" class="faq">
    <h2 class="rev">Dúvidas da Black</h2>
    {faq}
  </section>
</main>
<footer>
  <div class="wrap">
    <p><b>Afiliada Miyu</b>: moda feminina da Shopee e do Mercado Livre. Achei, comparei, indico.</p>
    <p>Os links desta página são links de afiliada: posso ganhar comissão pelas compras, sem custo extra pra você. Preço, cupom e estoque são definidos pelas lojas e podem mudar a qualquer momento.</p>
    <p>"Baixou X% desde ontem" compara o preço visto no painel da loja em 26/11/2026 com o preço visto na última atualização desta página.</p>
    <p>Segue no Instagram: <a href="https://instagram.com/afiliadamiyu">@afiliadamiyu</a></p>
  </div>
</footer>
<script>
document.querySelectorAll('.grade').forEach(g=>g.querySelectorAll('.card').forEach((c,k)=>c.style.setProperty('--d',k%8)));
const io=new IntersectionObserver(es=>es.forEach(x=>{{if(x.isIntersecting){{x.target.classList.add('vis');io.unobserve(x.target)}}}}),{{threshold:.12}});
document.querySelectorAll('.rev,.card').forEach(el=>io.observe(el));
const alvo=new Date("{proxima}"),cont=document.getElementById('cont');
if(cont)setInterval(()=>{{let s=Math.max(0,Math.round((alvo-new Date())/1000));cont.textContent=s?String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'):'já já';}},1000);
setTimeout(()=>location.reload(),15*60*1000);
</script>
</body>
</html>
'''
    (RAIZ / "black-friday/index.html").write_text(pagina)
    sm = f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{URL}</loc><lastmod>{at.isoformat()}</lastmod><changefreq>hourly</changefreq></url></urlset>\n'
    (RAIZ / "sitemap.xml").write_text(sm)
    print(f"ok: {len(itens)} itens, {len(cats)} categorias, modo {d.get('modo')}")


if __name__ == "__main__":
    main()
