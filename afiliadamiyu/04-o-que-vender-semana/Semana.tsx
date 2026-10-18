import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {cream: '#FFF4E6', orange: '#F28C38', orangeDark: '#D9661A', ink: '#2B1B12', pink: '#F7A8B8', white: '#FFFFFF', red: '#D64545'};
const FONT = 'Inter, sans-serif';

const HOOK = 80;
const ITEM = 90;
const CTA = 75;
export const TOTAL = HOOK + ITEM * 5 + CTA;

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
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.05, color: C.ink}}>{children}</div>
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

// ---------- item illustrations (viewBox 0 0 200 200) ----------
const Pumpkin = () => (
  <g>
    <rect x="94" y="40" width="12" height="26" rx="4" fill="#4E8B3A" />
    <ellipse cx="68" cy="118" rx="42" ry="56" fill={C.orangeDark} />
    <ellipse cx="132" cy="118" rx="42" ry="56" fill={C.orangeDark} />
    <ellipse cx="100" cy="118" rx="46" ry="60" fill={C.orange} />
    <polygon points="70,100 88,100 79,84" fill={C.ink} />
    <polygon points="112,100 130,100 121,84" fill={C.ink} />
    <path d="M66 130 L 78 142 L 90 130 L 100 142 L 110 130 L 122 142 L 134 130 Q 100 172 66 130 Z" fill={C.ink} />
  </g>
);

const WitchHat = () => (
  <g>
    <ellipse cx="100" cy="160" rx="86" ry="20" fill="#5B3A8C" />
    <path d="M58 160 L 104 24 Q 118 30 128 60 L 142 160 Z" fill="#6E48A8" />
    <rect x="62" y="134" width="78" height="18" fill={C.orange} />
    <rect x="92" y="132" width="20" height="22" rx="3" fill="none" stroke="#F5C542" strokeWidth="5" />
  </g>
);

const Fan: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 14;
  return (
    <g>
      <rect x="94" y="120" width="12" height="54" fill="#9AA3AB" />
      <ellipse cx="100" cy="178" rx="46" ry="12" fill="#7D868E" />
      <circle cx="100" cy="82" r="66" fill="#EAF2F8" stroke="#9AA3AB" strokeWidth="6" />
      <g transform={`rotate(${rot} 100 82)`}>
        {[0, 120, 240].map((a) => (
          <ellipse key={a} cx="100" cy="50" rx="18" ry="32" fill={C.orange} transform={`rotate(${a} 100 82)`} />
        ))}
      </g>
      <circle cx="100" cy="82" r="12" fill={C.orangeDark} />
      {[-40, -20, 0, 20, 40].map((d) => (
        <line key={d} x1={100 + d} y1={82 - Math.sqrt(66 * 66 - d * d)} x2={100 + d} y2={82 + Math.sqrt(66 * 66 - d * d)} stroke="#9AA3AB" strokeWidth="2" opacity="0.6" />
      ))}
    </g>
  );
};

const Nativity = () => (
  <g>
    <polygon points="100,18 104,30 117,30 107,38 111,51 100,43 89,51 93,38 83,30 96,30" fill="#F5C542" />
    <polygon points="22,96 100,52 178,96" fill="#8B5A2B" />
    <rect x="36" y="94" width="128" height="86" fill="#C08A4E" />
    <rect x="52" y="108" width="96" height="72" fill="#5E3A1C" />
    <path d="M70 160 L 130 160 L 120 178 L 80 178 Z" fill="#E0B96B" />
    <ellipse cx="100" cy="156" rx="18" ry="10" fill={C.white} />
    <circle cx="100" cy="148" r="8" fill="#F2C9A0" />
    <circle cx="68" cy="128" r="9" fill="#F2C9A0" />
    <path d="M56 176 Q 68 136 80 176 Z" fill="#4A78C2" />
    <circle cx="132" cy="128" r="9" fill="#F2C9A0" />
    <path d="M120 176 Q 132 136 144 176 Z" fill="#7A5230" />
  </g>
);

