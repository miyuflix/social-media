import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {C, Card, Center, Check, CTA, Dots, Fade, Fonts, Pop, Progress, SANS, SERIF, Sub, Tag, Title, usePop} from './common';

const Scene: React.FC<{from: number; dur: number; children: React.ReactNode}> = ({from, dur, children}) => (
  <Sequence from={from} durationInFrames={dur}>
    <Fade dur={dur}>{children}</Fade>
  </Sequence>
);

const Shell: React.FC<{bg: string; total: number; dots?: boolean; bar?: string; children: React.ReactNode}> = ({bg, total, dots = true, bar, children}) => (
  <AbsoluteFill style={{background: bg}}>
    <Fonts />
    {dots ? <Dots /> : null}
    {children}
    <Progress total={total} color={bar} />
  </AbsoluteFill>
);

const Source: React.FC<{text: string; color?: string}> = ({text, color = C.ink}) => (
  <div style={{position: 'absolute', bottom: 60, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 28, color, opacity: 0.55}}>{text}</div>
);

/* ---------- 24/11 · Diário #3 · layout CADERNO ---------- */
const NoteLine: React.FC<{text: string; delay: number}> = ({text, delay}) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [delay, delay + 40], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 50, lineHeight: '96px', color: C.ink, minHeight: 96}}>
      {text.slice(0, n)}
    </div>
  );
};
const Notebook: React.FC<{children: React.ReactNode; label: string}> = ({children, label}) => (
  <div style={{width: 900, background: C.white, borderRadius: 28, boxShadow: '0 20px 60px rgba(24,57,43,0.16)', position: 'relative', overflow: 'hidden',
    backgroundImage: `repeating-linear-gradient(transparent 0 95px, rgba(46,125,91,0.22) 95px 97px)`, backgroundPosition: '0 150px', padding: '150px 70px 60px 130px'}}>
    <div style={{position: 'absolute', left: 95, top: 0, bottom: 0, width: 4, background: C.pink, opacity: 0.6}} />
    <div style={{position: 'absolute', top: 44, left: 130}}><Tag bg={C.pink}>{label}</Tag></div>
    {children}
  </div>
);
export const Diario3: React.FC = () => (
  <Shell bg={C.pistache} total={360}>
    <Scene from={0} dur={95}>
      <Center>
        <Pop><Notebook label="DIÁRIO DA MIYU #3"><Title text="Por que a Miyu tá *de graça* agora?" size={92} align="left" /></Notebook></Pop>
      </Center>
    </Scene>
    <Scene from={95} dur={130}>
      <Center>
        <Notebook label="O MOTIVO">
          <NoteLine delay={6} text="Antes de cobrar," />
          <NoteLine delay={40} text="quero afiliada de verdade" />
          <NoteLine delay={70} text="usando no dia a dia." />
        </Notebook>
      </Center>
    </Scene>
    <Scene from={225} dur={75}>
      <Center>
        <Pop><Title text="O que vocês acharem *vai mudar* o app" size={100} /></Pop>
        <Pop delay={14}><Sub>o que ajuda e o que atrapalha</Sub></Pop>
      </Center>
    </Scene>
    <Scene from={300} dur={60}>
      <CTA title="Comenta QUERO" sub="e segue a @miyuflix pra ver o #4" />
    </Scene>
  </Shell>
);

/* ---------- 25/11 · Nicho · layout GRADE DE CHIPS ---------- */
const NICHOS = ['Eletrônicos', 'Beleza', 'Moda', 'Casa', 'Automotivos'];
const Chips: React.FC<{pick: number}> = ({pick}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center', width: 900}}>
      {NICHOS.map((n, i) => {
        const chosen = i === pick && frame > 70;
        const dim = frame > 70 && !chosen;
        return (
          <Pop key={n} delay={6 + i * 6}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, padding: '26px 44px', borderRadius: 999,
              background: chosen ? C.pink : C.white, color: chosen ? C.white : C.ink, opacity: dim ? 0.35 : 1,
              transform: `scale(${chosen ? 1.12 : 1})`, boxShadow: '0 10px 30px rgba(24,57,43,0.12)'}}>{n}</div>
          </Pop>
        );
      })}
    </div>
  );
};
export const Nicho: React.FC = () => (
  <Shell bg={C.white} total={360}>
    <Scene from={0} dur={85}>
      <Center>
        <Pop><Tag bg={C.green}>BLACK FRIDAY · 27/11</Tag></Pop>
        <Pop delay={8}><Title text="Escolhe *um nicho só* e vai fundo nele" size={104} /></Pop>
      </Center>
    </Scene>
    <Scene from={85} dur={120}>
      <Center gap={60}>
        <Pop><Title text="Os destaques da Shopee:" size={76} /></Pop>
        <Chips pick={1} />
        <Pop delay={75}><Sub>cupom de até R$ 100 · até 50% off</Sub></Pop>
      </Center>
    </Scene>
    <Scene from={205} dur={95}>
      <Center gap={36}>
        <Pop>
          <Card style={{width: 880, display: 'flex', gap: 30, alignItems: 'center', background: '#F3F3F3'}}>
            <div style={{fontSize: 64, fontFamily: SANS, fontWeight: 800, color: C.pink}}>✕</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.ink}}>Um pouco de cada = vitrine bagunçada</div>
          </Card>
        </Pop>
        <Pop delay={20}>
          <Card style={{width: 880, display: 'flex', gap: 30, alignItems: 'center', background: C.pistache}}>
            <Check on={1} />
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.ink}}>Um nicho = quem te segue sabe o que esperar</div>
          </Card>
        </Pop>
      </Center>
    </Scene>
    <Scene from={300} dur={60}>
      <CTA title="Qual você escolheu?" sub="salva e comenta aqui" />
    </Scene>
    <Sequence durationInFrames={300}><Source text="Fonte: O Tempo, 06/11/2026" /></Sequence>
  </Shell>
);

