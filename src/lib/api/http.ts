type httpMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function apiRequest<T>(
  url: string,
  method: httpMethod,
  body?: unknown
): Promise<T> {
  const res = await fetch(url, {
    method,
    ...(body ? { body: JSON.stringify(body) } : {}),
    headers: {
      "content-type": "application/json",
    },
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json?.error?.message || "Something went wrong");
  }

  return json.data as T;
}
