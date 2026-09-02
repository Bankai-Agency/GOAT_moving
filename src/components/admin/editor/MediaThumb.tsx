"use client";

import { useState } from "react";
import { Film, ImageOff } from "lucide-react";
import { cn } from "@/lib/admin/cn";

/**
 * Thumbnail for a public media path. Files uploaded since the last deploy
 * are not on the CDN yet, so on the GitHub backend a failed load falls back
 * to /api/admin/file (which reads the branch). Videos show a film icon.
 */
export function MediaThumb({
  url,
  kind,
  github,
  className,
}: {
  url: string;
  kind: "image" | "video" | "icon";
  github: boolean;
  className?: string;
}) {
  // Per-url load state; reset when the url prop changes (state derived
  // from props, adjusted during render as React recommends).
  const [state, setState] = useState({ url, src: url, failed: false });
  if (state.url !== url) {
    setState({ url, src: url, failed: false });
  }

  if (!url) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
        <Film className="h-5 w-5" />
      </div>
    );
  }

  if (state.failed) {
    return (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)} title="Файл не найден">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary public paths, no optimization needed
    <img
      src={state.src}
      alt=""
      loading="lazy"
      className={cn("bg-muted object-cover", kind === "icon" && "object-contain p-2", className)}
      onError={() => {
        if (github && !state.src.startsWith("/api/admin/file")) {
          setState({ url, src: `/api/admin/file?p=${encodeURIComponent(url)}`, failed: false });
        } else {
          setState({ url, src: state.src, failed: true });
        }
      }}
    />
  );
}
