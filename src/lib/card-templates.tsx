import type { ReadingLogWithMember } from "@/lib/types";

export const CARD_SIZE = 1080;

const PALETTES = [
  { bg: "#FDF6EC", accent: "#E8A33D" },
  { bg: "#EEF3EC", accent: "#5B8A63" },
  { bg: "#F3EEF6", accent: "#8A63B5" },
  { bg: "#EEF1F6", accent: "#4C6EA8" },
  { bg: "#FBEEEF", accent: "#C05B62" },
];

function paletteFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

function Stars({ rating, size = 28, color = "#F5A623" }: { rating: number; size?: number; color?: string }) {
  return (
    <div style={{ display: "flex" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            fontSize: size,
            color: n <= rating ? color : "#D9D9D9",
            marginRight: 2,
          }}
        >
          {"★"}
        </span>
      ))}
    </div>
  );
}

function Watermark({ color = "rgba(0,0,0,0.35)" }: { color?: string }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 28,
        right: 36,
        display: "flex",
        fontSize: 22,
        color,
      }}
    >
      책방아줌마 · Bookmami
    </div>
  );
}

export function CoverRatingCard({ log }: { log: ReadingLogWithMember }) {
  const palette = paletteFor(log.title);
  return (
    <div
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        display: "flex",
        flexDirection: "column",
        background: palette.bg,
        position: "relative",
        fontFamily: "Pretendard",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: 680,
          alignItems: "center",
          justifyContent: "center",
          background: "#fff",
        }}
      >
        {log.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={log.cover_url}
            alt=""
            width={CARD_SIZE}
            height={680}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div style={{ display: "flex", fontSize: 160 }}>📕</div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "40px 56px",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", marginBottom: 16 }}>
          <Stars rating={log.rating} color={palette.accent} />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 800,
            color: "#1f2430",
            lineHeight: 1.25,
          }}
        >
          {log.title}
        </div>
        {(log.author || log.publisher) && (
          <div style={{ display: "flex", marginTop: 10, fontSize: 26, color: "#6b7280" }}>
            {[log.author, log.publisher].filter(Boolean).join(" · ")}
          </div>
        )}
        {log.one_line_review && (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 30,
              color: "#374151",
              lineHeight: 1.4,
            }}
          >
            &ldquo;{log.one_line_review}&rdquo;
          </div>
        )}
      </div>
      <Watermark />
    </div>
  );
}

export function MinimalQuoteCard({ log }: { log: ReadingLogWithMember }) {
  const palette = paletteFor(log.title + "q");
  const quoteText = log.quote || log.one_line_review || log.title;

  return (
    <div
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: palette.bg,
        position: "relative",
        fontFamily: "Pretendard",
        padding: 100,
      }}
    >
      <div style={{ display: "flex", fontSize: 90, color: palette.accent, marginBottom: 8 }}>
        {"“"}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 46,
          fontWeight: 800,
          color: "#1f2430",
          textAlign: "center",
          lineHeight: 1.45,
        }}
      >
        {quoteText}
      </div>

      <div
        style={{
          display: "flex",
          marginTop: 48,
        }}
      >
        <Stars rating={log.rating} color={palette.accent} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 28,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, fontWeight: 800, color: "#1f2430" }}>
          {log.title}
        </div>
        {log.author && (
          <div style={{ display: "flex", marginTop: 6, fontSize: 22, color: "#6b7280" }}>
            {log.author}
          </div>
        )}
      </div>
      <Watermark />
    </div>
  );
}

export function PolaroidPhotoCard({ log }: { log: ReadingLogWithMember }) {
  const palette = paletteFor(log.title + "p");
  const photo = log.photo_url || log.cover_url;

  return (
    <div
      style={{
        width: CARD_SIZE,
        height: CARD_SIZE,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#EFEAE3",
        position: "relative",
        fontFamily: "Pretendard",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "28px 28px 90px 28px",
          borderRadius: 6,
          boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
          transform: "rotate(-3deg)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 680,
            height: 680,
            background: "#f1f1f1",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" width={680} height={680} style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", fontSize: 140 }}>📖</div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
            width: 680,
          }}
        >
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#2b2b2b" }}>
            {log.title}
          </div>
          <div style={{ display: "flex", marginTop: 10 }}>
            <Stars rating={log.rating} size={24} color={palette.accent} />
          </div>
        </div>
      </div>
      <Watermark color="rgba(0,0,0,0.4)" />
    </div>
  );
}
