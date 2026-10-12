import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Identidade @afiliadamiyu: "caderno de afiliada" — papel, tinta, verde e marca-texto
const P = {paper: '#F4F1EA', ink: '#161616', green: '#1F6F5C', marker: '#F2DC5D', line: '#D9D3C4', red: '#C2412D', white: '#FFFFFF'};
const SANS = 'Inter, sans-serif';
const MONO = '"DejaVu Sans Mono", monospace';
const HANDLE = '@afiliadamiyu';

const Pop: React.FC<{delay?: number; children: React.ReactNode}> = ({delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, mass: 0.7}});
  return <div style={{transform: `translateY(${(1 - s) * 40}px)`, opacity: Math.min(1, s * 1.3)}}>{children}</div>;
};

const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

// Marca-texto que "pinta" a palavra
const Mark: React.FC<{children: React.ReactNode; delay?: number; color?: string; still?: boolean}> = ({children, delay = 0, color = P.marker, still = false}) => {
  const frame = useCurrentFrame();
  const w = still ? 100 : interpolate(frame, [delay, delay + 14], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <span style={{backgroundImage: `linear-gradient(${color}, ${color})`, backgroundSize: `${w}% 42%`, backgroundPosition: '0 85%', backgroundRepeat: 'no-repeat', padding: '0 6px', whiteSpace: 'nowrap'}}>
      {children}
    </span>
  );
};

const Lines: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 79px, ${P.line} 79px, ${P.line} 80px)`, opacity: 0.55}}>
    <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 3, background: P.red, opacity: 0.35}} />
  </AbsoluteFill>
);

const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = P.green}) => (
  <div style={{fontFamily: MONO, fontSize: 34, letterSpacing: 4, color, fontWeight: 700}}>{children}</div>
);

const H: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 96, color = P.ink}) => (
  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.08, color}}>{children}</div>
);

const Sub: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 44}) => (
  <div style={{fontFamily: SANS, fontWeight: 500, fontSize: size, color: P.ink, opacity: 0.7, lineHeight: 1.3}}>{children}</div>
);

const Left: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 40}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: '0 110px 0 130px', display: 'flex', flexDirection: 'column', gap}}>{children}</AbsoluteFill>
);

const Check: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const frame = useCurrentFrame();
  const on = frame > delay + 10;
  return (
    <Pop delay={delay}>
      <div style={{display: 'flex', alignItems: 'center', gap: 32}}>
        <div style={{width: 72, height: 72, border: `5px solid ${P.ink}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? P.green : 'transparent', borderColor: on ? P.green : P.ink}}>
          {on && (
            <svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke={P.white} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, color: P.ink}}>{text}</div>
      </div>
    </Pop>
  );
};

