"use client";

import dynamic from "next/dynamic";

/* Client wrapper so the home page (a Server Component) can ssr:false the
   QuoteModal. The modal is hidden until the `open-quote-modal` event fires,
   so there's nothing meaningful to SSR — deferring it keeps its JS out of
   the home's initial hydration. The chunk loads right after hydration, so
   the open-quote-modal listener is attached before a real click can land. */
export const QuoteModalLazy = dynamic(
  () => import("./QuoteModal").then((m) => m.QuoteModal),
  { ssr: false },
);
