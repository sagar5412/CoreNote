import { useQuery } from "@tanstack/react-query";
import { getPage } from "@/lib/api/pages";

export function usePage(pageId: string) {
  return useQuery({
    queryKey: ["page", pageId],
    queryFn: () => getPage(pageId),
    enabled: !!pageId,
  });
}
