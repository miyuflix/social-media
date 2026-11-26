import React from 'react';
import { useCurrentFrame } from 'remotion';
const C = { orange: '#F28C38', pink: '#F7A8B8', ink: '#1C3A2E', white: '#FFFFFF' };
export const Corgi: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const blink = frame % 70 > 64;
  const ear = Math.sin(frame / 6) * 4;
  const float = Math.sin(frame / 8) * 12;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: `translateY(${float}px)` }}>
      <g transform={`rotate(${-ear} 55 70)`}><polygon points="30,95 50,20 90,70" fill={C.orange} /><polygon points="45,82 55,42 76,68" fill={C.pink} /></g>
      <g transform={`rotate(${ear} 145 70)`}><polygon points="170,95 150,20 110,70" fill={C.orange} /><polygon points="155,82 145,42 124,68" fill={C.pink} /></g>
      <ellipse cx="100" cy="115" rx="70" ry="62" fill={C.orange} />
      <path d="M100 70 C 80 100, 60 130, 75 160 Q100 178 125 160 C140 130 120 100 100 70 Z" fill={C.white} />
      {blink ? (<><rect x="62" y="110" width="20" height="4" rx="2" fill={C.ink} /><rect x="118" y="110" width="20" height="4" rx="2" fill={C.ink} /></>)
        : (<><circle cx="72" cy="110" r="9" fill={C.ink} /><circle cx="128" cy="110" r="9" fill={C.ink} /><circle cx="75" cy="107" r="3" fill="#fff" /><circle cx="131" cy="107" r="3" fill="#fff" /></>)}
      <ellipse cx="100" cy="132" rx="11" ry="8" fill={C.ink} />
      <path d="M90 145 Q100 154 110 145" stroke={C.ink} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="55" cy="135" r="10" fill={C.pink} opacity={0.8} />
      <circle cx="145" cy="135" r="10" fill={C.pink} opacity={0.8} />
    </svg>
  );
};