const Brick: React.FC<{x: number; y: number; w: number; c: string; studs: number}> = ({x, y, w, c, studs}) => (
  <g>
    {Array.from({length: studs}).map((_, i) => (
      <rect key={i} x={x + 8 + i * (w / studs)} y={y - 10} width={w / studs - 16} height={12} rx={3} fill={c} stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
    ))}
    <rect x={x} y={y} width={w} height={40} rx={5} fill={c} stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
  </g>
);
const Blocks = () => (
  <g>
    <Brick x={30} y={140} w={140} c="#D64545" studs={4} />
    <Brick x={52} y={90} w={96} c="#F5C542" studs={3} />
    <Brick x={70} y={40} w={60} c="#3F7FD6" studs={2} />
  </g>
);

const PhoneFilm = () => (
  <g>
    <rect x="52" y="14" width="96" height="176" rx="16" fill={C.ink} />
    <rect x="60" y="30" width="80" height="144" rx="6" fill="#BFE3F5" />
    <polygon points="60,30 140,30 140,90" fill={C.white} opacity="0.45" />
    <path d="M140 174 L 140 130 Q 118 150 100 174 Z" fill={C.white} opacity="0.9" />
    <path d="M140 130 Q 118 150 100 174" stroke="#9AA3AB" strokeWidth="2" fill="none" />
    <rect x="88" y="20" width="24" height="4" rx="2" fill="#555" />
  </g>
);

const Remote = () => (
  <g>
    <rect x="66" y="10" width="68" height="184" rx="30" fill="#3A3A3A" />
    <circle cx="100" cy="40" r="11" fill={C.red} />
    <circle cx="100" cy="88" r="22" fill="#5A5A5A" />
    <circle cx="100" cy="88" r="9" fill="#7A7A7A" />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={80 + c * 20} cy={128 + r * 20} r={6} fill="#8A8A8A" />)
    )}
  </g>
);

const Helmet = () => (
  <g>
    <path d="M24 130 Q 24 40 108 36 Q 180 40 178 118 L 178 150 L 60 150 Q 30 150 24 130 Z" fill={C.red} />
    <path d="M96 76 Q 160 70 174 104 L 174 124 L 96 124 Q 88 100 96 76 Z" fill="#2B2B3A" />
    <path d="M104 82 Q 150 80 162 100" stroke={C.white} strokeWidth="5" fill="none" opacity="0.5" strokeLinecap="round" />
    <rect x="40" y="148" width="130" height="14" rx="6" fill="#8E2E2E" />
  </g>
);

const Scooter = () => (
  <g>
    <rect x="40" y="148" width="110" height="12" rx="6" fill="#3A3A3A" />
    <line x1="150" y1="154" x2="140" y2="34" stroke="#3A3A3A" strokeWidth="10" strokeLinecap="round" />
    <line x1="118" y1="34" x2="162" y2="34" stroke="#3A3A3A" strokeWidth="10" strokeLinecap="round" />
    <circle cx="48" cy="170" r="20" fill={C.ink} />
    <circle cx="48" cy="170" r="8" fill="#9AA3AB" />
    <circle cx="152" cy="170" r="20" fill={C.ink} />
    <circle cx="152" cy="170" r="8" fill="#9AA3AB" />
    <polygon points="92,120 104,120 96,136 108,136 88,160 94,142 84,142" fill="#F5C542" />
  </g>
);

