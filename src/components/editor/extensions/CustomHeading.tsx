import { mergeAttributes } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import { Heading as RadixHeading } from "@radix-ui/themes";

const HeadingComponent = ({ node }: any) => {
  const level = node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6;

  // Map Tiptap levels to Radix sizes
  const sizeMap: Record<number, "9" | "8" | "7" | "6" | "5" | "4"> = {
    1: "9",
    2: "8",
    3: "7",
    4: "6",
    5: "5",
    6: "4",
  };

  return (
    <NodeViewWrapper>
      <RadixHeading as={`h${level}`} size={sizeMap[level]} className="my-2">
        <NodeViewContent />
      </RadixHeading>
    </NodeViewWrapper>
  );
};

export const CustomHeading = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(HeadingComponent);
  },
}).configure({
  levels: [1, 2, 3],
});
