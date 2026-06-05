import { Composition } from 'remotion';
import { Reel, REEL_FPS, REEL_DURATION } from './Reel';

export const RemotionRoot = () => {
  return (
    <Composition
      id="UBCReel"
      component={Reel}
      durationInFrames={REEL_DURATION}
      fps={REEL_FPS}
      width={1080}
      height={1920}
    />
  );
};
