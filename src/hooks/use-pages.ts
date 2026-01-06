import {
  getChildren,
  getPages,
  PageListItem,
  updatePage,
} from "@/lib/api/pages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useRootPages() {
  return useQuery<PageListItem[]>({
    queryKey: ["pages", null],
    queryFn: () => getPages(null),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });
}

export function useChildPages(parentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["pages", parentId],
    queryFn: () => getChildren(parentId),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdatePage(pageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title?: string; content?: JSON }) =>
      updatePage(pageId, data),

    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),

    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ["page", pageId],
      });
      const previousPageDetail = queryClient.getQueryData(["page", pageId]);

      queryClient.setQueryData(["page", pageId], (old: any) => {
        return old ? { ...old, ...variables } : old;
      });

      return { previousPageDetail };
    },

    onSuccess: (updatePage, variables) => {
      queryClient.setQueryData(["page", pageId], updatePage);

      const parentId = updatePage.parentId ?? null;

      queryClient.setQueryData(["pages", parentId], (cached: any) => {
        if (!cached) return cached;
        const updateItem = { ...updatePage };
        if (Array.isArray(cached)) {
          return cached.map((p) => (p.id === pageId ? updateItem : p));
        }

        if (cached.items) {
          return {
            ...cached,
            items: cached.items.map((p: any) =>
              p.id === pageId ? updateItem : p
            ),
          };
        }
        return cached;
      });
    },

    onError: (error) => {
      console.error("Failed to save after retries:", error);
    },
  });
}
