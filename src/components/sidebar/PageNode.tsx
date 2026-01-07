// src/components/sidebar/PageNode.tsx
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { PageListItem } from "@/lib/api/pages";
import { useChildPages } from "@/hooks/use-pages";
import { useCreatePage } from "@/hooks/use-create-page";
import { PageIcon } from "./PageIcon";
import { PageActions } from "./PageAction";
import { Skeleton } from "@radix-ui/themes";

type Props = {
  page: PageListItem;
  level: number;
};

export function PageNode({ page, level }: Props) {
  const { pageId } = useParams<{ pageId?: string }>();
  const isActive = pageId === page.id;

  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { data, isLoading } = useChildPages(page.id, expanded);
  const createChildPage = useCreatePage(page.id);

  const serverChildCount = page._count?.children ?? 0;
  const cachedChildCount = data?.items?.length ?? 0;
  const hasChildren = serverChildCount > 0 || cachedChildCount > 0;

  const handleAddChild = () => {
    setExpanded(true);
    createChildPage.mutate({ title: "Untitled" });
  };

  const handleOpenMenu = () => {
    // TODO: Open dropdown menu
    console.log("Open menu for:", page.id);
  };

  return (
    <div>
      <div
        className={clsx(
          "group/page relative flex items-center gap-2 px-2 py-1 rounded text-sm text-[#37352F]",
          "hover:bg-[#F0F0F0] font-sans cursor-pointer",
          isActive && "bg-[#E8E8E8] font-medium"
        )}
        style={{ paddingLeft: level * 12 + 8 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <PageIcon
          emoji={page.icon}
          hasContent={false}
          isHovered={isHovered}
          hasChildren={hasChildren}
          isExpanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />
        <div className="truncate max-w-[120px] group-hover/page:max-w-[90px] transition-[max-width] duration-10 ease-out inline-block">
          <Link href={`/${page.id}`}>{page.title}</Link>
        </div>

        <PageActions onAddChild={handleAddChild} onOpenMenu={handleOpenMenu} />
      </div>

      {expanded && (
        <div>
          {isLoading && (
            <div
              style={{ paddingLeft: (level + 1) * 12 + 8 }}
              className="text-xs text-muted-foreground py-1"
            >
              <Skeleton />
            </div>
          )}

          {data?.items?.map((child) => (
            <PageNode key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
