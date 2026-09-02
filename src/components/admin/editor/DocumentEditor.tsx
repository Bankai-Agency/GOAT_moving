"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import type { Schema } from "@/lib/admin/schema";
import { deleteItemAction, saveDocumentAction, type SaveResult } from "@/app/admin/content/actions";
import { Button } from "../ui/button";
import { Alert } from "../ui/card";
import { FieldRenderer, type ErrorMap } from "./FieldRenderer";

export type DocumentEditorProps = {
  docId: string;
  schema: Schema;
  initial: Record<string, unknown>;
  baseHash: string;
  /** Collections: "edit" an existing item or create a "new" one. */
  itemMode?: "edit" | "new";
  originalKey?: string;
  /** Site pages affected by this document — shown as preview links. */
  previewUrls: string[];
  backHref: string;
  github: boolean;
  /** Message to show on load (e.g. after a redirect from "create"). */
  notice?: string;
};

/**
 * Schema-driven editor. Holds the whole document in state, renders the
 * fields recursively and sends the JSON to `saveDocumentAction`. The
 * `baseHash` guard makes the server reject a save when the file changed
 * since the form was loaded.
 */
export function DocumentEditor({
  docId,
  schema,
  initial,
  baseHash: initialHash,
  itemMode,
  originalKey,
  previewUrls,
  backHref,
  github,
  notice,
}: DocumentEditorProps) {
  const [value, setValue] = useState<Record<string, unknown>>(initial);
  const [baseHash, setBaseHash] = useState(initialHash);
  const [dirty, setDirty] = useState(itemMode === "new");
  const [deferBuild, setDeferBuild] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(
    notice ? { ok: true, hash: initialHash, deferred: false, message: notice } : null,
  );
  const [pending, startTransition] = useTransition();

  const errors: ErrorMap = {};
  if (result && !result.ok && result.errors) {
    for (const e of result.errors) errors[e.path] = e.message;
  }

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const update = useCallback((key: string, next: unknown) => {
    setValue((v) => ({ ...v, [key]: next }));
    setDirty(true);
  }, []);

  function save() {
    startTransition(async () => {
      const res = await saveDocumentAction({
        docId,
        baseHash,
        value,
        deferBuild,
        itemMode,
        originalKey,
      });
      // A server-side redirect (new / renamed item) resolves without a value:
      // the router is already navigating.
      if (!res) {
        setDirty(false);
        return;
      }
      setResult(res);
      if (res.ok) {
        setDirty(false);
        setBaseHash(res.hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  function remove() {
    if (!originalKey) return;
    if (!confirm(`Удалить «${originalKey}»? Страница исчезнет с сайта после пересборки.`)) return;
    startTransition(async () => {
      const res = await deleteItemAction({ docId, baseHash, key: originalKey, deferBuild });
      if (!res) {
        setDirty(false);
        return; // redirected server-side to the list
      }
      setResult(res);
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-28">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft /> Назад
          </Link>
        </Button>
        <div className="ml-auto flex flex-wrap gap-2">
          {previewUrls.map((u) => (
            <Button key={u} variant="outline" size="sm" asChild>
              <a href={u} target="_blank" rel="noopener noreferrer">
                {u} <ExternalLink />
              </a>
            </Button>
          ))}
        </div>
      </div>

      {result && !result.ok && (
        <Alert variant="destructive">
          <p className="font-medium">{result.error}</p>
          {result.errors && result.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-xs">
              {result.errors.map((e, i) => (
                <li key={i}>
                  <span className="font-mono">{e.path}</span>: {e.message}
                </li>
              ))}
            </ul>
          )}
        </Alert>
      )}
      {result && result.ok && !dirty && <Alert variant="positive">{result.message}</Alert>}

      <div className="flex flex-col gap-5">
        {schema.map((field) => (
          <FieldRenderer
            key={field.key}
            field={field}
            value={value[field.key]}
            onChange={(next) => update(field.key, next)}
            path={field.key}
            ctx={{ errors, github }}
          />
        ))}
      </div>

      {/* Sticky action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/90 backdrop-blur lg:left-60">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center gap-3 px-6 py-3">
          {itemMode === "edit" && originalKey && (
            <Button variant="ghost" size="sm" onClick={remove} disabled={pending} className="text-muted-foreground hover:text-destructive">
              <Trash2 /> Удалить
            </Button>
          )}
          <span className="text-xs text-muted-foreground">
            {dirty ? "Есть несохранённые изменения" : "Всё сохранено"}
          </span>
          <div className="ml-auto flex items-center gap-4">
            {github && (
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer accent-[#ffe533]"
                  checked={deferBuild}
                  onChange={(e) => setDeferBuild(e.target.checked)}
                />
                Сохранить без публикации
              </label>
            )}
            <Button variant="brand" onClick={save} disabled={pending || (!dirty && itemMode !== "new")}>
              {pending ? <Loader2 className="animate-spin" /> : <Save />}
              {itemMode === "new" ? "Создать" : "Сохранить"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
