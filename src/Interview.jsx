import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const INTERVIEW_FPS = 30;

// Source video cuts from the talking head to its baked-in contact card at
// frame 824 (27.467s). We keep the talk, then replace the static card with
// an animated rebuild of the same design.
const TALK_FRAMES = 824;
const CARD_FRAMES = 165;
export const INTERVIEW_DURATION = TALK_FRAMES + CARD_FRAMES;

const NAVY = '#2B3A64';
const RED = '#942E2C';
const WHITE = '#FFFFFF';

const FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// ---------------------------------------------------------------- overlays

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const pct = interpolate(frame, [0, INTERVIEW_DURATION], [0, 100]);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: 10,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${NAVY}, ${RED})`,
        zIndex: 40,
      }}
    />
  );
};

const Watermark = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        position: 'absolute',
        top: 36,
        right: 32,
        zIndex: 30,
        opacity: enter * 0.94,
        transform: `translateY(${(1 - enter) * -24}px)`,
        background: WHITE,
        borderRadius: 18,
        padding: '10px 16px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
      }}
    >
      <Img
        src={staticFile('logo.jpg')}
        style={{ width: 150, display: 'block' }}
      />
    </div>
  );
};

const QuestionChip = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const IN = 14;
  const OUT = 132; // fully gone by frame 144 (4.8s), before b-roll slides in at ~5.0s
  const enter = spring({ frame: frame - IN, fps, config: { damping: 16, mass: 0.8 } });
  const exit = interpolate(frame, [OUT, OUT + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (frame < IN || frame > OUT + 12) return null;
  return (
    <div
      style={{
        position: 'absolute',
        top: 170,
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        zIndex: 30,
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * 50 - exit * 40}px)`,
      }}
    >
      <div
        style={{
          background: RED,
          color: WHITE,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 6,
          padding: '12px 30px',
          borderRadius: 999,
          boxShadow: '0 8px 28px rgba(0,0,0,0.3)',
        }}
      >
        TEAM Q&amp;A
      </div>
      <div
        style={{
          background: 'rgba(255,255,255,0.96)',
          color: NAVY,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 46,
          lineHeight: 1.25,
          padding: '26px 44px',
          borderRadius: 26,
          maxWidth: 880,
          textAlign: 'center',
          boxShadow: '0 10px 36px rgba(0,0,0,0.3)',
        }}
      >
        “What should a shop buy first?”
      </div>
    </div>
  );
};

const Vignette = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.20) 100%)',
      zIndex: 20,
      pointerEvents: 'none',
    }}
  />
);

// ----------------------------------------------------------------- talk

const Talk = () => {
  const frame = useCurrentFrame();
  // quick fade in from white, fade to white into the end card
  const introFade = interpolate(frame, [0, 10], [1, 0], {
    extrapolateRight: 'clamp',
  });
  const outroFade = interpolate(frame, [TALK_FRAMES - 10, TALK_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
  });
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <OffthreadVideo
        muted
        src={staticFile('interview.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'contrast(1.06) saturate(1.12) brightness(1.03)',
        }}
      />
      {/* speech ends naturally at 27.42s; the remaining tail is room silence */}
      <Audio src={staticFile('interview-vo.wav')} />
      <Vignette />
      <QuestionChip />
      <Watermark />
      <AbsoluteFill
        style={{
          background: WHITE,
          opacity: Math.max(introFade, outroFade),
          zIndex: 50,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------- end card

const ContactRow = ({ icon, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 15, mass: 0.7 } });
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        opacity: s,
        transform: `translateX(${(1 - s) * -70}px)`,
      }}
    >
      {icon}
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 47,
          color: NAVY,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const iconStyle = { width: 52, height: 52, flexShrink: 0 };

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" style={iconStyle}>
    <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
    <path d="M3 6.5l9 6.5 9-6.5" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" style={iconStyle}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19M12 2.5c-5.5 5.5-5.5 13.5 0 19M12 2.5c5.5 5.5 5.5 13.5 0 19" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1.8" style={iconStyle}>
    <path d="M5 3.5h3.5L10 8l-2 1.8a14 14 0 006.2 6.2L16 14l4.5 1.5V19a1.8 1.8 0 01-1.9 1.8C9.8 20.2 3.8 14.2 3.2 5.4A1.8 1.8 0 015 3.5z" />
  </svg>
);

const EndCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame: frame - 4, fps, config: { damping: 14, mass: 0.8 } });
  const bannerIn = spring({ frame: frame - 14, fps, config: { damping: 18 } });
  const titleIn = spring({ frame: frame - 22, fps, config: { damping: 15, mass: 0.7 } });
  // gentle life so the card never feels frozen
  const breathe = interpolate(frame, [0, CARD_FRAMES], [1, 1.015]);

  return (
    <AbsoluteFill style={{ background: WHITE }}>
      <AbsoluteFill
        style={{
          transform: `scale(${breathe})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* logo */}
        <Img
          src={staticFile('logo.jpg')}
          style={{
            width: 740,
            marginTop: 260,
            opacity: logoIn,
            transform: `scale(${0.85 + logoIn * 0.15})`,
          }}
        />

        {/* red banner */}
        <div
          style={{
            width: '100%',
            marginTop: 150,
            background: RED,
            padding: '38px 0',
            transform: `scaleX(${bannerIn})`,
            transformOrigin: 'left center',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 124,
              color: WHITE,
              letterSpacing: 2,
              opacity: titleIn,
              transform: `translateX(${(1 - titleIn) * -70}px)`,
            }}
          >
            Contact us
          </div>
        </div>

        {/* dots */}
        <div style={{ display: 'flex', gap: 26, marginTop: 90 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const d = spring({
              frame: frame - 34 - i * 4,
              fps,
              config: { damping: 12, mass: 0.5 },
            });
            return (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: NAVY,
                  transform: `scale(${d})`,
                }}
              />
            );
          })}
        </div>

        {/* contact rows */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 72,
            marginTop: 110,
            alignItems: 'flex-start',
          }}
        >
          <ContactRow icon={<MailIcon />} text="marketing@ubcbim.com" delay={42} />
          <ContactRow icon={<GlobeIcon />} text="www.ubcbim.com" delay={52} />
          <ContactRow
            icon={<PhoneIcon />}
            text="+ (214) 444 6150 | USA, Canada"
            delay={62}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ main

export const Interview = () => {
  return (
    <AbsoluteFill style={{ background: WHITE }}>
      <Sequence durationInFrames={TALK_FRAMES}>
        <Talk />
      </Sequence>
      <Sequence from={TALK_FRAMES} durationInFrames={CARD_FRAMES}>
        <EndCard />
      </Sequence>
      <ProgressBar />
    </AbsoluteFill>
  );
};
