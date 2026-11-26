# Ferramentas de vídeo @afiliadamiyu

Aplica a identidade Afiliada Miyu (design system) em vídeos verticais 1080x1920:
selo pílula verde-noite com @afiliadamiyu, carimbo "achadinho testado",
texto de gancho nos primeiros 3,6 s e aviso "comenta PALAVRA" em rosa até o fim.

    python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 "linha 1|linha 2|palavra em destaque" PALAVRA

Saída já comprimida (~2,5 MB, H.264 2500k). Requer ffmpeg e Pillow.
