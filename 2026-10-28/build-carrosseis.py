import sys, pathlib
from playwright.sync_api import sync_playwright

OUT = pathlib.Path('/home/claude/carrosseis/out')

# ---------- MiyuFlix ----------
M = dict(cream='#FFF4E6', orange='#F28C38', orangeDark='#D9661A', ink='#2B1B12', pink='#F7A8B8', white='#FFFFFF', red='#D64545')

CORGI = '''<svg viewBox="0 0 200 200" width="{s}" height="{s}">
<polygon points="40,90 55,22 90,70" fill="#F28C38"/><polygon points="50,80 58,40 80,70" fill="#F7A8B8"/>
<polygon points="160,90 145,22 110,70" fill="#F28C38"/><polygon points="150,80 142,40 120,70" fill="#F7A8B8"/>
<ellipse cx="100" cy="112" rx="70" ry="62" fill="#F28C38"/>
<path d="M100 70 C 85 100, 60 130, 70 160 Q 100 182 130 160 C 140 130, 115 100, 100 70 Z" fill="#fff"/>
<circle cx="75" cy="108" r="8" fill="#2B1B12"/><path d="M116 106 Q 125 98 134 106" stroke="#2B1B12" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="62" cy="128" rx="9" ry="6" fill="#F7A8B8" opacity=".8"/><ellipse cx="138" cy="128" rx="9" ry="6" fill="#F7A8B8" opacity=".8"/>
<ellipse cx="100" cy="132" rx="9" ry="7" fill="#2B1B12"/><path d="M92 144 Q 100 152 108 144" stroke="#2B1B12" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>'''

BASE = '''<html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;font-family:Inter,sans-serif;overflow:hidden;position:relative}
.h{font-weight:900;letter-spacing:-3px;line-height:1.04}
.pill{display:inline-block;font-weight:800;font-size:34px;letter-spacing:1px;padding:14px 30px;border-radius:999px}
.card{background:#fff;border-radius:32px;box-shadow:0 12px 36px rgba(43,27,18,.08);padding:30px 36px;display:flex;gap:30px;align-items:flex-start}
.num{flex:none;width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:38px;color:#fff}
.ct{font-weight:800;font-size:44px;letter-spacing:-1px;line-height:1.15}
.cs{font-weight:500;font-size:32px;opacity:.68;margin-top:8px;line-height:1.3}
.top{position:absolute;top:70px;left:78px;right:78px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:34px}
.wrap{position:absolute;left:78px;right:78px}
.src{position:absolute;bottom:60px;left:78px;right:78px;font-weight:600;font-size:24px;opacity:.55}
</style></head><body style="background:{bg};color:{fg}">{body}</body></html>'''

def m_top(i, n, fg='#2B1B12'):
    return f'<div class="top" style="color:{fg}"><div style="display:flex;align-items:center;gap:16px">{CORGI.format(s=56)}@miyuflix</div><div style="opacity:.7">{i}/{n}</div></div>'

def m_avatar(fg):
    return f'<div style="position:absolute;left:78px;bottom:90px;display:flex;align-items:center;gap:20px;font-weight:800;font-size:38px;color:{fg}"><div style="width:96px;height:96px;border-radius:50%;background:#FFF4E6;display:flex;align-items:center;justify-content:center">{CORGI.format(s=80)}</div>@miyuflix</div>'

def m_card(n, t, s=None, c='#F28C38'):
    sub = f'<div class="cs">{s}</div>' if s else ''
    return f'<div class="card"><div class="num" style="background:{c}">{n}</div><div><div class="ct">{t}</div>{sub}</div></div>'

def m_cta(i, n, title, btn, sub):
    return f'''<div style="position:absolute;top:70px;right:78px;font-weight:800;font-size:34px;opacity:.7">{i}/{n}</div>
<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center;padding:0 90px">
<div style="width:330px;height:330px;border-radius:50%;background:#FFF4E6;display:flex;align-items:center;justify-content:center">{CORGI.format(s=250)}</div>
<div class="h" style="font-size:84px">{title}</div>
<div class="pill" style="background:#2B1B12;color:#fff;font-size:44px;padding:22px 50px">{btn}</div>
<div style="font-weight:700;font-size:36px">{sub}</div>
<div style="font-weight:800;font-size:32px;opacity:.75">@miyuflix</div></div>'''

