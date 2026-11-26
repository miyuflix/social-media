# Gera src/tiktokTiming.ts a partir do SRT (8 frases do roteiro)
import re, sys
srt = open(sys.argv[1], encoding='utf-8').read()
def t(x):
    h, m, s = x.replace(',', '.').split(':'); return int(h)*3600 + int(m)*60 + float(s)
cues = []
for block in re.split(r'\n\s*\n', srt.strip()):
    lines = block.strip().splitlines()
    tl = [l for l in lines if '-->' in l]
    if not tl: continue
    a, b = [t(x.strip()) for x in tl[0].split('-->')]
    text = ' '.join(lines[lines.index(tl[0])+1:])
    cues.append((a, b, text))
starts = ['Se você', 'Essa é', 'Primeiro', 'Depois', 'Na hora', 'E as suas', 'Tudo pensado', 'Quer testar']
idx = []
for k in starts:
    for i, c in enumerate(cues):
        if c[2].strip().startswith(k): idx.append(i); break
    else: print('MISSING', k, file=sys.stderr)
dur = float(sys.argv[2])
segs = []
for j, i in enumerate(idx):
    a = 0.0 if j == 0 else cues[i][0]
    b = cues[idx[j+1]][0] if j+1 < len(idx) else dur
    segs.append([round(a, 3), round(b, 3)])
open('src/tiktokTiming.ts', 'w').write(f'export const TIKTOK_SEGS: [number, number][] = {segs};\nexport const TIKTOK_VIDEO_END = {round(dur,3)};\n')
print(segs)
