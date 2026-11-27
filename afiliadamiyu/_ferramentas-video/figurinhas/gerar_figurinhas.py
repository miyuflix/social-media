import subprocess, io
from PIL import Image, ImageDraw, ImageFont, ImageFilter
VM,VN,PI,RO,BR="#2E7D5B","#18392B","#DDEFC9","#FF5A87","#FFFFFF"
B='/home/claude/brand/fonts/BricolageGrotesque.ttf'; F='/home/claude/brand/fonts/Fraunces-Italic.ttf'
S=600
def font(p,s,v=None):
    f=ImageFont.truetype(p,s)
    if v: f.set_variation_by_name(v)
    return f
HEAD='''<path d="M20 50 L33 12 Q37 5 42 11 L57 40 Z" fill="#2E7D5B"/><path d="M100 50 L87 12 Q83 5 78 11 L63 40 Z" fill="#2E7D5B"/>
<path d="M30 40 L36 20 L45 36 Z" fill="#FF5A87"/><path d="M90 40 L84 20 L75 36 Z" fill="#FF5A87"/>
<rect x="12" y="34" width="96" height="80" rx="30" fill="#2E7D5B"/><rect x="55" y="44" width="10" height="34" rx="5" fill="#FFFFFF"/>
<ellipse cx="60" cy="92" rx="27" ry="17" fill="#FFFFFF"/><ellipse cx="60" cy="86" rx="6" ry="4.5" fill="#18392B"/>'''
OLHOS={
 'normal':'<circle cx="42" cy="70" r="5.5" fill="#18392B"/><circle cx="78" cy="70" r="5.5" fill="#18392B"/>',
 'brilho':'<circle cx="42" cy="70" r="7.5" fill="#18392B"/><circle cx="78" cy="70" r="7.5" fill="#18392B"/><circle cx="44.5" cy="67" r="2.6" fill="#fff"/><circle cx="80.5" cy="67" r="2.6" fill="#fff"/><circle cx="40" cy="72.5" r="1.3" fill="#fff"/><circle cx="76" cy="72.5" r="1.3" fill="#fff"/>',
 'coracao':''.join(f'<path transform="translate({x},70)" d="M0 7 C-12 -1 -8 -10 0 -4 C8 -10 12 -1 0 7 Z" fill="#FF5A87" stroke="#18392B" stroke-width="1.5"/>' for x in (42,78)),
 'desconfiada':'<path d="M33 66 L51 66" stroke="#18392B" stroke-width="3.2" stroke-linecap="round"/><path d="M69 66 L87 66" stroke="#18392B" stroke-width="3.2" stroke-linecap="round"/><circle cx="47" cy="70" r="4" fill="#18392B"/><circle cx="83" cy="70" r="4" fill="#18392B"/><path d="M33 58 L50 61" stroke="#18392B" stroke-width="3" stroke-linecap="round"/><path d="M70 61 L87 56" stroke="#18392B" stroke-width="3" stroke-linecap="round"/>',
 'chorando':'<path d="M35 70 Q42 64 49 70" stroke="#18392B" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M71 70 Q78 64 85 70" stroke="#18392B" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M38 74 Q34 86 38 96 Q43 86 40 74 Z" fill="#BFE6FF" stroke="#18392B" stroke-width="1.5"/><path d="M82 74 Q86 86 82 96 Q77 86 80 74 Z" fill="#BFE6FF" stroke="#18392B" stroke-width="1.5"/>',
 'piscando':'<circle cx="42" cy="70" r="5.5" fill="#18392B"/><path d="M71 71 Q78 65 85 71" stroke="#18392B" stroke-width="3.2" fill="none" stroke-linecap="round"/>',
 'oculos':'<path d="M14 64 L28 63" stroke="#18392B" stroke-width="3" stroke-linecap="round"/><path d="M106 64 L92 63" stroke="#18392B" stroke-width="3" stroke-linecap="round"/><rect x="26" y="59" width="29" height="21" rx="8" fill="#18392B"/><rect x="65" y="59" width="29" height="21" rx="8" fill="#18392B"/><path d="M55 66 Q60 62 65 66" stroke="#18392B" stroke-width="3" fill="none"/><text x="40.5" y="76" font-family="sans-serif" font-weight="bold" font-size="17" fill="#8FE3A2" text-anchor="middle">$</text><text x="79.5" y="76" font-family="sans-serif" font-weight="bold" font-size="17" fill="#8FE3A2" text-anchor="middle">$</text>',
 'olhando_cima':'<circle cx="42" cy="70" r="7" fill="#fff" stroke="#18392B" stroke-width="2"/><circle cx="78" cy="70" r="7" fill="#fff" stroke="#18392B" stroke-width="2"/><circle cx="43" cy="66" r="3.6" fill="#18392B"/><circle cx="79" cy="66" r="3.6" fill="#18392B"/>',
}
BOCAS={
 'sorriso':'<path d="M53 96 Q60 102 67 96" stroke="#18392B" stroke-width="3" fill="none" stroke-linecap="round"/>',
 'aberta':'<path d="M50 95 Q60 110 70 95 Z" fill="#FF5A87" stroke="#18392B" stroke-width="3" stroke-linejoin="round"/>',
 'reta':'<path d="M54 98 L66 98" stroke="#18392B" stroke-width="3" stroke-linecap="round"/>',
 'triste':'<path d="M53 100 Q60 94 67 100" stroke="#18392B" stroke-width="3" fill="none" stroke-linecap="round"/>',
 'o':'<ellipse cx="60" cy="99" rx="4" ry="5" fill="#18392B"/>',
}
LACO='<g transform="translate(88,30) rotate(18)"><path d="M0 0 L-14 -9 Q-17 0 -14 9 Z" fill="#FF5A87" stroke="#18392B" stroke-width="1.6"/><path d="M0 0 L14 -9 Q17 0 14 9 Z" fill="#FF5A87" stroke="#18392B" stroke-width="1.6"/><circle r="3.6" fill="#FF5A87" stroke="#18392B" stroke-width="1.6"/></g>'
def sacola(x,y,s=1,cor="#fff",pata=True):
    p=f'<g transform="translate({x},{y}) scale({s})"><path d="M10 12 Q10 -4 24 -4 Q38 -4 38 12" fill="none" stroke="#18392B" stroke-width="3"/><rect x="0" y="10" width="48" height="50" rx="5" fill="{cor}" stroke="#18392B" stroke-width="3"/>'
    if pata: p+='<g fill="#2E7D5B"><ellipse cx="24" cy="41" rx="8" ry="6.5"/><circle cx="14" cy="30" r="3.4"/><circle cx="21" cy="25.5" r="3.4"/><circle cx="29" cy="25.5" r="3.4"/><circle cx="35" cy="30" r="3.4"/></g>'
    return p+'</g>'
