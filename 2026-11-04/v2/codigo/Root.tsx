import React from 'react';
import {Composition} from 'remotion';
import {Beta, TOTAL} from './Beta';

export const Root: React.FC = () => (
  <Composition id="Beta" component={Beta} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />
);
