import pathlib
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).parent
src = (HERE.parent / '2026-10-28' / 'build-carrosseis.py').read_text()
# reaproveita cores, corgi e helpers do builder de 28/10 (tudo antes do primeiro bloco "# =====")
exec(src.split('# =====')[0])

# =====================================================================
# @miyuflix — Semana Pix + calendário de novembro (sem link)
def novembro():
    n = 6
    s = []
    s.append(page(M['orange'], M['ink'], f'''
<div class="top"><div class="pill" style="background:#2B1B12;color:#fff">COMEÇOU HOJE</div><div></div></div>
<div class="wrap h" style="top:330px;font-size:122px">A Semana Pix<br>começou <span style="color:#fff">hoje.</span><br>Você já sabe<br>o que é?</div>
<div class="wrap" style="top:1000px;font-weight:700;font-size:40px">E o resto de novembro todinho ➜</div>
{m_avatar(M['ink']).replace('bottom:90px', 'bottom:70px')}'''))
    s.append(page(M['cream'], M['ink'], m_top(2, n) + f'''
<div class="wrap" style="top:200px"><div class="pill" style="background:#F28C38;color:#fff">SEMANA PIX · 2 A 8/11</div>
<div class="h" style="font-size:96px;margin-top:40px">Pagou no Pix,<br>ganhou <span style="color:#D9661A">20% off</span></div>
<div style="font-weight:600;font-size:40px;opacity:.7;margin-top:24px">em categorias selecionadas</div></div>
<div class="wrap" style="top:760px;display:flex;flex-direction:column;gap:22px">
{m_card('💡', 'Fala isso no seu vídeo', '“paga no Pix que sai mais barato essa semana”')}
{m_card('⏰', 'Só até domingo, dia 8', 'depois vem o 11.11')}
</div>
<div class="src">Fonte: InfoMoney, 27/10/2026</div>'''))
    s.append(page('#2B1B12', '#FFF4E6', m_top(3, n, '#FFF4E6') + f'''
<div class="wrap" style="top:220px"><div class="pill" style="background:#F28C38;color:#2B1B12">11/11 · A MAIOR LIQUIDA</div>
<div class="h" style="font-size:104px;margin-top:40px">R$ 25 milhões<br>em <span style="color:#F28C38">cupons</span></div></div>
<div class="wrap" style="top:760px;display:flex;flex-direction:column;gap:22px;color:#2B1B12">
{m_card(1, 'Ofertas em mais de 30 categorias')}
{m_card(2, 'Live 11h–14h e 18h–21h', 'aproveita o movimento e posta antes')}
</div>
<div class="src" style="color:#FFF4E6">Fonte: Mundo do Marketing e InfoMoney, out/2026</div>'''))
    row = lambda d, t, sub, c='#fff', fg='#2B1B12': f'<div class="card" style="align-items:center;background:{c};color:{fg};padding:24px 34px"><div class="h" style="font-size:58px;width:190px;flex:none;letter-spacing:-2px">{d}</div><div><div class="ct" style="font-size:42px">{t}</div><div class="cs" style="font-size:28px">{sub}</div></div></div>'
    s.append(page(M['pink'], M['ink'], m_top(4, n) + f'''
<div class="wrap" style="top:180px"><div class="h" style="font-size:84px">Depois do 11.11<br>ainda tem isso:</div></div>
<div class="wrap" style="top:470px;display:flex;flex-direction:column;gap:20px">
{row('16/11', 'Dia de Grandes Marcas', 'nas Lojas Oficiais')}
{row('22/11', 'Esquenta Black Friday', 'aquece o público')}
{row('27/11', 'Black Friday', 'R$ 23 mi em cupons', '#2B1B12', '#FFF4E6')}
{row('30/11', 'Cyber Monday', 'cupons em eletrônicos')}
</div>
<div class="src">Fonte: InfoMoney, 27/10/2026</div>'''))
    bar = lambda t, p: f'<div><div style="display:flex;justify-content:space-between;font-weight:800;font-size:42px"><span>{t}</span><span style="color:#D9661A">{p}%</span></div><div style="height:30px;border-radius:15px;background:#fff;margin-top:12px"><div style="height:30px;border-radius:15px;background:#F28C38;width:{p*2}%"></div></div></div>'
    s.append(page(M['cream'], M['ink'], m_top(5, n) + f'''
<div class="wrap" style="top:190px"><div class="pill" style="background:#2B1B12;color:#fff">NÃO SABE O QUE DIVULGAR?</div>
<div class="h" style="font-size:80px;margin-top:34px">O que o povo<br>quer comprar:</div></div>
<div class="wrap" style="top:600px;display:flex;flex-direction:column;gap:34px">
{bar('Casa', 47)}{bar('Moda feminina', 41)}{bar('Eletrodomésticos', 32)}{bar('Beleza', 30)}
</div>
<div class="src">Pesquisa Shopee com 790 usuários · E-Commerce Brasil, 22/10/2026</div>'''))
    s.append(page(M['orange'], M['ink'], m_cta(6, n, 'Qual data você<br>vai focar?', 'Comenta aqui 👇', 'e salva pra não perder nenhuma')))
    return s

