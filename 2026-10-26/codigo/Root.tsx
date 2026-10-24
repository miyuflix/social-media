import React from 'react';
import {Composition} from 'remotion';
import {Pinterest, TOTAL} from './Pinterest';
export const Root: React.FC = () => <Composition id="Pinterest" component={Pinterest} durationInFrames={TOTAL} fps={30} width={1080} height={1920} />;
