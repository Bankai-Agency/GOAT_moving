import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Plus } from "lucide-react";
import { AdminShell, TopBar } from "@/components/admin/Shell";
import { DocumentEditor } from "@/components/admin/editor/DocumentEditor";
import { Button } from "@/components/admin/ui/button";
import { Alert, Badge, Card, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/admin/ui/card";
import { requireUser } from "@/lib/auth";
import { findDocument, type DocumentDef } from "@/lib/admin/documents";
import { readDocument } from "@/lib/admin/content-store";
import { isGitHubBackend } from "@/lib/admin/github";
import { emptyObject } from "@/lib/admin/schema";

export const dynamic = "force-dynamic";

type Params = { path: string[] };
type Search = { saved?: string; deleted?: string };

function savedNotice(saved?: string): string | undefined {
  if (saved === "deferred") {
    return "Сохранено без публикации. Когда закончите все правки - нажмите «Опубликовать накопленное» в списке документов.";
  }
  if (saved) return "Сохранено.";
  return undefined;
}

/** `/admin/content/services/local-moving` → doc; `/admin/content/locations/portland-movers` → doc + item. */
function resolve(path: string[]): { def: DocumentDef; itemKey?: string } | null {
  const full = findDocument(path.join("/"));
  if (full) return { def: full };
  if (path.length >= 2) {
    const def = findDocument(path.slice(0, -1).join("/"));
    if (def && def.kind === "collection") return { def, itemKey: path[path.length - 1] };
  }
  return null;
}

function itemUrl(def: DocumentDef, key: string): string | null {
  return def.itemUrl ? def.itemUrl.replace("{" + (def.itemKey ?? "slug") + "}", key) : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { path } = await params;
  const r = resolve(path);
  return { title: r ? (r.itemKey ? `${r.def.label} · ${r.itemKey}` : r.def.label) : "Контент" };
}

export default async function ContentEditorPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const { path } = await params;
  const { saved, deleted } = await searchParams;
  const user = await requireUser();
  const r = resolve(path);
  if (!r) notFound();
  const { def, itemKey } = r;
  const github = isGitHubBackend();

  let doc;
  try {
    doc = await readDocument(def);
  } catch (err) {
    return (
      <AdminShell username={user.username}>
        <TopBar title={def.label} />
        <div className="p-6">
          <Alert variant="destructive">{err instanceof Error ? err.message : "Не удалось прочитать документ."}</Alert>
        </div>
      </AdminShell>
    );
  }
  if (!doc) notFound();

  /* ── single document ── */
  if (def.kind === "single") {
    return (
      <AdminShell username={user.username}>
        <TopBar title={def.label} actions={<span className="text-xs text-muted-foreground">{def.file}</span>} />
        <div className="flex-1 p-6">
          <DocumentEditor
            docId={def.id}
            schema={def.schema}
            initial={doc.data as Record<string, unknown>}
            baseHash={doc.hash}
            previewUrls={def.urls}
            backHref="/admin/content"
            github={github}
          />
        </div>
      </AdminShell>
    );
  }

  const keyField = def.itemKey ?? "slug";
  const items = ((doc.data as { items?: Record<string, unknown>[] }).items ?? []) as Record<string, unknown>[];

  /* ── collection: list ── */
  if (!itemKey) {
    return (
      <AdminShell username={user.username}>
        <TopBar
          title={def.label}
          actions={
            <Button variant="brand" size="sm" asChild>
              <Link href={`/admin/content/${def.id}/new`}>
                <Plus /> Добавить
              </Link>
            </Button>
          }
        />
        <div className="flex-1 space-y-4 p-6">
          <p className="text-sm text-muted-foreground">{def.description}</p>
          {deleted && <Alert variant="positive">«{deleted}» удалён.</Alert>}
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Адрес на сайте</TableHead>
                  <TableHead className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((it, i) => {
                  const key = String(it[keyField] ?? "");
                  const title = String((def.itemTitle && it[def.itemTitle]) || key);
                  const url = itemUrl(def, key);
                  return (
                    <TableRow key={key || i}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <Link href={`/admin/content/${def.id}/${key}`} className="font-medium hover:underline">
                          {title}
                        </Link>
                        {"state" in it && typeof it.state === "string" && (
                          <Badge variant="secondary" className="ml-2">
                            {it.state}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
                          >
                            {url} <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/content/${def.id}/${key}`}>Редактировать</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                      Пока пусто.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
          <div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/content">
                <ArrowLeft /> Все документы
              </Link>
            </Button>
          </div>
        </div>
      </AdminShell>
    );
  }

  /* ── collection: new item ── */
  if (itemKey === "new") {
    return (
      <AdminShell username={user.username}>
        <TopBar title={`${def.label} · новый`} />
        <div className="flex-1 p-6">
          <DocumentEditor
            docId={def.id}
            schema={def.schema}
            initial={emptyObject(def.schema)}
            baseHash={doc.hash}
            itemMode="new"
            previewUrls={[]}
            backHref={`/admin/content/${def.id}`}
            github={github}
          />
        </div>
      </AdminShell>
    );
  }

  /* ── collection: edit item ── */
  const item = items.find((it) => it[keyField] === itemKey);
  if (!item) notFound();
  const url = itemUrl(def, itemKey);

  return (
    <AdminShell username={user.username}>
      <TopBar
        title={`${def.label} · ${String((def.itemTitle && item[def.itemTitle]) || itemKey)}`}
        actions={<span className="font-mono text-xs text-muted-foreground">{itemKey}</span>}
      />
      <div className="flex-1 p-6">
        <DocumentEditor
          docId={def.id}
          schema={def.schema}
          initial={item}
          baseHash={doc.hash}
          itemMode="edit"
          originalKey={itemKey}
          previewUrls={url ? [url] : []}
          backHref={`/admin/content/${def.id}`}
          github={github}
          notice={savedNotice(saved)}
        />
      </div>
    </AdminShell>
  );
}
