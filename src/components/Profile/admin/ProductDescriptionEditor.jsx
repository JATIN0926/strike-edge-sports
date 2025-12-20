"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Mark } from "@tiptap/core";

/* ✅ Custom TextStyle Mark (font-size support) */
const TextStyle = Mark.create({
  name: "textStyle",

  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return {
            style: `font-size: ${attributes.fontSize}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [{ style: "font-size" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

export default function ProductDescriptionEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle, // ✅ REAL MARK now
    ],
    content: value,
    immediatelyRender: false, // SSR FIX
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setFontSize = (size) => {
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  return (
    <div className="rounded-xl border border-black/10 bg-white/70 backdrop-blur">
      {/* Toolbar */}
      <div className="flex gap-2 border-b border-black/10 px-3 py-2 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm font-bold rounded
            ${
              editor.isActive("bold")
                ? "bg-black text-white"
                : "hover:bg-black/10"
            }
          `}
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm italic rounded
            ${
              editor.isActive("italic")
                ? "bg-black text-white"
                : "hover:bg-black/10"
            }
          `}
        >
          I
        </button>

        <select
          onChange={(e) => setFontSize(e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white"
          defaultValue="16px"
        >
          <option value="14px">Small</option>
          <option value="16px">Normal</option>
          <option value="18px">Large</option>
          <option value="22px">Extra Large</option>
        </select>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="
  px-4 py-3
  text-sm
  focus:outline-none

  [&_.ProseMirror]:min-h-[12rem]
  [&_.ProseMirror]:max-h-[40vh]
  [&_.ProseMirror]:overflow-y-auto
  [&_.ProseMirror]:outline-none
"
      />
    </div>
  );
}
