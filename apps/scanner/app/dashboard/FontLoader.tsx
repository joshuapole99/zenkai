"use client";
import { useEffect } from "react";

export function FontLoader() {
  useEffect(() => {
    if (document.querySelector("[data-sk-f]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,300&family=IBM+Plex+Mono:wght@400;500;600&display=swap";
    l.setAttribute("data-sk-f", "");
    document.head.appendChild(l);
  }, []);
  return null;
}
