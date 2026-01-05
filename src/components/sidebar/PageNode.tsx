"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { PageListItem } from "@/lib/api/pages";
import { useChildPages } from "@/hooks/use-pages";
import { useCreatePage } from "@/hooks/use-create-page";

type Props = {
  page: PageListItem;
  level: number;
};

export function PageNode({ page, level }: Props) {
  const { pageId } = useParams<{ pageId?: string }>();
  const isActive = pageId === page.id;

  const [expanded, setExpanded] = useState(false);
  const hasChildren = (page._count?.children ?? 0) > 0;

  const { data, isLoading } = useChildPages(page.id, expanded);
  const createChildPage = useCreatePage(page.id);

  return (
    <div>
      <div
        className={clsx(
          "flex items-center gap-2 px-2 py-1 rounded text-sm",
          "hover:bg-muted",
          isActive && "bg-muted font-medium"
        )}
        style={{ paddingLeft: level * 12 }}
      >
        {hasChildren && (
          <button onClick={() => setExpanded(!expanded)} className="text-xs">
            {expanded ? "▾" : "▸"}
          </button>
        )}

        <Link
          href={`/${page.id}`}
          className="flex items-center gap-2 flex-1 truncate"
        >
          <span>{page.icon ?? "📄"}</span>
          <span className="truncate">{page.title}</span>
        </Link>

        <button
          onClick={() => {
            setExpanded(true);
            createChildPage.mutate({ title: "Untitled" });
          }}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          +
        </button>
      </div>

      {expanded && (
        <div>
          {isLoading && (
            <div
              style={{ paddingLeft: (level + 1) * 12 }}
              className="text-xs text-muted-foreground"
            >
              Loading…
            </div>
          )}

          {data?.items.map((child) => (
            <PageNode key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
