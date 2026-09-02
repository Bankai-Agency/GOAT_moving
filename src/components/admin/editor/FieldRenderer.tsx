"use client";

import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Copy, FolderOpen, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import type { Field } from "@/lib/admin/schema";
import { emptyObject } from "@/lib/admin/schema";
import { ICON_OPTIONS, SiteIcon } from "@/lib/content/icons";
import { cn } from "@/lib/admin/cn";
import { Button } from "../ui/button";
import { Input, Label, Select, Textarea } from "../ui/input";
import { MediaPicker, uploadFile } from "./MediaPicker";
import { MediaThumb } from "./MediaThumb";

export type ErrorMap = Record<string, string>;

type Ctx = { errors: ErrorMap; github: boolean };

type Props = {
  field: Field;
  value: unknown;
  onChange: (next: unknown) => void;
  path: string;
  ctx: Ctx;
};

function FieldShell({
  field,
  path,
  ctx,
  children,
  inline,
}: {
  field: Field;
  path: string;
  ctx: Ctx;
  children: ReactNode;
  inline?: boolean;
}) {
  const error = ctx.errors[path];
  return (
    <div className={cn("flex flex-col gap-1.5", inline && "flex-row items-center gap-3")}>
      <Label htmlFor={path} className={cn(error && "text-destructive")}>
        {field.label}
        {"required" in field && field.required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {field.help && !error && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

/* ───────────── media (image / video) ───────────── */

function MediaField({ field, value, onChange, path, ctx }: Props & { field: Extract<Field, { type: "image" | "video" }> }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const url = typeof value === "string" ? value : "";
  const accept = field.type === "video" ? "video" : "image";

  async function onPick(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await uploadFile(file);
      onChange(res.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Загрузка не удалась");
    } finally {
      setUploading(false);
    }
  }

  return (
    <FieldShell field={field} path={path} ctx={ctx}>
      <div className="flex items-start gap-3">
        <MediaThumb
          url={url}
          kind={accept === "video" ? "video" : url.endsWith(".svg") ? "icon" : "image"}
          github={ctx.github}
          className="h-20 w-28 shrink-0 rounded-md border"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input
            id={path}
            value={url}
            onChange={(e) => onChange(e.target.value)}
            placeholder={accept === "video" ? "/videos/clip.mp4" : "/images/photo.jpg"}
            className="font-mono text-xs"
          />
          <div className="flex flex-wrap gap-2">
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
              <Button asChild variant="outline" size="sm" disabled={uploading}>
                <span>
                  {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                  Загрузить
                </span>
              </Button>
            </label>
            <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              <FolderOpen /> Выбрать из библиотеки
            </Button>
            {url && (
              <Button variant="ghost" size="sm" onClick={() => onChange("")} className="text-muted-foreground">
                <X /> Очистить
              </Button>
            )}
          </div>
          {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
        </div>
      </div>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(u) => onChange(u)}
        accept={accept}
        github={ctx.github}
      />
    </FieldShell>
  );
}

/* ───────────── strings ───────────── */

function StringsField({ field, value, onChange, path, ctx }: Props & { field: Extract<Field, { type: "strings" }> }) {
  const list = Array.isArray(value) ? (value as string[]) : [];
  const set = (next: string[]) => onChange(next);
  return (
    <FieldShell field={field} path={path} ctx={ctx}>
      <div className="flex flex-col gap-2">
        {list.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={s}
              onChange={(e) => set(list.map((x, j) => (j === i ? e.target.value : x)))}
              id={i === 0 ? path : undefined}
            />
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => set(list.filter((_, j) => j !== i))}
              aria-label="Удалить"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        <div>
          <Button variant="outline" size="sm" onClick={() => set([...list, ""])}>
            <Plus /> Добавить {field.itemLabel ?? "элемент"}
          </Button>
        </div>
      </div>
    </FieldShell>
  );
}

/* ───────────── list of objects ───────────── */

function itemTitle(field: Extract<Field, { type: "list" }>, item: unknown, index: number): string {
  const label = field.itemLabel ?? "элемент";
  if (field.titleKey && item && typeof item === "object") {
    const v = (item as Record<string, unknown>)[field.titleKey];
    if (typeof v === "string" && v.trim()) return v.length > 70 ? v.slice(0, 70) + "…" : v;
  }
  return `${label} ${index + 1}`;
}

function ListField({ field, value, onChange, path, ctx }: Props & { field: Extract<Field, { type: "list" }> }) {
  const list = Array.isArray(value) ? (value as unknown[]) : [];
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const set = (next: unknown[]) => onChange(next);
  const error = ctx.errors[path];

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    set(next);
    setOpen((o) => ({ ...o, [i]: o[j] ?? false, [j]: o[i] ?? false }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className={cn(error && "text-destructive")}>
          {field.label} <span className="text-muted-foreground">({list.length})</span>
        </Label>
      </div>
      {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex flex-col gap-2">
        {list.map((item, i) => {
          const isOpen = open[i] ?? false;
          const itemPath = `${path}[${i}]`;
          const hasError = Object.keys(ctx.errors).some((k) => k.startsWith(itemPath));
          return (
            <div key={i} className={cn("rounded-lg border bg-card", hasError && "border-destructive/60")}>
              <div className="flex items-center gap-1 px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [i]: !isOpen }))}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-left text-sm hover:bg-accent/50"
                >
                  {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                  <span className="w-6 shrink-0 font-mono text-xs text-muted-foreground">{i + 1}</span>
                  <span className="truncate">{itemTitle(field, item, i)}</span>
                </button>
                <Button variant="ghost" size="iconSm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Выше">
                  <ArrowUp />
                </Button>
                <Button variant="ghost" size="iconSm" onClick={() => move(i, 1)} disabled={i === list.length - 1} aria-label="Ниже">
                  <ArrowDown />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => {
                    const copy = JSON.parse(JSON.stringify(item)) as unknown;
                    set([...list.slice(0, i + 1), copy, ...list.slice(i + 1)]);
                  }}
                  aria-label="Дублировать"
                >
                  <Copy />
                </Button>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => {
                    if (confirm(`Удалить «${itemTitle(field, item, i)}»?`)) set(list.filter((_, j) => j !== i));
                  }}
                  aria-label="Удалить"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 />
                </Button>
              </div>
              {isOpen && (
                <div className="flex flex-col gap-4 border-t p-4">
                  {field.fields.map((sub) => (
                    <FieldRenderer
                      key={sub.key}
                      field={sub}
                      value={(item as Record<string, unknown>)?.[sub.key]}
                      onChange={(v) =>
                        set(list.map((x, j) => (j === i ? { ...(x as Record<string, unknown>), [sub.key]: v } : x)))
                      }
                      path={`${itemPath}.${sub.key}`}
                      ctx={ctx}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            set([...list, emptyObject(field.fields)]);
            setOpen((o) => ({ ...o, [list.length]: true }));
          }}
        >
          <Plus /> Добавить {field.itemLabel ?? "элемент"}
        </Button>
      </div>
    </div>
  );
}

/* ───────────── group ───────────── */

function GroupField({ field, value, onChange, path, ctx }: Props & { field: Extract<Field, { type: "group" }> }) {
  const [open, setOpen] = useState(!field.collapsed);
  const obj = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const hasError = Object.keys(ctx.errors).some((k) => k.startsWith(path + "."));
  return (
    <fieldset className={cn("rounded-xl border bg-card/50", hasError && "border-destructive/60")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-semibold hover:bg-accent/40"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {field.label}
        {field.help && <span className="ml-2 font-normal text-muted-foreground">{field.help}</span>}
      </button>
      {open && (
        <div className="flex flex-col gap-5 border-t p-4">
          {field.fields.map((sub) => (
            <FieldRenderer
              key={sub.key}
              field={sub}
              value={obj[sub.key]}
              onChange={(v) => onChange({ ...obj, [sub.key]: v })}
              path={`${path}.${sub.key}`}
              ctx={ctx}
            />
          ))}
        </div>
      )}
    </fieldset>
  );
}

/* ───────────── dispatcher ───────────── */

export function FieldRenderer(props: Props) {
  const { field, value, onChange, path, ctx } = props;
  switch (field.type) {
    case "text":
      return (
        <FieldShell field={field} path={path} ctx={ctx}>
          <Input
            id={path}
            value={typeof value === "string" ? value : value == null ? "" : String(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cn(field.mono && "font-mono text-xs")}
          />
        </FieldShell>
      );
    case "textarea":
      return (
        <FieldShell field={field} path={path} ctx={ctx}>
          <Textarea
            id={path}
            value={typeof value === "string" ? value : value == null ? "" : String(value)}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows ?? 3}
          />
        </FieldShell>
      );
    case "number":
      return (
        <FieldShell field={field} path={path} ctx={ctx}>
          <Input
            id={path}
            type="number"
            value={typeof value === "number" ? value : value == null ? "" : String(value)}
            min={field.min}
            max={field.max}
            onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-32"
          />
        </FieldShell>
      );
    case "boolean":
      return (
        <div className="flex items-center gap-3">
          <input
            id={path}
            type="checkbox"
            className="h-4 w-4 cursor-pointer accent-[#ffe533]"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
          />
          <Label htmlFor={path}>{field.label}</Label>
          {field.help && <span className="text-xs text-muted-foreground">{field.help}</span>}
        </div>
      );
    case "select":
      return (
        <FieldShell field={field} path={path} ctx={ctx}>
          <Select
            id={path}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-auto min-w-48"
          >
            {field.optional && <option value="">— не задано —</option>}
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </FieldShell>
      );
    case "icon": {
      const name = typeof value === "string" ? value : "";
      return (
        <FieldShell field={field} path={path} ctx={ctx}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#181818] text-[#FFE533]">
              {name && <SiteIcon name={name} size={22} />}
            </span>
            <Select id={path} value={name} onChange={(e) => onChange(e.target.value)} className="w-auto min-w-56">
              {!ICON_OPTIONS.some((o) => o.value === name) && <option value={name}>{name || "— выбрать —"}</option>}
              {ICON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </FieldShell>
      );
    }
    case "image":
    case "video":
      return <MediaField {...props} field={field} />;
    case "strings":
      return <StringsField {...props} field={field} />;
    case "list":
      return <ListField {...props} field={field} />;
    case "group":
      return <GroupField {...props} field={field} />;
  }
}
