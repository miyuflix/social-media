import React from 'react';
import {AbsoluteFill, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Paleta Pistache
const C = {pistache: '#DDEFC9', ink: '#18392B', pink: '#FF5A87', green: '#2E7D5B', white: '#FFFFFF', card: '#EEF7E4', dark: '#1B3A2E', orange: '#F28C38', corgiPink: '#F7A8B8'};
const SANS = 'Bricolage, Inter, sans-serif';
const SERIF = 'FrauncesX, serif';

const fontCss = `
@font-face { font-family: 'Bricolage'; src: url('${staticFile('BricolageGrotesque-Bold.ttf')}') format('truetype'); font-weight: 100 900; }
@font-face { font-family: 'FrauncesX'; src: url('${staticFile('fraunces-latin-600-normal.woff2')}') format('woff2'); font-weight: 100 900; }
`;

const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.6}});
};

const Pop: React.FC<{delay?: number; children: React.ReactNode}> = ({delay = 0, children}) => {
  const s = usePop(delay);
  return <div style={{transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.4)}}>{children}</div>;
};

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Center: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 48}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: 90, gap, textAlign: 'center'}}>{children}</AbsoluteFill>
);

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = [[120, 260, 9, C.green], [930, 340, 11, C.pink], [180, 1500, 10, C.pink], [900, 1650, 9, C.green], [520, 140, 7, C.green], [980, 1050, 8, C.pink], [80, 900, 8, C.green], [600, 1820, 9, C.pink]] as const;
  return (
    <AbsoluteFill>
      {dots.map(([x, y, r, c], i) => (
        <div key={i} style={{position: 'absolute', left: x - r, top: y - r + Math.sin(frame / 20 + i) * 18, width: r * 2, height: r * 2, borderRadius: '50%', background: c, opacity: 0.55}} />
      ))}
    </AbsoluteFill>
  );
};

const Rich: React.FC<{text: string; hi?: string}> = ({text, hi = C.pink}) => {
  const lines = text.split('\n');
  return <>{lines.map((ln, li) => <React.Fragment key={li}>{ln.split('*').map((seg, si) => si % 2 ? <span key={si} style={{fontFamily: SERIF, fontStyle: 'italic', color: hi, letterSpacing: -1}}>{seg}</span> : <React.Fragment key={si}>{seg}</React.Fragment>)}{li < lines.length - 1 ? <br /> : null}</React.Fragment>)}</>;
};

