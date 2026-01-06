import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPage } from "@/lib/api/pages";
import { useRouter } from "next/navigation";

export function useCreatePage(parentId?: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data?: { title?: string }) =>
      createPage({
        title: data?.title,
        parentId: parentId ?? null,
      }),
    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),

    onSuccess: (page) => {
      queryClient.setQueryData(["pages", parentId ?? null], (cached: any) => {
        if (!cached) return [page];

        if (Array.isArray(cached)) {
          return [...cached, page];
        }
        if (cached.items) {
          return {
            ...cached,
            items: [...cached.items, page],
          };
        }
        return cached;
      });
      router.push(`/${page.id}`);
    },
    onSettled: (data, error) => {
      if (error) {
        console.error("Failed to save after retries:", error);
      }
      queryClient.invalidateQueries({
        queryKey: ["pages", parentId ?? null],
      });
    },
    onError: (error) => {
      console.error("Failed to save after retries:", error);
    },
  });
}
