import { Composition } from 'remotion';
import { Reel, REEL_FPS, REEL_DURATION } from './Reel';
import { Interview, INTERVIEW_FPS, INTERVIEW_DURATION } from './Interview';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="UBCReel"
        component={Reel}
        durationInFrames={REEL_DURATION}
        fps={REEL_FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="UBCInterview"
        component={Interview}
        durationInFrames={INTERVIEW_DURATION}
        fps={INTERVIEW_FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
