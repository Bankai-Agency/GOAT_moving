"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/change-password/actions";
import { Button } from "./ui/button";
import { Alert } from "./ui/card";
import { PasswordField } from "./SettingsForms";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <PasswordField name="current" label="Текущий пароль" autoComplete="current-password" disabled={pending} />
      <PasswordField name="next" label="Новый пароль" autoComplete="new-password" disabled={pending} />
      <PasswordField name="repeat" label="Повторите новый" autoComplete="new-password" disabled={pending} />

      {state.error && <Alert variant="destructive">{state.error}</Alert>}

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Сохраняем…" : "Сменить пароль"}
      </Button>
    </form>
  );
}