EXTRAS={
 'brilhos':'<g fill="#FF5A87"><path d="M118 20 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z"/><path d="M-6 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z"/></g>',
 'velocidade':'<g stroke="#FF5A87" stroke-width="5" stroke-linecap="round"><path d="M-30 60 L-8 60"/><path d="M-38 78 L-10 78"/><path d="M-26 96 L-8 96"/></g>',
 'gota':'<path d="M106 36 Q114 48 106 54 Q98 48 106 36 Z" fill="#BFE6FF" stroke="#18392B" stroke-width="1.8"/>',
 'interrog':'<text x="118" y="40" font-family="sans-serif" font-weight="900" font-size="34" fill="#FF5A87" stroke="#18392B" stroke-width="1.5">?</text>',
 'sacolas':sacola(96,62,1.0)+sacola(-36,70,0.85,"#DDEFC9",False),
 'sacola':sacola(98,64,1.0),
 'risquinhos':'<g stroke="#FF5A87" stroke-width="5" stroke-linecap="round"><path d="M112 8 L104 22"/><path d="M126 22 L114 30"/></g>',
 'pix':'<g transform="translate(96,60) rotate(10)"><rect width="46" height="30" rx="5" fill="#DDEFC9" stroke="#18392B" stroke-width="3"/><text x="23" y="21" font-family="sans-serif" font-weight="900" font-size="15" fill="#18392B" text-anchor="middle">PIX</text></g>',
}
FIGS=[
 ('achei','ACHEI!',None,'brilho','aberta',['brilhos','laco'],RO),
 ('ta-caro','TÁ CARO',None,'desconfiada','reta',['laco'],VN),
 ('corre','CORRE!','tá no menor preço','brilho','aberta',['velocidade','laco','risquinhos'],RO),
 ('so-vou-olhar','SÓ VOU OLHAR','(mentira)','olhando_cima','sorriso',['laco','sacola'],VN),
 ('carrinho-cheio','CARRINHO CHEIO',None,'coracao','aberta',['laco','sacolas'],RO),
 ('tem-certeza','TEM CERTEZA?',None,'desconfiada','o',['laco','interrog'],VN),
 ('modo-black','MODO BLACK',None,'oculos','sorriso',['laco','risquinhos'],VN),
 ('amei','AMEI',None,'coracao','aberta',['laco','brilhos'],RO),
 ('chorando-no-pix','CHORANDO','no pix','chorando','triste',['laco','pix'],VN),
 ('passa-o-link','PASSA O LINK','no direct','piscando','sorriso',['laco','risquinhos'],RO),
]
def svg(olho,boca,extras):
    ex=''.join(LACO if e=='laco' else EXTRAS[e] for e in extras)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-45 -5 210 130" width="{S}" height="{int(S*130/210)}">{HEAD}{OLHOS[olho]}{BOCAS[boca]}{ex}</svg>'
