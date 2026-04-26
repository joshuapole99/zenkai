"use client";

import { useEffect, useState } from "react";

export default function MomentScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 80);
    const advance = setTimeout(onDone, 4000);
    return () => { clearTimeout(show); clearTimeout(advance); };
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 cursor-pointer"
      style={{
        background: "#0a0a0a",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
      />
      <div className="text-center">
        <p
          className="font-black text-white leading-tight mb-3"
          style={{ fontSize: "clamp(2rem, 8vw, 3rem)" }}
        >
          You showed up.
        </p>
        <p className="text-gray-500 text-lg font-medium">
          That&apos;s the whole game.
        </p>
      </div>
      <p className="absolute bottom-10 text-xs text-gray-800">tap to continue</p>
    </div>
  );
}
