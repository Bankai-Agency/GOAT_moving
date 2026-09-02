import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { AdminShell, TopBar } from "@/components/admin/Shell";
import { PublishPendingButton } from "@/components/admin/PublishPendingButton";
import { Card } from "@/components/admin/ui/card";
import { requireUser } from "@/lib/auth";
import { DOCUMENTS, GROUP_LABELS, type DocumentGroup } from "@/lib/admin/documents";
import { isGitHubBackend } from "@/lib/admin/github";

export const metadata = { title: "Контент" };
export const dynamic = "force-dynamic";

const ORDER: DocumentGroup[] = ["pages", "general", "locations", "lps"];

export default async function ContentIndexPage() {
  const user = await requireUser();
  const github = isGitHubBackend();

  return (
    <AdminShell username={user.username}>
      <TopBar
        title="Контент сайта"
        actions={
          github ? (
            <PublishPendingButton />
          ) : (
            <span className="text-xs text-muted-foreground">режим разработки: правки применяются сразу</span>
          )
        }
      />
      <div className="flex-1 space-y-6 p-6">
        {ORDER.map((group) => {
          const docs = DOCUMENTS.filter((d) => d.group === group);
          if (!docs.length) return null;
          return (
            <section key={group} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{GROUP_LABELS[group]}</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {docs.map((d) => (
                  <Link key={d.id} href={`/admin/content/${d.id}`} className="group block">
                    <Card className="flex h-full flex-col gap-2 p-4 transition-colors hover:bg-accent/40">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{d.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <p className="text-xs text-muted-foreground">{d.description}</p>
                      {d.urls.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-2 pt-1">
                          {d.urls.map((u) => (
                            <span key={u} className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                              {u} <ExternalLink className="h-3 w-3" />
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AdminShell>
  );
}