# @afiliadamiyu — produto da Shopee marcado no Reels (ferramenta)
def etiqueta():
    n = 6
    s = []
    s.append(a_page(1, n, f'''
<div style="position:absolute;top:230px;left:90px;right:90px">
 {a_label('FERRAMENTA · INSTAGRAM')}
 <div class="h" style="font-size:108px;margin-top:40px">Dá pra marcar<br>o {mark('produto da Shopee')}<br>no seu Reels</div>
 <div style="font-size:46px;opacity:.75;margin-top:44px;line-height:1.35">e ganhar comissão por isso.<br>Arrasta que eu te mostro ➜</div>
 <div style="margin-top:90px;display:inline-flex;align-items:center;gap:18px;background:#fff;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.08);padding:20px 34px;font-weight:700;font-size:38px">
  <svg width="44" height="44" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z" stroke="#161616" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M9 7a3 3 0 0 1 6 0" stroke="#161616" stroke-width="2" fill="none"/></svg>
  Elegível para comissão</div>
</div>'''))
    s.append(a_page(2, n, f'''
<div style="position:absolute;top:220px;left:90px;right:90px">
 {a_label('COMO FUNCIONA')}
 <div class="h" style="font-size:88px;margin-top:30px">É a {mark('Parceria de')}<br>{mark('Afiliados')} do Insta</div>
 <div style="display:flex;flex-direction:column;gap:30px;margin-top:80px;font-size:44px;line-height:1.3">
  {''.join(f'<div style="display:flex;gap:26px;align-items:flex-start"><div style="flex:none;width:62px;height:62px;border-radius:50%;background:#1F6F5C;color:#fff;font-weight:800;font-size:34px;display:flex;align-items:center;justify-content:center">{k}</div><div>{t}</div></div>' for k, t in enumerate(['Você marca o produto no Reels ou no Feed', 'Aparece o ícone de compras no post', 'A pessoa compra na Shopee', 'Você ganha comissão por compra <b>validada</b>'], 1))}
 </div>
 <div style="font-size:30px;opacity:.6;margin-top:70px">Dá pra marcar mais de um produto no mesmo post</div>
</div>'''))
    ck = lambda t: f'<div style="display:flex;gap:30px;align-items:center;font-size:46px;line-height:1.3"><div style="flex:none;width:64px;height:64px;border-radius:14px;background:#1F6F5C;display:flex;align-items:center;justify-content:center"><svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div>{t}</div></div>'
    s.append(a_page(3, n, f'''
<div style="position:absolute;top:220px;left:90px;right:90px">
 {a_label('ANTES DE TUDO', '#C2412D')}
 <div class="h" style="font-size:92px;margin-top:30px">Confere se<br>você {mark('pode usar')}</div>
 <div style="display:flex;flex-direction:column;gap:38px;margin-top:80px">
  {ck('Ter <b>18 anos</b> ou mais')}
  {ck('Conta <b>profissional</b> e <b>pública</b>')}
  {ck('Pelo menos <b>1.000 seguidores</b>')}
  {ck('Cadastro no <b>afiliados Shopee</b>')}
  {ck('Sem histórico de <b>violação</b>')}
 </div>
</div>'''))
    step = lambda t, dark=False: f'<div style="background:{"#161616" if dark else "#fff"};color:{"#fff" if dark else "#161616"};border-radius:22px;box-shadow:0 10px 30px rgba(0,0,0,.07);padding:24px 36px;font-weight:800;font-size:44px">{t}</div>'
    arrow = '<div style="font-size:44px;font-weight:900;padding-left:40px;line-height:1">↓</div>'
    s.append(a_page(4, n, f'''
<div style="position:absolute;top:180px;left:90px;right:90px">
 {a_label('PASSO 1 · VINCULAR')}
 <div class="h" style="font-size:80px;margin-top:26px">No Instagram, vai em:</div>
 <div style="display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin-top:56px">
  {step('Painel profissional')}{arrow}{step('Monetização')}{arrow}{step('Parceria de Afiliados')}{arrow}{step('Afiliados Shopee → Continuar')}{arrow}{step('Login no app da Shopee', True)}
 </div>
</div>'''))
    s.append(a_page(5, n, f'''
<div style="position:absolute;top:180px;left:90px;right:90px">
 {a_label('PASSO 2 · MARCAR NO REELS')}
 <div class="h" style="font-size:80px;margin-top:26px">Na hora de postar:</div>
 <div style="display:flex;flex-direction:column;align-items:flex-start;gap:14px;margin-top:56px">
  {step('Adicionar produtos')}{arrow}{step('Afiliados da Shopee')}{arrow}{step('Busca o nome ou cola o link')}{arrow}{step('Vê a comissão estimada')}{arrow}{step('Concluir → Compartilhar', True)}
 </div>
</div>'''))
    s.append(a_page(6, n, f'''
<div style="position:absolute;top:0;bottom:0;left:90px;right:90px;display:flex;flex-direction:column;justify-content:center;gap:40px">
 <div class="h" style="font-size:96px">Teu Reels do<br>11.11 já sai com<br>{mark('produto marcado')}</div>
 <div style="font-size:44px;opacity:.75;line-height:1.35">Salva esse passo a passo e<br>manda pra amiga afiliada</div>
 <div style="font-size:30px;opacity:.6">Fonte: Central de Ajuda da Shopee</div>
</div>'''))
    return s

SETS = {'miyuflix-semana-pix-novembro': novembro, 'afiliadamiyu-produto-marcado-reels': etiqueta}

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1350})
    for name, fn in SETS.items():
        d = HERE / name
        d.mkdir(parents=True, exist_ok=True)
        for i, html in enumerate(fn(), 1):
            pg.set_content(html)
            pg.wait_for_timeout(150)
            pg.screenshot(path=str(d / f'{i:02d}.png'))
        print(name, 'ok')
    b.close()
