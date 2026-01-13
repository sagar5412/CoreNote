"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { slashCommands } from "./SlashCommands";
import {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

// Custom extensions
import { CustomHeading } from "./extensions/CustomHeading";
import { CustomBlockquote } from "./extensions/CustomBlockquote";
import { CustomCodeBlock } from "./extensions/CustomCodeBlock";
import {
  CustomBulletList,
  CustomListItem,
} from "./extensions/CustomBulletList";

export interface TiptapEditorRef {
  focus: () => void;
}

export const TiptapEditor = forwardRef<TiptapEditorRef, any>(
  ({ value, onChange }, ref) => {
    const [showSlash, setShowSlash] = useState(false);
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const isInternalUpdate = useRef(false);
    const editorContainerRef = useRef<HTMLDivElement>(null);

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
          placeholder: ({ node }) => {
            if (node.type.name === "heading") {
              const level = node.attrs.level;
              if (level === 1) return "Heading 1";
              if (level === 2) return "Heading 2";
              if (level === 3) return "Heading 3";
              return `Heading ${level}`;
            }
            return "Type / for commands...";
          },
          showOnlyWhenEditable: true,
          emptyEditorClass: "is-empty",
        }),
      ],
      content: value,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "outline-none focus:outline-none min-h-[300px] cursor-text",
        },
      },
      onUpdate({ editor }) {
        isInternalUpdate.current = true;
        onChange(editor.getJSON());

        // Check if current node is empty paragraph
        const { $from } = editor.state.selection;
        const currentNode = $from.parent;
        const isEmpty = currentNode.content.size === 0;
        const isParagraph = currentNode.type.name === "paragraph";
        setShowPlaceholder(isEmpty && isParagraph);

        // Slash command detection
        const { from } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(
          Math.max(0, from - 1),
          from,
          "\n"
        );
        setShowSlash(textBefore === "/");
      },
      onSelectionUpdate({ editor }) {
        // Check placeholder on cursor move
        const { $from } = editor.state.selection;
        const currentNode = $from.parent;
        const isEmpty = currentNode.content.size === 0;
        const isParagraph = currentNode.type.name === "paragraph";
        setShowPlaceholder(isEmpty && isParagraph);
      },
    });

    // Expose focus method to parent
    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus("end");
      },
    }));

    // Only sync when value changes from EXTERNAL source
    useEffect(() => {
      if (editor && value && !isInternalUpdate.current) {
        const currentContent = JSON.stringify(editor.getJSON());
        const newContent = JSON.stringify(value);

        if (currentContent !== newContent) {
          editor.commands.setContent(value, { emitUpdate: false });
        }
      }
      isInternalUpdate.current = false;
    }, [editor, value]);

    // Click anywhere in container to focus editor
    const handleContainerClick = () => {
      if (editor && !editor.isFocused) {
        editor.commands.focus("end");
      }
    };

    if (!editor) return null;

    return (
      <div
        ref={editorContainerRef}
        className="relative min-h-[300px] cursor-text"
        onClick={handleContainerClick}
      >
        {showSlash && (
          <div className="absolute z-10 bg-background border rounded shadow p-1">
            {slashCommands.map((item) => (
              <button
                key={item.title}
                className="block px-2 py-1 text-sm hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
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

        <EditorContent editor={editor} className="text-[#2C2C2B]" />
      </div>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";
