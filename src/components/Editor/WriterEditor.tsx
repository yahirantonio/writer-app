'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useWriterStore } from '@/stores/useWriterStore';
import { Toolbar } from './Toolbar';

export function WriterEditor() {
  const editorContent = useWriterStore((s) => s.editorContent);
  const activeFile = useWriterStore((s) => s.activeFile);
  const setEditorContent = useWriterStore((s) => s.setEditorContent);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        horizontalRule: false,
        code: false,
      }),
      Placeholder.configure({
        placeholder: 'Comienza a escribir tu historia…',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose-editor',
      },
    },
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  // Sync store content → editor when switching files
  useEffect(() => {
    if (!editor) return;
    const currentHTML = editor.getHTML();
    if (editorContent !== currentHTML) {
      editor.commands.setContent(editorContent || '', {emitUpdate: false});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile, editor]);

  return (
    <section className="editor-container">
      <Toolbar editor={editor} />
      <div className="editor-scroll">
        {activeFile ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="editor-empty-state">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-600">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <p className="text-zinc-500 text-sm">
              Selecciona un archivo para comenzar a editar
            </p>
            <p className="text-zinc-600 text-xs mt-1">
              o abre una carpeta desde el panel izquierdo
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
