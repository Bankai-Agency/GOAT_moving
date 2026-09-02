import { AdminShell, TopBar } from "@/components/admin/Shell";
import { InviteForm, RevokeInviteButton, UserRowActions } from "@/components/admin/UsersWidgets";
import {
  Alert,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/card";
import { envAuthMode, requireUser } from "@/lib/auth";
import { LIMITS, listActiveInvites, listUsers } from "@/lib/admin/users";

export const metadata = { title: "Пользователи" };
export const dynamic = "force-dynamic";

const fmt = (d: Date) => d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

export default async function UsersPage() {
  const me = await requireUser();

  if (envAuthMode) {
    return (
      <AdminShell username={me.username}>
        <TopBar title="Пользователи" />
        <div className="p-6">
          <Alert variant="warning">
            <p className="font-medium">База пользователей не&nbsp;подключена.</p>
            <p className="mt-1 text-sm">
              Сейчас вход выполняется по&nbsp;ADMIN_USERNAME / ADMIN_PASSWORD из&nbsp;переменных окружения - один
              владелец без приглашений и&nbsp;смены пароля. Чтобы добавить редакторов, задайте DATABASE_URL (Neon
              Postgres), выполните <code>npm run db:setup</code> и&nbsp;<code>npm run db:seed</code> - подробности
              в&nbsp;ADMIN.md.
            </p>
          </Alert>
        </div>
      </AdminShell>
    );
  }

  let users: Awaited<ReturnType<typeof listUsers>> = [];
  let invites: Awaited<ReturnType<typeof listActiveInvites>> = [];
  let dbError: string | null = null;
  try {
    [users, invites] = await Promise.all([listUsers(), listActiveInvites()]);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Ошибка базы данных";
  }
  const remaining = LIMITS.MAX_USERS - users.length - invites.length;

  return (
    <AdminShell username={me.username}>
      <TopBar
        title="Пользователи"
        actions={
          <span className="text-xs text-muted-foreground">
            {users.length} / {LIMITS.MAX_USERS} · свободно {Math.max(0, remaining)}
          </span>
        }
      />
      <div className="flex-1 space-y-4 p-6">
        {dbError && (
          <Alert variant="destructive">
            Не удалось прочитать базу: {dbError}. Проверьте DATABASE_URL и что выполнен <code>npm run db:setup</code>.
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Редакторы</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Логин</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead>Последний вход</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {u.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{u.username}</div>
                          {u.name && <div className="text-xs text-muted-foreground">{u.name}</div>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === "owner" ? "default" : "secondary"}>
                        {u.role}
                        {u.id === me.id && " · вы"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{fmt(u.createdAt)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.lastLoginAt ? fmt(u.lastLoginAt) : "—"}</TableCell>
                    <TableCell className="text-right">
                      <UserRowActions id={u.id} isSelf={u.id === me.id} isOwner={u.role === "owner"} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          <aside className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Пригласить редактора</CardTitle>
                <CardDescription>Ссылка действует 7 дней, по ней человек сам придумает логин и пароль.</CardDescription>
              </CardHeader>
              <CardContent>
                {remaining <= 0 ? (
                  <div className="rounded-md bg-warning/15 p-3 text-sm">
                    Лимит {LIMITS.MAX_USERS} редакторов достигнут. Удалите кого-то или отзовите приглашение.
                  </div>
                ) : (
                  <InviteForm />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ожидающие приглашения</CardTitle>
              </CardHeader>
              <CardContent>
                {invites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Приглашений нет.</p>
                ) : (
                  <ul className="flex flex-col divide-y">
                    {invites.map((i) => (
                      <li key={i.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{i.label ?? "без комментария"}</div>
                          <div className="text-xs text-muted-foreground">
                            до {i.expiresAt.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                          </div>
                        </div>
                        <RevokeInviteButton id={i.id} />
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AdminShell>
  );
}
