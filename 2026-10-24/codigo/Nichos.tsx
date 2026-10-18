import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {cream: '#FFF4E6', orange: '#F28C38', orangeDark: '#D9661A', ink: '#2B1B12', pink: '#F7A8B8', white: '#FFFFFF', red: '#D64545'};
const FONT = 'Inter, sans-serif';

const HOOK = 80;
const ITEM = 84;
const CTA = 75;
const CLOSE = 105;
export const TOTAL = HOOK + ITEM * 7 + CLOSE + CTA;

// ---------- helpers ----------
const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.6}});
};

const Pop: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
  const s = usePop(delay);
  return (
    <div style={{transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.4), ...style}}>{children}</div>
  );
};

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 46}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 90, gap, textAlign: 'center'}}>{children}</AbsoluteFill>
);

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [
    [120, 260, 70, C.orange], [930, 340, 90, C.pink], [180, 1500, 110, C.pink], [900, 1650, 80, C.orange],
    [520, 140, 50, C.pink], [980, 1050, 60, C.orange], [80, 900, 55, C.orange], [600, 1820, 65, C.pink],
  ] as const;
  return (
    <AbsoluteFill>
      {dots.map(([x, y, r, c], i) => (
        <div key={i} style={{position: 'absolute', left: x - r, top: y - r + Math.sin(frame / 20 + i) * 18, width: r * 2, height: r * 2, borderRadius: '50%', background: c, opacity: 0.12}} />
      ))}
    </AbsoluteFill>
  );
};

const Pill: React.FC<{bg: string; children: React.ReactNode}> = ({bg, children}) => (
  <div style={{background: bg, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 2, padding: '18px 40px', borderRadius: 999}}>{children}</div>
);

const Title: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 100}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.05, color: C.ink, textWrap: 'balance'} as React.CSSProperties}>{children}</div>
);

const Hi: React.FC<{children: React.ReactNode; c?: string}> = ({children, c = C.orangeDark}) => <span style={{color: c}}>{children}</span>;

// ---------- corgi ----------
const Corgi: React.FC<{size?: number}> = ({size = 360}) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 > 64;
  const ear = Math.sin(frame / 6) * 4;
  const fy = Math.sin(frame / 8) * 12;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translateY(${fy}px)`}}>
      <g transform={`rotate(${-ear} 60 70)`}>
        <polygon points="40,90 55,22 90,70" fill={C.orange} />
        <polygon points="50,80 58,40 80,70" fill={C.pink} />
      </g>
      <g transform={`rotate(${ear} 140 70)`}>
        <polygon points="160,90 145,22 110,70" fill={C.orange} />
        <polygon points="150,80 142,40 120,70" fill={C.pink} />
      </g>
      <ellipse cx="100" cy="112" rx="70" ry="62" fill={C.orange} />
      <path d="M100 70 C 85 100, 60 130, 70 160 Q 100 182 130 160 C 140 130, 115 100, 100 70 Z" fill={C.white} />
      {blink ? (
        <>
          <rect x="66" y="106" width="18" height="4" rx="2" fill={C.ink} />
          <rect x="116" y="106" width="18" height="4" rx="2" fill={C.ink} />
        </>
      ) : (
        <>
          <circle cx="75" cy="108" r="8" fill={C.ink} />
          <circle cx="125" cy="108" r="8" fill={C.ink} />
          <circle cx="78" cy="105" r="2.5" fill={C.white} />
          <circle cx="128" cy="105" r="2.5" fill={C.white} />
        </>
      )}
      <ellipse cx="62" cy="128" rx="9" ry="6" fill={C.pink} opacity="0.8" />
      <ellipse cx="138" cy="128" rx="9" ry="6" fill={C.pink} opacity="0.8" />
      <ellipse cx="100" cy="132" rx="9" ry="7" fill={C.ink} />
      <path d="M92 144 Q 100 152 108 144" stroke={C.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

const Illo: React.FC<{children: React.ReactNode; delay: number; size: number}> = ({children, delay, size}) => {
  const frame = useCurrentFrame();
  const fy = Math.sin((frame + delay * 3) / 10) * 8;
  return (
    <Pop delay={delay}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translateY(${fy}px)`}}>{children}</svg>
    </Pop>
  );
};