def contorno(im,w=14):
    a=im.getchannel('A'); big=a.filter(ImageFilter.MaxFilter(w*2+1))
    base=Image.new('RGBA',im.size,(255,255,255,0)); base.putalpha(big)
    sh=Image.new('RGBA',im.size,(24,57,43,0)); sh.putalpha(big.point(lambda v:int(v*.35)))
    out=Image.new('RGBA',im.size,(0,0,0,0)); out.alpha_composite(sh,(0,8)); out.alpha_composite(base); out.alpha_composite(im); return out
fichas=[]
for nome,tit,sub,olho,boca,ex,cor in FIGS:
    png=subprocess.run(['rsvg-convert','-'],input=svg(olho,boca,ex).encode(),capture_output=True).stdout
    corg=Image.open(io.BytesIO(png)).convert('RGBA')
    cv=Image.new('RGBA',(S+60,S+60),(0,0,0,0)); cv.alpha_composite(corg,(30,20))
    d=ImageDraw.Draw(cv); tam=96
    f=font(B,tam,'ExtraBold')
    while d.textlength(tit,font=f)>S-10 and tam>40: tam-=4; f=font(B,tam,'ExtraBold')
    y=30+corg.height-18
    d.text((cv.width/2,y),tit,font=f,fill=cor,anchor="mt",stroke_width=8,stroke_fill="#FFFFFF")
    if sub:
        fs=font(F,58); d.text((cv.width/2,y+tam+2),sub,font=fs,fill=VN if cor==RO else RO,anchor="mt",stroke_width=7,stroke_fill="#FFFFFF")
    bb=cv.getbbox(); cv=cv.crop((max(bb[0]-30,0),max(bb[1]-30,0),min(bb[2]+30,cv.width),min(bb[3]+30,cv.height)))
    pad=Image.new('RGBA',(cv.width+40,cv.height+50),(0,0,0,0)); pad.alpha_composite(cv,(20,20))
    out=contorno(pad); bb=out.getbbox(); out=out.crop(bb)
    out.save(f'{nome}.png'); fichas.append(out)
# folha de prévia
cols=5; cw=300; rows=(len(fichas)+cols-1)//cols
sheet=Image.new('RGB',(cols*cw,rows*cw),"#DDEFC9")
for i,im in enumerate(fichas):
    t=im.copy(); t.thumbnail((cw-30,cw-30)); x=(i%cols)*cw+(cw-t.width)//2; y=(i//cols)*cw+(cw-t.height)//2
    sheet.paste(t,(x,y),t)
sheet.save('previa-figurinhas.png'); print('ok',len(fichas))
