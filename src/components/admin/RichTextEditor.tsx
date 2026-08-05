"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
  StarterKit,
  Underline,
  Image,
  Link.configure({
    openOnClick: false,
  }),
],
    content: content || "<p>Start writing your article...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow">

      <div className="flex flex-wrap gap-2 border-b bg-gray-100 p-3">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-3 py-1 font-bold ${
            editor.isActive("bold")
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-3 py-1 italic ${
            editor.isActive("italic")
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded px-3 py-1 underline ${
            editor.isActive("underline")
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          U
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded px-3 py-1 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-3 py-1 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={`rounded px-3 py-1 ${
            editor.isActive("bulletList")
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          •
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={`rounded px-3 py-1 ${
            editor.isActive("orderedList")
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          1.
        </button>

        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");

            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`rounded px-3 py-1 ${
            editor.isActive("link")
              ? "bg-emerald-600 text-white"
              : "border bg-white"
          }`}
        >
          🔗
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded border bg-white px-3 py-1"
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded border bg-white px-3 py-1"
        >
          ↷
        </button>
<button
  type="button"
  onClick={() => alert("Image upload coming next!")}
  className="rounded border bg-white px-3 py-1"
>
  🖼️
</button>
      </div>

      <div className="min-h-[400px] p-4">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}