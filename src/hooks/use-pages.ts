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
  });
}

export function useChildPages(parentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["pages", parentId],
    queryFn: () => getChildren(parentId),
    enabled,
  });
}

export function useUpdatePage(pageId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title?: string; content?: JSON }) =>
      updatePage(pageId, data),
    onSuccess: (updatePage, variables) => {
      queryClient.setQueryData(["page", pageId], (old: any) =>
        old ? { ...old, ...variables } : old
      );

      const parentId = updatePage.parentId ?? null;

      queryClient.setQueryData(["pages", parentId], (cached: any) => {
        if (!cached) return cached;

        if (Array.isArray(cached)) {
          return cached.map((p) =>
            p.id === pageId ? { ...p, ...variables } : p
          );
        }

        if (cached.items) {
          return {
            ...cached,
            items: cached.items.map((p: any) =>
              p.id === pageId ? { ...p, ...variables } : p
            ),
          };
        }
        return cached;
      });
    },

    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["page", pageId],
      });
    },
  });
}
