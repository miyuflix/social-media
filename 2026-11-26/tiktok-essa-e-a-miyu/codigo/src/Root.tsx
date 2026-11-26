import React from 'react';
import { Composition } from 'remotion';
import { MiyuTikTok, TIKTOK_FRAMES } from './MiyuTikTok';

export const Root: React.FC = () => (
  <Composition id="MiyuTikTok" component={MiyuTikTok} durationInFrames={TIKTOK_FRAMES} fps={30} width={1080} height={1920} />
);
