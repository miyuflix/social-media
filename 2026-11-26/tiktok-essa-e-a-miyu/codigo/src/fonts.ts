import { continueRender, delayRender, staticFile } from 'remotion';

const faces: [string, string, string, string][] = [
  ['Inter', 'Inter-Medium.otf', '500', 'normal'],
  ['Inter', 'Inter-SemiBold.otf', '600', 'normal'],
  ['Inter', 'Inter-Bold.otf', '700', 'normal'],
  ['Inter', 'Inter-ExtraBold.otf', '800', 'normal'],
  ['Inter', 'Inter-Black.otf', '900', 'normal'],
  ['Lora', 'Lora-Italic-Variable.ttf', '400 700', 'italic'],
];
const handle = delayRender('fonts');
Promise.all(
  faces.map(([family, file, weight, style]) => {
    const f = new FontFace(family, `url(${staticFile('fonts/' + file)})`, { weight, style });
    return f.load().then((loaded) => (document as any).fonts.add(loaded));
  }),
).then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
