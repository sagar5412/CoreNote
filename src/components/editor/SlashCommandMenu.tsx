// src/components/editor/SlashCommandMenu.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Editor } from "@tiptap/react";
import { slashCommands, SlashCommand } from "./SlashCommands";

interface SlashCommandMenuProps {
  editor: Editor;
  query: string;
  onClose: () => void;
  position: { top: number; left: number };
}

export function SlashCommandMenu({
  editor,
  query,
  onClose,
  position,
}: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter commands based on query (after the "/")
  const filteredCommands = slashCommands.filter((cmd) => {
    const searchTerm = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(searchTerm) ||
      cmd.keywords.some((keyword) => keyword.includes(searchTerm))
    );
  });

  // Reset selection when filtered results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  // Execute command
  const executeCommand = useCallback(
    (command: SlashCommand) => {
      const { from } = editor.state.selection;
      const deleteFrom = from - query.length - 1;

      // Delete "/" and query
      editor.commands.deleteRange({ from: deleteFrom, to: from });

      // Run the command
      command.command(editor);

      // Move cursor back up to stay on the created block
      setTimeout(() => {
        // If we ended up on an empty paragraph, delete it and go back
        const { $from } = editor.state.selection;
        const currentNode = $from.parent;

        if (
          currentNode.type.name === "paragraph" &&
          currentNode.content.size === 0
        ) {
          // Delete this empty paragraph and focus previous block
          editor.chain().focus().deleteCurrentNode().focus("end").run();
        }
      }, 10);

      onClose();
    },
    [editor, query, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredCommands.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeCommand(filteredCommands[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, selectedIndex, executeCommand, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const selectedItem = menu.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement;
    if (selectedItem) {
      selectedItem.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (filteredCommands.length === 0) {
    return (
      <div
        className="absolute z-50 w-72 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden"
        style={{ top: position.top, left: position.left }}
      >
        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
          No results found
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-72 max-h-80 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 overflow-y-auto"
      style={{ top: position.top, left: position.left }}
    >
      <div className="py-1">
        {filteredCommands.map((command, index) => {
          const Icon = command.icon;
          const isSelected = index === selectedIndex;

          return (
            <button
              key={command.title}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
                isSelected
                  ? "bg-gray-100 dark:bg-zinc-800"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-800/50"
              }`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => executeCommand(command)}
              onMouseEnter={() => setSelectedIndex(index)}
              data-index={index}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-md border ${
                  isSelected
                    ? "border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                    : "border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50"
                }`}
              >
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {command.title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {command.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
