/* Mobile-only top + bottom fade for full-bleed page heroes. On phones the
   hero image is inset into a band (see each hero's image container) sitting
   on a solid BLACK section; these gradients smooth the band's top edge into
   the nav strip and its bottom edge into the black headline area. Many color
   stops keep the fade gradual (no visible banding). Desktop heroes keep
   their own flat overlay (this is `lg:hidden`). */
export function HeroMobileFade() {
  return (
    <>
      <div
        aria-hidden
        className="lg:hidden absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.85) 5%, rgba(0,0,0,0.6) 10%, rgba(0,0,0,0.32) 15%, rgba(0,0,0,0.12) 20%, transparent 25%)",
        }}
      />
      <div
        aria-hidden
        className="lg:hidden absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 5%, rgba(0,0,0,0.78) 9%, rgba(0,0,0,0.6) 13%, rgba(0,0,0,0.42) 18%, rgba(0,0,0,0.26) 23%, rgba(0,0,0,0.14) 28%, rgba(0,0,0,0.06) 33%, transparent 39%)",
        }}
      />
    </>
  );
}