const Corgi: React.FC<{size?: number}> = ({size = 360}) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 > 64;
  const ear = Math.sin(frame / 6) * 4;
  const fy = Math.sin(frame / 8) * 8;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translateY(${fy}px)`}}>
      <g transform={`rotate(${-ear} 60 70)`}><polygon points="40,90 55,22 90,70" fill={C.orange} /><polygon points="50,80 58,40 80,70" fill={C.corgiPink} /></g>
      <g transform={`rotate(${ear} 140 70)`}><polygon points="160,90 145,22 110,70" fill={C.orange} /><polygon points="150,80 142,40 120,70" fill={C.corgiPink} /></g>
      <ellipse cx="100" cy="112" rx="70" ry="62" fill={C.orange} />
      <path d="M100 70 C 85 100, 60 130, 70 160 Q 100 182 130 160 C 140 130, 115 100, 100 70 Z" fill={C.white} />
      {blink ? (<><rect x="66" y="106" width="18" height="4" rx="2" fill={C.ink} /><rect x="116" y="106" width="18" height="4" rx="2" fill={C.ink} /></>) : (
        <><circle cx="75" cy="108" r="8" fill={C.ink} /><circle cx="125" cy="108" r="8" fill={C.ink} /><circle cx="78" cy="105" r="2.5" fill={C.white} /><circle cx="128" cy="105" r="2.5" fill={C.white} /></>
      )}
      <ellipse cx="62" cy="128" rx="9" ry="6" fill={C.corgiPink} opacity="0.8" /><ellipse cx="138" cy="128" rx="9" ry="6" fill={C.corgiPink} opacity="0.8" />
      <ellipse cx="100" cy="132" rx="9" ry="7" fill={C.ink} />
      <path d="M92 144 Q 100 152 108 144" stroke={C.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};

const CorgiBadge: React.FC<{size: number; bg: string}> = ({size, bg}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Corgi size={size * 0.78} /></div>
);

const Pill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{background: C.pink, color: C.white, fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 2, padding: '16px 40px', borderRadius: 999}}>{children}</div>
);

const Card: React.FC<{n: number; t: string; sub?: string; delay: number; onWhite: boolean}> = ({n, t, sub, delay, onWhite}) => (
  <Pop delay={delay}>
    <div style={{background: onWhite ? C.card : C.white, border: `3px solid ${onWhite ? '#CFE5BC' : '#C5E0AE'}`, borderRadius: 32, padding: '26px 40px', display: 'flex', alignItems: 'center', gap: 32, width: 880, textAlign: 'left'}}>
      <div style={{flex: 'none', width: 84, height: 84, borderRadius: '50%', background: C.pink, color: C.white, fontFamily: SANS, fontWeight: 700, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{n}</div>
      <div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 54, color: C.ink, letterSpacing: -1, lineHeight: 1.1}}>{t}</div>
        {sub && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: C.ink, opacity: 0.6, marginTop: 6}}>{sub}</div>}
      </div>
    </div>
  </Pop>
);

type SceneT = {type: 'hook' | 'big' | 'cards' | 'cta'; dur: number; pill?: string; title: string; size?: number; sub?: string; cards?: {t: string; s?: string}[]};
export type GenProps = {scenes: SceneT[]; startWhite?: boolean};

const Scene: React.FC<{s: SceneT; white: boolean}> = ({s, white}) => {
  if (s.type === 'cta') return (
    <AbsoluteFill style={{background: C.dark}}>
      <Fade dur={s.dur}>
        <Center gap={50}>
          <Pop delay={2}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: s.size ?? 104, letterSpacing: -2, lineHeight: 1.05, color: C.white}}><Rich text={s.title} hi={C.pink} /></div></Pop>
          <Pop delay={10}><CorgiBadge size={440} bg={C.pistache} /></Pop>
          {s.sub ? <Pop delay={18}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.white, lineHeight: 1.25}}><Rich text={s.sub} hi={C.pink} /></div></Pop> : null}
          <Pop delay={26}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.pistache}}>@miyuflix</div></Pop>
        </Center>
      </Fade>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{background: white ? C.white : C.pistache}}>
      <Dots />
      <Fade dur={s.dur}>
        <Center gap={s.type === 'cards' ? 30 : 50}>
          {s.pill ? <Pop delay={0}><Pill>{s.pill}</Pill></Pop> : null}
          <Pop delay={4}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: s.size ?? (s.type === 'cards' ? 92 : 104), letterSpacing: -2, lineHeight: 1.08, color: C.ink}}><Rich text={s.title} /></div></Pop>
          {s.sub ? <Pop delay={12}><div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.ink, opacity: 0.7, lineHeight: 1.3}}><Rich text={s.sub} /></div></Pop> : null}
          {s.type === 'cards' && s.cards ? s.cards.map((c, i) => <Card key={i} n={i + 1} t={c.t} sub={c.s} delay={14 + i * 12} onWhite={white} />) : null}
          {s.type === 'hook' ? <Pop delay={12}><CorgiBadge size={330} bg={C.green} /></Pop> : null}
        </Center>
      </Fade>
    </AbsoluteFill>
  );
};

export const totalOf = (p: GenProps) => p.scenes.reduce((a, s) => a + s.dur, 0);

export const Gen: React.FC<GenProps> = ({scenes, startWhite = false}) => {
  const frame = useCurrentFrame();
  const total = totalOf({scenes});
  let acc = 0;
  let k = 0;
  return (
    <AbsoluteFill style={{background: startWhite ? C.white : C.pistache}}>
      <style>{fontCss}</style>
      {scenes.map((s, i) => {
        const from = acc; acc += s.dur;
        const white = s.type === 'cta' ? false : (k++ % 2 === 0) === startWhite;
        return <Sequence key={i} from={from} durationInFrames={s.dur}><Scene s={s} white={white} /></Sequence>;
      })}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / total) * 100}%`, background: C.pink}} />
    </AbsoluteFill>
  );
};
