import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "linear-gradient(135deg, #FF6B35, #7C3AED)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 102,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 300,
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: "sans-serif",
          }}
        >
          Z
        </span>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
