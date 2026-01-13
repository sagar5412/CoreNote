export const slashCommands = [
  {
    title: "Heading 1",
    command: (editor: any) =>
      editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    command: (editor: any) =>
      editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    command: (editor: any) =>
      editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  {
    title: "Bullet List",
    command: (editor: any) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Quote",
    command: (editor: any) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Code",
    command: (editor: any) =>
      editor.chain().focus().setCodeBlock({ language: "javascript" }).run(),
  },
];
