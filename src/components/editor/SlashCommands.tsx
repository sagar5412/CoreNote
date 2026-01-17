import { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  Quote,
  Code,
  Text,
} from "lucide-react";

export interface SlashCommand {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  command: (editor: Editor) => void;
}

export const slashCommands: SlashCommand[] = [
  {
    title: "Text",
    description: "Just start writing with plain text.",
    icon: Text,
    keywords: ["paragraph", "text", "plain"],
    command: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    icon: Heading1,
    keywords: ["h1", "heading", "title", "large"],
    command: (editor) => {
      editor.chain().focus().setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    icon: Heading2,
    keywords: ["h2", "heading", "subtitle", "medium"],
    command: (editor) => {
      editor.chain().focus().setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    icon: Heading3,
    keywords: ["h3", "heading", "small"],
    command: (editor) => {
      editor.chain().focus().setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    icon: List,
    keywords: ["list", "bullet", "unordered", "ul"],
    command: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    icon: Quote,
    keywords: ["quote", "blockquote", "citation"],
    command: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    icon: Code,
    keywords: ["code", "codeblock", "snippet", "programming"],
    command: (editor) => {
      editor.chain().focus().setCodeBlock({ language: "javascript" }).run();
    },
  },
];