// ---------- illustrations (viewBox 0 0 200 200) ----------
const Printer3D: React.FC = () => {
  const frame = useCurrentFrame();
  const nx = 100 + Math.sin(frame / 6) * 26;
  const h = Math.min(46, 14 + frame * 0.4);
  return (
    <g>
      <rect x="30" y="26" width="140" height="150" rx="10" fill="none" stroke={C.ink} strokeWidth="10" />
      <rect x="30" y="56" width="140" height="10" fill={C.ink} />
      <rect x={nx - 14} y="62" width="28" height="22" rx="4" fill="#7D868E" />
      <polygon points={`${nx - 6},84 ${nx + 6},84 ${nx},94`} fill={C.orangeDark} />
      <rect x="48" y="156" width="104" height="10" rx="3" fill="#9AA3AB" />
      <rect x="78" y={156 - h} width="44" height={h} rx="4" fill={C.orange} />
      {[0, 1, 2].map((i) => <line key={i} x1="80" x2="120" y1={156 - h + 10 + i * 12} y2={156 - h + 10 + i * 12} stroke={C.orangeDark} strokeWidth="2" opacity={i * 12 + 10 < h ? 0.6 : 0} />)}
      <circle cx="170" cy="40" r="22" fill={C.pink} stroke={C.ink} strokeWidth="5" />
      <circle cx="170" cy="40" r="7" fill={C.white} />
    </g>
  );
};

const Faucet: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g>
      <path d="M40 150 L 160 150 Q 156 188 100 188 Q 44 188 40 150 Z" fill={C.white} stroke="#9AA3AB" strokeWidth="6" />
      <rect x="86" y="70" width="16" height="80" rx="4" fill="#B8C2CA" />
      <path d="M94 74 Q 94 30 136 30 L 146 30 L 146 50 L 136 50 Q 112 50 112 74 Z" fill="#B8C2CA" />
      <rect x="70" y="92" width="48" height="12" rx="6" fill="#8A949C" />
      {[0, 1, 2].map((i) => {
        const y = 60 + ((frame * 3 + i * 30) % 90);
        return <ellipse key={i} cx="141" cy={y} rx="5" ry="8" fill="#5AA9E6" opacity={y < 145 ? 1 : 0} />;
      })}
    </g>
  );
};

const Bulb: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.25 + 0.2 * Math.sin(frame / 5);
  return (
    <g>
      <circle cx="100" cy="80" r="70" fill="#F5C542" opacity={glow} />
      <path d="M100 26 C 62 26 48 58 60 84 C 68 100 78 106 78 124 L 122 124 C 122 106 132 100 140 84 C 152 58 138 26 100 26 Z" fill="#F5C542" />
      <rect x="78" y="124" width="44" height="12" fill="#9AA3AB" />
      <rect x="80" y="136" width="40" height="10" fill="#7D868E" />
      <rect x="86" y="146" width="28" height="8" rx="4" fill="#5A5A5A" />
      <rect x="20" y="172" width="160" height="14" rx="7" fill="#3A3A3A" />
      {Array.from({length: 8}).map((_, i) => (
        <circle key={i} cx={32 + i * 19.5} cy="179" r="4" fill={(Math.floor(frame / 4) + i) % 3 === 0 ? C.pink : C.orange} />
      ))}
    </g>
  );
};