# ---------- afiliadamiyu ----------
A = dict(paper='#F4F1EA', ink='#161616', green='#1F6F5C', marker='#F2DC5D', line='#D9D3C4', red='#C2412D')
MONO = "'DejaVu Sans Mono',monospace"

def a_page(i, n, inner, bg='#F4F1EA', fg='#161616'):
    return BASE.replace('{bg}', bg).replace('{fg}', fg).replace('{body}', f'''
<div style="position:absolute;top:44px;right:56px;font-size:30px;opacity:.75">{i}/{n}</div>
{inner}
<div style="position:absolute;bottom:40px;left:0;right:0;text-align:center;font-size:30px;opacity:.75">@afiliadamiyu</div>''')

def mark(t, c='#F2DC5D'):
    return f'<span style="background:linear-gradient({c},{c}) 0 88%/100% 40% no-repeat;padding:0 8px">{t}</span>'

def a_label(t, c='#1F6F5C'):
    return f'<div style="font-family:{MONO};font-size:38px;letter-spacing:4px;font-weight:700;color:{c}">{t}</div>'

def page(bg, fg, body):
    return BASE.replace('{bg}', bg).replace('{fg}', fg).replace('{body}', body)

# =====================================================================
# 1) @miyuflix — Qual perfil é pra você? (refaz o Reels "A Miyu ganhou uma parceira")
def perfis():
    n = 5
    s = []
    s.append(page(M['pink'], M['ink'], f'''
<div class="top"><div class="pill" style="background:#2B1B12;color:#fff">PERFIL NOVO</div><div></div></div>
<div class="wrap" style="top:250px;display:flex;gap:24px">
 <div class="pill" style="background:#fff;color:#2B1B12;font-size:40px">@miyuflix</div>
 <div style="font-weight:900;font-size:56px;align-self:center">+</div>
 <div class="pill" style="background:#2B1B12;color:#fff;font-size:40px">@afiliadamiyu</div></div>
<div class="wrap h" style="top:640px;font-size:118px">A Miyu ganhou<br>uma parceira.<br><span style="color:#fff">Qual é a sua?</span></div>
{m_avatar(M['ink'])}'''))
    s.append(page(M['cream'], M['ink'], m_top(2, n) + f'''
<div class="wrap" style="top:190px"><div class="pill" style="background:#F28C38;color:#fff">@miyuflix</div>
<div class="h" style="font-size:84px;margin-top:34px">Aqui você aprende<br>o <span style="color:#D9661A">passo a passo</span></div></div>
<div class="wrap" style="top:600px;display:flex;flex-direction:column;gap:22px">
{m_card(1, 'Como a comissão funciona', 'base, extra e o que muda em cada data')}
{m_card(2, 'As datas que mais vendem', '11.11, Black, 12.12 e Natal')}
{m_card(3, 'Novidade da Shopee', 'contada de um jeito fácil, sem enrolação')}
</div>'''))
    s.append(page('#2B1B12', '#FFF4E6', m_top(3, n, '#FFF4E6') + f'''
<div class="wrap" style="top:190px"><div class="pill" style="background:#FFF4E6;color:#2B1B12">@afiliadamiyu</div>
<div class="h" style="font-size:84px;margin-top:34px">Lá você vê as<br><span style="color:#F28C38">ferramentas</span></div></div>
<div class="wrap" style="top:600px;display:flex;flex-direction:column;gap:22px;color:#2B1B12">
{m_card(1, 'Telas do app de afiliado', 'Insights, atalhos, compartilhar link')}
{m_card(2, 'IA pra criar vídeo', 'quais eu uso e como')}
{m_card(3, 'Pesquisa de produto', 'como ver se ele tá subindo antes de divulgar')}
</div>'''))
    s.append(page(M['cream'], M['ink'], m_top(4, n) + f'''
<div class="wrap" style="top:200px"><div class="h" style="font-size:92px">Funciona<br>melhor <span style="color:#D9661A">junto</span></div></div>
<div class="wrap" style="top:560px;display:flex;gap:26px">
 <div class="card" style="flex:1;flex-direction:column;gap:18px;min-height:470px">
  <div class="pill" style="background:#F28C38;color:#fff;font-size:30px">@miyuflix</div>
  <div class="ct" style="font-size:52px">Aprende<br>o que fazer</div>
  <div class="cs">a dica, a regra, a data</div></div>
 <div class="card" style="flex:1;flex-direction:column;gap:18px;min-height:470px;background:#2B1B12;color:#FFF4E6">
  <div class="pill" style="background:#FFF4E6;color:#2B1B12;font-size:30px">@afiliadamiyu</div>
  <div class="ct" style="font-size:52px">Vê com<br>o que fazer</div>
  <div class="cs">o app, a tela, a ferramenta</div></div>
</div>'''))
    s.append(page(M['orange'], M['ink'], m_cta(5, n, 'Já segue as duas?', 'Marca sua amiga afiliada', 'e manda pra quem tá começando')))
    return s

