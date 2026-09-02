"use client";

import { useActionState } from "react";
import { changePassword, saveProfile } from "@/app/admin/settings/actions";
import { Button } from "./ui/button";
import { Input, Label } from "./ui/input";
import { Alert } from "./ui/card";

export function ProfileForm({
  username,
  initialName,
  initialEmail,
}: {
  username: string;
  initialName: string;
  initialEmail: string;
}) {
  const [state, formAction, pending] = useActionState(saveProfile, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="prof-login">Логин</Label>
        <Input id="prof-login" defaultValue={username} readOnly />
        <span className="text-xs text-muted-foreground">Логин сменить нельзя.</span>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="prof-name">Имя</Label>
        <Input id="prof-name" name="name" defaultValue={initialName} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="prof-email">Email</Label>
        <Input id="prof-email" name="email" type="email" defaultValue={initialEmail} />
      </div>

      {state.error && <Alert variant="destructive">{state.error}</Alert>}
      {state.ok && <Alert variant="positive">{state.ok}</Alert>}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Сохраняем…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, {});

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <PasswordField name="current" label="Текущий пароль" autoComplete="current-password" disabled={pending} />
      <PasswordField name="next" label="Новый пароль" autoComplete="new-password" disabled={pending} />
      <PasswordField name="repeat" label="Повторите новый" autoComplete="new-password" disabled={pending} />

      {state.error && <Alert variant="destructive">{state.error}</Alert>}
      {state.ok && <Alert variant="positive">{state.ok}</Alert>}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Сохраняем…" : "Сменить пароль"}
        </Button>
      </div>
    </form>
  );
}

export function PasswordField({
  name,
  label,
  autoComplete,
  disabled,
}: {
  name: string;
  label: string;
  autoComplete: string;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="password" autoComplete={autoComplete} required disabled={disabled} />
    </div>
  );
}
