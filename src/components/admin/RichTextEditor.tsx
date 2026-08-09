"use client";



import { useRef } from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";


import Image from "@tiptap/extension-image";

import Placeholder from "@tiptap/extension-placeholder";

import TextAlign from "@tiptap/extension-text-align";



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
  Link,
  Image,
  Placeholder.configure({
    placeholder: "Start writing your article...",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
],

    content: content || "<p>Start writing your article...</p>",

    immediatelyRender: false,

    onUpdate: ({ editor }) => {

      onChange(editor.getHTML());

    },

  });



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

        .setImage({

          src: data.imageUrl,

        })

        .run();

    } catch (error) {

      console.error(error);

      alert("Image upload failed.");

    }

  }



  if (!editor) {

    return <p>Loading editor...</p>;

  }



  return (

    <div className="rounded-lg border border-gray-300 bg-white shadow">

      <div className="flex flex-wrap gap-2 border-b bg-gray-100 p-3">        <button

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

          onClick={() => editor.chain().focus().toggleBulletList().run()}

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

          onClick={() => editor.chain().focus().toggleOrderedList().run()}

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

          onClick={() => fileInputRef.current?.click()}

          className="rounded border bg-white px-3 py-1"

        >

          🖼️

        </button>

<button
  type="button"
  onClick={() => editor.chain().focus().setTextAlign("left").run()}
  className={`rounded border px-3 py-1 ${
    editor.isActive({ textAlign: "left" })
      ? "bg-emerald-600 text-white"
      : "bg-white"
  }`}
>
  ⬅️
</button>

<button
  type="button"
  onClick={() => editor.chain().focus().setTextAlign("center").run()}
  className={`rounded border px-3 py-1 ${
    editor.isActive({ textAlign: "center" })
      ? "bg-emerald-600 text-white"
      : "bg-white"
  }`}
>
  ↔️
</button>

<button
  type="button"
  onClick={() => editor.chain().focus().setTextAlign("right").run()}
  className={`rounded border px-3 py-1 ${
    editor.isActive({ textAlign: "right" })
      ? "bg-emerald-600 text-white"
      : "bg-white"
  }`}
>
  ➡️
</button>

<button
  type="button"
  onClick={() => editor.chain().focus().setTextAlign("justify").run()}
  className={`rounded border px-3 py-1 ${
    editor.isActive({ textAlign: "justify" })
      ? "bg-emerald-600 text-white"
      : "bg-white"
  }`}
>
  ☰
</button>

        <button

          type="button"

          onClick={() => {

            const img = editor.view.dom.querySelector(

              "img:last-of-type"

            ) as HTMLImageElement | null;



            if (img) {

              img.style.width = "30%";

            }

          }}

          className="rounded border bg-white px-3 py-1"

        >

          S

        </button>



        <button

          type="button"

          onClick={() => {

            const img = editor.view.dom.querySelector(

              "img:last-of-type"

            ) as HTMLImageElement | null;



            if (img) {

              img.style.width = "60%";

            }

          }}

          className="rounded border bg-white px-3 py-1"

        >

          M

        </button>



        <button

          type="button"

          onClick={() => {

            const img = editor.view.dom.querySelector(

              "img:last-of-type"

            ) as HTMLImageElement | null;



            if (img) {

              img.style.width = "100%";

            }

          }}

          className="rounded border bg-white px-3 py-1"

        >

          L

        </button>

      </div>



      <div className="min-h-[400px] p-4">

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