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
        /* Solid #f6f9ff base — same tint that the rest of the LP
           paints its light sections with (lp-theme.css light-section
           tint block). The earlier 2-stop `#f6f9ff → #ffffff`
           gradient left the BOTTOM of AboutSection visibly white,
           which seamed against the next section's #f6f9ff. Solid
           tint = seamless hand-off into CTABanner below. Blobs
           still float on top for the decorative glow.

           Opacity is tied to (1 − --dark-veil): when this backdrop
           sits INSIDE a DarkScrollZone (the Solution + Social Proof
           combined zone), it stays invisible while the dark veil is
           up and only fades in as the veil fades out. Outside any
           dark zone, --dark-veil is undefined → defaults to 0 →
           opacity 1 (fully visible), so this backdrop still works
           on its own. */
        backgroundColor: "#f6f9ff",
        opacity: "calc(1 - var(--dark-veil, 0))",
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