/* ---------- 26/11 · Véspera · layout CHECKLIST ---------- */
const ITEMS = ['3 vídeos gravados', 'Legendas com o preço final', 'Links separados'];
const Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Card style={{width: 900, padding: 60}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 2, color: C.pink, marginBottom: 30}}>ANTES DE DORMIR</div>
      {ITEMS.map((t, i) => {
        const on = interpolate(frame, [30 + i * 28, 38 + i * 28], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        return (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 34, padding: '26px 0', borderTop: i ? '3px dashed rgba(24,57,43,0.15)' : 'none'}}>
            <Check on={on} />
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: C.ink, textDecoration: on > 0.5 ? 'line-through' : 'none', textDecorationColor: C.pink, textDecorationThickness: 5}}>{t}</div>
          </div>
        );
      })}
    </Card>
  );
};
const Steps: React.FC<{items: string[]}> = ({items}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 26, width: 860}}>
    {items.map((t, i) => (
      <Pop key={t} delay={8 + i * 14}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{width: 92, height: 92, borderRadius: '50%', background: C.green, color: C.white, fontFamily: SANS, fontWeight: 800, fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{i + 1}</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 56, color: C.ink}}>{t}</div>
        </div>
      </Pop>
    ))}
  </div>
);
export const Vespera: React.FC = () => (
  <Shell bg={C.pistache} total={360}>
    <Scene from={0} dur={85}>
      <Center>
        <Pop><Tag bg={C.pink}>AMANHÃ É BLACK FRIDAY</Tag></Pop>
        <Pop delay={8}><Title text="O que você faz *hoje à noite* decide o seu dia" size={100} /></Pop>
      </Center>
    </Scene>
    <Scene from={85} dur={130}>
      <Center><Pop><Checklist /></Pop></Center>
    </Scene>
    <Scene from={215} dur={85}>
      <Center gap={60}>
        <Pop><Title text="Amanhã *cedo*:" size={96} /></Pop>
        <Steps items={['Acorda', 'Posta', 'Responde quem te chamou']} />
      </Center>
    </Scene>
    <Scene from={300} dur={60}>
      <CTA title="Salva pra fazer hoje" />
    </Scene>
  </Shell>
);

/* ---------- 27/11 · Black Friday · layout NÚMERO GIGANTE (fundo escuro) ---------- */
const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const v = Math.round(interpolate(frame, [10, 45], [0, 23], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <div style={{fontFamily: SANS, fontWeight: 800, color: C.pistache, textAlign: 'center', lineHeight: 0.9}}>
      <div style={{fontSize: 90}}>R$</div>
      <div style={{fontSize: 340, letterSpacing: -10}}>{v}</div>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 110, color: C.pink}}>milhões</div>
    </div>
  );
};
const Tile: React.FC<{big: string; small: string; delay: number}> = ({big, small, delay}) => (
  <Pop delay={delay}>
    <div style={{width: 860, borderRadius: 36, border: `4px solid ${C.pistache}`, padding: '44px 50px', display: 'flex', flexDirection: 'column', gap: 10}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 80, color: C.pistache, letterSpacing: -2}}>{big}</div>
      <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 44, color: C.white, opacity: 0.85}}>{small}</div>
    </div>
  </Pop>
);
const Timeline: React.FC = () => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 30, width: 860}}>
    {[['Manhã', 'produto 1'], ['Tarde', 'produto 2'], ['Noite', 'produto 3']].map(([h, p], i) => (
      <Pop key={h} delay={10 + i * 14}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <div style={{width: 230, fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.pink}}>{h}</div>
          <div style={{flex: 1, background: C.pistache, borderRadius: 24, padding: '26px 36px', fontFamily: SANS, fontWeight: 700, fontSize: 50, color: C.ink}}>posta o {p}</div>
        </div>
      </Pop>
    ))}
  </div>
);
export const BlackFriday: React.FC = () => (
  <Shell bg={C.ink} total={360} dots={false} bar={C.pink}>
    <Scene from={0} dur={95}>
      <Center gap={30}>
        <Pop><Tag bg={C.pink}>HOJE É BLACK FRIDAY</Tag></Pop>
        <Counter />
        <Pop delay={40}><Sub color={C.white}>em cupons da Shopee</Sub></Pop>
      </Center>
    </Scene>
    <Scene from={95} dur={100}>
      <Center gap={36}>
        <Tile big="Frete grátis" small="a partir de R$ 10" delay={4} />
        <Tile big="Até 50% off" small="em mais de 30 categorias" delay={18} />
      </Center>
    </Scene>
    <Scene from={195} dur={105}>
      <Center gap={56}>
        <Pop><Title text="Reposta o dia *todo*" size={96} color={C.white} /></Pop>
        <Timeline />
      </Center>
    </Scene>
    <Scene from={300} dur={60}>
      <CTA title="Manda pra amiga afiliada" bg={C.pink} />
    </Scene>
    <Sequence durationInFrames={300}><Source text="Fonte: O Tempo, 06/11/2026" color={C.white} /></Sequence>
  </Shell>
);

