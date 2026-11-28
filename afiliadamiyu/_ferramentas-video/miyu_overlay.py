"""Aplica a identidade Afiliada Miyu (design system) num Reel vertical 1080x1920,
nos formatos do estilo Lobão (skill feed-afiliadamiyu-estilo-lobao).

Sempre: selo pílula verde-noite com corgi + @afiliadamiyu (canto sup. esquerdo),
carimbo "achadinho testado" (canto sup. direito, acima dos botões do app) e
aviso "comenta PALAVRA" em rosa-achadinho no fim do vídeo.

Estilos do gancho:
  tweet   -> cartão-tweet "Afiliada Miyu @afiliadamiyu" flutuando sobre o vídeo (formato 2)
  chamada -> título gigante em CAIXA ALTA pistache com sombra verde-noite (formato 5)
  cartao  -> cartão branco de 2 linhas (versão de 26/11)

Uso:
  python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 --estilo tweet   --texto "Essa saia vira vestido quando..." --palavra SAIA
  python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 --estilo chamada --texto "VAI PRO|RÉVEILLON?|de branco" --palavra BRANCO
  python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 --estilo cartao  --texto "Esse broche dourado|faz o look|sozinho" --palavra BROCHE
  (forma antiga também vale: ENTRADA SAIDA "linha 1|linha 2|destaque" PALAVRA)
"""
import argparse
import subprocess
import sys
import textwrap
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent
FONTS, ASSETS = HERE / "fonts", HERE / "assets"
VERDE_MIYU, VERDE_NOITE, PISTACHE = "#2E7D5B", "#18392B", "#DDEFC9"
ROSA, BRANCO, CINZA = "#FF5A87", "#FFFFFF", "#5E7468"
W, H = 1080, 1920
ZONA_TEXTO = 1190  # faixa de texto, acima da legenda do Instagram e longe do rosto


def fonte(nome, tam, var):
    f = ImageFont.truetype(str(FONTS / nome), tam)
    f.set_variation_by_name(var)
    return f


def largura(d, runs):
    return sum(d.textlength(t, font=f) for t, f, _ in runs)


def escreve(d, x, y, runs):
    for t, f, c in runs:
        d.text((x, y), t, font=f, fill=c)
        x += d.textlength(t, font=f)


def larg_espacada(d, txt, f, track):
    return sum(d.textlength(ch, font=f) + track for ch in txt) - (track if txt else 0)


def escreve_espacado(d, x, y, txt, f, cor, track, contorno=0, cor_contorno=None):
    for ch in txt:
        d.text((x, y), ch, font=f, fill=cor, stroke_width=contorno, stroke_fill=cor_contorno)
        x += d.textlength(ch, font=f) + track


# ---------- camadas fixas ----------

