# Ferramentas de vídeo @afiliadamiyu

Aplica a identidade Afiliada Miyu (design system) em Reels 1080x1920, nos formatos
do estilo Lobão (skill feed-afiliadamiyu-estilo-lobao). Sempre entram: selo pílula
@afiliadamiyu (sup. esquerdo), carimbo "achadinho testado" (sup. direito) e aviso
"comenta PALAVRA" em rosa no fim, com a palavra-chave real do vídeo.

Estilos do gancho:
- `tweet`: cartão-tweet "Afiliada Miyu @afiliadamiyu" sobre o vídeo até 4,6 s (formato 2 do Lobão)
- `chamada`: título gigante em CAIXA ALTA pistache com contorno verde-noite até 2,6 s (formato 5)
- `cartao`: cartão branco de 2 linhas até 3,6 s (versão de 26/11)

    python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 --estilo tweet --texto "Frase curta de humor" --palavra SAIA
    python3 miyu_overlay.py ENTRADA.mp4 SAIDA.mp4 --estilo chamada --texto "VAI PRO|RÉVEILLON?|de pretinho básico" --palavra MIDI

Saída já comprimida (~2,5 MB, H.264 2500k). Requer ffmpeg e Pillow.
