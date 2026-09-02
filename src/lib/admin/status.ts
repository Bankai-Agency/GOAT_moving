import { dbConfigured } from "@/lib/db";
import { githubBranch, githubRepo, isGitHubBackend } from "./github";

/**
 * Integration readiness — shown on the dashboard and settings pages so the
 * owner can see at a glance where saves go and what still needs an env var.
 */
export type IntegrationStatus = {
  key: string;
  name: string;
  ready: boolean;
  hint: string;
};

export function getIntegrations(): IntegrationStatus[] {
  const gh = isGitHubBackend();
  return [
    {
      key: "github",
      name: "Публикация (GitHub → Vercel)",
      ready: gh,
      hint: gh
        ? `Сохранения коммитятся в ${githubRepo()}@${githubBranch()}, Vercel пересобирает сайт`
        : "GITHUB_TOKEN / GITHUB_REPO не заданы: правки пишутся в файлы проекта (режим разработки)",
    },
    {
      key: "db",
      name: "База пользователей (Neon Postgres)",
      ready: dbConfigured,
      hint: dbConfigured
        ? "Подключена: приглашения, смена пароля, несколько редакторов"
        : "DATABASE_URL не задан: вход по ADMIN_USERNAME / ADMIN_PASSWORD из env",
    },
    {
      key: "secret",
      name: "AUTH_SECRET",
      ready: Boolean(process.env.AUTH_SECRET),
      hint: process.env.AUTH_SECRET ? "Задан" : "Не задан: в проде обязателен (openssl rand -base64 32)",
    },
  ];
}
