import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deletePage,
  getChildren,
  PageDetail,
  PageListItem,
} from "@/lib/api/pages";
import { useRouter } from "next/navigation";

const DELETED_PAGE_KEY = ["_deleted_page"];

// Recursively fetch all children
async function fetchAllDescendants(
  pageId: string,
  queryClient: QueryClient
): Promise<PageListItem[]> {
  // Try to get from cache first, otherwise fetch
  let childrenData = queryClient.getQueryData<{ items: PageListItem[] }>([
    "pages",
    pageId,
  ]);

  if (!childrenData) {
    try {
      childrenData = await getChildren(pageId);
    } catch {
      return [];
    }
  }

  const children = childrenData?.items || [];
  const allDescendants: PageListItem[] = [...children];

  // Recursively get each child's descendants
  for (const child of children) {
    const childDescendants = await fetchAllDescendants(child.id, queryClient);
    allDescendants.push(...childDescendants);
  }

  return allDescendants;
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (pageId: string) => {
      // Get the page data BEFORE deleting
      const pageData = queryClient.getQueryData<PageDetail>(["page", pageId]);
      const parentId = pageData?.parentId ?? null;

      // Fetch all descendants (children, grandchildren, etc.)
      const descendants = await fetchAllDescendants(pageId, queryClient);

      // Get content for each descendant from cache
      const descendantsWithContent = descendants.map((child) => {
        const childData = queryClient.getQueryData<PageDetail>([
          "page",
          child.id,
        ]);
        return {
          ...child,
          content: childData?.content || null,
        };
      });

      // Get first available page for navigation
      const rootPages = queryClient.getQueryData<PageListItem[]>([
        "pages",
        null,
      ]);
      const fallbackPage = rootPages?.find((p) => p.id !== pageId);

      // Delete from server
      await deletePage(pageId);

      return {
        pageData,
        parentId,
        descendants: descendantsWithContent,
        fallbackPageId: fallbackPage?.id,
        deletedPageId: pageId,
      };
    },

    onSuccess: ({
      pageData,
      parentId,
      descendants,
      fallbackPageId,
      deletedPageId,
    }) => {
      // Store deleted page and ALL its children in cache for undo
      if (pageData) {
        queryClient.setQueryData(DELETED_PAGE_KEY, {
          page: pageData,
          parentId,
          descendants,
          deletedAt: Date.now(),
        });
      }

      // Remove page from cache
      queryClient.removeQueries({ queryKey: ["page", deletedPageId] });

      // Remove all descendants from cache
      descendants.forEach((child) => {
        queryClient.removeQueries({ queryKey: ["page", child.id] });
        queryClient.removeQueries({ queryKey: ["pages", child.id] });
      });

      // Remove from parent's pages list (handle both array and object formats)
      queryClient.setQueryData(["pages", parentId], (cached: any) => {
        if (!cached) return cached;

        // Root pages are stored as array
        if (Array.isArray(cached)) {
          return cached.filter((p: PageListItem) => p.id !== deletedPageId);
        }

        // Child pages are stored as { items: [...], nextCursor: ... }
        if (cached.items) {
          return {
            ...cached,
            items: cached.items.filter(
              (p: PageListItem) => p.id !== deletedPageId
            ),
          };
        }

        return cached;
      });

      // Navigate
      if (fallbackPageId) {
        router.push(`/${fallbackPageId}`);
      } else {
        router.push("/");
      }
    },
  });
}
