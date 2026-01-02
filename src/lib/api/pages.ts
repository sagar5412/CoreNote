import { CreatePageSchema } from "../validators/page";

const API_URL = "http://localhost:3000/api/pages";

export async function fetchPages(parentId?: string) {
  const url = parentId ? `${API_URL}?parentId=${parentId}` : API_URL;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch pages");
  }

  return await res.json();
}

export async function createPage(data: CreatePageSchema) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create page");
  }

  return await res.json();
}
