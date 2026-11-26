import React from 'react';
import {
  AbsoluteFill, OffthreadVideo, Sequence, staticFile, spring, interpolate,
  useCurrentFrame, useVideoConfig,
} from 'remotion';
import { Corgi } from './Corgi';
import './fonts';
import { TIKTOK_SEGS, TIKTOK_VIDEO_END } from './tiktokTiming';

const C = { dark: '#1C3A2E', mid: '#2E7D5B', light: '#DCEFC9', pink: '#E8457A', pinkSoft: '#F59BB5', white: '#FFFFFF' };
const FONT = 'Inter, sans-serif';
const SERIF = 'Lora, serif';
const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
const END_CARD = 1.8;
export const TIKTOK_FRAMES = s(TIKTOK_VIDEO_END + END_CARD);
const shadow = '0 18px 50px rgba(28,58,46,0.30)';

const Em: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.pink }) => (
  <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, color, letterSpacing: -1 }}>{children}</span>
);

const Pop: React.FC<{ delay?: number; children: React.ReactNode }> = ({ delay = 0, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: { damping: 12, mass: 0.6 } });
  return <div style={{ transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`, opacity: Math.min(1, p * 1.4) }}>{children}</div>;
};

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, dur - 6, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

// TikTok safe area: keep away from right icons (~140px) and bottom caption (~420px)
const Zone: React.FC<{ top?: number; children: React.ReactNode }> = ({ top = 1010, children }) => (
  <div style={{ position: 'absolute', top, left: 60, width: 860, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>{children}</div>
);

const Pill: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <div style={{ background: bg, color: C.white, fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 2, padding: '14px 30px', borderRadius: 999, boxShadow: shadow }}>{children}</div>
);

const Big: React.FC<{ bg: string; color: string; children: React.ReactNode; size?: number }> = ({ bg, color, children, size = 84 }) => (
  <div style={{ background: bg, borderRadius: 36, padding: '34px 44px', boxShadow: shadow, maxWidth: 860 }}>
    <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, letterSpacing: -2, color, lineHeight: 1.06 }}>{children}</div>
  </div>
);

const Feature: React.FC<{ n: number; title: string; sub: string; dur: number }> = ({ n, title, sub, dur }) => (
  <Fade dur={dur}>
    <Zone>
      <Pop><Pill bg={C.dark}>O QUE A MIYU FAZ · {n}/4</Pill></Pop>
      <Pop delay={6}>
        <div style={{ background: C.white, borderRadius: 32, padding: '32px 40px', display: 'flex', alignItems: 'center', gap: 30, boxShadow: shadow, width: 860 }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: C.mid, color: C.white, fontFamily: FONT, fontWeight: 900, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{n}</div>
          <div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.dark, letterSpacing: -1, lineHeight: 1.08 }}>{title}</div>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600, fontSize: 40, color: C.pink, marginTop: 6 }}>{sub}</div>
          </div>
        </div>
      </Pop>
    </Zone>
  </Fade>
);

const TalkingHead: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const idx = Math.max(0, TIKTOK_SEGS.findIndex(([a, b]) => t >= a && t < b));
  const zoom = idx % 2 === 1 ? 1.1 : 1.0;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', background: C.light }}>
      <OffthreadVideo src={staticFile('tiktok.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: '50% 28%' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(28,58,46,0.4) 100%)' }} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: C.dark, opacity: o, alignItems: 'center', justifyContent: 'center', gap: 46 }}>
      <Pop><div style={{ width: 400, height: 400, borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Corgi size={340} /></div></Pop>
      <Pop delay={6}><div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 108, color: C.white, letterSpacing: -2, textAlign: 'center', lineHeight: 1.04 }}>Comenta<br /><Em color={C.pinkSoft}>QUERO</Em></div></Pop>
      <Pop delay={12}><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: C.light }}>@miyuafiliadas</div></Pop>
    </AbsoluteFill>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [0, TIKTOK_FRAMES], [0, 1080]);
  return <div style={{ position: 'absolute', top: 0, left: 0, height: 12, width: w, background: C.pink }} />;
};

export const MiyuTikTok: React.FC = () => {
  const seq = (i: number) => ({ from: s(TIKTOK_SEGS[i][0]), dur: s(TIKTOK_SEGS[i][1]) - s(TIKTOK_SEGS[i][0]) });
  const S = (i: number, el: (dur: number) => React.ReactNode) => (
    <Sequence key={i} from={seq(i).from} durationInFrames={seq(i).dur}>{el(seq(i).dur)}</Sequence>
  );
  return (
    <AbsoluteFill style={{ background: C.light }}>
      <Sequence durationInFrames={s(TIKTOK_VIDEO_END)}><TalkingHead /></Sequence>
      {S(0, (d) => (
        <Fade dur={d}><Zone top={980}>
          <Pop><Pill bg={C.pink}>AFILIADA SHOPEE</Pill></Pop>
          <Pop delay={5}><Big bg={C.light} color={C.dark} size={96}>Faz tudo<br /><Em>sozinha</Em>?</Big></Pop>
        </Zone></Fade>
      ))}
      {S(1, (d) => (
        <Fade dur={d}><Zone top={1000}>
          <Pop><div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <div style={{ width: 170, height: 170, borderRadius: '50%', background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow }}><Corgi size={150} /></div>
            <Big bg={C.dark} color={C.white} size={88}>Essa é a <Em color={C.pinkSoft}>Miyu</Em></Big>
          </div></Pop>
          <Pop delay={8}><div style={{ background: C.white, borderRadius: 999, padding: '14px 30px', fontFamily: FONT, fontWeight: 600, fontSize: 36, color: C.dark, boxShadow: shadow }}>o app da afiliada Shopee</div></Pop>
        </Zone></Fade>
      ))}
      {S(2, (d) => <Feature n={1} title="Catálogo por comissão" sub="em dois cliques" dur={d} />)}
      {S(3, (d) => <Feature n={2} title="Vitrine em pastas" sub="por tipo de produto" dur={d} />)}
      {S(4, (d) => <Feature n={3} title="Legenda, roteiro e vídeo" sub="na hora de postar" dur={d} />)}
      {S(5, (d) => <Feature n={4} title="Vendas e comissão" sub="numa tela só" dur={d} />)}
      {S(6, (d) => (
        <Fade dur={d}><Zone top={960}>
          <Pop><Big bg={C.dark} color={C.white} size={78}>Feita pra quem<br /><Em color={C.pinkSoft}>não é</Em> de tecnologia</Big></Pop>
          <Pop delay={s(2.2)}><div style={{ background: C.white, borderRadius: 28, padding: '22px 34px', boxShadow: shadow, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: C.mid, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={40} height={40} viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 46, color: C.dark }}>“é bem fácil de usar”</div>
              <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 30, color: C.dark, opacity: 0.6 }}>primeira afiliada do beta</div>
            </div>
          </div></Pop>
        </Zone></Fade>
      ))}
      {S(7, (d) => (
        <Fade dur={d}><Zone top={1000}>
          <Pop><Pill bg={C.pink}>BETA GRATUITO</Pill></Pop>
          <Pop delay={6}><Big bg={C.light} color={C.dark} size={92}>Comenta <Em>QUERO</Em></Big></Pop>
          <Pop delay={12}><div style={{ background: C.dark, borderRadius: 999, padding: '14px 30px', fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.white }}>e segue @miyuafiliadas</div></Pop>
        </Zone></Fade>
      ))}
      <Sequence from={s(TIKTOK_VIDEO_END)} durationInFrames={s(END_CARD)}><EndCard /></Sequence>
      <Progress />
    </AbsoluteFill>
  );
};
