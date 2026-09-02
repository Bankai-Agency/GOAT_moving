"use client";

import { useActionState } from "react";
import { Loader2, Rocket } from "lucide-react";
import { publishPending, type PublishState } from "@/app/admin/content/actions";
import { Button } from "./ui/button";

/**
 * "Опубликовать накопленное" — triggers one Vercel build that picks up all
 * draft saves ([skip deploy] commits) made since the last deploy. Safe to
 * press with nothing pending: the build just re-deploys the same content.
 */
export function PublishPendingButton() {
  const [state, formAction, pending] = useActionState<PublishState, FormData>(publishPending, {});

  return (
    <form action={formAction} className="flex items-center gap-2">
      {state.error && <span className="text-xs text-destructive">{state.error}</span>}
      {state.ok && <span className="text-xs text-muted-foreground">Сборка запущена, ~2-3 минуты</span>}
      <Button type="submit" size="sm" variant="brand" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Rocket />}
        Опубликовать накопленное
      </Button>
    </form>
  );
}
