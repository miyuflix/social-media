import React from 'react';
import {Composition} from 'remotion';
import {ReelApps, A_TOTAL, ReelPreguica, B_TOTAL, ReelPostoHoje, C_TOTAL} from './Beta';
export const Root: React.FC = () => (<>
  <Composition id="Apps" component={ReelApps} durationInFrames={A_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="Preguica" component={ReelPreguica} durationInFrames={B_TOTAL} fps={30} width={1080} height={1920} />
  <Composition id="PostoHoje" component={ReelPostoHoje} durationInFrames={C_TOTAL} fps={30} width={1080} height={1920} />
</>);
