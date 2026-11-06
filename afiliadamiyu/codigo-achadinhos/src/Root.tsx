import React from 'react';
import { Composition } from 'remotion';
import { Achadinhos, Props, totalOf } from './Achadinhos';
import exemplo from '../props/exemplo-lista.json';

// Renderize com: remotion render src/index.ts Achadinhos out/x.mp4 --props=props/<arquivo>.json
export const Root: React.FC = () => (
  <Composition
    id="Achadinhos"
    component={Achadinhos as any}
    fps={30}
    width={1080}
    height={1920}
    durationInFrames={totalOf(exemplo as Props)}
    defaultProps={exemplo as Props}
    calculateMetadata={({ props }) => ({ durationInFrames: totalOf(props as Props) })}
  />
);
