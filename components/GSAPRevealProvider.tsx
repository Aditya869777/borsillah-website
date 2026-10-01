"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// RULEBOOK §10: GSAP-powered reveals. Every .reveal element
// gets a timeline driven by ScrollTrigger, not just a CSS class.
// Narrative reason: content appears as the user earns it by scrolling.
// ─────────────────────────────────────────────────────────────
export default function GSAPRevealProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // Batch all .reveal elements for performance
      ScrollTrigger.batch(".reveal", {
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              stagger: 0.09,
            }
          );
        },
        start: "top 88%",
        once: true,
      });

      // Hero product parallax depth plane (Rulebook §10 + §3)
      // Narrative reason: product floats at a different depth than typography
      const heroProduct = document.querySelector(".hero-product");
      if (heroProduct) {
        gsap.to(heroProduct, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Marquee tape in bridge section (Magic UI pattern — Rulebook §7)
      // Drives by CSS animation, but ScrollTrigger pauses it off-screen
      const tape = document.querySelector(".bridge-marquee");
      if (tape) {
        ScrollTrigger.create({
          trigger: ".bridge",
          start: "top bottom",
          end: "bottom top",
          onEnter: () => (tape as HTMLElement).style.animationPlayState = "running",
          onLeave: () => (tape as HTMLElement).style.animationPlayState = "paused",
          onEnterBack: () => (tape as HTMLElement).style.animationPlayState = "running",
          onLeaveBack: () => (tape as HTMLElement).style.animationPlayState = "paused",
        });
      }

      // Floating words in transform section — narrative: words becoming movement
      const floatingWords = document.querySelectorAll(".floating-word");
      floatingWords.forEach((word, i) => {
        const dir = i % 2 === 0 ? -30 : 30;
        gsap.fromTo(
          word,
          { x: dir, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".transform-stage",
              start: "top 75%",
              once: true,
            },
            delay: i * 0.08,
          }
        );
      });

      // Ecosystem ring nodes — spin into view
      const ecoNodes = document.querySelectorAll(".eco-node");
      ecoNodes.forEach((node, i) => {
        gsap.fromTo(
          node,
          { scale: 0.7, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: ".ecosystem-ring",
              start: "top 75%",
              once: true,
            },
            delay: i * 0.07,
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
