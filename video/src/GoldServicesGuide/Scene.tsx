import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const NAVY = "#0b2265";
const NAVY_DARK = "#07183f";
const GOLD = "#d4af37";
const GREEN = "#2e6f40";

export const Scene: React.FC<{
  image: string;
  step: string;
  title: string;
  detail: string;
}> = ({ image, step, title, detail }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = Math.min(fadeIn, fadeOut);

  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  const captionSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 200 },
  });

  const captionTranslate = interpolate(captionSpring, [0, 1], [24, 0]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY_DARK}, ${NAVY})`,
        opacity,
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 140px 210px",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
            border: `3px solid ${GOLD}`,
            transform: `scale(${zoom})`,
          }}
        >
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          top: "auto",
          height: 200,
          background: "rgba(7,24,63,0.92)",
          borderTop: `4px solid ${GOLD}`,
          display: "flex",
          alignItems: "center",
          gap: 26,
          padding: "0 90px",
          transform: `translateY(${captionTranslate}px)`,
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: GOLD,
            color: NAVY_DARK,
            fontWeight: 800,
            fontSize: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {step}
        </div>

        <div>
          <div
            style={{
              color: "#fff",
              fontSize: 34,
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {title}
          </div>
          <div style={{ color: "#d6e0f5", fontSize: 22, lineHeight: 1.4 }}>
            {detail}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TitleCard: React.FC<{
  eyebrow: string;
  title: string;
  subtitle: string;
}> = ({ eyebrow, title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 200 } });
  const translate = interpolate(s, [0, 1], [30, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at top right, rgba(212,175,55,0.18), transparent 45%), linear-gradient(160deg, ${NAVY_DARK}, ${NAVY})`,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity,
          transform: `translateY(${translate}px)`,
        }}
      >
        <svg width={110} height={110} viewBox="0 0 100 100" style={{ marginBottom: 26 }}>
          <polygon
            points="50,4 90,27 90,73 50,96 10,73 10,27"
            fill="none"
            stroke={GOLD}
            strokeWidth={4}
          />
          <circle cx="50" cy="4" r="3.4" fill={GOLD} />
          <circle cx="90" cy="27" r="3.4" fill={GOLD} />
          <circle cx="90" cy="73" r="3.4" fill={GOLD} />
          <circle cx="50" cy="96" r="3.4" fill={GOLD} />
          <circle cx="10" cy="73" r="3.4" fill={GOLD} />
          <circle cx="10" cy="27" r="3.4" fill={GOLD} />
          <text
            x="50"
            y="53"
            textAnchor="middle"
            fontFamily="Segoe UI, Arial, sans-serif"
            fontWeight={700}
            fontSize={28}
            fill="#fff"
          >
            GS
          </text>
          <path d="M33 68 Q40 58 50 61 Q44 73 33 68 Z" fill={GREEN} />
          <path d="M67 68 Q60 58 50 61 Q56 73 67 68 Z" fill={GREEN} />
        </svg>

        <div
          style={{
            color: "#8fd6a8",
            letterSpacing: 4,
            fontSize: 20,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            color: "#fff",
            fontSize: 60,
            fontWeight: 800,
            marginBottom: 16,
          }}
        >
          {title}
        </div>

        <div style={{ color: "#c7d2ea", fontSize: 26 }}>{subtitle}</div>
      </div>
    </AbsoluteFill>
  );
};
