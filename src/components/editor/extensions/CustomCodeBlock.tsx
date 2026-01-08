import { Node, mergeAttributes } from "@tiptap/core";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { CodeBlock } from "@/components/ui/code-block";

// Create lowlight instance with common languages (includes JavaScript)
const lowlight = createLowlight(common);

const CodeBlockComponent = ({ node, updateAttributes }: any) => {
  const language = node.attrs.language || "javascript";

  return (
    <NodeViewWrapper>
      <CodeBlock language={language}>
        <code className="block">
          <NodeViewContent className="outline-none min-h-[1.5em]" />
        </code>
      </CodeBlock>
    </NodeViewWrapper>
  );
};

// Extend the official CodeBlockLowlight with our custom React view
export const CustomCodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockComponent);
  },
}).configure({
  lowlight,
  defaultLanguage: "javascript",
});