# 2) @miyuflix — 11.11 em números (refaz o Reels R$ 3 bi)
def onze():
    n = 5
    src = '<div class="src">Previsão Confi / E-Commerce Brasil, out/2026</div>'
    s = []
    s.append(page('#2B1B12', '#FFF4E6', f'''
<div class="top"><div class="pill" style="background:#F28C38;color:#2B1B12">11.11 EM NÚMEROS</div><div></div></div>
<div class="wrap h" style="top:470px;font-size:120px">Semana que<br>vem é <span style="color:#F28C38">11.11.</span><br>Seu link<br>tá pronto?</div>
{m_avatar('#FFF4E6')}'''))
    s.append(page(M['cream'], M['ink'], m_top(2, n) + f'''
<div class="wrap" style="top:300px;text-align:center">
 <div style="font-weight:800;font-size:46px">A previsão pro 11/11 é de</div>
 <div class="h" style="font-size:200px;color:#D9661A;letter-spacing:-8px;margin:20px 0;white-space:nowrap">R$ 3,17 bi</div>
 <div style="font-weight:800;font-size:46px">em vendas, em <span style="background:#2B1B12;color:#fff;padding:2px 18px;border-radius:14px">UM</span> dia</div>
 <div class="card" style="margin-top:80px;justify-content:center;font-weight:700;font-size:38px">O 2º maior dia de vendas do ano</div>
</div>''' + src))
    s.append(page(M['pink'], M['ink'], m_top(3, n) + f'''
<div class="wrap" style="top:200px"><div class="h" style="font-size:84px">E na Black, quem<br>mais cresce é:</div></div>
<div class="wrap" style="top:560px;display:flex;flex-direction:column;gap:30px">
 <div class="card" style="align-items:center;justify-content:space-between"><div class="ct" style="font-size:54px">Beleza e perfumaria</div><div class="h" style="font-size:96px;color:#D9661A">+70%</div></div>
 <div class="card" style="align-items:center;justify-content:space-between"><div class="ct" style="font-size:54px">Moda e acessórios</div><div class="h" style="font-size:96px;color:#D9661A">+44%</div></div>
</div>''' + src))
    s.append(page(M['cream'], M['ink'], m_top(4, n) + f'''
<div class="wrap" style="top:200px"><div class="pill" style="background:#2B1B12;color:#fff">FAZ ISSO ESSA SEMANA</div>
<div class="h" style="font-size:84px;margin-top:30px">Dá tempo, mas<br>é <span style="color:#D9661A">agora</span></div></div>
<div class="wrap" style="top:600px;display:flex;flex-direction:column;gap:22px">
{m_card(1, 'Escolhe moda ou beleza', 'as que mais crescem nessa época')}
{m_card(2, 'Salva os produtos', 'nos favoritos, com calma, antes do dia')}
{m_card(3, 'Grava antes do dia 11', 'no dia é só postar')}
</div>'''))
    s.append(page(M['orange'], M['ink'], m_cta(5, n, 'Moda ou beleza?', 'Comenta aqui o seu', 'e salva pra não esquecer')))
    return s

