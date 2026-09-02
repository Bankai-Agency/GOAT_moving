"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Upload, X } from "lucide-react";
import type { MediaItem } from "@/lib/admin/media";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MediaThumb } from "./MediaThumb";

export type MediaPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** "image" hides videos, "video" shows only videos. */
  accept: "image" | "video";
  github: boolean;
};

let cache: MediaItem[] | null = null;

async function fetchMedia(): Promise<MediaItem[]> {
  if (cache) return cache;
  const res = await fetch("/api/admin/media");
  if (!res.ok) throw new Error("Не удалось загрузить библиотеку");
  const data = (await res.json()) as { items: MediaItem[] };
  cache = data.items;
  return cache;
}

export function invalidateMediaCache() {
  cache = null;
}

/** Upload one file through /api/admin/upload; returns its public URL. */
export async function uploadFile(file: File): Promise<{ url: string; kind: "image" | "video" }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = (await res.json()) as { url?: string; kind?: "image" | "video"; error?: string };
  if (!res.ok || !data.url) throw new Error(data.error ?? "Загрузка не удалась");
  invalidateMediaCache();
  return { url: data.url, kind: data.kind ?? "image" };
}

/**
 * Modal that lists everything under public/images, public/lp, public/videos
 * and the uploads folder. Click a tile to pick it; "Загрузить" adds a new
 * file and selects it right away.
 */
export function MediaPicker({ open, onClose, onSelect, accept, github }: MediaPickerProps) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState<string>("all");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    fetchMedia()
      .then((list) => {
        if (!cancelled) setItems(list);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Ошибка");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (accept === "video" ? it.kind !== "video" : it.kind === "video") return false;
      if (folder !== "all" && it.folder !== folder) return false;
      if (q && !it.name.toLowerCase().includes(q) && !it.url.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, folder, accept]);

  const folders = useMemo(() => {
    if (!items) return [];
    const set = new Set<string>();
    for (const it of items) {
      if (accept === "video" ? it.kind === "video" : it.kind !== "video") set.add(it.folder);
    }
    return [...set];
  }, [items, accept]);

  if (!open) return null;

  async function onPick(file: File) {
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadFile(file);
      onSelect(url);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Загрузка не удалась");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-5xl flex-col rounded-xl border bg-popover text-popover-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center gap-3 border-b p-4">
          <h3 className="text-sm font-semibold">{accept === "video" ? "Выбрать видео" : "Выбрать картинку"}</h3>
          <div className="relative ml-auto w-64 max-w-full">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по имени" className="pl-8" />
          </div>
          <label className="inline-flex cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept={accept === "video" ? "video/mp4,video/webm" : "image/*"}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onPick(f);
                e.target.value = "";
              }}
            />
            <Button asChild variant="brand" size="sm">
              <span>
                {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                Загрузить
              </span>
            </Button>
          </label>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Закрыть">
            <X />
          </Button>
        </div>

        {folders.length > 1 && (
          <div className="flex flex-wrap gap-1.5 border-b px-4 py-2">
            {["all", ...folders].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFolder(f)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors ${
                  folder === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {f === "all" ? "все" : f}
              </button>
            ))}
          </div>
        )}

        <div className="adm-scroll min-h-0 flex-1 overflow-y-auto p-4">
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
          {!items && !error && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Загружаем библиотеку…
            </p>
          )}
          {items && filtered.length === 0 && <p className="text-sm text-muted-foreground">Ничего не найдено.</p>}
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {filtered.map((it) => (
              <button
                key={it.url}
                type="button"
                onClick={() => {
                  onSelect(it.url);
                  onClose();
                }}
                className="group flex cursor-pointer flex-col gap-1 rounded-lg border p-1.5 text-left transition-colors hover:border-ring hover:bg-accent/40"
                title={it.url}
              >
                <MediaThumb url={it.url} kind={it.kind} github={github} className="aspect-[4/3] w-full rounded-md" />
                <span className="truncate text-[11px] text-muted-foreground">{it.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