const Illo: React.FC<{children: React.ReactNode; delay: number; size: number}> = ({children, delay, size}) => {
  const frame = useCurrentFrame();
  const fy = Math.sin((frame + delay * 3) / 10) * 8;
  return (
    <Pop delay={delay}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translateY(${fy}px)`}}>{children}</svg>
    </Pop>
  );
};

// ---------- scenes ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame < 40 ? Math.sin(frame * 1.5) * 3 : 0;
  return (
    <Fade dur={HOOK}>
      <Center gap={50}>
        <Pop delay={2}><Pill bg={C.ink}>AFILIADA SHOPEE</Pill></Pop>
        <Pop delay={8}>
          <Title size={112}>O que vender<br /><Hi>essa semana</Hi></Title>
        </Pop>
        <Pop delay={18} style={{transform: `rotate(${shake}deg)`}}><Corgi size={400} /></Pop>
        <Pop delay={26}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink, opacity: 0.75, lineHeight: 1.3}}>Nada aleatório: tirado do<br /><Hi>Google Trends</Hi> e da <Hi>busca da Shopee</Hi></div></Pop>
      </Center>
    </Fade>
  );
};

type Item = {n: number; title: React.ReactNode; sub: string; tag?: string; illos: React.ReactNode[]};

const items: Item[] = [
  {n: 1, title: <>Fantasia de <Hi>Halloween</Hi></>, sub: 'Só faz sentido até 31/10. Tem que ser essa semana!', tag: 'CORRE', illos: [<WitchHat key="h" />, <Pumpkin key="p" />]},
  {n: 2, title: <><Hi>Ventilador</Hi></>, sub: 'O calor tá chegando e vende o ano todo no Nordeste', illos: [<Fan key="f" />]},
  {n: 3, title: <><Hi>Presépio</Hi> e Lego</>, sub: 'Já dá pra começar o conteúdo de Natal', illos: [<Nativity key="n" />, <Blocks key="b" />]},
  {n: 4, title: <>Película e <Hi>controle de TV</Hi></>, sub: 'Achadinho barato, ótimo pra quem tá começando', illos: [<PhoneFilm key="ph" />, <Remote key="r" />]},
  {n: 5, title: <>Capacete e <Hi>scooter elétrica</Hi></>, sub: 'Auto & Moto é a categoria que mais se destaca no Nordeste no Mapa Shopee', illos: [<Helmet key="he" />, <Scooter key="s" />]},
];

const ItemScene: React.FC<{item: Item}> = ({item}) => {
  const two = item.illos.length > 1;
  return (
    <Fade dur={ITEM}>
      <Center gap={44}>
        <Pop delay={0} style={{display: 'flex', gap: 20, alignItems: 'center'}}>
          <div style={{width: 96, height: 96, borderRadius: '50%', background: C.orange, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 56, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{item.n}</div>
          {item.tag ? <Pill bg={C.red}>{item.tag}</Pill> : null}
        </Pop>
        <Pop delay={4}><Title size={96}>{item.title}</Title></Pop>
        <Pop delay={10}>
          <div style={{background: C.white, borderRadius: 40, boxShadow: '0 18px 50px rgba(43,27,18,0.12)', width: 860, height: 640, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
            {item.illos.map((il, i) => (
              <Illo key={i} delay={14 + i * 8} size={two ? 400 : 520}>{il}</Illo>
            ))}
          </div>
        </Pop>
        <Pop delay={22}>
          <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 48, color: C.ink, opacity: 0.8, maxWidth: 880, lineHeight: 1.25, textWrap: 'balance'} as React.CSSProperties}>{item.sub}</div>
        </Pop>
      </Center>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 32, color: C.ink, opacity: 0.55}}>Fonte: Google Trends + busca da Shopee</div>
    </Fade>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: C.orange}}>
    <Fade dur={CTA}>
      <Center gap={56}>
        <Pop delay={2}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 100, letterSpacing: -2, lineHeight: 1.05, color: C.white}}>Salva pra montar<br />sua semana</div>
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

export const Semana: React.FC = () => (
  <AbsoluteFill style={{background: C.cream}}>
    <Dots />
    <Sequence from={0} durationInFrames={HOOK}><Hook /></Sequence>
    {items.map((it, i) => (
      <Sequence key={it.n} from={HOOK + i * ITEM} durationInFrames={ITEM}><ItemScene item={it} /></Sequence>
    ))}
    <Sequence from={HOOK + ITEM * 5} durationInFrames={CTA}><Cta /></Sequence>
    <Progress />
  </AbsoluteFill>
);
