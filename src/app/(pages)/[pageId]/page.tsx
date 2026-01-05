"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { usePage } from "@/hooks/use-page";
import { useUpdatePage } from "@/hooks/use-pages";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { useDebounce } from "@/hooks/use-debounce";

export default function PageEditor() {
  const { pageId } = useParams<{ pageId: string }>();
  const { data, isLoading, error } = usePage(pageId);
  const updatePage = useUpdatePage(pageId);

  const [title, setTitle] = useState("");
  const [savedTitle, setSavedTitle] = useState("");

  const [content, setContent] = useState<any>(null);
  const [savedContent, setSavedContent] = useState<any>(null);

  const debouncedTitle = useDebounce(title, 500);
  const debouncedContent = useDebounce(content, 1000);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setSavedTitle(data.title);
      setContent(data.content);
      setSavedContent(data.content);
    }
  }, [data]);

  useEffect(() => {
    if (debouncedTitle && debouncedTitle !== savedTitle) {
      updatePage.mutate({ title: debouncedTitle });
      setSavedTitle(debouncedTitle);
    }
  }, [debouncedTitle]);

  useEffect(() => {
    if (
      debouncedContent &&
      JSON.stringify(debouncedContent) !== JSON.stringify(savedContent)
    ) {
      updatePage.mutate({ content: debouncedContent });
      setSavedContent(debouncedContent);
    }
  }, [debouncedContent]);

  if (isLoading) return <div className="p-8">Loading…</div>;
  if (error || !data) return <div className="p-8">Not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full text-4xl font-bold outline-none"
      />
      <TiptapEditor value={content} onChange={setContent} />
    </div>
  );
}