/* ---------- 28/11 · Pós-Black · layout CALENDÁRIO ---------- */
const Calendar: React.FC<{fill: boolean}> = ({fill}) => {
  const frame = useCurrentFrame();
  const cells = Array.from({length: 35}, (_, i) => i - 1); // dez/2026 começa na terça
  return (
    <Card style={{width: 900, padding: 44}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.ink, marginBottom: 20}}>Dezembro</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12}}>
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i} style={{textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.green}}>{d}</div>
        ))}
        {cells.map((d, i) => {
          const valid = d >= 1 && d <= 31;
          const lit = valid && fill && frame > 10 + d * 2;
          const big = valid && d === 25;
          return (
            <div key={i} style={{height: 92, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SANS, fontWeight: 700, fontSize: 36,
              background: big ? C.pink : lit ? C.pistache : valid ? '#F4F6F2' : 'transparent',
              color: big ? C.white : C.ink, opacity: valid ? 1 : 0}}>{valid ? d : ''}</div>
          );
        })}
      </div>
    </Card>
  );
};
const Pill: React.FC<{text: string; delay: number}> = ({text, delay}) => (
  <Pop delay={delay}>
    <div style={{display: 'flex', alignItems: 'center', gap: 24, background: C.white, borderRadius: 999, padding: '24px 44px', boxShadow: '0 10px 30px rgba(24,57,43,0.12)'}}>
      <Check on={1} size={56} />
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 48, color: C.ink}}>{text}</div>
    </div>
  </Pop>
);
export const PosBlack: React.FC = () => (
  <Shell bg={C.pistache} total={420}>
    <Scene from={0} dur={85}>
      <Center>
        <Pop><Title text="A Black passou. *Dezembro* começa na terça." size={100} /></Pop>
      </Center>
    </Scene>
    <Scene from={85} dur={95}>
      <Center gap={50}>
        <Pop><Calendar fill={false} /></Pop>
        <Pop delay={14}><Sub size={50}>Só vende em data grande? O mês fica parado.</Sub></Pop>
      </Center>
    </Scene>
    <Scene from={180} dur={85}>
      <Center gap={50}>
        <Calendar fill />
        <Pop delay={10}><Title text="Quem tem *rotina* vende o ano todo" size={84} /></Pop>
      </Center>
    </Scene>
    <Scene from={265} dur={95}>
      <Center gap={30}>
        <Pop><Title text="A Miyu:" size={96} /></Pop>
        <Pill text="organiza sua rotina" delay={8} />
        <Pill text="mostra quanto você vendeu" delay={20} />
        <Pill text="faz vídeo, legenda e roteiro" delay={32} />
      </Center>
    </Scene>
    <Scene from={360} dur={60}>
      <CTA title="Comenta QUERO" sub="pra usar de graça antes do lançamento" />
    </Scene>
  </Shell>
);