const Icon: React.FC<{ok: boolean}> = ({ok}) => (
  <div style={{width: 84, height: 84, borderRadius: '50%', background: ok ? P.green : P.red, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width="48" height="48" viewBox="0 0 24 24">
      {ok ? <path d="M4 12.5l5 5L20 6.5" stroke={P.white} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M6 6l12 12M18 6L6 18" stroke={P.white} strokeWidth="3.4" strokeLinecap="round" />}
    </svg>
  </div>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position: 'absolute', bottom: 0, left: 0, height: 14, width: `${(frame / durationInFrames) * 100}%`, background: P.green}} />;
};

const Handle: React.FC<{color?: string}> = ({color = P.ink}) => (
  <div style={{position: 'absolute', bottom: 90, left: 130, fontFamily: MONO, fontSize: 32, color, opacity: 0.6}}>{HANDLE}</div>
);

// ---------- Reels 1: apresentação (18 s) ----------
export const AfiliadaIntro: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}>
    <Lines />

    <Sequence from={0} durationInFrames={80}>
      <Fade dur={80}>
        <Left>
          <Pop><Label>CADERNO DE AFILIADA · PÁG. 01</Label></Pop>
          <Pop delay={6}><H size={104}>Esse perfil é o meu caderno de afiliada, <Mark delay={22}>aberto</Mark></H></Pop>
        </Left>
      </Fade>
    </Sequence>

    <Sequence from={80} durationInFrames={95}>
      <Fade dur={95}>
        <Left>
          <Pop><H size={96}>Sou afiliada Shopee de <Mark delay={14}>moda feminina</Mark></H></Pop>
          <Pop delay={20}><Sub size={52}>na vida real. Não sou guru.</Sub></Pop>
        </Left>
      </Fade>
    </Sequence>

    <Sequence from={175} durationInFrames={125}>
      <Fade dur={125}>
        <Left gap={44}>
          <Pop><Label>O QUE EU TESTO AQUI</Label></Pop>
          <Check text="Produto" delay={10} />
          <Check text="Horário" delay={26} />
          <Check text="Vídeo" delay={42} />
          <Check text="Comissão" delay={58} />
        </Left>
      </Fade>
    </Sequence>

    <Sequence from={300} durationInFrames={115}>
      <Fade dur={115}>
        <Left gap={56}>
          <Pop><H size={92}>E te conto <Mark delay={12}>tudo</Mark>:</H></Pop>
          <Pop delay={20}><div style={{display: 'flex', alignItems: 'center', gap: 32}}><Icon ok /><H size={64}>o que dá certo</H></div></Pop>
          <Pop delay={34}><div style={{display: 'flex', alignItems: 'center', gap: 32}}><Icon ok={false} /><H size={64}>o que dá errado</H></div></Pop>
          <Pop delay={50}><Sub size={52}>sem filtro.</Sub></Pop>
        </Left>
      </Fade>
    </Sequence>

    <Sequence from={415} durationInFrames={125}>
      <Fade dur={125}>
        <AbsoluteFill style={{background: P.green}}>
          <Left>
            <Pop><Label color={P.marker}>PRÓXIMA PÁGINA</Label></Pop>
            <Pop delay={6}><H size={100} color={P.paper}>Me segue se você também tá <Mark delay={20} color={P.ink}><span style={{color: P.marker}}>construindo isso</span></Mark></H></Pop>
            <Pop delay={30}><div style={{fontFamily: MONO, fontSize: 44, color: P.paper, opacity: 0.9}}>{HANDLE}</div></Pop>
          </Left>
        </AbsoluteFill>
      </Fade>
    </Sequence>

    <Progress />
  </AbsoluteFill>
);

// ---------- Carrossel 3: enquete da dor (1080×1350) ----------
const SLIDES = [
  {kind: 'capa'},
  {n: '1', t: 'Escolher produto pra divulgar', s: 'rolar a Shopee atrás do produto certo'},
  {n: '2', t: 'Gravar e editar vídeo todo dia', s: 'roteiro, gravação e edição'},
  {n: '3', t: 'Escrever legenda e hashtag', s: 'pensar no texto de cada post'},
  {n: '4', t: 'Acompanhar o que vendeu', s: 'abrir relatório e tentar entender'},
  {kind: 'fim'},
] as const;

export const AfiliadaEnquete: React.FC<{slide: number}> = ({slide}) => {
  const d = SLIDES[slide] as any;
  const counter = <div style={{position: 'absolute', top: 80, right: 100, fontFamily: MONO, fontSize: 30, color: d.kind === 'fim' ? P.paper : P.ink, opacity: 0.6}}>{slide + 1}/6</div>;

  if (d.kind === 'capa') {
    return (
      <AbsoluteFill style={{background: P.paper}}>
        <Lines />
        {counter}
        <Left>
          <Label>ENQUETE · PÁG. 02</Label>
          <H size={108}>O que mais toma <Mark still>tempo</Mark> de quem é afiliada?</H>
          <Sub>Arrasta e me conta a sua</Sub>
        </Left>
        <Handle />
      </AbsoluteFill>
    );
  }
  if (d.kind === 'fim') {
    return (
      <AbsoluteFill style={{background: P.green}}>
        {counter}
        <Left>
          <Label color={P.marker}>SUA VEZ</Label>
          <H size={112} color={P.paper}>Qual é a sua?</H>
          <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 96, color: P.marker}}>1 · 2 · 3 · 4</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 52, color: P.paper, opacity: 0.85, lineHeight: 1.3}}>Comenta o número. Tô juntando as respostas pra uma ideia.</div>
        </Left>
        <Handle color={P.paper} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: P.paper}}>
      <Lines />
      {counter}
      <Left gap={36}>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 220, color: P.green, lineHeight: 1}}>{d.n}</div>
        <H size={96}>{d.t}</H>
        <Sub size={46}>{d.s}</Sub>
      </Left>
      <Handle />
    </AbsoluteFill>
  );
};
