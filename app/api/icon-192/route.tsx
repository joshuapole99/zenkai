import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          background: "linear-gradient(135deg, #FF6B35, #7C3AED)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 38,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 110,
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: "sans-serif",
          }}
        >
          Z
        </span>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