# 3) @afiliadamiyu — Dia 1: sua comissão caiu? (refaz o Reels mínimo R$ 10)
def dia1():
    n = 5
    s = []
    s.append(a_page(1, n, f'''
<div style="position:absolute;top:260px;left:90px;right:90px">
 <div style="width:330px;background:#fff;border-radius:28px;box-shadow:0 18px 50px rgba(0,0,0,.08);overflow:hidden;text-align:center;transform:rotate(-3deg)">
  <div style="background:#C2412D;color:#fff;font-weight:800;font-size:40px;padding:18px">NOVEMBRO</div>
  <div style="font-weight:900;font-size:200px;line-height:1.1;padding:10px 0 20px">1</div></div>
 <div class="h" style="font-size:104px;margin-top:90px">Hoje é dia 1.<br>Sua {mark('comissão')}<br>caiu?</div>
 <div style="font-size:42px;opacity:.7;margin-top:30px">Arrasta que eu te mostro onde ver</div>
</div>'''))
    s.append(a_page(2, n, f'''
<div style="position:absolute;top:240px;left:90px;right:90px;text-align:center">
 {a_label('O MÍNIMO PRA SACAR')}
 <div style="display:flex;justify-content:center;align-items:center;gap:40px;margin-top:80px">
  <div><div style="font-size:34px;opacity:.6">antes</div><div class="h" style="font-size:120px;white-space:nowrap;opacity:.35;text-decoration:line-through;text-decoration-thickness:10px;text-decoration-color:#C2412D">R$ 30</div></div>
  <div style="font-size:90px;font-weight:900">→</div>
  <div><div style="font-size:34px;opacity:.6">agora</div><div class="h" style="font-size:160px;white-space:nowrap;color:#1F6F5C">R$ 10</div></div>
 </div>
 <div style="font-size:42px;line-height:1.35;margin-top:90px">Vale pras comissões geradas<br>a partir de {mark('setembro')}, pagas em outubro</div>
</div>'''))
    chip = lambda t, dark=False: f'<div style="background:{"#161616" if dark else "#fff"};color:{"#fff" if dark else "#161616"};border-radius:22px;box-shadow:0 10px 30px rgba(0,0,0,.07);padding:30px 40px;font-weight:800;font-size:52px">{t}</div>'
    s.append(a_page(3, n, f'''
<div style="position:absolute;top:240px;left:90px;right:90px">
 {a_label('ONDE CONFERIR')}
 <div class="h" style="font-size:92px;margin-top:30px">Abre o app<br>e vai em {mark('Renda')}</div>
 <div style="display:flex;flex-direction:column;align-items:flex-start;gap:26px;margin-top:90px">
  {chip('App de afiliado')}
  <div style="font-size:60px;font-weight:900;padding-left:40px">↓</div>
  {chip('Renda', True)}
 </div>
</div>'''))
    ck = lambda t: f'<div style="display:flex;gap:30px;align-items:flex-start;font-size:46px;line-height:1.3"><div style="flex:none;width:64px;height:64px;border-radius:14px;background:#1F6F5C;display:flex;align-items:center;justify-content:center"><svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div>{t}</div></div>'
    s.append(a_page(4, n, f'''
<div style="position:absolute;top:220px;left:90px;right:90px">
 {a_label('QUANDO O PAGAMENTO SAI')}
 <div class="h" style="font-size:88px;margin-top:30px">É gerado todo<br>{mark('dia 1')}, se:</div>
 <div style="display:flex;flex-direction:column;gap:44px;margin-top:80px">
  {ck('Sua comissão pendente chegou a <b>R$ 10</b>')}
  {ck('Você teve venda <b>validada e completada</b> no mês anterior')}
 </div>
 <div style="font-size:30px;opacity:.6;margin-top:90px">Fonte: Central de Ajuda da Shopee</div>
</div>'''))
    s.append(a_page(5, n, f'''
<div style="position:absolute;top:0;bottom:0;left:90px;right:90px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:50px">
 <div class="h" style="font-size:96px">Tem amiga com<br>{mark('comissão parada')}?</div>
 <div style="font-size:44px;opacity:.75">Hoje é o dia dela conferir</div>
 <div style="background:#161616;color:#fff;border-radius:999px;padding:26px 56px;font-size:44px;font-weight:700">manda esse post pra ela</div>
</div>'''))
    return s

