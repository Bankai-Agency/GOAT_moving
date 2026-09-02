"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, Copy, KeyRound, Trash2 } from "lucide-react";
import {
  createInvite,
  deleteUserAction,
  resetPasswordAction,
  revokeInviteAction,
} from "@/app/admin/users/actions";
import { Button } from "./ui/button";
import { Input, Label } from "./ui/input";
import { Alert } from "./ui/card";

export function InviteForm() {
  const [state, formAction, pending] = useActionState(createInvite, {});
  const [copied, setCopied] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="invite-label">Комментарий (необязательно)</Label>
        <Input id="invite-label" name="label" type="text" maxLength={80} placeholder="Напр. Иван, менеджер" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Генерируем…" : "Создать ссылку"}
      </Button>

      {state.error && <Alert variant="destructive">{state.error}</Alert>}

      {state.url && (
        <Alert variant="positive">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Отправьте эту ссылку (активна 7 дней):
            </span>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={state.url}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="font-mono text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(state.url!);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  } catch {
                    /* ignore */
                  }
                }}
                title={copied ? "Скопировано" : "Копировать"}
              >
                {copied ? <CheckCircle2 /> : <Copy />}
              </Button>
            </div>
          </div>
        </Alert>
      )}
    </form>
  );
}

export function RevokeInviteButton({ id }: { id: string }) {
  return (
    <form
      action={revokeInviteAction}
      onSubmit={(e) => {
        if (!confirm("Отозвать приглашение? Ссылка перестанет работать.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
        Отозвать
      </Button>
    </form>
  );
}

export function UserRowActions({ id, isSelf, isOwner }: { id: string; isSelf: boolean; isOwner: boolean }) {
  const [resetState, resetAction, resetPending] = useActionState(resetPasswordAction, {});
  const deleteDisabled = isSelf || isOwner;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <form action={resetAction}>
        <input type="hidden" name="id" value={id} />
        <Button type="submit" variant="outline" size="sm" disabled={resetPending} title="Сгенерировать временный пароль">
          <KeyRound className="h-3.5 w-3.5" />
          {resetPending ? "…" : "Сбросить пароль"}
        </Button>
      </form>

      {resetState.ok && (
        <span className="max-w-[240px] rounded-md bg-warning/15 px-2 py-1 font-mono text-xs text-foreground">{resetState.ok}</span>
      )}
      {resetState.error && (
        <span className="rounded-md bg-destructive/15 px-2 py-1 text-xs text-destructive">{resetState.error}</span>
      )}

      <form
        action={deleteUserAction}
        onSubmit={(e) => {
          if (!confirm("Удалить пользователя? Это действие необратимо.")) e.preventDefault();
        }}
      >
        <input type="hidden" name="id" value={id} />
        <Button
          type="submit"
          variant="destructive"
          size="sm"
          disabled={deleteDisabled}
          title={isSelf ? "Нельзя удалить самого себя" : isOwner ? "Нельзя удалить владельца" : ""}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Удалить
        </Button>
      </form>
    </div>
  );
}
