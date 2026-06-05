import { useCurrentFrame, useVideoConfig, AbsoluteFill, interpolate } from 'remotion';

export const MyVideo = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f0f1a',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ opacity, textAlign: 'center', color: 'white' }}>
        <h1 style={{ fontSize: 56, margin: 0 }}>
          How Machine Learning & AI
        </h1>
        <h2 style={{ fontSize: 36, margin: '16px 0 0', color: '#7c9ef8' }}>
          Are Transforming Industries
        </h2>
      </div>
    </AbsoluteFill>
  );
};
