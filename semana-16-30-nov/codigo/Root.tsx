import React from 'react';
import {Composition} from 'remotion';
import {Gen, totalOf, GenProps} from './Gen';

export const Root: React.FC = () => (
  <Composition id="Gen" component={Gen} durationInFrames={300} fps={30} width={1080} height={1920} defaultProps={{scenes: []} as GenProps} calculateMetadata={({props}) => ({durationInFrames: Math.max(30, totalOf(props as GenProps))})} />
);
