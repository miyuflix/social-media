import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// Identidade @afiliadamiyu: caderno de afiliada
const P = {paper: '#F4F1EA', ink: '#161616', green: '#1F6F5C', marker: '#F2DC5D', line: '#D9D3C4', red: '#C2412D', white: '#FFFFFF'};
const SANS = 'Inter, sans-serif';
const MONO = "'DejaVu Sans Mono', monospace";
const HANDLE = '@afiliadamiyu';

const Pop: React.FC<{delay?: number; children: React.ReactNode}> = ({delay = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, mass: 0.7}});
  return <div style={{transform: `translateY(${(1 - s) * 40}px)`, opacity: Math.min(1, s * 1.3)}}>{children}</div>;
};
const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
const Mark: React.FC<{children: React.ReactNode; delay?: number; color?: string}> = ({children, delay = 0, color = P.marker}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 12], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <span style={{backgroundImage: `linear-gradient(${color}, ${color})`, backgroundSize: `${w}% 42%`, backgroundPosition: '0 85%', backgroundRepeat: 'no-repeat', padding: '0 6px'}}>{children}</span>;
};
const Lines: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 79px, ${P.line} 79px, ${P.line} 80px)`, opacity: 0.55}}>
    <div style={{position: 'absolute', left: 80, top: 0, bottom: 0, width: 3, background: P.red, opacity: 0.35}} />
  </AbsoluteFill>
);
const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = P.green}) => (
  <div style={{fontFamily: MONO, fontSize: 36, letterSpacing: 4, color, fontWeight: 700}}>{children}</div>
);
const H: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 100, color = P.ink}) => (
  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: size, letterSpacing: -2, lineHeight: 1.08, color}}>{children}</div>
);
const Sub: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 50, color = P.ink}) => (
  <div style={{fontFamily: SANS, fontWeight: 600, fontSize: size, color, opacity: 0.72, lineHeight: 1.3}}>{children}</div>
);
const Left: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 40}) => (
  <AbsoluteFill style={{justifyContent: 'center', padding: '0 100px 0 130px', display: 'flex', flexDirection: 'column', gap}}>{children}</AbsoluteFill>
);
const Icon: React.FC<{ok: boolean; size?: number}> = ({ok, size = 76}) => (
  <div style={{flex: 'none', width: size, height: size, borderRadius: '50%', background: ok ? P.green : P.red, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24">
      {ok ? <path d="M4 12.5l5 5L20 6.5" stroke={P.white} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M6 6l12 12M18 6L6 18" stroke={P.white} strokeWidth="3.4" strokeLinecap="round" />}
    </svg>
  </div>
);
const Row: React.FC<{ok: boolean; text: string; delay: number; size?: number}> = ({ok, text, delay, size = 60}) => (
  <Pop delay={delay}><div style={{display: 'flex', alignItems: 'center', gap: 30}}><Icon ok={ok} /><div style={{fontFamily: SANS, fontWeight: 800, fontSize: size, color: P.ink, letterSpacing: -1}}>{text}</div></div></Pop>
);
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <div style={{position: 'absolute', bottom: 0, left: 0, height: 14, width: `${(frame / durationInFrames) * 100}%`, background: P.green}} />;
};
const Handle: React.FC<{color?: string}> = ({color = P.ink}) => (
  <div style={{position: 'absolute', bottom: 90, left: 130, fontFamily: MONO, fontSize: 32, color, opacity: 0.6}}>{HANDLE}</div>
);

// Cena comum: o que a Miyu faz
const MiyuFaz: React.FC<{dur: number; title?: React.ReactNode}> = ({dur, title}) => (
  <Fade dur={dur}><Left gap={34}>
    <Pop><Label>CONHEÇA A MIYU</Label></Pop>
    <Pop delay={4}><H size={84}>{title ?? <>Tudo num <Mark delay={14}>lugar só</Mark>:</>}</H></Pop>
    <Row ok text="escolhe o produto" delay={16} />
    <Row ok text="cria vídeo, roteiro e legenda" delay={28} size={54} />
    <Row ok text="dispara seus criativos" delay={40} />
    <Row ok text="organiza sua rotina" delay={52} />
    <Row ok text="mostra o que vendeu" delay={64} />
  </Left></Fade>
);
// Cena comum: CTA beta
const CtaBeta: React.FC<{dur: number}> = ({dur}) => (
  <Fade dur={dur}>
    <AbsoluteFill style={{background: P.green}}>
      <Left gap={44}>
        <Pop><Label color={P.marker}>BETA GRÁTIS</Label></Pop>
        <Pop delay={6}><H size={120} color={P.paper}>Só <span style={{color: P.marker}}>10 vagas</span></H></Pop>
        <Pop delay={16}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 26, background: P.paper, borderRadius: 26, padding: '26px 44px'}}>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 56, color: P.ink}}>Comenta</div>
            <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 74, color: P.paper, background: P.ink, borderRadius: 14, padding: '4px 22px'}}>BETA</div>
          </div>
        </Pop>
        <Pop delay={26}><Sub size={50} color={P.paper}>que eu te chamo no direct</Sub></Pop>
      </Left>
      <Handle color={P.paper} />
    </AbsoluteFill>
  </Fade>
);

const Seq: React.FC<{items: [number, React.FC<{dur: number}>][]}> = ({items}) => {
  let t = 0;
  return <>{items.map(([d, C], i) => { const s = <Sequence key={i} from={t} durationInFrames={d}><C dur={d} /></Sequence>; t += d; return s; })}</>;
};
const total = (items: [number, unknown][]) => items.reduce((a, [d]) => a + d, 0);

// ================= Reels A: quantos apps =================
const APPS = ['app da Shopee', 'pesquisa de produto', 'editor de vídeo', 'IA pra legenda', 'bloco de notas', 'planilha de vendas'];
const A_items: [number, React.FC<{dur: number}>][] = [
  [80, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><Label color={P.red}>SEJA SINCERA</Label></Pop>
      <Pop delay={5}><H size={112}>Quantos apps você abre pra postar <Mark delay={22}>1 vídeo</Mark>?</H></Pop>
    </Left></Fade>
  )],
  [150, ({dur}) => {
    const frame = useCurrentFrame();
    const shown = Math.min(APPS.length, Math.floor(frame / 16) + 1);
    return (
      <Fade dur={dur}>
        <AbsoluteFill style={{padding: '360px 100px 0 130px', display: 'flex', flexDirection: 'column', gap: 22}}>
          {APPS.map((a, i) => (
            <Pop key={a} delay={i * 16}>
              <div style={{display: 'flex', alignItems: 'center', gap: 24, background: P.white, borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,.07)', padding: '24px 34px', transform: `rotate(${(i % 2 ? 1 : -1) * 1.2}deg)`}}>
                <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 40, color: P.green}}>{i + 1}</div>
                <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: P.ink}}>{a}</div>
              </div>
            </Pop>
          ))}
          <div style={{position: 'absolute', right: 100, bottom: 260, fontFamily: SANS, fontWeight: 900, fontSize: 220, color: P.red, letterSpacing: -6}}>{shown}</div>
        </AbsoluteFill>
      </Fade>
    );
  }],
  [80, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={120}><span style={{color: P.red}}>6 apps.</span><br />1 vídeo.</H></Pop>
      <Pop delay={18}><Sub size={58}>E se fosse um <Mark delay={30}>lugar só</Mark>?</Sub></Pop>
    </Left></Fade>
  )],
  [130, ({dur}) => <MiyuFaz dur={dur} />],
  [100, ({dur}) => <CtaBeta dur={dur} />],
];
export const A_TOTAL = total(A_items);
export const ReelApps: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}><Lines /><Seq items={A_items} /><Sequence durationInFrames={A_TOTAL - 100}><Handle /></Sequence><Progress /></AbsoluteFill>
);

// ================= Reels B: você não é preguiçosa =================
const B_items: [number, React.FC<{dur: number}>][] = [
  [70, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={124}>Você não é <Mark delay={14}>preguiçosa</Mark>.</H></Pop>
    </Left></Fade>
  )],
  [80, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={112}>Você tá fazendo o trabalho de <span style={{color: P.red}}>5 pessoas</span>.</H></Pop>
    </Left></Fade>
  )],
  [130, ({dur}) => (
    <Fade dur={dur}><Left gap={34}>
      <Pop><Label color={P.red}>TODO DIA, SOZINHA</Label></Pop>
      <Row ok={false} text="escolhe o produto" delay={8} />
      <Row ok={false} text="grava" delay={20} />
      <Row ok={false} text="edita" delay={32} />
      <Row ok={false} text="escreve a legenda" delay={44} />
      <Row ok={false} text="confere o relatório" delay={56} />
    </Left></Fade>
  )],
  [70, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={112}>Por isso eu criei a <Mark delay={12}>Miyu</Mark></H></Pop>
      <Pop delay={16}><Sub size={52}>a ferramenta pra afiliadas</Sub></Pop>
    </Left></Fade>
  )],
  [130, ({dur}) => <MiyuFaz dur={dur} title={<>Ela faz <Mark delay={14}>com você</Mark>:</>} />],
  [100, ({dur}) => <CtaBeta dur={dur} />],
];
export const B_TOTAL = total(B_items);
export const ReelPreguica: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}><Lines /><Seq items={B_items} /><Sequence durationInFrames={B_TOTAL - 100}><Handle /></Sequence><Progress /></AbsoluteFill>
);

// ================= Reels C: o que eu posto hoje? =================
const C_items: [number, React.FC<{dur: number}>][] = [
  [80, ({dur}) => {
    const frame = useCurrentFrame();
    const txt = '"O que eu posto hoje?"';
    const n = Math.floor(interpolate(frame, [4, 40], [0, txt.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
    return (
      <Fade dur={dur}><Left>
        <Pop><Label color={P.red}>TODO SANTO DIA</Label></Pop>
        <H size={116}>{txt.slice(0, n)}<span style={{opacity: frame % 20 < 10 ? 1 : 0}}>|</span></H>
      </Left></Fade>
    );
  }],
  [90, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={100}>Se você <Mark delay={10}>trava</Mark> nessa pergunta, o problema não é você.</H></Pop>
    </Left></Fade>
  )],
  [80, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={112}>É não ter uma <span style={{color: P.green}}>rotina pronta</span>.</H></Pop>
    </Left></Fade>
  )],
  [130, ({dur}) => <MiyuFaz dur={dur} title={<>A Miyu te diz o <Mark delay={14}>próximo passo</Mark>:</>} />],
  [80, ({dur}) => (
    <Fade dur={dur}><Left>
      <Pop><H size={108}>Quer testar <Mark delay={12}>antes</Mark> de todo mundo?</H></Pop>
    </Left></Fade>
  )],
  [100, ({dur}) => <CtaBeta dur={dur} />],
];
export const C_TOTAL = total(C_items);
export const ReelPostoHoje: React.FC = () => (
  <AbsoluteFill style={{background: P.paper}}><Lines /><Seq items={C_items} /><Sequence durationInFrames={C_TOTAL - 100}><Handle /></Sequence><Progress /></AbsoluteFill>
);
