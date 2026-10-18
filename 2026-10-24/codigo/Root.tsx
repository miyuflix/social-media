import React from 'react';
import {Composition} from 'remotion';
import {Nichos, TOTAL} from './Nichos';

export const Root: React.FC = () => (
  <Composition id="Nichos" component={Nichos} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
