import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo/schema";

export type BreadcrumbItem = {
  name: string;
  /** Absolute path starting with `/`. Omit on the last (current) item. */
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /** Render only the BreadcrumbList JSON-LD without the visible trail. Useful on
      pages with a full-bleed h-screen hero where breadcrumbs can't fit visually. */
  schemaOnly?: boolean;
};

/**
 * Breadcrumb trail with matching BreadcrumbList JSON-LD.
 * Render at the top of internal pages (below <Header>, above <section hero>).
 */
export function Breadcrumbs({ items, schemaOnly = false }: BreadcrumbsProps) {
  const schemaItems = items.map((it) => ({
    name: it.name,
    url: `${SITE_URL}${it.href ?? "/"}`,
  }));

  if (schemaOnly) {
    return <JsonLd data={breadcrumbSchema(schemaItems)} />;
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <nav aria-label="Breadcrumb" className="bg-[#0c0c0c] px-4 pt-[88px] lg:pt-[96px] pb-3 lg:pb-4">
        <ol className="max-w-[1408px] mx-auto flex flex-wrap items-center gap-2 font-mono font-medium text-xs lg:text-sm tracking-[-0.48px] uppercase text-white/50">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-[#FFE533] transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className={isLast ? "text-white" : ""} aria-current={isLast ? "page" : undefined}>
                    {item.name}
                  </span>
                )}
                {!isLast && <span className="text-white/25">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
