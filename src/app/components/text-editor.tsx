import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";

interface TextEditorProps {
  content: string;
  onChange?: (content: string) => void;
}

export default function Text_editor({ content, onChange }: TextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "p-6 min-h-[200px] prose prose-invert max-w-none focus:outline-none text-slate-200 leading-relaxed",
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
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-teal-500/20 rounded-xl opacity-75"></div>

      <div className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-600/30 rounded-xl overflow-hidden shadow-2xl">
        <RichTextEditor
          editor={editor}
          variant="unstyled"
          className="bg-transparent"
        >
          {/* Custom Toolbar */}
          <div className="bg-slate-800/60 backdrop-blur-sm border-b border-slate-600/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {/* Text Formatting Group */}
                <div className="flex items-center bg-slate-700/50 rounded-lg p-1 space-x-1">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 ${
                      editor?.isActive("bold")
                        ? "bg-indigo-500/80 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
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
                    className={`p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 ${
                      editor?.isActive("italic")
                        ? "bg-indigo-500/80 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
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
                    className={`p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 ${
                      editor?.isActive("underline")
                        ? "bg-indigo-500/80 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
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
                    className={`p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 ${
                      editor?.isActive("strike")
                        ? "bg-indigo-500/80 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
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
                <div className="flex items-center bg-slate-700/50 rounded-lg p-1 space-x-1 ml-2">
                  <button
                    onClick={() =>
                      editor?.chain().focus().toggleHighlight().run()
                    }
                    className={`p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 ${
                      editor?.isActive("highlight")
                        ? "bg-yellow-500/80 text-black shadow-lg"
                        : "text-slate-300 hover:text-white"
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
                    className={`p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 ${
                      editor?.isActive("code")
                        ? "bg-emerald-500/80 text-white shadow-lg"
                        : "text-slate-300 hover:text-white"
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
                  className="p-2 rounded-md transition-all duration-200 hover:bg-slate-600/50 text-slate-300 hover:text-white ml-2"
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
              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
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
              <div className="absolute top-6 left-6 text-slate-500 pointer-events-none select-none">
                Start writing your content...
              </div>
            )}

            <RichTextEditor.Content className="min-h-[200px] max-h-[400px] overflow-y-auto" />

            {/* Subtle gradient overlay at bottom for scroll indication */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
          </div>

          {/* Footer */}
          <div className="bg-slate-800/40 backdrop-blur-sm border-t border-slate-600/30 px-4 py-2 flex justify-between items-center text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Rich Text Editor</span>
              {editor?.isEditable && (
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
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
