import React, { useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { FormattingToolbar } from "./FormattingToolbar";

interface TipTapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  placeholder?: string;
  className?: string;
}

// Helper function to convert plain text to HTML paragraphs
function ensureHtmlContent(content: string): string {
  if (!content || content.trim() === "") return "";

  // If content already has HTML tags, return as-is
  if (
    content.includes("<p>") ||
    content.includes("<h1>") ||
    content.includes("<h2>") ||
    content.includes("<ul>") ||
    content.includes("<ol>") ||
    content.includes("<blockquote>") ||
    content.includes("<strong>") ||
    content.includes("<em>") ||
    content.includes("<br>")
  ) {
    return content;
  }

  // Convert plain text with line breaks to HTML paragraphs
  const paragraphs = content
    .split(/\n\n+/)
    .map((para) => {
      const lines = para.split(/\n/).filter((line) => line.trim() !== "");
      if (lines.length === 0) return "";
      if (lines.length === 1) return `<p>${lines[0]}</p>`;
      return `<p>${lines.join("<br>")}</p>`;
    })
    .filter((p) => p !== "");

  return paragraphs.join("");
}

export default function TipTapEditor({
  content,
  onUpdate,
  placeholder = "Start writing...",
  className = "",
}: TipTapEditorProps) {
  const lastEditorHTML = useRef<string>("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: ensureHtmlContent(content),
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEditorHTML.current = html;
      onUpdate(html);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none font-mono ${className}`,
        style:
          'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 16px; line-height: 1.6;',
      },
    },
  });

  // Update editor content when prop changes from external source
  useEffect(() => {
    if (editor) {
      // Skip if content came from the editor's own onUpdate
      if (content === lastEditorHTML.current) {
        return;
      }

      const htmlContent = ensureHtmlContent(content || "");
      const currentHTML = editor.getHTML();

      const normalizedNew = htmlContent === "" ? "" : htmlContent;
      const normalizedCurrent = currentHTML === "<p></p>" ? "" : currentHTML;

      if (normalizedNew !== normalizedCurrent) {
        editor.commands.setContent(htmlContent, { emitUpdate: false });
        lastEditorHTML.current = editor.getHTML();
      }
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[#a89880]">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border border-[#d4c4a8] rounded-lg overflow-hidden bg-white relative">
      <FormattingToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="flex-1 overflow-y-auto p-4 focus-within:outline-none"
        style={{ minHeight: "100px" }}
      />
    </div>
  );
}