const Mug = () => (
  <g>
    <rect x="40" y="50" width="100" height="120" rx="14" fill={C.white} stroke={C.ink} strokeWidth="6" />
    <path d="M140 76 Q 178 76 178 108 Q 178 140 140 140" fill="none" stroke={C.ink} strokeWidth="10" />
    <path d="M90 92 C 90 78 70 78 70 94 C 70 108 90 118 90 126 C 90 118 110 108 110 94 C 110 78 90 78 90 92 Z" fill={C.red} />
    <rect x="58" y="140" width="64" height="10" rx="5" fill={C.orange} />
    <path d="M70 40 Q 76 28 70 16" stroke="#C9C9C9" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M100 40 Q 106 28 100 16" stroke="#C9C9C9" strokeWidth="5" fill="none" strokeLinecap="round" />
  </g>
);

const Tshirt = () => (
  <g>
    <path d="M70 30 L 40 44 L 22 82 L 48 94 L 56 80 L 56 176 L 144 176 L 144 80 L 152 94 L 178 82 L 160 44 L 130 30 Q 100 50 70 30 Z" fill={C.pink} stroke={C.ink} strokeWidth="5" />
    <text x="100" y="128" textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize="34" fill={C.ink}>SEU</text>
    <text x="100" y="158" textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize="28" fill={C.orangeDark}>NOME</text>
  </g>
);

const Nuts = () => (
  <g>
    <path d="M24 110 L 176 110 Q 170 176 100 176 Q 30 176 24 110 Z" fill={C.orange} />
    <rect x="24" y="104" width="152" height="12" rx="6" fill={C.orangeDark} />
    {[[60, 96], [84, 88], [110, 92], [136, 96], [72, 76], [100, 72], [126, 78]].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="16" ry="11" fill={i % 2 ? '#B57A3E' : '#D9A066'} transform={`rotate(${i * 25} ${x} ${y})`} />
    ))}
  </g>
);

const SnackBag = () => (
  <g>
    <path d="M50 30 L 150 30 L 158 176 L 42 176 Z" fill="#4E8B3A" />
    <path d="M50 30 L 60 20 L 70 30 L 80 20 L 90 30 L 100 20 L 110 30 L 120 20 L 130 30 L 140 20 L 150 30 Z" fill="#3E7030" />
    <circle cx="100" cy="102" r="36" fill={C.cream} />
    <ellipse cx="100" cy="102" rx="18" ry="12" fill="#D9A066" />
    <rect x="62" y="148" width="76" height="14" rx="7" fill={C.cream} opacity="0.85" />
  </g>
);

const Cat: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = frame % 60 > 55;
  return (
    <g>
      <polygon points="40,80 52,24 88,58" fill="#9A9A9A" />
      <polygon points="160,80 148,24 112,58" fill="#9A9A9A" />
      <polygon points="50,70 56,40 78,60" fill={C.pink} />
      <polygon points="150,70 144,40 122,60" fill={C.pink} />
      <ellipse cx="100" cy="110" rx="70" ry="62" fill="#B0B0B0" />
      {blink ? (
        <>
          <rect x="62" y="100" width="22" height="4" rx="2" fill={C.ink} />
          <rect x="116" y="100" width="22" height="4" rx="2" fill={C.ink} />
        </>
      ) : (
        <>
          <ellipse cx="73" cy="102" rx="10" ry="13" fill="#7BC67B" />
          <ellipse cx="127" cy="102" rx="10" ry="13" fill="#7BC67B" />
          <ellipse cx="73" cy="102" rx="3" ry="10" fill={C.ink} />
          <ellipse cx="127" cy="102" rx="3" ry="10" fill={C.ink} />
        </>
      )}
      <polygon points="92,124 108,124 100,134" fill={C.pink} />
      <path d="M100 134 Q 92 144 84 138 M100 134 Q 108 144 116 138" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
      <line x1="40" y1="122" x2="74" y2="128" stroke={C.ink} strokeWidth="2" />
      <line x1="40" y1="136" x2="74" y2="134" stroke={C.ink} strokeWidth="2" />
      <line x1="160" y1="122" x2="126" y2="128" stroke={C.ink} strokeWidth="2" />
      <line x1="160" y1="136" x2="126" y2="134" stroke={C.ink} strokeWidth="2" />
    </g>
  );
};

