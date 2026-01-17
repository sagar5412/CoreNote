import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage, PageListItem, PageDetail } from "@/lib/api/pages";
import { useRouter } from "next/navigation";

const DELETED_PAGE_KEY = ["_deleted_page"];

type DeletedPageData = {
  page: PageDetail;
  parentId: string | null;
  descendants: RestorablePage[];
  deletedAt: number;
};

type RestorablePage = PageListItem & {
  content?: PageDetail["content"];
};

export function useRestorePage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const deleted =
        queryClient.getQueryData<DeletedPageData>(DELETED_PAGE_KEY);

      if (!deleted) {
        throw new Error("No page to restore");
      }

      const { page, parentId, descendants } = deleted;

      // oldId -> newId
      const idMap = new Map<string, string>();

      // Restore root page first
      const restoredRoot = await createPage({
        title: page.title || "Untitled",
        parentId,
        content: page.content ?? null,
      });

      idMap.set(page.id, restoredRoot.id);

      // Build parent -> children map
      const childrenMap = new Map<string, RestorablePage[]>();

      for (const d of descendants) {
        const pid = d.parentId ?? page.id;

        if (!childrenMap.has(pid)) {
          childrenMap.set(pid, []);
        }

        childrenMap.get(pid)!.push(d);
      }

      // DFS restore
      async function restoreDFS(oldParentId: string, newParentId: string) {
        const children = childrenMap.get(oldParentId);
        console.log("children", children);
        if (!children) return;

        for (const child of children) {
          const restored = await createPage({
            title: child.title || "Untitled",
            parentId: newParentId,
            content: child.content ?? null,
          });

          idMap.set(child.id, restored.id);
          await restoreDFS(child.id, restored.id);
        }
      }

      await restoreDFS(page.id, restoredRoot.id);

      return { restoredPage: restoredRoot };
    },

    onSuccess: ({ restoredPage }) => {
      // Clear undo snapshot
      queryClient.removeQueries({ queryKey: DELETED_PAGE_KEY });

      // Refresh sidebar
      queryClient.invalidateQueries({ queryKey: ["pages"] });

      // Navigate to restored page
      router.push(`/${restoredPage.id}`);
    },
  });
}
