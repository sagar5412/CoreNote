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

    onSuccess: (page) => {
      queryClient.invalidateQueries({
        queryKey: ["pages", parentId ?? null],
      });
      queryClient.setQueryData(["page", page.id], {
        id: page.id,
        title: page.title,
        icon: page.icon,
        content: null,
        parentId: page.parentId,
        position: page.position,
        isPublished: false,
        slug: null,
      });

      router.push(`/${page.id}`);
    },
  });
}
