"use client";

import React, { useState } from "react";
import { Check, Copy, Code2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  language?: string;
  className?: string;
  children?: React.ReactNode;
};

export function CodeBlock({
  language = "javascript",
  className,
  children,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default to light mode

  const handleCopy = async () => {
    const codeElement = document.querySelector("[data-code-content]");
    const code = codeElement?.textContent || "";

    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden my-4 transition-colors duration-200",
        isDark
          ? "bg-[#1e1e1e] border-zinc-700"
          : "bg-[#fafafa] border-zinc-200",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 border-b transition-colors duration-200",
          isDark
            ? "bg-[#2d2d2d] border-zinc-700"
            : "bg-[#f0f0f0] border-zinc-200"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            isDark ? "text-zinc-400" : "text-zinc-600"
          )}
        >
          <Code2 className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
              isDark
                ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-black/5"
            )}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors",
              isDark
                ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-black/5"
            )}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div
        data-code-content
        className={cn(
          "p-4 font-mono text-sm overflow-x-auto transition-colors duration-200",
          isDark ? "text-[#d4d4d4]" : "text-[#1e1e1e]",
          // JavaScript syntax highlighting - Light mode (lowlight classes)
          !isDark && [
            "[&_.hljs-keyword]:text-[#0000ff]",
            "[&_.hljs-string]:text-[#a31515]",
            "[&_.hljs-number]:text-[#098658]",
            "[&_.hljs-comment]:text-[#008000]",
            "[&_.hljs-function]:text-[#795e26]",
            "[&_.hljs-title]:text-[#795e26]",
            "[&_.hljs-params]:text-[#001080]",
            "[&_.hljs-built_in]:text-[#267f99]",
            "[&_.hljs-literal]:text-[#0000ff]",
            "[&_.hljs-attr]:text-[#e50000]",
          ],
          // JavaScript syntax highlighting - Dark mode (lowlight classes)
          isDark && [
            "[&_.hljs-keyword]:text-[#569cd6]",
            "[&_.hljs-string]:text-[#ce9178]",
            "[&_.hljs-number]:text-[#b5cea8]",
            "[&_.hljs-comment]:text-[#6a9955]",
            "[&_.hljs-function]:text-[#dcdcaa]",
            "[&_.hljs-title]:text-[#dcdcaa]",
            "[&_.hljs-params]:text-[#9cdcfe]",
            "[&_.hljs-built_in]:text-[#4ec9b0]",
            "[&_.hljs-literal]:text-[#569cd6]",
            "[&_.hljs-attr]:text-[#9cdcfe]",
          ]
        )}
      >
        {children}
      </div>
    </div>
  );
}
