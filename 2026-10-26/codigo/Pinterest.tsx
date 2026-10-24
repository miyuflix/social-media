import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {cream: '#FFF4E6', orange: '#F28C38', orangeDark: '#D9661A', ink: '#2B1B12', pink: '#F7A8B8', white: '#FFFFFF', red: '#D64545'};
const FONT = 'Inter, sans-serif';

const HOOK = 90, DATA = 95, CON = 160, MARK = 160, PAY = 80, CTA = 95;
export const TOTAL = HOOK + DATA + CON + MARK + PAY + CTA;

const Pop: React.FC<{delay?: number; children: React.ReactNode}> = ({delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.6}});
  return <div style={{transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.4)}}>{children}</div>;
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
  const d = [[120, 260, 70, C.orange], [930, 340, 90, C.pink], [180, 1500, 110, C.pink], [900, 1650, 80, C.orange], [520, 140, 50, C.pink], [980, 1050, 60, C.orange], [80, 900, 55, C.orange], [600, 1820, 65, C.pink]] as const;
  return <AbsoluteFill>{d.map(([x, y, r, c], i) => <div key={i} style={{position: 'absolute', left: x - r, top: y - r + Math.sin(frame / 20 + i) * 18, width: r * 2, height: r * 2, borderRadius: '50%', background: c, opacity: 0.12}} />)}</AbsoluteFill>;
};
const Pill: React.FC<{bg: string; children: React.ReactNode}> = ({bg, children}) => (
  <div style={{background: bg, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 2, padding: '18px 40px', borderRadius: 999}}>{children}</div>
);
const Title: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 100, color = C.ink}) => (
  <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.05, color}}>{children}</div>
);
const Hi: React.FC<{children: React.ReactNode; c?: string}> = ({children, c = C.orangeDark}) => <span style={{color: c}}>{children}</span>;
const Small: React.FC<{children: React.ReactNode; o?: number}> = ({children, o = 0.75}) => (
  <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 46, color: C.ink, opacity: o, lineHeight: 1.3}}>{children}</div>
);

