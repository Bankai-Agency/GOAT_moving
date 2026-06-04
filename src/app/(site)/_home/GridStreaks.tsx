"use client";

import { useEffect, useRef } from "react";

/* ════════════════════════════════════════════════════════════════
   GridStreaks — terminal-industries-style animated grid backdrop.

   Renders a static cell grid + light streaks that travel along
   grid edges with a bright leading head and a fade-out tail. The
   whole thing is one 2D canvas, rAF-driven, resize-aware (DPR
   scaled). Drop-in replacement for the SVG grid in the morph
   section.

   Tunables in the constants block below.
   ══════════════════════════════════════════════════════════════ */

const CELL = 240;                                  // px, full cell outline grid (desktop / >=768px)
const CELL_MOBILE = 130;                           // smaller cells on <768px so there are enough vertical/horizontal lines to read the grid AND give vertical streaks more lanes to travel on (narrow viewports otherwise only fit ~1 line at CELL=240, breaking symmetry)
const MOBILE_BREAKPOINT = 768;                     // px viewport width threshold for switching to CELL_MOBILE
const GRID_STROKE = "rgba(255, 255, 255, 0.06)";   // faint static grid
const STREAK_COLOR = [255, 229, 51] as const;      // brand yellow rgb tuple (#FFE533)
const STREAK_HEAD_COLOR = "rgba(255, 245, 150, ";  // brighter near-white-yellow head
const STREAK_BASE_LENGTH = 200;                    // px, before random scale
const STREAK_SPEED = 280;                          // px / sec
const DEFAULT_MAX_STREAKS = 0;                     // streaks disabled by default — only the static cell grid is drawn. Per-instance opt-in via the `maxStreaks` prop (the morph section uses MagicRings on top instead; benefits V1 enables vertical streaks).
const SPAWN_GAP_MIN = 0.4;                         // sec, lower bound between spawns
const SPAWN_GAP_MAX = 1.6;                         // sec, upper bound
const LIFE_MIN = 2.5;                              // sec, total visible lifetime
const LIFE_MAX = 4.5;                              // sec
const FADE_IN = 0.3;                               // sec
const FADE_OUT = 0.6;                              // sec

type Streak = {
  axis: "h" | "v";   // h = horizontal grid line (constant y), v = vertical
  line: number;      // grid-line index (1..n) — line position = (line) * CELL
  pos: number;       // current head position along the line (px)
  dir: 1 | -1;
  len: number;
  age: number;
  life: number;
};

export function GridStreaks({
  className,
  maxStreaks = DEFAULT_MAX_STREAKS,
  streakAxis = "h",
}: {
  className?: string;
  maxStreaks?: number;
  streakAxis?: "h" | "v";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

    const streaks: Streak[] = [];

    /* Effective cell size + centering offsets are re-derived on every
       resize. Centering: leftover space (w % cell) is split evenly so
       the FIRST line sits at (offsetX) and the LAST line at (w - offsetX)
       — guarantees visual symmetry around the centre on any viewport. */
    let cell = CELL;
    let offsetX = 0;
    let offsetY = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = window.innerWidth < MOBILE_BREAKPOINT ? CELL_MOBILE : CELL;
      offsetX = (w % cell) / 2;
      offsetY = (h % cell) / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = () => {
      /* Streak axis driven by the `streakAxis` prop. "h" travels
         left↔right along a random horizontal grid line; "v" travels
         top↔bottom along a random vertical grid line. Skip the two
         edge lines (i=0 and i=count-1) so streaks ride inner lines
         only — keeps the head dots away from clipping against the
         section's overflow:hidden edge. */
      const axis: "h" | "v" = streakAxis;
      const lineSpan = axis === "h" ? h : w;
      const totalLines = Math.floor(lineSpan / cell) + 1;
      const innerCount = Math.max(1, totalLines - 2);
      const line = 1 + Math.floor(Math.random() * innerCount);
      const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const span = axis === "h" ? w : h;
      const startPos = dir > 0 ? -STREAK_BASE_LENGTH : span + STREAK_BASE_LENGTH;
      streaks.push({
        axis,
        line,
        pos: startPos,
        dir,
        len: STREAK_BASE_LENGTH * (0.7 + Math.random() * 0.7),
        age: 0,
        life: LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN),
      });
    };

    let spawnTimer = 0.6; // first streak appears ~0.6s after mount

    const draw = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      ctx.clearRect(0, 0, w, h);

      /* Static grid lines, drawn from a CENTRED origin so the pattern
         is visually symmetric on every viewport.
         Line count = floor(span / cell) + 1, positions: offset + i*cell
         (i = 0..N). Left and right margins both equal `offset` — true
         symmetry. 0.5 offset keeps strokes crisp at 1px. */
      ctx.strokeStyle = GRID_STROKE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      const vLineCount = Math.floor(w / cell) + 1;
      for (let i = 0; i < vLineCount; i++) {
        const x = offsetX + i * cell;
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
      }
      const hLineCount = Math.floor(h / cell) + 1;
      for (let i = 0; i < hLineCount; i++) {
        const y = offsetY + i * cell;
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(w, Math.round(y) + 0.5);
      }
      ctx.stroke();

      /* Spawn timer. */
      spawnTimer -= dt;
      if (spawnTimer <= 0 && streaks.length < maxStreaks) {
        spawn();
        spawnTimer = SPAWN_GAP_MIN + Math.random() * (SPAWN_GAP_MAX - SPAWN_GAP_MIN);
      }

      /* Draw streaks. */
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.pos += s.dir * STREAK_SPEED * dt;
        s.age += dt;

        const bright =
          s.age < FADE_IN
            ? s.age / FADE_IN
            : s.age > s.life - FADE_OUT
              ? Math.max(0, (s.life - s.age) / FADE_OUT)
              : 1;

        /* Tail end (older, faded) → head end (current, bright).
           Line index maps to the centred-grid position so streaks
           ride the SAME lines the static grid draws. */
        let x0: number, y0: number, x1: number, y1: number;
        if (s.axis === "h") {
          const yLine = Math.round(offsetY + s.line * cell) + 0.5;
          y0 = y1 = yLine;
          x1 = s.pos;
          x0 = s.pos - s.dir * s.len;
        } else {
          const xLine = Math.round(offsetX + s.line * cell) + 0.5;
          x0 = x1 = xLine;
          y1 = s.pos;
          y0 = s.pos - s.dir * s.len;
        }

        const [R, G, B] = STREAK_COLOR;
        const grad = ctx.createLinearGradient(x0, y0, x1, y1);
        grad.addColorStop(0, `rgba(${R}, ${G}, ${B}, 0)`);
        grad.addColorStop(0.6, `rgba(${R}, ${G}, ${B}, 0.5)`);
        grad.addColorStop(1, `rgba(${R}, ${G}, ${B}, 1)`);

        ctx.globalAlpha = bright * 0.9;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        /* Bright head dot. */
        ctx.fillStyle = `${STREAK_HEAD_COLOR}${bright})`;
        ctx.beginPath();
        ctx.arc(x1, y1, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        /* Kill when fully past viewport OR life expired. */
        const span = s.axis === "h" ? w : h;
        const offscreen =
          s.dir > 0
            ? s.pos - s.len > span
            : s.pos + s.len < 0;
        if (offscreen || s.age >= s.life) streaks.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    let running = false;
    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };
    // Only animate while the canvas is on-screen — no need to run the
    // streak RAF for the whole page lifetime.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [maxStreaks, streakAxis]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}

export default GridStreaks;
