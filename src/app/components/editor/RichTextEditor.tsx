"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function RichTextEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello Africana!</p>",
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <EditorContent editor={editor} />
    </div>
  );
}