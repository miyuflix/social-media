import React from 'react';
import {AbsoluteFill, Sequence, staticFile, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const C = {cream: '#FFF4E6', orange: '#F28C38', orangeDark: '#D9661A', ink: '#2B1B12', pink: '#F7A8B8', white: '#FFFFFF', red: '#D64545'};
const FONT = 'Inter, sans-serif';

const HOOK = 90;
const PROB = 75;
const S1 = 90;
const S2 = 165;
const RES = 90;
const RULE = 90;
const CTA = 120;
export const TOTAL = HOOK + PROB + S1 + S2 + RES + RULE + CTA;

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


const Sandal: React.FC<{w?: number}> = ({w = 420}) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 200 124">
    <rect x="14" y="58" width="172" height="50" rx="25" fill="#E9B8B8" />
    <rect x="14" y="78" width="172" height="30" rx="15" fill="#D99A9A" />
    <rect x="40" y="36" width="44" height="48" rx="12" fill="#F4CFCB" stroke="#D99A9A" strokeWidth="3" />
    <rect x="104" y="36" width="44" height="48" rx="12" fill="#F4CFCB" stroke="#D99A9A" strokeWidth="3" />
    <rect x="54" y="48" width="16" height="10" rx="2" fill="none" stroke="#C9A24A" strokeWidth="4" />
    <rect x="118" y="48" width="16" height="10" rx="2" fill="none" stroke="#C9A24A" strokeWidth="4" />
  </svg>
);

const AdCard: React.FC = () => (
  <div style={{width: 640, background: C.white, borderRadius: 32, boxShadow: '0 20px 50px rgba(43,27,18,0.15)', padding: 40, textAlign: 'left'}}>
    <div style={{height: 380, background: '#F6F6F6', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Sandal w={440} /></div>
    <div style={{fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.ink, marginTop: 24}}>Sandália papete feminina</div>
    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.orangeDark, marginTop: 6}}>R$ 49,90</div>
  </div>
);

const Hook: React.FC = () => (
  <Fade dur={HOOK}>
    <Center gap={50}>
      <Pop delay={0}><Pill bg={C.orangeDark}>AFILIADA SHOPEE</Pill></Pop>
      <Pop delay={4}><Title size={96}>O prompt que<br />transforma <Hi>print<br />de anúncio</Hi> em<br />foto que vende</Title></Pop>
      <Pop delay={12}><Corgi size={300} /></Pop>
    </Center>
  </Fade>
);

const Prob: React.FC = () => (
  <Fade dur={PROB}>
    <Center gap={50}>
      <Pop delay={2}><Title size={92}>Foto de fundo branco<br /><Hi c={C.red}>ninguém para<br />pra ver</Hi></Title></Pop>
      <Pop delay={10}><div style={{transform: 'scale(0.8)'}}><AdCard /></div></Pop>
    </Center>
  </Fade>
);

const Step1: React.FC = () => (
  <Fade dur={S1}>
    <Center gap={48}>
      <Pop delay={2}><Pill bg={C.ink}>PASSO 1</Pill></Pop>
      <Pop delay={6}><Title size={96}>Tira print<br />do <Hi>anúncio</Hi></Title></Pop>
      <Pop delay={14}><AdCard /></Pop>
    </Center>
  </Fade>
);

const PROMPT = 'Foto realista estilo UGC, em primeira pessoa, a minha mão segurando esse produto, luz natural de janela, casa de verdade. O produto tem que ficar idêntico ao da foto.';
const Step2: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [24, 120], [0, PROMPT.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const tags = ['/POV-UGC', '/NA-MÃO', '/LUZ-DE-JANELA'];
  return (
    <Fade dur={S2}>
      <Center gap={44}>
        <Pop delay={2}><Pill bg={C.ink}>PASSO 2</Pill></Pop>
        <Pop delay={6}><Title size={88}>Cola na IA com<br /><Hi>esse prompt</Hi></Title></Pop>
        <Pop delay={14}>
          <div style={{width: 940, background: '#1E1714', borderRadius: 36, padding: 40, textAlign: 'left', boxShadow: '0 24px 60px rgba(43,27,18,0.25)'}}>
            <div style={{display: 'flex', gap: 24, alignItems: 'center'}}>
              <div style={{width: 150, height: 150, borderRadius: 20, background: '#F6F6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Sandal w={130} /></div>
              <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 30, color: '#BFAFA5'}}>print-do-anuncio.png</div>
            </div>
            <div style={{fontFamily: FONT, fontWeight: 600, fontSize: 40, lineHeight: 1.35, color: C.white, marginTop: 30, minHeight: 330}}>{PROMPT.slice(0, n)}<span style={{opacity: frame % 20 < 10 ? 1 : 0}}>|</span></div>
            <div style={{display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10}}>
              {tags.map((t, i) => <Pop key={t} delay={124 + i * 8}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 40, color: C.ink, background: C.orange, padding: '10px 22px', borderRadius: 16}}>{t}</div></Pop>)}
            </div>
          </div>
        </Pop>
      </Center>
    </Fade>
  );
};

