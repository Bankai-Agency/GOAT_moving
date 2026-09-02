import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminShell, TopBar } from "@/components/admin/Shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { requireUser } from "@/lib/auth";
import { DOCUMENTS, findDocument } from "@/lib/admin/documents";
import { readDocument, recentContentCommits } from "@/lib/admin/content-store";
import { getIntegrations } from "@/lib/admin/status";
import { isGitHubBackend } from "@/lib/admin/github";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function collectionCount(id: string): Promise<number> {
  const def = findDocument(id);
  if (!def) return 0;
  try {
    const doc = await readDocument(def);
    const items = (doc?.data as { items?: unknown[] } | null)?.items;
    return Array.isArray(items) ? items.length : 0;
  } catch {
    return 0;
  }
}

export default async function DashboardPage() {
  const user = await requireUser();
  const [locations, lps, commits] = await Promise.all([
    collectionCount("locations"),
    collectionCount("lp-cities"),
    recentContentCommits(8),
  ]);
  const integrations = getIntegrations();
  const pageDocs = DOCUMENTS.filter((d) => d.kind === "single");

  return (
    <AdminShell username={user.username}>
      <TopBar
        title="Dashboard"
        actions={
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Открыть сайт <ExternalLink className="h-3 w-3" />
          </Link>
        }
      />
      <div className="flex-1 space-y-4 p-6">
        {!isGitHubBackend() && (
          <div className="rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm">
            Режим разработки: правки сохраняются прямо в&nbsp;файлы проекта и&nbsp;сразу видны на&nbsp;dev-сервере.
            На&nbsp;проде задайте GITHUB_TOKEN / GITHUB_REPO - тогда каждое сохранение станет коммитом
            и&nbsp;Vercel пересоберёт сайт.
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Страниц и блоков" value={String(pageDocs.length)} hint="редактируемых документов" href="/admin/content" />
          <Metric label="Городов (SEO)" value={String(locations)} hint="/{city}-movers" href="/admin/content/locations" />
          <Metric label="Лендингов" value={String(lps)} hint="/lp/movers-…" href="/admin/content/lp-cities" />
          <Metric label="Публикация" value={isGitHubBackend() ? "GitHub" : "Файлы"} hint={isGitHubBackend() ? "коммит → сборка Vercel" : "локально, без сборки"} href="/admin/settings" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Недавние правки контента</CardTitle>
              <CardDescription>{isGitHubBackend() ? "Коммиты в src/content" : "git log · src/content"}</CardDescription>
            </CardHeader>
            <CardContent>
              {commits.length === 0 ? (
                <p className="text-sm text-muted-foreground">Пока нет коммитов с правками контента.</p>
              ) : (
                <ul className="flex flex-col divide-y">
                  {commits.map((c) => (
                    <li key={c.sha} className="flex items-start gap-4 py-3 first:pt-0 last:pb-0">
                      <code className="w-16 shrink-0 font-mono text-xs text-muted-foreground">{c.sha}</code>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{c.message}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.author}
                          {c.date ? ` · ${new Date(c.date).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : ""}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Интеграции</CardTitle>
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
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Как это работает</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm text-muted-foreground md:grid-cols-3">
            <div>
              <div className="mb-1 font-medium text-foreground">1. Редактируете</div>
              Тексты, картинки и&nbsp;списки (отзывы, FAQ, карточки) - в&nbsp;разделе «Контент». Картинки можно
              загрузить или выбрать из&nbsp;библиотеки «Медиа».
            </div>
            <div>
              <div className="mb-1 font-medium text-foreground">2. Сохраняете</div>
              Сохранение делает коммит в&nbsp;репозиторий. Галочка «без публикации» копит правки, а&nbsp;кнопка
              «Опубликовать накопленное» выпускает их одной сборкой.
            </div>
            <div>
              <div className="mb-1 font-medium text-foreground">3. Сайт обновляется</div>
              Vercel пересобирает сайт после коммита - изменения видны примерно через 2-3 минуты.
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

function Metric({ label, value, hint, href }: { label: string; value: string; hint: string; href: string }) {
  return (
    <Link href={href} className="block">
      <Card className="h-full transition-colors hover:bg-accent/40">
        <CardHeader className="pb-2">
          <CardDescription>{label}</CardDescription>
          <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">{hint}</div>
        </CardContent>
      </Card>
    </Link>
  );
}
