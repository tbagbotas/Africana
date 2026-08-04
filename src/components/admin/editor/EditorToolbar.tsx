import ToolbarButton from "./ToolbarButton";

import type { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({
  editor,
}: EditorToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b bg-gray-100 p-3">

      <ToolbarButton
        label="B"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <ToolbarButton
        label="I"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <ToolbarButton
        label="U"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />

    </div>
  );
}