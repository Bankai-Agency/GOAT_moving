/* BlueBlobBackdrop — reusable animated blob layer.
   ─────────────────────────────────────────────────
   Three large radial blobs in the LP blue/lavender palette,
   floating via the global `blob-float-a/b/c` keyframes. Rendered
   as an absolutely-positioned full-size layer so it can sit
   behind one or more sibling sections inside a `position:
   relative` wrapper. The base is a subtle 2-stop white→blue tint
   so even at rest there's a slight gradient.

   Durations bumped down (was 12/14/16s) so the motion is visible
   without staring — the blobs noticeably drift between halves
   of their cycle in a few seconds. */
export function BlueBlobBackdrop() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]"
      style={{
        background: "linear-gradient(180deg, #f6f9ff 0%, #ffffff 100%)",
      }}
    >
      {/* Blob opacities: desktop reads them clearly at the values
          below, but mobile loses them because the viewport is
          smaller relative to the blur radius. The `.lp-blob-*`
          marker classes let lp-theme.css bump opacity on narrow
          viewports without affecting desktop. The inline radial
          uses the variable `--blob-tint`; the wrapper / media
          query sets it. */}
      <div
        className="lp-blob lp-blob--a absolute top-[5%] left-[5%] w-[55vw] h-[55vw] max-w-[820px] max-h-[820px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 102, 255, var(--blob-tint-a, 0.22)) 0%, rgba(0, 102, 255, 0) 70%)",
          filter: "blur(60px)",
          animation: "blob-float-a 7s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="lp-blob lp-blob--b absolute bottom-[6%] right-[4%] w-[50vw] h-[50vw] max-w-[760px] max-h-[760px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(140, 120, 255, var(--blob-tint-b, 0.20)) 0%, rgba(140, 120, 255, 0) 70%)",
          filter: "blur(70px)",
          animation: "blob-float-b 9s ease-in-out infinite",
          animationDelay: "-2s",
          willChange: "transform",
        }}
      />
      <div
        className="lp-blob lp-blob--c absolute top-[42%] left-[40%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 102, 255, var(--blob-tint-c, 0.18)) 0%, rgba(0, 102, 255, 0) 70%)",
          filter: "blur(55px)",
          animation: "blob-float-c 11s ease-in-out infinite",
          animationDelay: "-4s",
          willChange: "transform",
        }}
      />
    </div>
  );
}