/* ---------- 29/11 · Cyber Monday · layout CARDS DE PRODUTO + ALERTA ---------- */
const Icon: React.FC<{kind: 'fone' | 'carregador' | 'som'}> = ({kind}) => (
  <svg width="120" height="120" viewBox="0 0 48 48" fill="none" stroke={C.green} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'fone' && (<><path d="M10 28v-4a14 14 0 0 1 28 0v4" /><rect x="7" y="28" width="8" height="12" rx="3" /><rect x="33" y="28" width="8" height="12" rx="3" /></>)}
    {kind === 'carregador' && (<><rect x="14" y="6" width="20" height="24" rx="4" /><path d="M24 30v6a6 6 0 0 1-6 6" /><path d="M26 12l-4 7h5l-4 7" /></>)}
    {kind === 'som' && (<><rect x="12" y="6" width="24" height="36" rx="5" /><circle cx="24" cy="28" r="7" /><circle cx="24" cy="14" r="3" /></>)}
  </svg>
);
const Products: React.FC = () => (
  <div style={{display: 'flex', gap: 24}}>
    {([['fone', 'Fone'], ['carregador', 'Carregador'], ['som', 'Caixinha de som']] as const).map(([k, t], i) => (
      <Pop key={k} delay={8 + i * 10}>
        <Card style={{width: 280, height: 360, padding: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26}}>
          <div style={{width: 170, height: 170, borderRadius: '50%', background: C.pistache, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon kind={k} /></div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: C.ink, textAlign: 'center'}}>{t}</div>
        </Card>
      </Pop>
    ))}
  </div>
);
export const Cyber: React.FC = () => (
  <Shell bg={C.white} total={390}>
    <Scene from={0} dur={85}>
      <Center>
        <Pop><Tag bg={C.green}>AMANHÃ · 30/11</Tag></Pop>
        <Pop delay={8}><Title text="Cyber Monday: a *última* data grande de novembro" size={96} /></Pop>
      </Center>
    </Scene>
    <Scene from={85} dur={110}>
      <Center gap={56}>
        <Pop><Title text="Separa hoje *3 produtos*" size={92} /></Pop>
        <Products />
        <Pop delay={45}><Sub>os cupons são em eletrônicos</Sub></Pop>
      </Center>
    </Scene>
    <Scene from={195} dur={70}>
      <Center gap={50}>
        <Pop><Title text="Depois:" size={96} /></Pop>
        <Steps items={['Grava o vídeo', 'Confere a comissão']} />
      </Center>
    </Scene>
    <Scene from={265} dur={65}>
      <Center>
        <Pop>
          <div style={{width: 900, background: C.pink, borderRadius: 36, padding: 56, display: 'flex', flexDirection: 'column', gap: 18}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 38, letterSpacing: 2, color: C.white, opacity: 0.9}}>AVISA SEU PÚBLICO</div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 66, color: C.white, lineHeight: 1.08}}>Sorteio "1 Ano de Shopee Grátis" só até hoje, 23h59</div>
          </div>
        </Pop>
      </Center>
    </Scene>
    <Scene from={330} dur={60}>
      <CTA title="Salva e posta amanhã cedo" />
    </Scene>
    <Sequence durationInFrames={330}><Source text="Fontes: InfoMoney, 27/10/2026 e Portal G, 20/10/2026" /></Sequence>
  </Shell>
);

/* ---------- 30/11 · Fim de novembro · layout ANTES x DEPOIS ---------- */
const Split: React.FC = () => {
  const l = usePop(6);
  const r = usePop(22);
  const col = (title: string, lines: string[], bg: string, fg: string, s: number) => (
    <div style={{flex: 1, background: bg, borderRadius: 36, padding: '50px 36px', display: 'flex', flexDirection: 'column', gap: 26, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: fg}}>{title}</div>
      {lines.map((t) => (
        <div key={t} style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: fg, opacity: 0.9, lineHeight: 1.15}}>{t}</div>
      ))}
    </div>
  );
  return (
    <div style={{display: 'flex', gap: 24, width: 920}}>
      {col('Na mão', ['cada vídeo come seu tempo', 'menos tempo postando'], '#EDEDED', C.ink, l)}
      {col('Com a Miyu', ['vídeo, legenda e roteiro em minutos', 'você só posta'], C.green, C.white, r)}
    </div>
  );
};
export const FimNovembro: React.FC = () => (
  <Shell bg={C.pistache} total={360}>
    <Scene from={0} dur={90}>
      <Center>
        <Pop><Tag bg={C.ink}>NOVEMBRO ACABA HOJE</Tag></Pop>
        <Pop delay={8}><Title text="Em dezembro você vai fazer tudo *sozinha* de novo?" size={96} /></Pop>
      </Center>
    </Scene>
    <Scene from={90} dur={120}>
      <Center gap={50}>
        <Pop><Title text="Dezembro tem *Natal* pra vender" size={84} /></Pop>
        <Split />
      </Center>
    </Scene>
    <Scene from={210} dur={85}>
      <Center>
        <Pop><div style={{fontFamily: SANS, fontWeight: 800, fontSize: 300, color: C.pink, lineHeight: 0.9}}>10</div></Pop>
        <Pop delay={10}><Title text="vagas pra usar *de graça* antes do lançamento" size={80} /></Pop>
      </Center>
    </Scene>
    <Scene from={295} dur={65}>
      <CTA title="Comenta QUERO" />
    </Scene>
  </Shell>
);
