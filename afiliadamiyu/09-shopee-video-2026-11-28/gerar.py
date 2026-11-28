import sys, os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

S = os.path.dirname(os.path.abspath(__file__))
FOTOS = sys.argv[1] if len(sys.argv) > 1 else os.path.join(S, 'fotos')
OUT = os.path.join(S, 'out'); os.makedirs(OUT, exist_ok=True)
NOITE = (0x18, 0x39, 0x2B); MIYU = (0x2E, 0x7D, 0x5B); PIST = (0xDD, 0xEF, 0xC9)
ROSA = (0xFF, 0x5A, 0x87); BRANCO = (255, 255, 255)
random.seed(28)

def font(size, w='ExtraBold'):
    f = ImageFont.truetype(os.path.join(S, 'brico.ttf'), size)
    f.set_variation_by_name(w)
    return f

EMOJI = ImageFont.truetype('/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf', 109)

def fundo(w, h, cor, pont=None):
    im = Image.new('RGB', (w, h), cor)
    d = ImageDraw.Draw(im)
    pc = pont or tuple(min(255, c + 18) for c in cor)
    for y in range(18, h, 36):
        for x in range(18 + (y // 36 % 2) * 18, w, 36):
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=pc)
    return im

def marca_texto(im, box, cor, ang=-2):
    x0, y0, x1, y1 = box
    lay = Image.new('RGBA', (x1 - x0 + 40, y1 - y0 + 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    pts = [(20 + random.randint(-4, 4), 20 + random.randint(-3, 3)),
           (lay.width - 20 + random.randint(-4, 4), 24 + random.randint(-3, 3)),
           (lay.width - 22 + random.randint(-4, 4), lay.height - 20 + random.randint(-3, 3)),
           (18 + random.randint(-4, 4), lay.height - 24 + random.randint(-3, 3))]
    d.polygon(pts, fill=cor + (255,))
    lay = lay.rotate(ang, expand=True, resample=Image.BICUBIC)
    im.paste(lay, (x0 - 20 - (lay.width - (x1 - x0 + 40)) // 2, y0 - 20 - (lay.height - (y1 - y0 + 40)) // 2), lay)

def texto_c(d, cx, y, txt, f, cor):
    w = d.textlength(txt, font=f)
    d.text((cx - w / 2, y), txt, font=f, fill=cor)
    return w

def linha_mao(d, pts, cor, larg=8):
    # traço levemente tremido
    q = []
    for i in range(len(pts) - 1):
        (a, b), (c, e) = pts[i], pts[i + 1]
        for t in range(0, 11):
            q.append((a + (c - a) * t / 10 + random.uniform(-1.5, 1.5), b + (e - b) * t / 10 + random.uniform(-1.5, 1.5)))
    d.line(q, fill=cor, width=larg, joint='curve')

def sublinhado(d, x0, x1, y, cor):
    pts = [(x0 + i * (x1 - x0) / 8, y + math.sin(i * 1.3) * 5) for i in range(9)]
    linha_mao(d, pts, cor, 9)

def seta(d, x0, y0, x1, y1, cor):
    mx, my = (x0 + x1) / 2 + 40, (y0 + y1) / 2 - 30
    pts = [(x0 + (1 - t) ** 2 * 0 + 0, 0) for t in []]
    curva = []
    for i in range(13):
        t = i / 12
        curva.append(((1 - t) ** 2 * x0 + 2 * (1 - t) * t * mx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * my + t * t * y1))
    linha_mao(d, curva, cor, 9)
    ang = math.atan2(y1 - curva[-3][1], x1 - curva[-3][0])
    for da in (2.5, -2.5):
        linha_mao(d, [(x1, y1), (x1 - 44 * math.cos(ang + da / 6), y1 - 44 * math.sin(ang + da / 6))], cor, 9)

def adesivo(img, borda=14):
    a = img.split()[-1]
    m = a.filter(ImageFilter.MaxFilter(borda * 2 + 1))
    base = Image.new('RGBA', img.size, BRANCO + (0,))
    base.putalpha(m)
    base.alpha_composite(img)
    return base

CORGI = Image.open(os.path.join(S, 'corgi.png')).convert('RGBA')
def corgi(tam, ang=8):
    c = CORGI.copy(); c.thumbnail((tam, tam))
    pad = Image.new('RGBA', (c.width + 40, c.height + 40), (0, 0, 0, 0)); pad.paste(c, (20, 20), c)
    return adesivo(pad, 12).rotate(ang, expand=True, resample=Image.BICUBIC)

def foto(nome, w, h):
    p = None
    for ext in ('.jpg', '.jpeg', '.png', '.webp'):
        if os.path.exists(os.path.join(FOTOS, nome + ext)): p = os.path.join(FOTOS, nome + ext)
    if p:
        im = Image.open(p).convert('RGB')
        return ImageOps.fit(im, (w, h), centering=(0.5, 0.35))
    im = Image.new('RGB', (w, h), (200, 200, 200)); d = ImageDraw.Draw(im)
    texto_c(d, w / 2, h / 2 - 40, 'FOTO ' + nome.upper(), font(60), (120, 120, 120)); return im

def polaroid(im, ang):
    w, h = im.size
    p = Image.new('RGBA', (w + 36, h + 36), BRANCO + (255,)); p.paste(im, (18, 18))
    sh = Image.new('RGBA', (p.width + 30, p.height + 30), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle([22, 26, p.width + 18, p.height + 22], fill=(0, 0, 0, 70))
    sh = sh.filter(ImageFilter.GaussianBlur(8)); sh.alpha_composite(p, (8, 8))
    return sh.rotate(ang, expand=True, resample=Image.BICUBIC)

def emoji(im, xy, ch, tam):
    e = Image.new('RGBA', (140, 140), (0, 0, 0, 0))
    ImageDraw.Draw(e).text((0, 0), ch, font=EMOJI, embedded_color=True)
    e = e.crop(e.getbbox()).resize((tam, tam), Image.LANCZOS)
    im.paste(e, xy, e)

# ------------------ CARROSSEL ------------------
PAL = 'ELEGANTE'
PECAS = [
    ('pantalona', 'CALÇA PANTALONA', 'DE ALFAIATARIA', 'Cintura alta e caimento social.', 'Vai do trabalho pro passeio.'),
    ('saia', 'SAIA TRÊS MARIAS', 'MIDI FORRADA', 'Três babados e forro por dentro.', 'Serve do culto ao passeio.'),
    ('conjunto', 'CONJUNTO DE', 'ALFAIATARIA', 'Short saia + cropped peplum.', 'Já sai pronta, sem pensar.'),
]

def capa():
    im = fundo(1080, 1350, NOITE); d = ImageDraw.Draw(im)
    f1 = font(128); f2 = font(110)
    linhas = [('3 ROUPAS', BRANCO), ('QUE PARECEM', BRANCO), ('CARAS', NOITE)]
    y = 250
    for t, c in linhas:
        w = d.textlength(t, font=f1)
        if c == NOITE:
            marca_texto(im, (int(540 - w / 2 - 26), y + 18, int(540 + w / 2 + 26), y + 140), PIST, -2.5)
            d = ImageDraw.Draw(im)
        texto_c(d, 540, y, t, f1, c); y += 140
    y += 30
    w = texto_c(d, 540, y, '(E NÃO SÃO)', f2, ROSA)
    sublinhado(d, 540 - w / 2, 540 + w / 2, y + 138, ROSA)
    seta(d, 250, 1060, 420, 960, PIST)
    d.text((110, 1080), 'arrasta pro lado', font=font(46, 'Bold'), fill=PIST)
    c = corgi(330, 9); im.paste(c, (1080 - c.width - 30, 1350 - c.height - 20), c)
    d.text((70, 70), '@afiliadamiyu', font=font(40, 'Bold'), fill=PIST)
    return im

def slide_peca(i, chave, t1, t2, det1, det2):
    cor = [PIST, BRANCO, PIST][i]
    im = fundo(1080, 1350, cor, tuple(max(0, c - 22) for c in cor)); d = ImageDraw.Draw(im)
    f = foto(chave, 600, 760)
    p = polaroid(f, [-3, 2.5, -2][i]); im.paste(p, ((1080 - p.width) // 2, 60), p)
    d = ImageDraw.Draw(im)
    # numero
    d.ellipse([90, 80, 230, 220], fill=ROSA); texto_c(d, 160, 100, str(i + 1), font(96), BRANCO)
    y = 920
    texto_c(d, 540, y, t1, font(86), NOITE)
    w = d.textlength(t2, font=font(86))
    marca_texto(im, (int(540 - w / 2 - 18), y + 108, int(540 + w / 2 + 18), y + 196), MIYU, 1.5)
    d = ImageDraw.Draw(im)
    texto_c(d, 540, y + 96, t2, font(86), BRANCO)
    texto_c(d, 540, y + 222, det1, font(44, 'SemiBold'), NOITE)
    texto_c(d, 540, y + 278, det2, font(44, 'SemiBold'), NOITE)
    return im

def slide_cta():
    im = fundo(1080, 1350, NOITE); d = ImageDraw.Draw(im)
    y = 260
    texto_c(d, 540, y, 'COMENTA', font(120), BRANCO)
    w = d.textlength(PAL, font=font(150))
    marca_texto(im, (int(540 - w / 2 - 30), y + 150, int(540 + w / 2 + 30), y + 310), ROSA, -2)
    d = ImageDraw.Draw(im)
    texto_c(d, 540, y + 140, PAL, font(150), BRANCO)
    for k, t in enumerate(['que te mando todos', 'os links no direct']):
        texto_c(d, 540, y + 360 + k * 84, t, font(72, 'Bold'), PIST)
    emoji(im, (490, y + 545), '💬', 100)
    c = corgi(380, -7); im.paste(c, (60, 1350 - c.height - 10), c)
    d = ImageDraw.Draw(im)
    seta(d, 860, 1150, 640, 1010, PIST)
    return im

def story():
    im = fundo(1080, 1920, NOITE); d = ImageDraw.Draw(im)
    d.text((90, 200), 'ROUPA DO DIA', font=font(92), fill=BRANCO)
    w = d.textlength('COM PREÇO BOM', font=font(92))
    marca_texto(im, (80, 318, int(100 + w), 418), PIST, -1.5); d = ImageDraw.Draw(im)
    d.text((90, 306), 'COM PREÇO BOM', font=font(92), fill=NOITE)
    f = foto('cacharrel', 520, 620); p = polaroid(f, -3); im.paste(p, (110, 470), p)
    c = corgi(260, 10); im.paste(c, (1080 - c.width - 20, 820), c)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([110, 1150, 970, 1370], radius=40, fill=BRANCO)
    texto_c(d, 540, 1168, 'Blusa cacharrel manga longa.', font(48, 'Bold'), NOITE)
    texto_c(d, 540, 1230, 'Básica de gola alta que vai com saia,', font(38, 'SemiBold'), NOITE)
    texto_c(d, 540, 1278, 'calça e jaqueta. Salva o look', font(38, 'SemiBold'), NOITE)
    texto_c(d, 540, 1310 + 16, 'quando bate a preguiça.', font(38, 'SemiBold'), NOITE)
    texto_c(d, 540, 1405, 'responde', font(60, 'Bold'), PIST)
    w = d.textlength('GOLA', font=font(110))
    marca_texto(im, (int(540 - w / 2 - 24), 1490, int(540 + w / 2 + 24), 1606), ROSA, 2); d = ImageDraw.Draw(im)
    texto_c(d, 540, 1476, 'GOLA', font(110), BRANCO)
    texto_c(d, 540, 1620, 'que te mando o link', font(56, 'Bold'), PIST)
    return im

capa().save(os.path.join(OUT, '1-capa.jpg'), quality=92)
for i, pc in enumerate(PECAS):
    slide_peca(i, *pc).save(os.path.join(OUT, f'{i + 2}-{pc[0]}.jpg'), quality=92)
slide_cta().save(os.path.join(OUT, '5-comenta.jpg'), quality=92)
story().save(os.path.join(OUT, 'story-cacharrel.jpg'), quality=92)
print('ok')
