import React from 'react';
import {Composition} from 'remotion';
import {Semana, TOTAL} from './Semana';

export const Root: React.FC = () => (
  <Composition id="Semana" component={Semana} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
