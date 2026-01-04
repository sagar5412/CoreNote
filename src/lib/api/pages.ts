import { apiRequest } from "./http";

/* Types */
export type PageListItem = {
  id: string;
  title: string;
  icon?: string | null;
  parentId?: string | null;
  position: number;
  _count?: { children: number };
};

export type PageDetail = PageListItem & {
  content: any;
  isPublished: boolean;
  slug?: string | null;
  parent?: {
    id: string;
    title: string;
    icon?: string | null;
  };
};

/* Queries */
export function getPages(parentId?: string | null) {
  const query = parentId ? `?parentId=${parentId}` : "";
  return apiRequest<PageListItem[]>(`/api/pages${query}`, "GET");
}

export function getPage(pageId: string) {
  return apiRequest<PageDetail>(`/api/pages/${pageId}`, "GET");
}

export function getChildren(pageId: string) {
  return apiRequest<{
    items: PageListItem[];
    nextCursor: string | null;
  }>(`/api/pages/${pageId}/children`, "GET");
}

/* Mutations */
export function createPage(data: { title?: string; parentId?: string | null }) {
  return apiRequest<PageListItem>("/api/pages", "POST", data);
}

export function updatePage(
  pageId: string,
  data: {
    title?: string;
    content?: any;
  }
) {
  return apiRequest<PageDetail>(`/api/pages/${pageId}`, "PUT", data);
}

export function deletePage(pageId: string) {
  return apiRequest<PageDetail>(`/api/pages/${pageId}`, "DELETE");
}

export function movePage(
  pageId: string,
  data: {
    newParentId: string | null;
    newPosition: number;
  }
) {
  return apiRequest<PageDetail>(`/api/pages/${pageId}/move`, "POST", data);
}

export function duplicatePage(pageId: string) {
  return apiRequest<{ id: string; title: string }>(
    `/api/pages/${pageId}/duplicate`,
    "POST"
  );
}

export function publishPage(
  pageId: string,
  data: {
    slug: string;
    isPublished: boolean;
  }
) {
  return apiRequest<PageDetail>(`/api/pages/${pageId}/publish`, "POST", data);
}