def camada_marca(path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = fonte("BricolageGrotesque.ttf", 34, b"Bold")
    txt = "@afiliadamiyu"
    h, pad, circ = 72, 8, 56
    x0, y0 = 40, 130
    x1 = x0 + pad + circ + 14 + d.textlength(txt, font=f) + 26
    d.rounded_rectangle((x0, y0, x1, y0 + h), radius=h // 2, fill=VERDE_NOITE)
    cx0, cy0 = x0 + pad, y0 + (h - circ) // 2
    d.ellipse((cx0, cy0, cx0 + circ, cy0 + circ), fill=PISTACHE)
    corgi = Image.open(ASSETS / "corgi.png").convert("RGBA")
    img.alpha_composite(corgi, (cx0 + (circ - corgi.width) // 2, cy0 + (circ - corgi.height) // 2 - 1))
    d.text((cx0 + circ + 14, y0 + (h - 40) // 2 - 2), txt, font=f, fill=BRANCO)
    car = Image.open(ASSETS / "carimbo.png").convert("RGBA").rotate(-10, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(car, (W - car.width - 30, 210))
    img.save(path)


def camada_cta(path, palavra):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    b = fonte("BricolageGrotesque.ttf", 52, b"ExtraBold")
    s = fonte("BricolageGrotesque.ttf", 40, b"Bold")
    l1 = [("comenta   ", b, BRANCO), (palavra.upper(), b, VERDE_NOITE)]
    l2 = [("que te mando o link no direct", s, BRANCO)]
    w1, w2 = largura(d, l1), largura(d, l2)
    cw, ch = max(w1, w2) + 80, 160
    x0, y0 = (W - cw) // 2, ZONA_TEXTO + 20
    d.rounded_rectangle((x0, y0, x0 + cw, y0 + ch), radius=14, fill=ROSA)
    xp = (W - w1) // 2 + d.textlength("comenta   ", font=b)
    wp = d.textlength(palavra.upper(), font=b)
    d.rounded_rectangle((xp - 12, y0 + 16, xp + wp + 12, y0 + 86), radius=999, fill=PISTACHE)
    escreve(d, (W - w1) // 2, y0 + 18, l1)
    escreve(d, (W - w2) // 2, y0 + 96, l2)
    img.save(path)


# ---------- ganchos ----------

def gancho_cartao(path, texto):
    antes, meio, destaque = (texto.split("|") + ["", ""])[:3]
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    b = fonte("BricolageGrotesque.ttf", 64, b"ExtraBold")
    i = fonte("BricolageGrotesque.ttf", 66, b"ExtraBold")
    linhas = [[(antes.strip(), b, VERDE_NOITE)],
              [(meio.strip() + " ", b, VERDE_NOITE), (destaque.strip(), i, VERDE_MIYU)]]
    linhas = [[r for r in ln if r[0].strip()] for ln in linhas]
    linhas = [ln for ln in linhas if ln]
    lh = 86
    ws = [largura(d, ln) for ln in linhas]
    cw, ch = max(ws) + 84, lh * len(linhas) + 50
    x0, y0 = (W - cw) // 2, ZONA_TEXTO
    d.rounded_rectangle((x0, y0, x0 + cw, y0 + ch), radius=28, fill=BRANCO)
    for n, (ln, w) in enumerate(zip(linhas, ws)):
        escreve(d, (W - w) // 2, y0 + 20 + n * lh, ln)
    img.save(path)


def gancho_tweet(path, texto):
    """Formato 2 do Lobão: cartão-tweet flutuando sobre o vídeo."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    nome = fonte("BricolageGrotesque.ttf", 38, b"ExtraBold")
    user = fonte("BricolageGrotesque.ttf", 32, b"Medium")
    corpo = fonte("BricolageGrotesque.ttf", 46, b"SemiBold")
    cw = 900
    linhas = []
    for par in texto.split("\n"):
        linhas += textwrap.wrap(par, width=34) or [""]
    lh = 60
    ch = 40 + 70 + 22 + lh * len(linhas) + 36
    x0 = (W - cw) // 2
    y0 = max(ZONA_TEXTO + 180 - ch, 760)  # base do tweet alinhada com a base do aviso rosa
    sombra = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(sombra).rounded_rectangle((x0 + 6, y0 + 10, x0 + cw + 6, y0 + ch + 10), radius=30,
                                             fill=(24, 57, 43, 90))
    img.alpha_composite(sombra)
    d.rounded_rectangle((x0, y0, x0 + cw, y0 + ch), radius=30, fill=BRANCO)
    av = 70
    ax, ay = x0 + 36, y0 + 36
    d.ellipse((ax, ay, ax + av, ay + av), fill=PISTACHE)
    corgi = Image.open(ASSETS / "corgi_big.png").convert("RGBA").resize((54, 54), Image.LANCZOS)
    img.alpha_composite(corgi, (ax + 8, ay + 7))
    nx = ax + av + 18
    d.text((nx, ay + 2), "Afiliada Miyu", font=nome, fill=VERDE_NOITE)
    vx = nx + d.textlength("Afiliada Miyu", font=nome) + 10
    d.ellipse((vx, ay + 12, vx + 26, ay + 38), fill=VERDE_MIYU)
    d.line((vx + 7, ay + 25, vx + 12, ay + 31, vx + 20, ay + 19), fill=BRANCO, width=4)
    d.text((nx, ay + 44), "@afiliadamiyu", font=user, fill=CINZA)
    ty = y0 + 40 + 70 + 22
    for n, ln in enumerate(linhas):
        d.text((x0 + 40, ty + n * lh), ln, font=corpo, fill=VERDE_NOITE)
    img.save(path)


def gancho_chamada(path, texto):
    """Formato 5 do Lobão: título gigante CAIXA ALTA pistache com sombra verde-noite.
    texto = "LINHA 1|LINHA 2|destaque" (destaque em Bricolage, sem itálico, opcional)."""
    partes = (texto.split("|") + ["", ""])[:3]
    l1, l2, destaque = partes[0].strip().upper(), partes[1].strip().upper(), partes[2].strip()
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    tam = 132
    f = fonte("BricolageGrotesque.ttf", tam, b"ExtraBold")
    linhas = [l for l in (l1, l2) if l]
    while max(larg_espacada(d, l, f, -0.035 * tam) for l in linhas) > W - 120 and tam > 70:
        tam -= 6
        f = fonte("BricolageGrotesque.ttf", tam, b"ExtraBold")
    track = -0.035 * tam
    lh = int(tam * 0.98)  # 0.9 do design system + folga pros acentos da caixa alta
    total = lh * len(linhas) + (int(tam * 0.75) if destaque else 0)
    y = ZONA_TEXTO + 170 - total
    for ln in linhas:
        w = larg_espacada(d, ln, f, track)
        x = (W - w) / 2
        escreve_espacado(d, x + 9, y + 10, ln, f, VERDE_NOITE, track, 7, VERDE_NOITE)  # sombra
        escreve_espacado(d, x, y, ln, f, PISTACHE, track, 7, VERDE_NOITE)  # contorno pra ler em fundo claro
        y += lh
    if destaque:
        fi = fonte("BricolageGrotesque.ttf", int(tam * 0.5), b"ExtraBold")
        w = d.textlength(destaque, font=fi)
        x = (W - w) / 2
        d.text((x + 5, y + 6), destaque, font=fi, fill=VERDE_NOITE, stroke_width=5, stroke_fill=VERDE_NOITE)
        d.text((x, y), destaque, font=fi, fill=BRANCO, stroke_width=5, stroke_fill=VERDE_NOITE)
    img.save(path)


ESTILOS = {
    # estilo: (função, fim do gancho em s, início do aviso em s)
    "tweet": (gancho_tweet, 4.6, 4.6),
    "chamada": (gancho_chamada, 2.6, 4.4),
    "cartao": (gancho_cartao, 3.6, 3.6),
}


def ler_args():
    if len(sys.argv) == 5 and not any(a.startswith("--") for a in sys.argv[1:]):
        return argparse.Namespace(entrada=sys.argv[1], saida=sys.argv[2], estilo="cartao",
                                  texto=sys.argv[3], palavra=sys.argv[4])
    p = argparse.ArgumentParser()
    p.add_argument("entrada")
    p.add_argument("saida")
    p.add_argument("--estilo", choices=ESTILOS, default="tweet")
    p.add_argument("--texto", required=True)
    p.add_argument("--palavra", required=True)
    return p.parse_args()


def main():
    a = ler_args()
    if a.palavra.strip().upper() == "PALAVRA":
        sys.exit("Use a palavra-chave real do vídeo, não 'PALAVRA'.")
    func, fim, ini = ESTILOS[a.estilo]
    base = Path(a.saida).with_suffix("")
    m, g, c = f"{base}_marca.png", f"{base}_gancho.png", f"{base}_cta.png"
    camada_marca(m)
    func(g, a.texto)
    camada_cta(c, a.palavra)
    fc = ("[0:v]scale=1080:1920[v0];[v0][1:v]overlay=0:0[a];"
          f"[a][2:v]overlay=0:0:enable='lt(t,{fim})'[b];"
          f"[b][3:v]overlay=0:0:enable='gte(t,{ini})'[v]")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", a.entrada, "-i", m, "-i", g, "-i", c,
                    "-filter_complex", fc, "-map", "[v]", "-map", "0:a?",
                    "-c:v", "libx264", "-preset", "slow", "-b:v", "2500k", "-maxrate", "2700k",
                    "-bufsize", "5000k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
                    "-movflags", "+faststart", a.saida], check=True)


if __name__ == "__main__":
    main()