const Yarn: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <g transform={`rotate(${Math.sin(frame / 8) * 15} 100 110)`}>
      <circle cx="100" cy="110" r="62" fill={C.pink} />
      <path d="M48 90 Q 100 60 152 90 M42 116 Q 100 84 158 116 M50 142 Q 100 110 150 142" stroke="#E07F95" strokeWidth="6" fill="none" />
      <path d="M150 150 Q 176 176 188 160" stroke="#E07F95" strokeWidth="6" fill="none" strokeLinecap="round" />
    </g>
  );
};

const Teddy = () => (
  <g>
    <circle cx="60" cy="40" r="22" fill="#B57A3E" />
    <circle cx="140" cy="40" r="22" fill="#B57A3E" />
    <circle cx="60" cy="40" r="11" fill="#D9A066" />
    <circle cx="140" cy="40" r="11" fill="#D9A066" />
    <ellipse cx="100" cy="148" rx="54" ry="46" fill="#B57A3E" />
    <ellipse cx="100" cy="152" rx="30" ry="28" fill="#D9A066" />
    <circle cx="52" cy="176" r="18" fill="#B57A3E" />
    <circle cx="148" cy="176" r="18" fill="#B57A3E" />
    <circle cx="100" cy="76" r="50" fill="#B57A3E" />
    <ellipse cx="100" cy="92" rx="22" ry="17" fill="#D9A066" />
    <circle cx="82" cy="70" r="6" fill={C.ink} />
    <circle cx="118" cy="70" r="6" fill={C.ink} />
    <ellipse cx="100" cy="86" rx="7" ry="5" fill={C.ink} />
    <path d="M92 98 Q 100 104 108 98" stroke={C.ink} strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M78 118 L 100 128 L 122 118 L 122 134 L 100 128 L 78 134 Z" fill={C.red} />
  </g>
);

// ---------- scenes ----------
const Credit: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 32, color: C.ink, opacity: 0.55}}>Dica do @guideggan</div>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame < 40 ? Math.sin(frame * 1.5) * 3 : 0;
  return (
    <Fade dur={HOOK}>
      <Center gap={48}>
        <Pop delay={2}><Pill bg={C.ink}>TIKTOK SHOP E MARKETPLACES</Pill></Pop>
        <Pop delay={8}>
          <Title size={108}>7 nichos que<br /><Hi>pouca gente</Hi><br />está olhando</Title>
        </Pop>
        <Pop delay={18} style={{transform: `rotate(${shake}deg)`}}><Corgi size={360} /></Pop>
        <Pop delay={26}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink, opacity: 0.75}}>Dica do <Hi>@guideggan</Hi></div></Pop>
      </Center>
    </Fade>
  );
};

type Item = {n: number; title: React.ReactNode; sub: string; illos: React.ReactNode[]};

const items: Item[] = [
  {n: 1, title: <>Impressão <Hi>3D</Hi></>, sub: 'Filamentos, acessórios e peças de reposição. Tem recompra', illos: [<Printer3D key="a" />]},
  {n: 2, title: <>Reforma e <Hi>acabamento</Hi></>, sub: 'Torneiras, cubas e duchas. Ticket bom e vídeo de transformação', illos: [<Faucet key="a" />]},
  {n: 3, title: <>Iluminação e <Hi>elétrica</Hi></>, sub: 'Spots, fita de LED e sensores. Vende pro cliente e pro profissional', illos: [<Bulb key="a" />]},
  {n: 4, title: <>Produtos <Hi>personalizados</Hi></>, sub: 'Canecas, camisetas e presentes. Menos comparação de preço', illos: [<Mug key="a" />, <Tshirt key="b" />]},
  {n: 5, title: <>Alimentos <Hi>fora do óbvio</Hi></>, sub: 'Snacks, nuts e funcionais. Tem recompra e é fácil de mostrar em vídeo', illos: [<Nuts key="a" />, <SnackBag key="b" />]},
  {n: 6, title: <>Produtos <Hi>pet</Hi></>, sub: 'Itens diferentes pra gatos: brinquedos, fontes, camas e acessórios', illos: [<Cat key="a" />, <Yarn key="b" />]},
  {n: 7, title: <><Hi>Brinquedos</Hi></>, sub: 'Visual, fácil de demonstrar e com datas fortes como o Natal', illos: [<Teddy key="a" />]},
];

