"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteItemAction, type SaveResult } from "@/app/admin/content/actions";
import { Button } from "../ui/button";
import { Alert } from "../ui/card";
import { Checkbox, Input, Label } from "../ui/input";

export type DeleteItemDialogProps = {
  docId: string;
  baseHash: string;
  /** The item's key (slug) - typed back by hand to confirm. */
  itemKey: string;
  /** What the heading calls it (city name, landing page name). */
  title: string;
  /** Public address of the page; null for collections that are not pages. */
  url: string | null;
  /** Other pages of the site, offered as redirect targets. */
  suggestions?: string[];
  github: boolean;
  initialDeferBuild?: boolean;
  size?: "sm" | "default";
};

const PATH_RE = /^\/[a-z0-9\-._~/]*$/i;

/**
 * Deleting a page, done carefully: the slug is typed back by hand, the
 * dialog explains what a missing redirect costs, and a 301 target can be
 * given right here so the old address keeps its link weight.
 */
export function DeleteItemDialog({
  docId,
  baseHash,
  itemKey,
  title,
  url,
  suggestions = [],
  github,
  initialDeferBuild = false,
  size = "sm",
}: DeleteItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const [deferBuild, setDeferBuild] = useState(initialDeferBuild);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, pending]);

  function show() {
    setConfirmText("");
    setRedirectTo("");
    setDeferBuild(initialDeferBuild);
    setResult(null);
    setOpen(true);
  }

  const target = redirectTo.trim();
  const redirectError = !target
    ? null
    : /\s/.test(target) || !PATH_RE.test(target) || target.startsWith("//")
      ? "Только путь на этом сайте, начиная с «/»"
      : url && target.replace(/\/+$/, "") === url
        ? "Нельзя перенаправить на удаляемую страницу"
        : null;
  const confirmed = confirmText.trim() === itemKey;
  const canDelete = confirmed && !redirectError && !pending;

  function remove() {
    if (!canDelete) return;
    startTransition(async () => {
      const res = await deleteItemAction({
        docId,
        baseHash,
        key: itemKey,
        deferBuild,
        redirectTo: target || undefined,
      });
      // A server-side redirect to the list resolves without a value.
      if (!res) return;
      setResult(res);
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size={size}
        onClick={show}
        className="text-muted-foreground hover:text-destructive"
        title="Удалить страницу"
      >
        <Trash2 /> Удалить
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${listId}-title`}
            className="w-full max-w-lg rounded-xl border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id={`${listId}-title`} className="text-lg font-semibold">
              Удалить «{title}»?
            </h2>

            {url ? (
              <div className="mt-3 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div className="space-y-1">
                  <p>
                    После пересборки адрес <span className="font-mono">{url}</span> будет отдавать 404. Если страница
                    уже в&nbsp;поиске, она потеряет позиции, а&nbsp;ссылки на&nbsp;неё станут битыми.
                  </p>
                  <p>
                    Укажите редирект: старый адрес будет отвечать 301 на&nbsp;выбранную страницу, и&nbsp;вес ссылок
                    перейдёт ей.
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Элемент исчезнет после пересборки.</p>
            )}

            {result && !result.ok && (
              <Alert variant="destructive" className="mt-4">
                {result.error}
                {result.errors?.map((e, i) => (
                  <div key={i} className="mt-1 text-xs">
                    {e.message}
                  </div>
                ))}
              </Alert>
            )}

            <div className="mt-5 space-y-4">
              {url && (
                <div className="space-y-1.5">
                  <Label htmlFor={`${listId}-redirect`}>Перенаправить на (301)</Label>
                  <Input
                    id={`${listId}-redirect`}
                    list={`${listId}-targets`}
                    value={redirectTo}
                    onChange={(e) => setRedirectTo(e.target.value)}
                    placeholder="/portland-movers"
                    className="font-mono"
                    autoComplete="off"
                    disabled={pending}
                  />
                  <datalist id={`${listId}-targets`}>
                    {suggestions
                      .filter((s) => s !== url)
                      .map((s) => (
                        <option key={s} value={s} />
                      ))}
                  </datalist>
                  <p className={`text-xs ${redirectError ? "text-destructive" : "text-muted-foreground"}`}>
                    {redirectError ??
                      "Необязательно, но для страниц с трафиком это главное. Обычно - ближайший город или главная «/»."}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor={`${listId}-confirm`}>
                  Для подтверждения введите <span className="font-mono">{itemKey}</span>
                </Label>
                <Input
                  id={`${listId}-confirm`}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={itemKey}
                  className="font-mono"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={pending}
                />
              </div>

              {github && (
                <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox checked={deferBuild} onChange={(e) => setDeferBuild(e.target.checked)} disabled={pending} />
                  Сохранить без публикации (выкатить вместе с&nbsp;остальными правками одной сборкой)
                </label>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={pending}>
                Отмена
              </Button>
              <Button variant="destructive" size="sm" onClick={remove} disabled={!canDelete}>
                {pending ? <Loader2 className="animate-spin" /> : <Trash2 />}
                {target ? "Удалить и перенаправить" : "Удалить"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
