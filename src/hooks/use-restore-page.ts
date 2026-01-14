import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage, PageListItem, PageDetail } from "@/lib/api/pages";
import { useRouter } from "next/navigation";

const DELETED_PAGE_KEY = ["_deleted_page"];

type DeletedPageData = {
  page: PageDetail;
  parentId: string | null;
  descendants: (PageListItem & { content?: any })[];
  deletedAt: number;
};

export function useRestorePage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const deletedData =
        queryClient.getQueryData<DeletedPageData>(DELETED_PAGE_KEY);

      if (!deletedData) {
        throw new Error("No page to restore");
      }

      const { page, parentId, descendants } = deletedData;

      // Map old IDs to new IDs for parent-child relationships
      const idMap = new Map<string, string>();

      // 1. Restore the parent page first
      const restoredParent = await createPage({
        title: page.title || "Untitled",
        parentId: parentId,
        content: page.content || null,
      });
      idMap.set(page.id, restoredParent.id);

      // 2. Restore children in order (parents before children)
      // Sort by depth (pages with parentId matching the deleted page first)
      const sortedDescendants = [...descendants].sort((a, b) => {
        const aDepth = getDepth(a.parentId, page.id, descendants);
        const bDepth = getDepth(b.parentId, page.id, descendants);
        return aDepth - bDepth;
      });

      for (const child of sortedDescendants) {
        // Get the new parent ID from the map
        const newParentId = child.parentId ? idMap.get(child.parentId) : null;

        const restoredChild = await createPage({
          title: child.title || "Untitled",
          parentId: newParentId || restoredParent.id, // Fallback to restored parent
          content: child.content || null,
        });

        idMap.set(child.id, restoredChild.id);
      }

      return { restoredPage: restoredParent, parentId };
    },

    onSuccess: ({ restoredPage, parentId }) => {
      // Clear deleted page from cache
      queryClient.removeQueries({ queryKey: DELETED_PAGE_KEY });

      // Invalidate pages to refresh the sidebar
      queryClient.invalidateQueries({ queryKey: ["pages"] });

      // Navigate to restored page
      router.push(`/${restoredPage.id}`);
    },
  });
}

// Helper to calculate depth of a page in the tree
function getDepth(
  parentId: string | null | undefined,
  rootId: string,
  descendants: PageListItem[]
): number {
  if (!parentId || parentId === rootId) return 0;

  const parent = descendants.find((d) => d.id === parentId);
  if (!parent) return 0;

  return 1 + getDepth(parent.parentId, rootId, descendants);
}
