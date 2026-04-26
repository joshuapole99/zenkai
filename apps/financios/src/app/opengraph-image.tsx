import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0F14",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top: brand */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: "white",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.5px",
            }}
          >
            Financios
          </span>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              color: "white",
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2.5px",
            }}
          >
            Waarom ben jij
          </div>
          <div
            style={{
              color: "#6366F1",
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2.5px",
            }}
          >
            altijd blut?
          </div>
          <div
            style={{
              color: "#9CA3AF",
              fontSize: 28,
              fontWeight: 400,
              marginTop: 28,
              lineHeight: 1.4,
            }}
          >
            Ontdek in 60 seconden waar je geld naartoe gaat.
          </div>
        </div>

        {/* Bottom: URL + badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#4B5563", fontSize: 22, fontWeight: 500 }}>
            financios.nl
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 100,
              padding: "10px 20px",
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: "#22C55E",
              }}
            />
            <span style={{ color: "#9CA3AF", fontSize: 19 }}>
              Gratis · geen account · 60 seconden
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
