"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content:
      value ||
      `
        <h2>Start writing your article...</h2>
        <p>This is the Africana editor.</p>
      `,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow">
      <div className="flex items-center justify-between border-b bg-gray-100 px-4 py-3">
        <h2 className="font-semibold text-gray-800">
          Article Content
        </h2>

        <span className="text-sm text-gray-500">
          TipTap Editor
        </span>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[450px] p-6 focus:outline-none"
      />
    </div>
  );
}