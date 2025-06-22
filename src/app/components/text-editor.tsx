"use client";

import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import { useThemeClasses } from "../hooks/useThemeClasses";

interface TextEditorProps {
  content: string;
  onChange?: (content: string) => void;
}

export default function Text_editor({ content, onChange }: TextEditorProps) {
  const theme = useThemeClasses();
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `p-4 min-h-[200px] prose max-w-none focus:outline-none ${theme.text.secondary} leading-relaxed transition-colors duration-300`,
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
  });

  if (!editor) return null;

  return (
    <div className="relative">
      <div
        className={`relative ${theme.bg.card} ${theme.border.primary} border rounded-lg overflow-hidden transition-colors duration-300`}
      >
        <RichTextEditor
          editor={editor}
          variant="unstyled"
          className="bg-transparent"
        >
          {/* Custom Toolbar */}
          <div
            className={`${theme.bg.secondary} ${theme.border.primary} border-b p-3 transition-colors duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {/* Text Formatting Group */}
                <div
                  className={`flex items-center ${theme.bg.card} ${theme.border.primary} border rounded-lg p-1 space-x-1 transition-colors duration-300`}
                >
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      theme.bg.hover
                    } ${
                      editor?.isActive("bold")
                        ? `${theme.button.primary}`
                        : `${theme.text.secondary} hover:${theme.text.primary}`
                    }`}
                    title="Bold"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6,4h4.5a3.5,3.5 0 0,1 0,7H6V4M6,13h5a3.5,3.5 0 0,1 0,7H6V13Z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      theme.bg.hover
                    } ${
                      editor?.isActive("italic")
                        ? `${theme.button.primary}`
                        : `${theme.text.secondary} hover:${theme.text.primary}`
                    }`}
                    title="Italic"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10,4V7H12.21L8.79,17H6V20H14V17H11.79L15.21,7H18V4H10Z" />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleUnderline().run()
                    }
                    className={`p-2 rounded-md transition-all duration-300 ${
                      theme.bg.hover
                    } ${
                      editor?.isActive("underline")
                        ? `${theme.button.primary}`
                        : `${theme.text.secondary} hover:${theme.text.primary}`
                    }`}
                    title="Underline"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5,21H19V19H5V21M12,17A6,6 0 0,0 18,11V3H15.5V11A3.5,3.5 0 0,1 12,14.5A3.5,3.5 0 0,1 8.5,11V3H6V11A6,6 0 0,0 12,17Z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      theme.bg.hover
                    } ${
                      editor?.isActive("strike")
                        ? `${theme.button.primary}`
                        : `${theme.text.secondary} hover:${theme.text.primary}`
                    }`}
                    title="Strikethrough"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3,14H21V12H3V14M5,4V7H10V10H14V7H19V4H5M10,19H14V16H10V19Z" />
                    </svg>
                  </button>
                </div>

                {/* Styling Group */}
                <div
                  className={`flex items-center ${theme.bg.card} ${theme.border.primary} border rounded-lg p-1 space-x-1 ml-2 transition-colors duration-300`}
                >
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHighlight().run()
                    }
                    className={`p-2 rounded-md transition-all duration-300 ${
                      theme.bg.hover
                    } ${
                      editor?.isActive("highlight")
                        ? "bg-yellow-200 text-yellow-800"
                        : `${theme.text.secondary} hover:${theme.text.primary}`
                    }`}
                    title="Highlight"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16H7V4A2,2 0 0,1 9,2H15A2,2 0 0,1 17,4V16H18A2,2 0 0,1 20,18A2,2 0 0,1 18,20H6Z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => editor?.chain().focus().toggleCode().run()}
                    className={`p-2 rounded-md transition-all duration-300 ${
                      theme.bg.hover
                    } ${
                      editor?.isActive("code")
                        ? `${theme.button.primary}`
                        : `${theme.text.secondary} hover:${theme.text.primary}`
                    }`}
                    title="Inline Code"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8,3A2,2 0 0,0 6,5V9A2,2 0 0,1 4,11H3V13H4A2,2 0 0,1 6,15V19A2,2 0 0,0 8,21H10V19H8V14A2,2 0 0,0 6,12A2,2 0 0,0 8,10V5H10V3M16,3A2,2 0 0,1 18,5V9A2,2 0 0,0 20,11H21V13H20A2,2 0 0,0 18,15V19A2,2 0 0,1 16,21H14V19H16V14A2,2 0 0,1 18,12A2,2 0 0,1 16,10V5H14V3H16Z" />
                    </svg>
                  </button>
                </div>

                {/* Clear Formatting */}
                <button
                  onClick={() => editor?.chain().focus().unsetAllMarks().run()}
                  className={`p-2 rounded-md transition-all duration-300 ${theme.bg.hover} ${theme.text.secondary} hover:${theme.text.primary} ml-2`}
                  title="Clear Formatting"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6,5V5.18L8.82,8H11.22L10.5,9.68L12.6,11.78C12.88,11.54 13.12,11.27 13.34,10.97H17V9.27H14.87L14.3,8H17V6.31H13.5L14.1,4.63H17V3H6.4L6,5M3.27,5L2,6.27L8.97,13.24L6.5,19.5H9.5L11.07,16.34L16.73,22L18,20.73L3.55,5.27L3.27,5Z" />
                  </svg>
                </button>
              </div>

              {/* Word Count Indicator */}
              <div
                className={`flex items-center space-x-3 text-xs ${theme.text.muted} transition-colors duration-300`}
              >
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live</span>
                </div>
                <span>
                  {editor?.storage.characterCount?.characters() || 0} chars
                </span>
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="relative">
            {/* Placeholder */}
            {editor?.isEmpty && (
              <div
                className={`absolute top-4 left-4 ${theme.text.muted} pointer-events-none select-none transition-colors duration-300`}
              >
                Start writing your content...
              </div>
            )}

            <RichTextEditor.Content className="min-h-[200px] max-h-[400px] overflow-y-auto" />
          </div>

          {/* Footer */}
          <div
            className={`${theme.bg.secondary} ${theme.border.primary} border-t px-4 py-2 flex justify-between items-center text-xs ${theme.text.muted} transition-colors duration-300`}
          >
            <div className="flex items-center space-x-4">
              <span>Rich Text Editor</span>
              {editor?.isEditable && (
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Editable</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>Powered by TipTap</span>
            </div>
          </div>
        </RichTextEditor>
      </div>
    </div>
  );
}
