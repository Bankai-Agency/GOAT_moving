import { redirect } from "next/navigation";
import { Logo } from "@/components/admin/Shell";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { currentUser, envAuthMode } from "@/lib/auth";

export const metadata = { title: "Смена пароля" };
export const dynamic = "force-dynamic";

export default async function ChangePasswordPage() {
  if (envAuthMode) redirect("/admin/dashboard");
  const me = await currentUser();
  const forced = Boolean(me?.mustChangePassword);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-6 py-12">
      <Card className="w-full max-w-[440px]">
        <CardHeader>
          <div className="mb-6">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Смена пароля</CardTitle>
          <CardDescription>
            {forced
              ? "Это первый вход - придумайте новый пароль. Текущий (временный) пароль нужно заменить."
              : "Введите текущий пароль для подтверждения и задайте новый."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
