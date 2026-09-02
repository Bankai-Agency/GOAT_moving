import { AdminShell, TopBar } from "@/components/admin/Shell";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { Alert } from "@/components/admin/ui/card";
import { requireUser } from "@/lib/auth";
import { listMedia, type MediaItem } from "@/lib/admin/media";
import { isGitHubBackend } from "@/lib/admin/github";
import { MAX_UPLOAD_BYTES } from "@/lib/admin/image-store";

export const metadata = { title: "Медиа" };
export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const user = await requireUser();
  let items: MediaItem[] = [];
  let error: string | null = null;
  try {
    items = await listMedia();
  } catch (err) {
    error = err instanceof Error ? err.message : "Не удалось прочитать библиотеку";
  }

  return (
    <AdminShell username={user.username}>
      <TopBar
        title="Медиа"
        actions={<span className="text-xs text-muted-foreground">{items.length} файлов · лимит загрузки {MAX_UPLOAD_BYTES / 1024 / 1024} MB</span>}
      />
      <div className="flex-1 space-y-4 p-6">
        <p className="text-sm text-muted-foreground">
          Все картинки и&nbsp;видео сайта. Загрузите новый файл здесь или прямо в&nbsp;поле редактора, затем выберите его
          в&nbsp;нужном месте. Путь файла можно скопировать и&nbsp;вставить в&nbsp;любое поле «картинка».
        </p>
        {error && <Alert variant="destructive">{error}</Alert>}
        <MediaLibrary initialItems={items} github={isGitHubBackend()} />
      </div>
    </AdminShell>
  );
}
