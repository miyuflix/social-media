import React from 'react';
import {
  AbsoluteFill, Img, Sequence, interpolate, spring, staticFile,
  useCurrentFrame, useVideoConfig, delayRender, continueRender,
} from 'remotion';

// Pistache: fundo verde-pistache, texto verde-floresta, destaque rosa-chiclete. Corgi continua laranja.
const C = { cream: '#DDEFC9', orange: '#F28C38', orangeDark: '#FF5A87', ink: '#18392B', pink: '#F7A8B8', white: '#FFFFFF', red: '#FF5A87', green: '#2E7D5B' };
const FONT = 'Bricolage, sans-serif';
const SERIF = 'FrauncesIt, serif';
const fontHandle = delayRender('fonts');
Promise.all([
  ...[500, 700, 800].map((w) => new FontFace('Bricolage', `url(${staticFile(`bricolage-grotesque-latin-${w}-normal.woff2`)})`, { weight: String(w) }).load()),
  ...[700, 900].map((w) => new FontFace('FrauncesIt', `url(${staticFile(`fraunces-latin-${w}-italic.woff2`)})`, { weight: String(w), style: 'italic' }).load()),
]).then((fs) => { fs.forEach((f) => (document.fonts as any).add(f)); continueRender(fontHandle); });
const Hi: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 800, color: C.red, letterSpacing: -1 }}>{children}</span>
);

export type Prod = { n?: number; img: string; name: string; price: string; from?: boolean; off?: string; sales?: string; tag?: string; bullets?: string[] };
export type Props = {
  photo: string;          // arquivo em public/ (ex.: afiliada-sorrindo.png)
  tag: string;            // pílula do gancho
  title: string;          // \n quebra linha, *palavra* = destaque rosa itálico
  sub: string;
  products: Prod[];       // 1 produto = vídeo de produto único; 3-4 = lista
  ctaTitle: string;
  ctaSub: string;
};

export const HOOK = 80;
export const CTA = 85;
export const perOf = (n: number) => (n === 1 ? 210 : 95);
export const totalOf = (p: Props) => HOOK + perOf(p.products.length) * p.products.length + CTA;
const rt = (t: string) => t.split('*').map((x, i) => (i % 2 ? <Hi key={i}>{x}</Hi> : x));

const usePop = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.6 } });
  return { transform: `scale(${0.6 + 0.4 * s}) translateY(${(1 - s) * 60}px)`, opacity: Math.min(1, s * 1.4) };
};

const Pop: React.FC<{ delay?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay = 0, children, style }) => {
  const p = usePop(delay);
  return <div style={{ ...style, ...p }}>{children}</div>;
};

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Dots: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = Array.from({ length: 14 }, (_, i) => ({
    x: (i * 173) % 1080, y: (i * 389) % 1920, r: 40 + (i % 4) * 22, c: i % 2 ? C.green : C.red,
  }));
  return (
    <AbsoluteFill>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', left: d.x, top: d.y + Math.sin((frame + i * 20) / 30) * 30,
          width: d.r, height: d.r, borderRadius: '50%', background: d.c, opacity: 0.10,
        }} />
      ))}
    </AbsoluteFill>
  );
};

const Corgi: React.FC<{ size?: number }> = ({ size = 360 }) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 > 64;
  const ear = Math.sin(frame / 6) * 4;
  const float = Math.sin(frame / 8) * 12;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: `translateY(${float}px)` }}>
      <g transform={`rotate(${-ear} 60 70)`}>
        <polygon points="35,85 55,20 85,70" fill={C.orange} />
        <polygon points="47,75 57,38 75,68" fill={C.pink} />
      </g>
      <g transform={`rotate(${ear} 140 70)`}>
        <polygon points="165,85 145,20 115,70" fill={C.orange} />
        <polygon points="153,75 143,38 125,68" fill={C.pink} />
      </g>
      <ellipse cx="100" cy="115" rx="72" ry="62" fill={C.orange} />
      <ellipse cx="100" cy="140" rx="44" ry="34" fill={C.white} />
      <path d="M100 62 L88 120 L112 120 Z" fill={C.white} />
      {blink ? (
        <>
          <rect x="64" y="104" width="18" height="4" rx="2" fill={C.ink} />
          <rect x="118" y="104" width="18" height="4" rx="2" fill={C.ink} />
        </>
      ) : (
        <>
          <circle cx="73" cy="106" r="8" fill={C.ink} />
          <circle cx="127" cy="106" r="8" fill={C.ink} />
          <circle cx="75" cy="103" r="2.5" fill={C.white} />
          <circle cx="129" cy="103" r="2.5" fill={C.white} />
        </>
      )}
      <ellipse cx="100" cy="128" rx="10" ry="7" fill={C.ink} />
      <path d="M90 142 Q100 152 110 142" stroke={C.ink} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="55" cy="130" r="9" fill={C.pink} opacity="0.8" />
      <circle cx="145" cy="130" r="9" fill={C.pink} opacity="0.8" />
    </svg>
  );
};

