import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {cream: '#FFF4E6', orange: '#F28C38', orangeDark: '#D9661A', ink: '#2B1B12', pink: '#F7A8B8', white: '#FFFFFF', red: '#D64545'};
const FONT = 'Inter, sans-serif';

const HOOK = 90;
const APP = 190;
const L1 = 230;
const OFFER = 90;
const CTA = 100;
export const TOTAL = HOOK + APP + L1 + OFFER + CTA;

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


const Check: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 24 24"><path d="M5 12.5 L10 17 L19 7" stroke={C.white} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const Card: React.FC<{n: number; t: React.ReactNode; sub?: string; delay: number}> = ({n, t, sub, delay}) => (
  <Pop delay={delay}>
    <div style={{background: C.white, borderRadius: 32, boxShadow: '0 12px 36px rgba(43,27,18,0.10)', padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 32, width: 860, textAlign: 'left'}}>
      <div style={{flex: 'none', width: 88, height: 88, borderRadius: '50%', background: C.orange, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
      <div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.ink, letterSpacing: -1}}>{t}</div>
        {sub && <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 38, color: C.ink, opacity: 0.65, marginTop: 6}}>{sub}</div>}
      </div>
    </div>
  </Pop>
);

const Hook: React.FC = () => (
  <Fade dur={HOOK}>
    <Center gap={52}>
      <Pop delay={2}><Pill bg={C.orangeDark}>BETA ABERTO</Pill></Pop>
      <Pop delay={8}><Title size={104}>Procuro<br /><Hi>10 afiliadas</Hi><br />pra testar a Miyu</Title></Pop>
      <Pop delay={16}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.ink, opacity: 0.8}}>a ferramenta pra afiliados</div></Pop>
      <Pop delay={22}><Corgi size={340} /></Pop>
    </Center>
  </Fade>
);

const App: React.FC = () => (
  <Fade dur={APP}>
    <Center gap={56}>
      <Pop delay={2}><Pill bg={C.orangeDark}>OLHA ELA AQUI</Pill></Pop>
      <Pop delay={8}><Title size={100}>Por dentro<br />da <Hi>Miyu</Hi></Title></Pop>
      <Pop delay={16}>
        <div style={{width: 980, borderRadius: 28, overflow: 'hidden', background: C.white, boxShadow: '0 24px 60px rgba(43,27,18,0.18)', border: `6px solid ${C.ink}`}}>
          <div style={{height: 54, background: C.ink, display: 'flex', alignItems: 'center', gap: 14, paddingLeft: 24}}>
            {[C.red, '#F5C542', '#5BBF6A'].map((c) => <div key={c} style={{width: 18, height: 18, borderRadius: '50%', background: c}} />)}
          </div>
          <OffthreadVideo src={staticFile('tela-inicial.mp4')} muted style={{width: '100%', display: 'block'}} />
        </div>
      </Pop>
      <Pop delay={24}><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 46, color: C.ink, opacity: 0.75}}>versão beta</div></Pop>
    </Center>
  </Fade>
);

const Sub: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, letterSpacing: -2, color: C.ink}}>{children}</div>
);

const List1: React.FC = () => (
  <Fade dur={L1}>
    <Center gap={30}>
      <Pop delay={2}><Sub>Tudo em <Hi>um lugar só</Hi></Sub></Pop>
      <Card n={1} t="Escolher o produto" delay={14} />
      <Card n={2} t="Criar seus vídeos" delay={26} />
      <Card n={3} t="Fazer legenda e roteiro" delay={38} />
      <Card n={4} t="Disparar seus criativos" sub="direto pra venda" delay={50} />
      <Card n={5} t="Organizar sua rotina" delay={62} />
      <Card n={6} t="Ver o que vendeu" delay={74} />
    </Center>
  </Fade>
);

const Offer: React.FC = () => (
  <Fade dur={OFFER}>
    <Center gap={50}>
      <Pop delay={2}><Pill bg={C.ink}>SÓ 10 VAGAS</Pill></Pop>
      <Pop delay={8}><Title size={104}>Você testa<br /><Hi>de graça</Hi><br />durante o beta</Title></Pop>
      <Pop delay={18}><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 50, color: C.ink, opacity: 0.75}}>e me conta o que achou</div></Pop>
    </Center>
  </Fade>
);

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: C.orange}}>
    <Fade dur={CTA}>
      <Center gap={52}>
        <Pop delay={2}>
          <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, letterSpacing: -2, lineHeight: 1.05, color: C.white}}>Comenta <span style={{color: C.ink}}>BETA</span></div>
        </Pop>
        <Pop delay={10}>
          <div style={{width: 440, height: 440, borderRadius: '50%', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Corgi size={360} />
          </div>
        </Pop>
        <Pop delay={18}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.ink}}>que eu te chamo no direct</div></Pop>
        <Pop delay={26}><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, color: C.white}}>@miyuflix + @afiliadamiyu</div></Pop>
      </Center>
    </Fade>
  </AbsoluteFill>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / TOTAL) * 100}%`, background: C.orangeDark}} />;
};

export const Beta: React.FC = () => (
  <AbsoluteFill style={{background: C.cream}}>
    <Dots />
    <Sequence from={0} durationInFrames={HOOK}><Hook /></Sequence>
    <Sequence from={HOOK} durationInFrames={APP}><App /></Sequence>
    <Sequence from={HOOK + APP} durationInFrames={L1}><List1 /></Sequence>
    <Sequence from={HOOK + APP + L1} durationInFrames={OFFER}><Offer /></Sequence>
    <Sequence from={HOOK + APP + L1 + OFFER} durationInFrames={CTA}><Cta /></Sequence>
    <Progress />
  </AbsoluteFill>
);
