"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Loader2, Search, Upload } from "lucide-react";
import type { MediaItem } from "@/lib/admin/media";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert } from "./ui/card";
import { MediaThumb } from "./editor/MediaThumb";
import { uploadFile } from "./editor/MediaPicker";

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  if (n >= 1024) return `${Math.round(n / 1024)} KB`;
  return `${n} B`;
}

export function MediaLibrary({ initialItems, github }: { initialItems: MediaItem[]; github: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const folders = useMemo(() => [...new Set(items.map((i) => i.folder))], [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (folder !== "all" && it.folder !== folder) return false;
      if (q && !it.name.toLowerCase().includes(q) && !it.url.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, folder]);

  async function onPick(file: File) {
    setUploading(true);
    setNotice(null);
    try {
      const res = await uploadFile(file);
      setItems((list) => {
        if (list.some((i) => i.url === res.url)) return list;
        const name = res.url.split("/").pop() ?? res.url;
        return [{ url: res.url, name, folder: "uploads", bytes: file.size, kind: res.kind }, ...list];
      });
      setNotice({
        kind: "ok",
        text: github
          ? `Загружено: ${res.url}. Файл закоммичен и попадёт на сайт вместе со следующей публикацией.`
          : `Загружено: ${res.url}`,
      });
    } catch (err) {
      setNotice({ kind: "error", text: err instanceof Error ? err.message : "Загрузка не удалась" });
    } finally {
      setUploading(false);
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по имени файла" className="pl-8" />
        </div>
        <label className="inline-flex cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*,video/mp4,video/webm"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onPick(f);
              e.target.value = "";
            }}
          />
          <Button asChild variant="brand" size="sm">
            <span>
              {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
              Загрузить файл
            </span>
          </Button>
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {["all", ...folders].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFolder(f)}
            className={`cursor-pointer rounded-md px-2.5 py-1 text-xs transition-colors ${
              folder === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
            }`}
          >
            {f === "all" ? `все (${items.length})` : `${f} (${items.filter((i) => i.folder === f).length})`}
          </button>
        ))}
      </div>

      {notice && <Alert variant={notice.kind === "ok" ? "positive" : "destructive"}>{notice.text}</Alert>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {filtered.map((it) => (
          <div key={it.url} className="flex flex-col gap-1.5 rounded-lg border bg-card p-2">
            <MediaThumb url={it.url} kind={it.kind} github={github} className="aspect-[4/3] w-full rounded-md" />
            <div className="truncate text-xs font-medium" title={it.name}>
              {it.name}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground">
                {it.folder} · {formatBytes(it.bytes)}
              </span>
              <Button variant="ghost" size="iconSm" onClick={() => copy(it.url)} title="Скопировать путь">
                {copied === it.url ? <Check /> : <Copy />}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">Ничего не найдено.</p>}
    </div>
  );
}
