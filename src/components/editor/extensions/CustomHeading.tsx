import Heading from "@tiptap/extension-heading";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import { Heading as RadixHeading } from "@radix-ui/themes";

const HeadingComponent = ({ node }: any) => {
  const level = node.attrs.level as 1 | 2 | 3;

  const sizeMap: Record<number, string> = {
    1: "1.875rem",
    2: "1.5rem",
    3: "1.25rem",
  };

  return (
    <NodeViewWrapper>
      <RadixHeading
        as={`h${level}`}
        style={{
          fontSize: sizeMap[level],
          fontWeight: 500,
          margin: "0.5rem 0",
        }}
      >
        <NodeViewContent />
      </RadixHeading>
    </NodeViewWrapper>
  );
};

export const CustomHeading = Heading.extend({
  addNodeView() {
    return ReactNodeViewRenderer(HeadingComponent, {
      className: "custom-heading-node",
    });
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      level: {
        default: 1,
        rendered: true,
      },
    };
  },
}).configure({
  levels: [1, 2, 3],
});
