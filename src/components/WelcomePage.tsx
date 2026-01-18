export const welcomeContent = () => {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Welcome to CoreNote! 🚀" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Your personal workspace for notes, docs, and brilliant ideas. This page is yours to edit - go ahead, make it your own!",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "✨ Quick Start Guide" }],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Here's everything you need to become a CoreNote pro:",
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "📝 Creating Content" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Type " },
                  { type: "text", marks: [{ type: "code" }], text: "/" },
                  { type: "text", text: " anywhere to open the command menu" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Use " },
                  { type: "text", marks: [{ type: "code" }], text: "/heading" },
                  { type: "text", text: " for titles, " },
                  { type: "text", marks: [{ type: "code" }], text: "/code" },
                  { type: "text", text: " for code blocks" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Press " },
                  { type: "text", marks: [{ type: "bold" }], text: "Enter" },
                  { type: "text", text: " twice to exit quotes and lists" },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "📂 Organizing Pages" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Click " },
                  { type: "text", marks: [{ type: "bold" }], text: "+" },
                  { type: "text", text: " in the sidebar to create new pages" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Drag pages to nest them inside each other",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "Click the " },
                  { type: "text", marks: [{ type: "bold" }], text: "⋯" },
                  { type: "text", text: " menu for more options" },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "💡 Pro Tips" }],
      },
      {
        type: "blockquote",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: '"The art of note-taking is the art of thinking." — Start capturing your ideas today!',
              },
            ],
          },
        ],
      },
      {
        type: "heading",
        attrs: { level: 3 },
        content: [{ type: "text", text: "🎨 Try This Code Block" }],
      },
      {
        type: "codeBlock",
        attrs: { language: "javascript" },
        content: [
          {
            type: "text",
            text: "// Welcome to CoreNote!\nconst ideas = ['notes', 'docs', 'projects'];\n\nideas.forEach(idea => {\n  console.log(`Start your ${idea} today! 🚀`);\n});",
          },
        ],
      },
      {
        type: "paragraph",
        content: [],
      },
      {
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "🎯 What's Next?" }],
      },
      {
        type: "bulletList",
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "📌 Create your first note about a project",
                  },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  { type: "text", text: "📚 Start a reading list or journal" },
                ],
              },
            ],
          },
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "💭 Brainstorm ideas for your next big thing",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "paragraph",
        content: [],
      },
      {
        type: "paragraph",
        content: [
          { type: "text", text: "Happy writing! ✨ " },
          {
            type: "text",
            marks: [{ type: "italic" }],
            text: "— The CoreNote Team",
          },
        ],
      },
    ],
  };
};
