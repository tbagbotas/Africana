"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,

            parseHTML: (element) =>
              element.style.fontSize || null,

            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

export default function RichTextEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontSize,
    ],

    content: "<p>Start writing your article...</p>",

    immediatelyRender: false,
  });

  if (!editor) return null;

  const buttonClass =
    "px-3 py-1 border rounded bg-white hover:bg-gray-100 cursor-pointer";

  const setFontSize = (size: string) => {
    editor
      .chain()
      .focus()
      .setMark("textStyle", {
        fontSize: size,
      })
      .run();
  };

  return (
    <div className="border rounded-lg p-4 bg-white">

      <div className="flex flex-wrap gap-2 mb-4">

        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
          }}
          className={`${buttonClass} font-bold`}
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
          }}
          className={`${buttonClass} italic`}
        >
          I
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
          }}
          className={`${buttonClass} underline`}
        >
          U
        </button>

        {/* Small */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setFontSize("14px");
          }}
          className={`${buttonClass} text-sm`}
        >
          S
        </button>

        {/* Medium */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setFontSize("18px");
          }}
          className={`${buttonClass} text-base`}
        >
          M
        </button>

        {/* Large */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setFontSize("24px");
          }}
          className={`${buttonClass} text-xl`}
        >
          L
        </button>

      </div>

      <div className="min-h-75 border rounded p-4">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}