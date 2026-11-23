import React from 'react';
import {Composition} from 'remotion';
import {Still} from 'remotion';
import * as Cv from './covers';
import {BlackFriday, Cyber, Diario3, FimNovembro, Nicho, PosBlack, Vespera} from './videos';
const V = [
  ['R24-Diario3', Diario3, 360], ['R25-Nicho', Nicho, 360], ['R26-Vespera', Vespera, 360],
  ['R27-BlackFriday', BlackFriday, 360], ['R28-PosBlack', PosBlack, 420], ['R29-Cyber', Cyber, 390], ['R30-FimNovembro', FimNovembro, 360],
] as const;
export const Root: React.FC = () => (<>{V.map(([id, c, d]) => <Composition key={id} id={id} component={c as React.FC} durationInFrames={d} fps={30} width={1080} height={1920} />)}{['24','25','26','27','28','29','30'].map((d) => <Still key={d} id={`Capa${d}`} component={(Cv as any)[`Cover${d}`]} width={1080} height={1920} />)}</>);
