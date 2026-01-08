"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { slashCommands } from "./SlashCommands";
import { useState } from "react";

// Custom extensions
import { CustomHeading } from "./extensions/CustomHeading";
import { CustomBlockquote } from "./extensions/CustomBlockquote";
import { CustomCodeBlock } from "./extensions/CustomCodeBlock";
import {
  CustomBulletList,
  CustomListItem,
} from "./extensions/CustomBulletList";

export function TiptapEditor({ value, onChange }: any) {
  const [showSlash, setShowSlash] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        bulletList: false,
        listItem: false,
      }),
      CustomHeading,
      CustomBlockquote,
      CustomCodeBlock,
      CustomBulletList,
      CustomListItem,
      Placeholder.configure({
        placeholder: "Type / to open commands...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "outline-none focus:outline-none border-none min-h-[300px]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getJSON());

      const { from } = editor.state.selection;
      const textBefore = editor.state.doc.textBetween(
        Math.max(0, from - 1),
        from,
        "\n"
      );
      setShowSlash(textBefore === "/");
    },
  });

  if (!editor) return null;

  return (
    <div className="relative">
      {showSlash && (
        <div className="absolute z-10 bg-background border rounded shadow p-1">
          {slashCommands.map((item) => (
            <button
              key={item.title}
              className="block px-2 py-1 text-sm hover:bg-muted"
              onClick={() => {
                editor.commands.deleteRange({
                  from: editor.state.selection.from - 1,
                  to: editor.state.selection.from,
                });
                item.command(editor);
                setShowSlash(false);
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}