const Corgi: React.FC<{size?: number}> = ({size = 360}) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 > 64;
  const ear = Math.sin(frame / 6) * 4;
  const fy = Math.sin(frame / 8) * 12;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translateY(${fy}px)`}}>
      <g transform={`rotate(${-ear} 60 70)`}><polygon points="40,90 55,22 90,70" fill={C.orange} /><polygon points="50,80 58,40 80,70" fill={C.pink} /></g>
      <g transform={`rotate(${ear} 140 70)`}><polygon points="160,90 145,22 110,70" fill={C.orange} /><polygon points="150,80 142,40 120,70" fill={C.pink} /></g>
      <ellipse cx="100" cy="112" rx="70" ry="62" fill={C.orange} />
      <path d="M100 70 C 85 100, 60 130, 70 160 Q 100 182 130 160 C 140 130, 115 100, 100 70 Z" fill={C.white} />
      {blink ? (<><rect x="66" y="106" width="18" height="4" rx="2" fill={C.ink} /><rect x="116" y="106" width="18" height="4" rx="2" fill={C.ink} /></>) : (
        <><circle cx="75" cy="108" r="8" fill={C.ink} /><circle cx="125" cy="108" r="8" fill={C.ink} /><circle cx="78" cy="105" r="2.5" fill={C.white} /><circle cx="128" cy="105" r="2.5" fill={C.white} /></>)}
      <ellipse cx="62" cy="128" rx="9" ry="6" fill={C.pink} opacity="0.8" /><ellipse cx="138" cy="128" rx="9" ry="6" fill={C.pink} opacity="0.8" />
      <ellipse cx="100" cy="132" rx="9" ry="7" fill={C.ink} />
      <path d="M92 144 Q 100 152 108 144" stroke={C.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

const Card: React.FC<{n: number; t: React.ReactNode; sub?: string; delay: number}> = ({n, t, sub, delay}) => (
  <Pop delay={delay}>
    <div style={{background: C.white, borderRadius: 32, boxShadow: '0 12px 36px rgba(43,27,18,0.10)', padding: '28px 40px', display: 'flex', alignItems: 'center', gap: 32, width: 900, textAlign: 'left'}}>
      <div style={{flex: 'none', width: 88, height: 88, borderRadius: '50%', background: C.orange, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
      <div>
        <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.ink, letterSpacing: -1}}>{t}</div>
        {sub && <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 36, color: C.ink, opacity: 0.65, marginTop: 6}}>{sub}</div>}
      </div>
    </div>
  </Pop>
);
const Arrow = () => <span style={{color: C.orangeDark}}> › </span>;

const Hook = () => (
  <Fade dur={HOOK}><Center gap={52}>
    <Pop delay={2}><Pill bg={C.orangeDark}>NOVIDADE</Pill></Pop>
    <Pop delay={8}><Title size={108}>Sua Shopee<br />agora vende<br />no <Hi>Pinterest</Hi></Title></Pop>
    <Pop delay={18}><Corgi size={340} /></Pop>
  </Center></Fade>
);
const Data = () => (
  <Fade dur={DATA}><Center gap={40}>
    <Pop delay={2}><Small>buscas por</Small></Pop>
    <Pop delay={6}><Title size={84}>"inspiração de look"</Title></Pop>
    <Pop delay={14}><Title size={260}><Hi>+281%</Hi></Title></Pop>
    <Pop delay={22}><Small>no Brasil, em um ano</Small></Pop>
    <Pop delay={30}><div style={{fontFamily: FONT, fontWeight: 600, fontSize: 32, color: C.ink, opacity: 0.5}}>Fonte: Pinterest</div></Pop>
  </Center></Fade>
);
const Con = () => (
  <Fade dur={CON}><Center gap={36}>
    <Pop delay={2}><Pill bg={C.ink}>PASSO 1</Pill></Pop>
    <Pop delay={8}><Title size={96}>Liga as <Hi>contas</Hi></Title></Pop>
    <Pop delay={12}><Small o={0.6}>no app do Pinterest</Small></Pop>
    <Card n={1} delay={20} t={<>Perfil<Arrow />Configurações</>} />
    <Card n={2} delay={34} t={<>Conectar ao Pinterest</>} sub="escolhe Shopee" />
    <Card n={3} delay={48} t={<>Vincular contas</>} sub="entra na Shopee e toca em Permitir" />
  </Center></Fade>
);
const Mark = () => (
  <Fade dur={MARK}><Center gap={36}>
    <Pop delay={2}><Pill bg={C.ink}>PASSO 2</Pill></Pop>
    <Pop delay={8}><Title size={96}>Marca o produto<br />no <Hi>Pin</Hi></Title></Pop>
    <Card n={1} delay={20} t="Marcar produtos" sub="na hora de criar o Pin" />
    <Card n={2} delay={34} t="Busca e escolhe Shopee" sub="como fonte, embaixo da busca" />
    <Card n={3} delay={48} t="Seleciona e toca Feito" sub="dá pra marcar mais de um no +" />
  </Center></Fade>
);
const Pay = () => (
  <Fade dur={PAY}><Center gap={44}>
    <Pop delay={2}><Title size={104}>Seu ID de<br />afiliada entra<br /><Hi>sozinho</Hi></Title></Pop>
    <Pop delay={14}><Small>sem copiar e colar nada</Small></Pop>
  </Center></Fade>
);
const Cta = () => (
  <Fade dur={CTA}>
    <AbsoluteFill style={{background: C.orange}} />
    <Center gap={50}>
      <Pop delay={2}><div style={{width: 440, height: 440, borderRadius: '50%', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Corgi size={330} /></div></Pop>
      <Pop delay={10}><Title size={100}>Salva e testa hoje</Title></Pop>
      <Pop delay={18}><div style={{background: C.ink, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 48, padding: '24px 54px', borderRadius: 999}}>manda pra amiga afiliada</div></Pop>
    </Center>
  </Fade>
);

const Progress = () => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / TOTAL) * 100}%`, background: C.orangeDark}} />;
};

export const Pinterest: React.FC = () => {
  let t = 0;
  const seq = (d: number, el: React.ReactNode) => { const s = <Sequence from={t} durationInFrames={d}>{el}</Sequence>; t += d; return s; };
  return (
    <AbsoluteFill style={{background: C.cream}}>
      <Dots />
      {seq(HOOK, <Hook />)}
      {seq(DATA, <Data />)}
      {seq(CON, <Con />)}
      {seq(MARK, <Mark />)}
      {seq(PAY, <Pay />)}
      {seq(CTA, <Cta />)}
      <Progress />
    </AbsoluteFill>
  );
};
