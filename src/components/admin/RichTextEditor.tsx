
"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link,
      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: content || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content || "<p></p>");
    }
  }, [editor, content]);

  async function handleInlineImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !editor) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Upload failed");
      }

      editor
        .chain()
        .focus()
        .setImage({ src: data.imageUrl })
        .run();
    } catch (error) {
      console.error(error);
      alert("Image upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  if (!editor) {
    return <p>Loading editor...</p>;
  }

  const buttonClass = (active: boolean) =>
    `rounded border px-3 py-1 ${
      active
        ? "bg-emerald-600 text-white"
        : "bg-white text-gray-800"
    }`;

  function resizeLastImage(width: string) {
    const images = editor?.view.dom.querySelectorAll("img");
    const img = images?.[images.length - 1] as HTMLImageElement | undefined;

    if (img) {
      img.style.width = width;
      img.style.height = "auto";
    }
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white shadow">
      <div className="flex flex-wrap gap-2 border-b bg-gray-100 p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={buttonClass(editor.isActive("underline"))}
          title="Underline"
        >
          <u>U</u>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", { level: 1 })
          )}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={buttonClass(
            editor.isActive("heading", { level: 2 })
          )}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={buttonClass(editor.isActive("paragraph"))}
        >
          P
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet list"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Numbered list"
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Enter the link URL");

            if (url) {
              editor.chain().focus().extendMarkRange("link")
                .setLink({ href: url }).run();
            }
          }}
          className={buttonClass(editor.isActive("link"))}
          title="Add link"
        >
          Link
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="rounded border bg-white px-3 py-1"
          title="Remove link"
        >
          Unlink
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="rounded border bg-white px-3 py-1"
          title="Undo"
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="rounded border bg-white px-3 py-1"
          title="Redo"
        >
          ↷
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded border bg-white px-3 py-1"
          title="Insert image"
        >
          🖼️ Image
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={buttonClass(editor.isActive({ textAlign: "left" }))}
          title="Align left"
        >
          Left
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={buttonClass(editor.isActive({ textAlign: "center" }))}
          title="Center"
        >
          Center
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={buttonClass(editor.isActive({ textAlign: "right" }))}
          title="Align right"
        >
          Right
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={buttonClass(editor.isActive({ textAlign: "justify" }))}
          title="Justify"
        >
          Justify
        </button>

        <button
          type="button"
          onClick={() => resizeLastImage("30%")}
          className="rounded border bg-white px-3 py-1"
          title="Small image"
        >
          Image S
        </button>

        <button
          type="button"
          onClick={() => resizeLastImage("60%")}
          className="rounded border bg-white px-3 py-1"
          title="Medium image"
        >
          Image M
        </button>

        <button
          type="button"
          onClick={() => resizeLastImage("100%")}
          className="rounded border bg-white px-3 py-1"
          title="Large image"
        >
          Image L
        </button>
      </div>

      <div className="min-h-75 p-4">
        <EditorContent editor={editor} />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInlineImage}
      />
    </div>
  );
}
