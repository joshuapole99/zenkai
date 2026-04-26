"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [androidPrompt, setAndroidPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("pwa-banner-dismissed")) return;

    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      setShowIOS(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setAndroidPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!androidPrompt) return;
    await androidPrompt.prompt();
    const { outcome } = await androidPrompt.userChoice;
    if (outcome === "accepted") setAndroidPrompt(null);
  }

  function handleDismiss() {
    localStorage.setItem("pwa-banner-dismissed", "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  if (showIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📱</span>
              <p className="text-sm font-semibold text-foreground">Installeer als app</p>
            </div>
            <button onClick={handleDismiss} className="text-muted hover:text-foreground transition-colors text-sm shrink-0">✕</button>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Tik op <span className="inline-flex items-center gap-0.5 bg-background border border-border rounded px-1.5 py-0.5 text-foreground font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l-1.5 4.5H4l5.5 3.5-2 5.5L12 12l4.5 3.5-2-5.5L20 6.5h-6.5L12 2z" /><path d="M8.59 16.59L7 18l1 1 8-8-1-1-6.41 6.59z" /><path d="M12 2v13M8 7l4-5 4 5" /></svg>
              Delen
            </span> onderaan Safari → <span className="text-foreground font-medium">"Zet op beginscherm"</span>
          </p>
        </div>
      </div>
    );
  }

  if (!androidPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-sm">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 text-xl">📱</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Installeer als app</p>
          <p className="text-xs text-muted">Voeg toe aan je beginscherm</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstall}
            className="text-xs font-semibold bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-lg transition-all"
          >
            Installeer
          </button>
          <button onClick={handleDismiss} className="text-xs text-muted hover:text-foreground transition-colors px-1">✕</button>
        </div>
      </div>
    </div>
  );
}
