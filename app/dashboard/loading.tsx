export default function DashboardLoading() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="font-black text-lg tracking-tight gradient-text">ZENKAI</span>
        <div className="w-16 h-4 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">

        {/* Character card skeleton */}
        <div
          className="rounded-2xl p-6 animate-pulse"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="w-24 h-3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-40 h-7 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl p-3 h-16" style={{ background: "rgba(255,255,255,0.03)" }} />
                ))}
              </div>
            </div>
            <div className="rounded-xl flex-shrink-0" style={{ width: 72, height: 96, background: "rgba(255,255,255,0.04)" }} />
          </div>
        </div>

        {/* XP bar skeleton */}
        <div className="animate-pulse space-y-2">
          <div className="flex justify-between">
            <div className="w-12 h-3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-20 h-3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* HP bar skeleton */}
        <div className="animate-pulse space-y-2">
          <div className="flex justify-between">
            <div className="w-28 h-3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-12 h-3 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Enemy card skeleton */}
        <div
          className="rounded-2xl p-4 animate-pulse"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-4">
            <div className="rounded-xl flex-shrink-0" style={{ width: 64, height: 84, background: "rgba(255,255,255,0.04)" }} />
            <div className="flex-1 space-y-2">
              <div className="w-20 h-2.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="w-32 h-5 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="w-full h-3 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="flex gap-1.5 mt-2">
                <div className="w-7 h-1.5 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="w-7 h-1.5 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="w-7 h-1.5 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quest card skeletons */}
        <div className="space-y-3">
          <div className="w-24 h-3 rounded animate-pulse" style={{ background: "rgba(255,255,255,0.06)" }} />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl p-4 animate-pulse"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="w-36 h-4 rounded" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="w-24 h-3 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
                <div className="w-20 h-8 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
