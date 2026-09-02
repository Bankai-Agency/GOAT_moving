import { AdminShell, TopBar } from "@/components/admin/Shell";
import { PasswordForm, ProfileForm } from "@/components/admin/SettingsForms";
import { Alert, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { envAuthMode, requireUser } from "@/lib/auth";
import { getUser } from "@/lib/admin/users";
import { getIntegrations } from "@/lib/admin/status";

export const metadata = { title: "Настройки" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await requireUser();
  const profile = envAuthMode ? null : await getUser(me.id).catch(() => null);
  const integrations = getIntegrations();

  return (
    <AdminShell username={me.username}>
      <TopBar title="Настройки" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            {envAuthMode ? (
              <Alert variant="warning">
                Вход по&nbsp;ADMIN_USERNAME / ADMIN_PASSWORD из&nbsp;env: профиль и&nbsp;смена пароля появятся после
                подключения базы пользователей (DATABASE_URL), см.&nbsp;ADMIN.md.
              </Alert>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Профиль</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm
                      username={profile?.username ?? me.username}
                      initialName={profile?.name ?? ""}
                      initialEmail={profile?.email ?? ""}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Смена пароля</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PasswordForm />
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Интеграции</CardTitle>
                <CardDescription>Что подключено на этом окружении</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {integrations.map((i) => (
                    <li key={i.key} className="flex items-start gap-3">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i.ready ? "bg-positive" : "bg-warning"}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{i.name}</div>
                        <div className="text-xs text-muted-foreground">{i.hint}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Переменные окружения</CardTitle>
                <CardDescription>Задаются в Vercel → Settings → Environment Variables</CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <ul className="flex flex-col gap-1 font-mono">
                  <li>AUTH_SECRET</li>
                  <li>GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH</li>
                  <li>DATABASE_URL</li>
                  <li>ADMIN_USERNAME, ADMIN_PASSWORD (без базы)</li>
                </ul>
                <p className="mt-2 font-sans">Описание каждой - в .env.example и ADMIN.md.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
