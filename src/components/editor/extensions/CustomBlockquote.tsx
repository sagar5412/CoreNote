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
    return ReactNodeViewRenderer(BlockquoteComponent);
  },
});
