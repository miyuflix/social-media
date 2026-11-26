import math
from PIL import Image, ImageDraw, ImageFont
S=840  # desenha 4x e reduz
img=Image.new("RGBA",(S,S),(0,0,0,0));d=ImageDraw.Draw(img)
c=S/2
d.ellipse((c-S*0.49,c-S*0.49,c+S*0.49,c+S*0.49),fill="#18392B")
d.ellipse((c-S*0.29,c-S*0.29,c+S*0.29,c+S*0.29),fill="#DDEFC9")
f=ImageFont.truetype("fonts/BricolageGrotesque.ttf",int(S*0.085));f.set_variation_by_name(b"ExtraBold")
txt="ACHADINHO TESTADO • AFILIADA MIYU • "
r=S*0.385
ws=[d.textlength(ch,font=f)+S*0.012 for ch in txt]
ang=-90-math.degrees(sum(ws)/r)/2*0  # começa no topo
a=-math.pi/2 - (sum(ws)/r)/2 + math.pi/2*0
a=-math.pi/2
tot=sum(ws); scale=(2*math.pi*r)/tot
for ch,w in zip(txt,ws):
    w*=scale; mid=a+(w/2)/r
    t=Image.new("RGBA",(int(S*0.12),int(S*0.12)),(0,0,0,0));td=ImageDraw.Draw(t)
    td.text((t.width/2,t.height/2),ch,font=f,fill="#FFFFFF",anchor="mm")
    t=t.rotate(-math.degrees(mid)-90,resample=Image.BICUBIC)
    x=c+r*math.cos(mid);y=c+r*math.sin(mid)
    img.alpha_composite(t,(int(x-t.width/2),int(y-t.height/2)))
    a+=w/r
corgi=Image.open("assets/corgi_big.png").convert("RGBA")
img.alpha_composite(corgi,(int(c-corgi.width/2),int(c-corgi.height/2)))
img.resize((210,210),Image.LANCZOS).save("assets/carimbo.png")
