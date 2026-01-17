"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { SlashCommandMenu } from "./SlashCommandMenu";
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
    const [slashMenu, setSlashMenu] = useState<{
      show: boolean;
      query: string;
      position: { top: number; left: number };
    }>({
      show: false,
      query: "",
      position: { top: 0, left: 0 },
    });

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
          placeholder: ({ editor: tipEditor, node }) => {
            if (node.type.name === "heading") {
              const level = node.attrs.level;
              if (level === 1) return "Heading 1";
              if (level === 2) return "Heading 2";
              if (level === 3) return "Heading 3";
              return `Heading ${level}`;
            }
            if (node.type.name === "blockquote") {
              return "Quote...";
            }
            if (
              node.type.name === "paragraph" &&
              tipEditor.isActive("bulletList")
            ) {
              return "List item...";
            }
            return "Type / for commands...";
          },
          showOnlyWhenEditable: true,
          emptyEditorClass: "is-empty",
          emptyNodeClass: "is-empty",
          includeChildren: true,
          showOnlyCurrent: true,
        }),
      ],
      content: value,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "outline-none focus:outline-none min-h-[300px] cursor-text",
        },
        handleKeyDown: (view, event) => {
          // If slash menu is open and Enter is pressed, don't create new paragraph
          if (slashMenu.show && event.key === "Enter") {
            event.preventDefault();
            return true;
          }
          return false;
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

        // Slash command detection with query extraction
        const { from } = editor.state.selection;
        const textFromLineStart = editor.state.doc.textBetween(
          $from.start(),
          from,
          "\n"
        );

        // Check if there's a "/" in the current line
        const slashIndex = textFromLineStart.lastIndexOf("/");

        if (slashIndex !== -1) {
          const query = textFromLineStart.slice(slashIndex + 1); // Text after "/"

          // Get cursor position for menu placement
          const coords = editor.view.coordsAtPos(from);
          const containerRect =
            editorContainerRef.current?.getBoundingClientRect();

          setSlashMenu({
            show: true,
            query,
            position: {
              top: coords.bottom - (containerRect?.top ?? 0) + 8,
              left: coords.left - (containerRect?.left ?? 0),
            },
          });
        } else {
          setSlashMenu((prev) => ({ ...prev, show: false }));
        }
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

    // Close menu on blur
    useEffect(() => {
      const handleBlur = () => {
        setTimeout(() => {
          setSlashMenu((prev) => ({ ...prev, show: false }));
        }, 150); // Small delay to allow click events
      };

      editor?.on("blur", handleBlur);
      return () => {
        editor?.off("blur", handleBlur);
      };
    }, [editor]);

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
          requestAnimationFrame(() => {
            editor.commands.setContent(value, { emitUpdate: false });
          });
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
        {slashMenu.show && (
          <SlashCommandMenu
            editor={editor}
            query={slashMenu.query}
            position={slashMenu.position}
            onClose={() => setSlashMenu((prev) => ({ ...prev, show: false }))}
          />
        )}

        <EditorContent editor={editor} className="text-[#2C2C2B]" />
      </div>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";
