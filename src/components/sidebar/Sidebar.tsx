"use client";

import { useRootPages } from "@/hooks/use-pages";
import { useCreatePage } from "@/hooks/use-create-page";
import { PageNode } from "./PageNode";

export function Sidebar() {
  const { data, isLoading } = useRootPages();
  const createRootPage = useCreatePage(null);

  return (
    <div className="group/sidebar border-r p-2 bg-[#F9F8F7]">
      <nav className="w-64 space-y-2">
        <button
          onClick={() => createRootPage.mutate({ title: "Untitled" })}
          className="w-full text-left px-2 py-1 rounded hover:bg-muted text-sm"
        >
          +
        </button>

        {isLoading && <div>Loading…</div>}

        {data?.map((page) => (
          <PageNode key={page.id} page={page} level={0} />
        ))}
      </nav>
    </div>
  );
}
