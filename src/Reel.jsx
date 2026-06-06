import {
  AbsoluteFill,
  Audio,
  Img,
  Series,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

export const REEL_FPS = 30;

/**
 * Slide durations are timed to the uploaded voiceover (public/voiceover.mp3,
 * ~62.46s). Each `durationInFrames` matches the spoken window for that line,
 * derived from silence analysis of the narration, so copy + b-roll change
 * exactly as the voice moves to the next line.
 *
 * `zoom` is the starting scale of the background. stat1/stat2/reason4 use a
 * larger zoom to crop the source's burned-in title text; every slide uses
 * >= 1.1 so any corner watermark is cropped out too.
 *
 * reason5 / reason6 backgrounds are TEMPORARY placeholders until the real
 * Shutterstock photos arrive — overwrite public/bg/reason5.jpg and
 * public/bg/reason6.jpg and re-render; no code change needed.
 */
export const SLIDES = [
  {
    key: 'hook',
    bg: 'bg/hook.jpg',
    zoom: 1.08,
    durationInFrames: 116, // 0.00–3.86s
    accent: '#FF6A2C',
    kicker: null,
    title: 'Wood is losing.',
    subtitle: 'Why U.S. builders are switching to LGSF.',
    footnote: 'Light Gauge Steel Framing',
  },
  {
    key: 'stat1',
    bg: 'bg/stat1.jpg',
    zoom: 1.5,
    durationInFrames: 144, // 3.86–8.66s
    accent: '#FF6A2C',
    kicker: 'STAT #1',
    bigStat: '$10.8B',
    subtitle: 'Lost every year to the U.S. framing labor shortage.',
    footnote: 'HBI / NAHB Construction Labor Market Report, 2025',
  },
  {
    key: 'stat2',
    bg: 'bg/stat2.jpg',
    zoom: 1.5,
    durationInFrames: 136, // 8.66–13.18s
    accent: '#FF6A2C',
    kicker: 'STAT #2',
    bigStat: '+41.6%',
    subtitle: 'Rise in building material costs since 2020.',
    footnote: null,
  },
  {
    key: 'switch',
    bg: 'bg/switch.jpg',
    zoom: 1.14,
    durationInFrames: 94, // 13.18–16.32s
    accent: '#4DA3FF',
    kicker: 'So builders are switching to…',
    title: 'LGSF',
    subtitle: 'Light-Gauge Steel Framing',
    footnote: null,
  },
  {
    key: 'reason1',
    bg: 'bg/reason1.jpg',
    zoom: 1.12,
    durationInFrames: 150, // 16.32–21.31s
    accent: '#4DA3FF',
    kicker: 'REASON 1',
    title: 'It frames faster.',
    subtitle: 'Prefab LGSF panels go up in days — wood framing takes weeks.',
    footnote: null,
  },
  {
    key: 'reason2',
    bg: 'bg/reason2.jpg',
    zoom: 1.12,
    durationInFrames: 172, // 21.31–27.04s
    accent: '#4DA3FF',
    kicker: 'REASON 2',
    title: 'It needs fewer hands.',
    subtitle: 'Pre-engineered panels = less labor, faster training, fewer field calls.',
    footnote: null,
  },
  {
    key: 'reason3',
    bg: 'bg/reason3.jpg',
    zoom: 1.12,
    durationInFrames: 193, // 27.04–33.49s
    accent: '#4DA3FF',
    kicker: 'REASON 3',
    title: 'It outlasts wood.',
    subtitle: 'Non-combustible. Termite-proof. 100+ year design life. Lower insurance premiums.',
    footnote: null,
  },
  {
    key: 'reason4',
    bg: 'bg/stat2.jpg',
    zoom: 1.5,
    durationInFrames: 144, // 33.49–38.29s
    accent: '#4DA3FF',
    kicker: 'REASON 4',
    title: 'Prices don’t swing.',
    subtitle: 'Steel doesn’t whipsaw 70% in a year. Budgets stay predictable.',
    footnote: null,
  },
  {
    key: 'reason5',
    bg: 'bg/reason5.jpg', // PLACEHOLDER — swap with insurance/durability photo
    zoom: 1.12,
    durationInFrames: 165, // 38.29–43.78s
    accent: '#4DA3FF',
    kicker: 'REASON 5',
    title: 'Cheaper to insure.',
    subtitle: 'Insurance runs 30–40% lower than wood-framed construction.',
    footnote: null,
  },
  {
    key: 'reason6',
    bg: 'bg/reason6.jpg', // PLACEHOLDER — swap with precision/clean-site photo
    zoom: 1.12,
    durationInFrames: 250, // 43.78–52.11s
    accent: '#4DA3FF',
    kicker: 'REASON 6',
    title: 'Precision engineered.',
    subtitle: 'Panels arrive pre-cut and ready to install — almost no site work, and zero debris to clean up.',
    footnote: null,
  },
  {
    key: 'cta',
    bg: 'bg/cta.jpg',
    zoom: 1.12,
    durationInFrames: 236, // 52.11–60.00s
    accent: '#FF6A2C',
    kicker: 'UBC BIM',
    title: 'Your one-stop shop for LGSF.',
    subtitle: 'Design & detailing — regardless of the machine or software you use.',
    footnote: 'ubcbim.com · DM us to get started',
  },
];

// Logo outro — timed to "Let's build yours. ubcbim dot com." (60.00–62.46s).
export const END_CARD_FRAMES = 75;

export const REEL_DURATION =
  SLIDES.reduce((sum, s) => sum + s.durationInFrames, 0) + END_CARD_FRAMES;

const BG = '#0C1118';
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const SHADOW = '0 4px 24px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.9)';

// Fade in (spring) + fade out at the tail + gentle upward drift.
const useReveal = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return {
    opacity: enter * exit,
    transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
  };
};