# 4) @afiliadamiyu — 4 semanas pra Black (refaz o Reels 6 semanas)
def black4():
    n = 6
    s = []
    s.append(a_page(1, n, f'''
<div style="position:absolute;top:200px;left:90px;right:90px">
 {a_label('BLACK FRIDAY · 27/11', '#C2412D')}
 <div class="h" style="font-size:118px;margin-top:40px">Faltam<br>{mark('4 semanas')}<br>pra Black</div>
 <div style="font-size:46px;opacity:.75;margin-top:44px;line-height:1.35">Uma tarefa e uma ferramenta<br>por semana. Arrasta ➜</div>
 <div style="display:flex;gap:18px;margin-top:80px">{''.join(f'<div style="flex:1;height:26px;border-radius:13px;background:{c}"></div>' for c in ['#1F6F5C','#D9D3C4','#D9D3C4','#D9D3C4'])}</div>
</div>''', bg=A['paper']))
    weeks = [
        ('SEMANA 1', '30/10 a 05/11', 'Escolhe 1 nicho e salva os produtos', 'Google Trends', 'confere se o produto tá subindo antes de salvar', 'Meus favoritos', 'atalho na tela inicial do afiliado'),
        ('SEMANA 2', '06/11 a 12/11', 'Usa o 11.11 como teste', 'Insights', 'no dia 12, vê o que teve clique e venda', 'Shopee Video x Mídia Sociais', 'compara onde seu conteúdo vende mais'),
        ('SEMANA 3', '13/11 a 19/11', 'Grava os vídeos do que vendeu', 'Baixar todas as imagens', 'até 15 fotos do anúncio de uma vez', 'IA pra vídeo', 'quando não tiver o produto em casa'),
        ('SEMANA 4', '20/11 a 27/11', 'Posta todo dia até a Black', 'Compartilhe para Ganhar Comissão', 'todos os jeitos de mandar o link numa tela', 'Copiar Link', 'pro grupo de WhatsApp e pra bio'),
    ]
    for k, (lab, dt, task, t1, d1, t2, d2) in enumerate(weeks):
        bars = ''.join(f'<div style="flex:1;height:26px;border-radius:13px;background:{"#1F6F5C" if j <= k else "#D9D3C4"}"></div>' for j in range(4))
        tool = lambda t, d: f'<div style="background:#fff;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.06);padding:30px 36px"><div style="font-family:{MONO};font-size:28px;letter-spacing:3px;color:#1F6F5C;font-weight:700">FERRAMENTA</div><div style="font-weight:800;font-size:50px;margin-top:10px">{t}</div><div style="font-size:36px;opacity:.65;margin-top:6px">{d}</div></div>'
        s.append(a_page(k + 2, n, f'''
<div style="position:absolute;top:190px;left:90px;right:90px">
 <div style="display:flex;gap:18px">{bars}</div>
 <div style="display:flex;justify-content:space-between;margin-top:60px">{a_label(lab)}<div style="font-family:{MONO};font-size:36px;opacity:.6">{dt}</div></div>
 <div class="h" style="font-size:96px;margin-top:36px">{task}</div>
 <div style="display:flex;flex-direction:column;gap:30px;margin-top:90px">{tool(t1, d1)}{tool(t2, d2)}</div>
</div>'''))
    s.append(a_page(6, n, f'''
<div style="position:absolute;top:0;bottom:0;left:90px;right:90px;display:flex;flex-direction:column;justify-content:center;gap:40px">
 <div class="h" style="font-size:96px">Quem se organiza<br>{mark('só posta')}</div>
 <div style="font-size:44px;opacity:.75;line-height:1.35">Salva esse plano e marca a<br>amiga que vai fazer junto</div>
 <div style="display:flex;gap:20px;font-family:{MONO};font-size:40px;font-weight:700">
  <div style="background:#161616;color:#fff;border-radius:16px;padding:16px 26px">11/11 · 11.11</div>
  <div style="background:#C2412D;color:#fff;border-radius:16px;padding:16px 26px">27/11 · Black</div></div>
</div>'''))
    return s

SETS = {'miyuflix-perfis': perfis, 'miyuflix-1111-numeros': onze, 'afiliadamiyu-dia-1': dia1, 'afiliadamiyu-black-4-semanas': black4}

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1080, 'height': 1350})
    for name, fn in SETS.items():
        d = OUT / name
        d.mkdir(parents=True, exist_ok=True)
        for i, html in enumerate(fn(), 1):
            pg.set_content(html)
            pg.wait_for_timeout(150)
            pg.screenshot(path=str(d / f'{i:02d}.png'))
        print(name, 'ok')
    b.close()
