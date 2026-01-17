import Blockquote from "@tiptap/extension-blockquote";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import { Blockquote as RadixBlockquote } from "@radix-ui/themes";

const BlockquoteComponent = () => {
  return (
    <NodeViewWrapper>
      <RadixBlockquote className="my-4 pl-4 border-l-4 border-zinc-300 dark:border-zinc-600 italic text-muted-foreground">
        <NodeViewContent />
      </RadixBlockquote>
    </NodeViewWrapper>
  );
};

export const CustomBlockquote = Blockquote.extend({
  addNodeView() {
    return ReactNodeViewRenderer(BlockquoteComponent, {
      className: "custom-blockquote-node",
    });
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => {
        return this.editor
          .chain()
          .focus()
          .exitCode()
          .insertContentAt(this.editor.state.selection.$to.after(), {
            type: "paragraph",
          })
          .focus()
          .run();
      },

      Enter: ({ editor }) => {
        const { state } = editor;
        const { $from } = state.selection;
        const node = $from.node($from.depth);

        if (!editor.isActive("blockquote")) {
          return false;
        }
        const isEmptyParagraph =
          node.type.name === "paragraph" && node.textContent === "";

        if (isEmptyParagraph) {
          return editor.chain().focus().lift("blockquote").run();
        }

        return false;
      },
    };
  },
});