// Slow Ken Burns push on the background for subtle motion.
const KenBurnsBg = ({ src, zoom }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoom, zoom + 0.06], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      {/* Dark scrim: heaviest at top & bottom for text legibility */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,12,18,0.86) 0%, rgba(8,12,18,0.30) 32%, rgba(8,12,18,0.40) 60%, rgba(8,12,18,0.93) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const Kicker = ({ children, accent }) => {
  const r = useReveal(2);
  return (
    <div
      style={{
        ...r,
        color: accent,
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: 4,
        textTransform: 'uppercase',
        marginBottom: 30,
        textShadow: SHADOW,
      }}
    >
      {children}
    </div>
  );
};

const Slide = ({ data }) => {
  const titleR = useReveal(6);
  const subR = useReveal(12);
  const footR = useReveal(18);
  const accentBar = useReveal(0);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <KenBurnsBg src={data.bg} zoom={data.zoom} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 90px',
          fontFamily: FONT,
          textAlign: 'center',
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            ...accentBar,
            width: 90,
            height: 8,
            borderRadius: 4,
            backgroundColor: data.accent,
            marginBottom: 50,
            boxShadow: SHADOW,
          }}
        />

        {data.kicker && <Kicker accent={data.accent}>{data.kicker}</Kicker>}

        {data.bigStat ? (
          <div
            style={{
              ...titleR,
              color: '#FFFFFF',
              fontSize: 230,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              textShadow: SHADOW,
            }}
          >
            {data.bigStat}
          </div>
        ) : (
          data.title && (
            <div
              style={{
                ...titleR,
                color: '#FFFFFF',
                fontSize: data.key === 'switch' ? 200 : 96,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -2,
                textShadow: SHADOW,
              }}
            >
              {data.title}
            </div>
          )
        )}

        {data.subtitle && (
          <div
            style={{
              ...subR,
              color: '#EAF1F8',
              fontSize: 46,
              fontWeight: 600,
              lineHeight: 1.35,
              marginTop: 40,
              maxWidth: 840,
              textShadow: SHADOW,
            }}
          >
            {data.subtitle}
          </div>
        )}

        {data.footnote && (
          <div
            style={{
              ...footR,
              color: '#AEBCCB',
              fontSize: 30,
              fontWeight: 500,
              marginTop: 46,
              maxWidth: 780,
              textShadow: SHADOW,
            }}
          >
            {data.footnote}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Branded outro: UBC BIM logo on a clean background.
const EndCard = () => {
  const frame = useCurrentFrame();
  const logo = spring({ frame, fps: REEL_FPS, config: { damping: 200 }, durationInFrames: 22 });
  const scale = interpolate(logo, [0, 1], [0.9, 1]);
  const tag = spring({ frame: frame - 8, fps: REEL_FPS, config: { damping: 200 }, durationInFrames: 18 });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          opacity: tag,
          color: '#FF6A2C',
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: 1,
          marginBottom: 30,
        }}
      >
        Let’s build yours.
      </div>
      <Img
        src={staticFile('logo.jpg')}
        style={{ width: '74%', opacity: logo, transform: `scale(${scale})` }}
      />
      <div
        style={{
          opacity: tag,
          marginTop: 10,
          color: '#1E2A57',
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        ubcbim.com
      </div>
    </AbsoluteFill>
  );
};

// Thin progress bar across the top of the whole reel.
const ProgressBar = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-start' }}>
      <div style={{ height: 8, width: `${w}%`, backgroundColor: '#FF6A2C' }} />
    </AbsoluteFill>
  );
};

export const Reel = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      {/* Synced narration (American VO, ~62.46s) */}
      <Audio src={staticFile('voiceover.mp3')} />

      <Series>
        {SLIDES.map((data) => (
          <Series.Sequence key={data.key} durationInFrames={data.durationInFrames}>
            <Slide data={data} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={END_CARD_FRAMES}>
          <EndCard />
        </Series.Sequence>
      </Series>

      <ProgressBar />
    </AbsoluteFill>
  );
};