const Pill: React.FC<{ bg: string; children: React.ReactNode; size?: number }> = ({ bg, children, size = 40 }) => (
  <div style={{ background: bg, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: '14px 34px', borderRadius: 999, letterSpacing: 1 }}>{children}</div>
);

const Hook: React.FC<{ photo: string; tag: string; title: string; sub: string }> = ({ photo, tag, title, sub }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, HOOK], [1.0, 1.06]);
  return (
    <Fade dur={HOOK}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <Img src={staticFile(photo)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 20%', transform: `scale(${zoom})` }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'flex-end' }}>
        <Pop delay={4}>
          <div style={{ background: C.cream, borderRadius: '56px 56px 0 0', padding: '60px 80px 110px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
            <Pill bg={C.red}>{tag}</Pill>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: -3, lineHeight: 1.02, textAlign: 'center', color: C.ink, whiteSpace: 'pre-line' }}>
              {rt(title)}
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 44, color: C.ink, opacity: 0.75, textAlign: 'center' }}>{sub}</div>
          </div>
        </Pop>
      </AbsoluteFill>
    </Fade>
  );
};

const Product: React.FC<{ p: Prod; per: number }> = ({ p, per }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, per], [1.0, 1.08]);
  const single = !!p.bullets?.length;
  return (
    <Fade dur={per}>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: single ? 150 : 240, gap: single ? 30 : 40 }}>
        <Pop delay={0} style={{ position: 'relative' }}>
          <div style={{ width: single ? 820 : 900, height: single ? 820 : 900, borderRadius: 40, overflow: 'hidden', background: C.white, boxShadow: '0 24px 60px rgba(43,27,18,0.18)', border: `10px solid ${C.white}` }}>
            <Img src={staticFile(p.img)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, borderRadius: 30 }} />
          </div>
          {p.n !== undefined && <div style={{ position: 'absolute', top: -40, left: -30, width: 150, height: 150, borderRadius: '50%', background: C.green, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 88, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `8px solid ${C.cream}` }}>{p.n}</div>}
          {p.off && <div style={{ position: 'absolute', top: -20, right: -20 }}><Pill bg={C.red} size={46}>{p.off}</Pill></div>}
          {p.tag && <div style={{ position: 'absolute', bottom: -30, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><Pill bg={C.ink} size={38}>{p.tag}</Pill></div>}
        </Pop>
        <Pop delay={8} style={{ marginTop: 20 }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, letterSpacing: -2, color: C.ink, textAlign: 'center' }}>{p.name}</div>
        </Pop>
        <Pop delay={14} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {p.from && <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.ink, opacity: 0.7, marginBottom: 6 }}>a partir de</div>}
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 900, fontSize: 140, letterSpacing: -2, color: C.red, lineHeight: 1 }}>{p.price}</div>
        </Pop>
        {p.sales && <Pop delay={20}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.ink, opacity: 0.7 }}>{p.sales}</div>
        </Pop>}
        {p.bullets?.slice(0, 3).map((b, i) => (
          <Pop key={i} delay={60 + i * 25}>
            <div style={{ background: C.white, borderRadius: 28, padding: '18px 36px', fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.ink, display: 'flex', alignItems: 'center', gap: 18, boxShadow: '0 10px 30px rgba(24,57,43,0.10)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill={C.green} /><path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {b}
            </div>
          </Pop>
        ))}
      </AbsoluteFill>
    </Fade>
  );
};

const Cta: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <Fade dur={CTA}>
    <AbsoluteFill style={{ background: C.cream, alignItems: 'center', justifyContent: 'center', padding: 90, gap: 50 }}>
      <Pop delay={0}>
        <div style={{ width: 440, height: 440, borderRadius: '50%', background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Corgi size={340} /></div>
      </Pop>
      <Pop delay={8}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 100, letterSpacing: -2, lineHeight: 1.05, color: C.ink, textAlign: 'center', whiteSpace: 'pre-line' }}>{rt(title)}</div>
      </Pop>
      <Pop delay={16}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.ink, textAlign: 'center', whiteSpace: 'pre-line' }}>{sub}</div>
      </Pop>
    </AbsoluteFill>
  </Fade>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / durationInFrames) * 100}%`, background: C.red }} />;
};

export const Achadinhos: React.FC<Props> = (props) => {
  const { products } = props;
  const per = perOf(products.length);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Dots />
      <Sequence durationInFrames={HOOK}><Hook photo={props.photo} tag={props.tag} title={props.title} sub={props.sub} /></Sequence>
      {products.map((p, i) => (
        <Sequence key={i} from={HOOK + i * per} durationInFrames={per}><Product p={p} per={per} /></Sequence>
      ))}
      <Sequence from={HOOK + products.length * per} durationInFrames={CTA}><Cta title={props.ctaTitle} sub={props.ctaSub} /></Sequence>
      <Progress />
    </AbsoluteFill>
  );
};
