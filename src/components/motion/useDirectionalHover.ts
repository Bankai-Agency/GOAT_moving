"use client";

import { useEffect, useRef } from "react";

/* Port of the Osmo "directional button hover" JS as a React hook.
   Returns a ref you attach to the button element. The hook positions a
   `.dir-circle` child element at the cursor's coordinates on hover and
   sizes it based on horizontal offset from the button's center —
   producing the "fill-from-cursor" sweep effect. The button itself
   needs a `.dir-circle-wrap` overflow:hidden container with a
   `.dir-circle` inside (see `useDirectionalHover.css` styling in
   globals.css). Source attribution:
   https://www.osmo.supply — Directional Button Hover. */
export function useDirectionalHover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;
    const circle = button.querySelector<HTMLElement>(".dir-circle");
    if (!circle) return;

    const handler = (event: MouseEvent) => {
      const buttonRect = button.getBoundingClientRect();
      const buttonWidth = buttonRect.width;
      const buttonHeight = buttonRect.height;
      const buttonCenterX = buttonRect.left + buttonWidth / 2;

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const offsetXFromLeft = ((mouseX - buttonRect.left) / buttonWidth) * 100;
      const offsetYFromTop = ((mouseY - buttonRect.top) / buttonHeight) * 100;
      const offsetXFromCenter = Math.abs(((mouseX - buttonCenterX) / (buttonWidth / 2)) * 50);

      circle.style.left = `${offsetXFromLeft.toFixed(1)}%`;
      circle.style.top = `${offsetYFromTop.toFixed(1)}%`;
      circle.style.width = `${115 + Number(offsetXFromCenter.toFixed(1)) * 2}%`;
    };

    button.addEventListener("mouseenter", handler);
    button.addEventListener("mouseleave", handler);
    return () => {
      button.removeEventListener("mouseenter", handler);
      button.removeEventListener("mouseleave", handler);
    };
  }, []);

  return ref;
}
