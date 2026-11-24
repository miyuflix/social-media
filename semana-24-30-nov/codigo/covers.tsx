import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, Card, Check, Corgi, Fonts, SANS, SERIF, Title} from './common';

// Tudo que importa fica no miolo 1080x1440 (o grid do perfil corta em 3:4)
const Safe: React.FC<{children: React.ReactNode; gap?: number; style?: React.CSSProperties}> = ({children, gap = 40, style}) => (
  <AbsoluteFill style={{top: 240, bottom: 240, padding: '0 90px', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap, ...style}}>
    {children}
  </AbsoluteFill>
);
const Base: React.FC<{bg: string; children: React.ReactNode}> = ({bg, children}) => (
  <AbsoluteFill style={{background: bg}}>
    <Fonts />
    {children}
  </AbsoluteFill>
);
const Kicker: React.FC<{children: React.ReactNode; color: string}> = ({children, color}) => (
  <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 4, color}}>{children}</div>
);
const Badge: React.FC<{size?: number}> = ({size = 260}) => (
  <div style={{width: size, height: size, borderRadius: '50%', background: C.pistache, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 40px rgba(0,0,0,0.15)'}}>
    <Corgi size={size * 0.78} />
  </div>
);

/* 24 · rosa, caderno inclinado · hook grande */
export const Cover24: React.FC = () => (
  <Base bg={C.pink}>
    <Safe gap={44}>
      <div style={{transform: 'rotate(-3deg)', width: 900, background: C.white, borderRadius: 28, padding: '60px 56px 70px 110px', position: 'relative',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)'}}>
        <div style={{position: 'absolute', left: 70, top: 0, bottom: 0, width: 4, background: C.pink, opacity: 0.6}} />
        <div style={{display: 'inline-block', background: C.pink, color: C.white, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 3, padding: '12px 28px', borderRadius: 999}}>DIÁRIO DA MIYU #3</div>
        <div style={{marginTop: 36}}><Title text="Por que a Miyu tá *de graça* agora?" size={112} align="left" /></div>
      </div>
      <Badge size={190} />
    </Safe>
  </Base>
);

/* 25 · branco, número gigante */
export const Cover25: React.FC = () => (
  <Base bg={C.white}>
    <Safe gap={10}>
      <Kicker color={C.green}>BLACK FRIDAY · 27/11</Kicker>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 440, color: C.pink, lineHeight: 0.95}}>1</div>
      <Title text="nicho só" size={150} />
      <div style={{display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', marginTop: 40}}>
        {['Eletrônicos', 'Beleza', 'Moda', 'Casa'].map((n, i) => (
          <div key={n} style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, padding: '16px 30px', borderRadius: 999,
            background: i === 1 ? C.pink : C.pistache, color: i === 1 ? C.white : C.ink, textDecoration: i === 1 ? 'none' : 'line-through'}}>{n}</div>
        ))}
      </div>
    </Safe>
  </Base>
);

/* 26 · verde, checklist */
export const Cover26: React.FC = () => (
  <Base bg={C.green}>
    <Safe gap={50}>
      <Title text="Checklist da *véspera*" size={120} color={C.white} hl={C.pistache} />
      <Card style={{width: 860, padding: 50}}>
        {['3 vídeos gravados', 'Legendas prontas', 'Links separados'].map((t, i) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 30, padding: '22px 0', borderTop: i ? '3px dashed rgba(24,57,43,0.15)' : 'none'}}>
            <Check on={i < 2 ? 1 : 0} size={72} />
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 54, color: C.ink}}>{t}</div>
          </div>
        ))}
      </Card>
      <Kicker color={C.pistache}>FAZ HOJE À NOITE</Kicker>
    </Safe>
  </Base>
);

/* 27 · escuro, valor gigante */
export const Cover27: React.FC = () => (
  <Base bg={C.ink}>
    <Safe gap={0}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 3, background: C.pink, color: C.white, padding: '16px 34px', borderRadius: 999, marginBottom: 40}}>HOJE É BLACK FRIDAY</div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 120, color: C.pistache}}>R$</div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 420, letterSpacing: -14, color: C.pistache, lineHeight: 0.85}}>23</div>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 150, color: C.pink, lineHeight: 1.1}}>milhões</div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 56, color: C.white, marginTop: 20}}>em cupons na Shopee</div>
    </Safe>
  </Base>
);

/* 28 · pistache, calendário · hook grande */
export const Cover28: React.FC = () => {
  const cells = Array.from({length: 35}, (_, i) => i - 1);
  return (
    <Base bg={C.pistache}>
      <Safe gap={50}>
        <Title text="A Black passou. *Dezembro* começa na terça." size={118} />
        <Card style={{width: 700, padding: 30, transform: 'rotate(2deg)'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8}}>
            {cells.map((d, i) => {
              const ok = d >= 1 && d <= 31;
              return (
                <div key={i} style={{height: 62, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 26,
                  background: !ok ? 'transparent' : d === 1 ? C.pink : '#F1F4EE', color: d === 1 ? C.white : C.ink, opacity: ok ? 1 : 0}}>{ok ? d : ''}</div>
              );
            })}
          </div>
        </Card>
      </Safe>
    </Base>
  );
};

/* 29 · rosa, ícones de produto */
const Ico: React.FC<{k: string}> = ({k}) => (
  <svg width="110" height="110" viewBox="0 0 48 48" fill="none" stroke={C.pink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    {k === 'fone' && (<><path d="M10 28v-4a14 14 0 0 1 28 0v4" /><rect x="7" y="28" width="8" height="12" rx="3" /><rect x="33" y="28" width="8" height="12" rx="3" /></>)}
    {k === 'carregador' && (<><rect x="14" y="6" width="20" height="24" rx="4" /><path d="M24 30v6a6 6 0 0 1-6 6" /><path d="M26 12l-4 7h5l-4 7" /></>)}
    {k === 'som' && (<><rect x="12" y="6" width="24" height="36" rx="5" /><circle cx="24" cy="28" r="7" /><circle cx="24" cy="14" r="3" /></>)}
  </svg>
);
export const Cover29: React.FC = () => (
  <Base bg={C.pink}>
    <Safe gap={50}>
      <Kicker color={C.white}>SEGUNDA · 30/11</Kicker>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 170, color: C.white, lineHeight: 0.95, textAlign: 'center', letterSpacing: -4}}>
        Cyber<br /><span style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, color: C.ink}}>Monday</span>
      </div>
      <div style={{display: 'flex', gap: 28}}>
        {['fone', 'carregador', 'som'].map((k) => (
          <div key={k} style={{width: 220, height: 220, borderRadius: 40, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Ico k={k} /></div>
        ))}
      </div>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 54, color: C.white}}>3 produtos pra separar hoje</div>
    </Safe>
  </Base>
);

/* 30 · dividido, antes x depois · hook grande */
export const Cover30: React.FC = () => (
  <Base bg={C.white}>
    <AbsoluteFill style={{flexDirection: 'row'}}>
      <div style={{flex: 1, background: '#EDEDED'}} />
      <div style={{flex: 1, background: C.green}} />
    </AbsoluteFill>
    <Safe gap={44}>
      <Badge size={220} />
      <div style={{background: C.white, borderRadius: 36, padding: '50px 50px 60px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', width: 920, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
        <div style={{background: C.ink, color: C.white, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 3, padding: '12px 28px', borderRadius: 999}}>NOVEMBRO ACABA HOJE</div>
        <Title text="Em dezembro você vai fazer tudo *sozinha* de novo?" size={100} />
      </div>
    </Safe>
  </Base>
);
