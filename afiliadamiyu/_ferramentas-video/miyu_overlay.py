"""Aplica a identidade Afiliada Miyu (design system) num vídeo vertical 1080x1920.

- Selo pílula verde-noite com corgi + @afiliadamiyu (canto superior esquerdo, vídeo claro)
- Carimbo "achadinho testado" (canto superior direito; a personagem prova a peça)
- Legenda/gancho no começo (Bricolage + palavra em Fraunces itálico verde-miyu)
- Aviso "comenta PALAVRA" em rosa-achadinho, acima da área da legenda do app

Uso: python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 "linha 1|linha 2|palavra em destaque" PALAVRA
"""
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent
FONTS, ASSETS = HERE / "fonts", HERE / "assets"
VERDE_MIYU, VERDE_NOITE, PISTACHE = "#2E7D5B", "#18392B", "#DDEFC9"
ROSA, BRANCO = "#FF5A87", "#FFFFFF"
W, H = 1080, 1920
ZONA_TEXTO = 1190  # topo da faixa de texto (acima da legenda do Instagram)


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


def camada_marca(path):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # selo pílula: verde-noite, círculo pistache com corgi, @afiliadamiyu branco
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
    # carimbo achadinho testado
    car = Image.open(ASSETS / "carimbo.png").convert("RGBA").rotate(-10, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(car, (W - car.width - 30, 210))
    img.save(path)


def camada_gancho(path, antes, destaque, depois):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    b = fonte("BricolageGrotesque.ttf", 64, b"ExtraBold")
    i = fonte("Fraunces-Italic.ttf", 70, b"SemiBold Italic")
    # linha 1: antes | linha 2: meio + palavra em destaque (Fraunces itálico verde-miyu)
    meio, destaque = destaque, depois
    linhas = [[(antes.strip(), b, VERDE_NOITE)],
              [(meio.strip() + " ", b, VERDE_NOITE), (destaque.strip(), i, VERDE_MIYU)]]
    linhas = [[r for r in ln if r[0]] for ln in linhas]
    linhas = [ln for ln in linhas if ln]
    lh = 86
    ws = [largura(d, ln) for ln in linhas]
    cw, ch = max(ws) + 84, lh * len(linhas) + 50
    x0, y0 = (W - cw) // 2, ZONA_TEXTO
    d.rounded_rectangle((x0, y0, x0 + cw, y0 + ch), radius=28, fill=BRANCO)
    for n, (ln, w) in enumerate(zip(linhas, ws)):
        escreve(d, (W - w) // 2, y0 + 20 + n * lh, ln)
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
    # etiqueta pistache atrás da palavra
    xp = (W - w1) // 2 + d.textlength("comenta   ", font=b)
    wp = d.textlength(palavra.upper(), font=b)
    d.rounded_rectangle((xp - 12, y0 + 16, xp + wp + 12, y0 + 86), radius=999, fill=PISTACHE)
    escreve(d, (W - w1) // 2, y0 + 18, l1)
    escreve(d, (W - w2) // 2, y0 + 96, l2)
    img.save(path)


def main():
    src, dst, gancho, palavra = sys.argv[1:5]
    antes, destaque, depois = (gancho.split("|") + ["", ""])[:3]
    base = Path(dst).with_suffix("")
    m, g, c = f"{base}_marca.png", f"{base}_gancho.png", f"{base}_cta.png"
    camada_marca(m)
    camada_gancho(g, antes, destaque, depois)
    camada_cta(c, palavra)
    fc = ("[0:v]scale=1080:1920[v0];[v0][1:v]overlay=0:0[a];"
          "[a][2:v]overlay=0:0:enable='lt(t,3.6)'[b];"
          "[b][3:v]overlay=0:0:enable='gte(t,3.6)'[v]")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-i", m, "-i", g, "-i", c,
                    "-filter_complex", fc, "-map", "[v]", "-map", "0:a?",
                    "-c:v", "libx264", "-preset", "slow", "-b:v", "2500k", "-maxrate", "2700k",
                    "-bufsize", "5000k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k",
                    "-movflags", "+faststart", dst], check=True)


if __name__ == "__main__":
    main()