const ItemScene: React.FC<{item: Item}> = ({item}) => {
  const two = item.illos.length > 1;
  return (
    <Fade dur={ITEM}>
      <Center gap={44}>
        <Pop delay={0}>
          <div style={{width: 96, height: 96, borderRadius: '50%', background: C.orange, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{item.n}</div>
        </Pop>
        <Pop delay={4}><Title size={96}>{item.title}</Title></Pop>
        <Pop delay={10}>
          <div style={{background: C.white, borderRadius: 40, boxShadow: '0 18px 50px rgba(43,27,18,0.12)', width: 860, height: 620, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
            {item.illos.map((il, i) => (
              <Illo key={i} delay={14 + i * 8} size={two ? 400 : 500}>{il}</Illo>
            ))}
          </div>
        </Pop>
        <Pop delay={20}>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 48, color: C.ink, opacity: 0.8, maxWidth: 880, lineHeight: 1.25, textWrap: 'balance'} as React.CSSProperties}>{item.sub}</div>
        </Pop>
      </Center>
      <Credit />
    </Fade>
  );
};

const Close: React.FC = () => {
  const chips = ['Demanda', 'Margem', 'Logística viável', 'Potencial de conteúdo'];
  return (
    <Fade dur={CLOSE}>
      <Center gap={50}>
        <Pop delay={2}><Pill bg={C.red}>ATENÇÃO</Pill></Pop>
        <Pop delay={8}><Title size={96}>Não basta ter<br /><Hi>pouca concorrência</Hi></Title></Pop>
        <Pop delay={16}><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 50, color: C.ink, opacity: 0.8}}>O melhor produto junta:</div></Pop>
        <div style={{display: 'flex', flexDirection: 'column', gap: 26, width: 820}}>
          {chips.map((c, i) => (
            <Pop key={c} delay={24 + i * 10}>
              <div style={{background: C.white, borderRadius: 32, boxShadow: '0 12px 36px rgba(43,27,18,0.10)', padding: '28px 36px', display: 'flex', alignItems: 'center', gap: 28}}>
                <div style={{width: 72, height: 72, borderRadius: '50%', background: C.orange, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke={C.white} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.ink}}>{c}</div>
              </div>
            </Pop>
          ))}
        </div>
      </Center>
      <Credit />
    </Fade>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: C.orange}}>
    <Fade dur={CTA}>
      <Center gap={56}>
        <Pop delay={2}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 100, letterSpacing: -2, lineHeight: 1.05, color: C.white}}>Salva e escolhe<br />seu nicho</div>
        </Pop>
        <Pop delay={10}>
          <div style={{width: 440, height: 440, borderRadius: '50%', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Corgi size={360} />
          </div>
        </Pop>
        <Pop delay={18}>
          <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.ink}}>Segue a @miyuflix</div>
        </Pop>
      </Center>
    </Fade>
  </AbsoluteFill>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / TOTAL) * 100}%`, background: C.orangeDark}} />;
};

export const Nichos: React.FC = () => (
  <AbsoluteFill style={{background: C.cream}}>
    <Dots />
    <Sequence from={0} durationInFrames={HOOK}><Hook /></Sequence>
    {items.map((it, i) => (
      <Sequence key={it.n} from={HOOK + i * ITEM} durationInFrames={ITEM}><ItemScene item={it} /></Sequence>
    ))}
    <Sequence from={HOOK + ITEM * 7} durationInFrames={CLOSE}><Close /></Sequence>
    <Sequence from={HOOK + ITEM * 7 + CLOSE} durationInFrames={CTA}><Cta /></Sequence>
    <Progress />
  </AbsoluteFill>
);