const UgcPhoto: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.25 + 0.1 * Math.sin(frame / 10);
  return (
    <div style={{width: 760, height: 900, borderRadius: 36, overflow: 'hidden', position: 'relative', background: 'linear-gradient(160deg, #F7DCE0 0%, #EBC3C9 60%, #D9A8B0 100%)', boxShadow: '0 24px 60px rgba(43,27,18,0.2)'}}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: -200 + i * 170, top: -100, width: 70, height: 1400, background: '#FFFFFF', opacity: glow, transform: 'rotate(28deg)'}} />)}
      <div style={{position: 'absolute', left: 90, top: 300, transform: 'rotate(-14deg)'}}><Sandal w={540} /></div>
      <svg width="760" height="900" viewBox="0 0 760 900" style={{position: 'absolute', left: 0, top: 0}}>
        {/* manga de tricô creme, como a blusa da personagem */}
        <path d="M560 560 L760 700 L760 900 L600 900 L470 650 Z" fill="#EDE4DA" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${505 + i * 22} ${600 + i * 6} L${640 + i * 22} ${900}`} stroke="#DCCFC2" strokeWidth="6" />)}
        <path d="M470 650 L560 560 L585 585 L495 678 Z" fill="#E2D6C8" />
        {/* mão */}
        <ellipse cx="470" cy="560" rx="105" ry="78" fill="#DDA88E" transform="rotate(-38 470 560)" />
        <rect x="300" y="590" width="150" height="48" rx="24" fill="#D39A80" transform="rotate(-20 375 614)" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`rotate(${-48 + i * 6} ${440} ${520 + i * 30})`}>
            <rect x={310 + i * 6} y={492 + i * 34} width="140" height="44" rx="22" fill="#DDA88E" stroke="#C48A70" strokeWidth="4" />
            <ellipse cx={330 + i * 6} cy={514 + i * 34} rx="15" ry="13" fill="#E8B4AC" />
          </g>
        ))}
        <path d="M520 520 Q470 520 455 560" stroke="#C98E74" strokeWidth="4" fill="none" strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', right: 24, bottom: 20, fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.ink, opacity: 0.6}}>ilustração</div>
    </div>
  );
};

const Res: React.FC = () => (
  <Fade dur={RES}>
    <Center gap={44}>
      <Pop delay={2}><Pill bg={C.ink}>PASSO 3</Pill></Pop>
      <Pop delay={6}><Title size={88}>Pronto: foto<br />de <Hi>quem usa</Hi></Title></Pop>
      <Pop delay={14}><UgcPhoto /></Pop>
    </Center>
  </Fade>
);

const Rule: React.FC = () => (
  <Fade dur={RULE}>
    <Center gap={34}>
      <Pop delay={2}><Pill bg={C.red}>ANTES DE POSTAR</Pill></Pop>
      <Pop delay={6}><Title size={92}>2 regras pra<br /><Hi c={C.red}>não levar punição</Hi></Title></Pop>
      <Card n={1} t="Igual ao anúncio" sub="mesma cor, modelo e detalhes" delay={16} />
      <Card n={2} t="Marca como IA" sub="na hora de publicar o vídeo" delay={30} />
    </Center>
  </Fade>
);

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: C.orange}}>
    <Fade dur={CTA}>
      <Center gap={52}>
        <Pop delay={2}><div style={{fontFamily: FONT, fontWeight: 900, fontSize: 112, letterSpacing: -2, lineHeight: 1.05, color: C.white}}>Comenta <span style={{color: C.ink}}>PROMPT</span></div></Pop>
        <Pop delay={10}><div style={{width: 440, height: 440, borderRadius: '50%', background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Corgi size={360} /></div></Pop>
        <Pop delay={18}><div style={{fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.ink}}>que eu te mando ele<br />completo no direct</div></Pop>
        <Pop delay={26}><div style={{fontFamily: FONT, fontWeight: 700, fontSize: 42, color: C.white}}>@miyuflix</div></Pop>
      </Center>
    </Fade>
  </AbsoluteFill>
);
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position: 'absolute', left: 0, bottom: 0, height: 14, width: `${(frame / TOTAL) * 100}%`, background: C.orangeDark}} />;
};

export const Prompt: React.FC = () => {
  const s = [HOOK, PROB, S1, S2, RES, RULE, CTA];
  const at = (i: number) => s.slice(0, i).reduce((a, b) => a + b, 0);
  const comps = [Hook, Prob, Step1, Step2, Res, Rule, Cta];
  return (
    <AbsoluteFill style={{background: C.cream}}>
      <Dots />
      {comps.map((Comp, i) => <Sequence key={i} from={at(i)} durationInFrames={s[i]}><Comp /></Sequence>)}
      <Progress />
    </AbsoluteFill>
  );
};
