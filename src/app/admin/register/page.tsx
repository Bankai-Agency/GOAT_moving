import Link from "next/link";
import { Logo } from "@/components/admin/Shell";
import { RegisterForm } from "@/components/admin/RegisterForm";
import { Button } from "@/components/admin/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { envAuthMode } from "@/lib/auth";
import { inspectInvite } from "@/lib/admin/users";

export const metadata = { title: "Регистрация" };
export const dynamic = "force-dynamic";

type SearchParams = { token?: string };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { token = "" } = await searchParams;
  const invite =
    envAuthMode || !token
      ? { valid: false, reason: envAuthMode ? ("no-db" as const) : ("missing" as const) }
      : await inspectInvite(token).catch(() => ({ valid: false, reason: "db-error" as const }));

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/40 px-6 py-12">
      <Card className="w-full max-w-[440px]">
        <CardHeader>
          <div className="mb-6">
            <Logo />
          </div>
          {invite.valid ? (
            <>
              <CardTitle className="text-2xl">Приглашение в админку</CardTitle>
              <CardDescription>
                {"label" in invite && invite.label ? `Для: ${invite.label}. ` : ""}
                Придумайте логин и&nbsp;пароль - после создания вы&nbsp;войдёте автоматически.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle className="text-2xl">Приглашение не&nbsp;активно</CardTitle>
              <CardDescription>{reasonText(invite.reason)}</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {invite.valid ? (
            <RegisterForm token={token} />
          ) : (
            <Button asChild variant="outline">
              <Link href="/admin/login">← Ко входу</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function reasonText(reason?: string): string {
  switch (reason) {
    case "not-found":
      return "Токен не найден. Возможно, ссылка была повреждена.";
    case "used":
      return "Это приглашение уже использовано. Если регистрировались вы - просто войдите. Если нет - попросите новую ссылку.";
    case "expired":
      return "Срок действия приглашения истёк (7 дней). Попросите новую ссылку у администратора.";
    case "no-db":
      return "База пользователей не подключена - приглашения недоступны.";
    case "db-error":
      return "Не удалось проверить приглашение: ошибка базы данных.";
    case "missing":
    default:
      return "В ссылке нет токена. Откройте полную ссылку из приглашения.";
  }
}
