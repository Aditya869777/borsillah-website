"use client";

import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────
// RULEBOOK §8: Aceternity-style custom cursor (desktop, fine pointer only)
// Gold dot + lagging ring. Enlarges on hover.
// ─────────────────────────────────────────────────────────────
export default function CustomCursor() {
  useEffect(() => {
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer || !dot || !ring) return;

    document.body.classList.add("cursor-ready");
    dot.style.opacity = "1";
    ring.style.opacity = "1";

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId: number;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };

    const animate = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      rafId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener("pointermove", onMove, { passive: true });

    document.querySelectorAll("a, button, [data-magnetic]").forEach((el) => {
      el.addEventListener("pointerenter", () => ring.classList.add("is-hover"));
      el.addEventListener("pointerleave", () => ring.classList.remove("is-hover"));
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return null;
}
