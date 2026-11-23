import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export const C = {
  pistache: '#DDEFC9',
  ink: '#18392B',
  pink: '#FF5A87',
  green: '#2E7D5B',
  white: '#FFFFFF',
  orange: '#F28C38',
  orangeDark: '#D9661A',
  cream: '#FFF4E6',
};

export const SANS = 'Brico, Inter, sans-serif';
export const SERIF = 'FrauncesI, serif';

export const Fonts: React.FC = () => (
  <style>{`
    @font-face{font-family:Brico;font-weight:500;src:url(${staticFile('bricolage-grotesque-latin-500-normal.woff2')})}
    @font-face{font-family:Brico;font-weight:700;src:url(${staticFile('bricolage-grotesque-latin-700-normal.woff2')})}
    @font-face{font-family:Brico;font-weight:800;src:url(${staticFile('bricolage-grotesque-latin-800-normal.woff2')})}
    @font-face{font-family:FrauncesI;font-style:italic;font-weight:700;src:url(${staticFile('fraunces-latin-700-italic.woff2')})}
  `}</style>
);

export const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 12, mass: 0.6}});
};

export const Pop: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
  const s = usePop(delay);
  return (
    <div style={{transform: `scale(${0.85 + 0.15 * s}) translateY(${(1 - s) * 40}px)`, opacity: Math.min(1, s), ...style}}>
      {children}
    </div>
  );
};

export const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Center: React.FC<{children: React.ReactNode; gap?: number; style?: React.CSSProperties}> = ({children, gap = 46, style}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 90, gap, flexDirection: 'column', ...style}}>
    {children}
  </AbsoluteFill>
);

// Title: parts wrapped in *asterisks* become the Fraunces italic highlight
export const Title: React.FC<{text: string; size?: number; color?: string; hl?: string; align?: 'center' | 'left'}> = ({
  text, size = 100, color = C.ink, hl = C.pink, align = 'center',
}) => {
  const parts = text.split('*');
  return (
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: -2, color, textAlign: align}}>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, color: hl, letterSpacing: -1}}>{p}</span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </div>
  );
};

export const Sub: React.FC<{children: React.ReactNode; color?: string; size?: number; align?: 'center' | 'left'}> = ({children, color = C.ink, size = 44, align = 'center'}) => (
  <div style={{fontFamily: SANS, fontWeight: 500, fontSize: size, lineHeight: 1.25, color, opacity: 0.8, textAlign: align}}>{children}</div>
);

export const Tag: React.FC<{children: React.ReactNode; bg?: string; color?: string}> = ({children, bg = C.ink, color = C.white}) => (
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 2, background: bg, color, padding: '16px 34px', borderRadius: 999}}>
    {children}
  </div>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: C.white, borderRadius: 36, boxShadow: '0 18px 50px rgba(24,57,43,0.14)', padding: 48, ...style}}>{children}</div>
);

export const Dots: React.FC<{color1?: string; color2?: string}> = ({color1 = C.green, color2 = C.pink}) => {
  const frame = useCurrentFrame();
  const pts = [
    [120, 260, 40, color1], [930, 180, 28, color2], [980, 1500, 46, color1], [90, 1650, 30, color2],
    [820, 980, 20, color2], [200, 980, 22, color1], [600, 120, 18, color1], [500, 1800, 24, color2],
  ] as const;
  return (
    <AbsoluteFill>
      {pts.map(([x, y, r, c], i) => (
        <div key={i} style={{position: 'absolute', left: x, top: y + Math.sin(frame / 20 + i) * 14, width: r * 2, height: r * 2, borderRadius: '50%', background: c, opacity: 0.13}} />
      ))}
    </AbsoluteFill>
  );
};

export const Progress: React.FC<{total: number; color?: string}> = ({total, color = C.pink}) => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / total) * 100}%`, background: color}} />;
};

export const Corgi: React.FC<{size?: number}> = ({size = 360}) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 > 64;
  const ear = Math.sin(frame / 6) * 4;
  const fy = Math.sin(frame / 8) * 12;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{transform: `translateY(${fy}px)`}}>
      <g transform={`rotate(${-ear} 55 60)`}>
        <polygon points="30,95 50,20 90,70" fill={C.orange} />
        <polygon points="45,82 54,40 76,68" fill="#F7A8B8" />
      </g>
      <g transform={`rotate(${ear} 145 60)`}>
        <polygon points="170,95 150,20 110,70" fill={C.orange} />
        <polygon points="155,82 146,40 124,68" fill="#F7A8B8" />
      </g>
      <ellipse cx="100" cy="112" rx="72" ry="64" fill={C.orange} />
      <path d="M100 70 C 80 110, 58 140, 70 165 C 85 180, 115 180, 130 165 C 142 140, 120 110, 100 70 Z" fill="#fff" />
      {blink ? (
        <>
          <rect x="62" y="106" width="20" height="4" rx="2" fill="#2B1B12" />
          <rect x="118" y="106" width="20" height="4" rx="2" fill="#2B1B12" />
        </>
      ) : (
        <>
          <circle cx="72" cy="108" r="8" fill="#2B1B12" />
          <circle cx="128" cy="108" r="8" fill="#2B1B12" />
        </>
      )}
      <ellipse cx="100" cy="132" rx="10" ry="7" fill="#2B1B12" />
      <path d="M90 145 Q100 154 110 145" stroke="#2B1B12" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="55" cy="135" rx="11" ry="7" fill="#F7A8B8" opacity="0.8" />
      <ellipse cx="145" cy="135" rx="11" ry="7" fill="#F7A8B8" opacity="0.8" />
    </svg>
  );
};

export const Check: React.FC<{on: number; size?: number; color?: string}> = ({on, size = 70, color = C.green}) => (
  <div style={{width: size, height: size, borderRadius: 18, border: `6px solid ${color}`, background: on > 0.5 ? color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" style={{opacity: on}}>
      <path d="M4 12.5 L10 18 L20 6" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// CTA: dark-green panel with corgi inside a light circle
export const CTA: React.FC<{title: string; sub?: string; bg?: string}> = ({title, sub, bg = C.green}) => (
  <AbsoluteFill style={{background: bg}}>
    <Center gap={50}>
      <Pop>
        <div style={{width: 440, height: 440, borderRadius: '50%', background: C.pistache, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Corgi size={330} />
        </div>
      </Pop>
      <Pop delay={8}>
        <Title text={title} color={C.white} hl={C.pistache} size={96} />
      </Pop>
      {sub ? (
        <Pop delay={16}>
          <Sub color={C.white} size={44}>{sub}</Sub>
        </Pop>
      ) : null}
    </Center>
  </AbsoluteFill>
);
