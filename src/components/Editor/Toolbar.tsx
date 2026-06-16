'use client';

import React from 'react';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `toolbar-btn ${active ? 'toolbar-btn-active' : ''}`;

  return (
    <div className="editor-toolbar">
      {/* ── Text formatting ──────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive('bold'))}
          title="Negrita (Ctrl+B)"
        >
          <span className="font-bold">B</span>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive('italic'))}
          title="Cursiva (Ctrl+I)"
        >
          <span className="italic">I</span>
        </button>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="toolbar-divider" />

      {/* ── Headings ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btnClass(editor.isActive('heading', { level: 1 }))}
          title="Título 1"
        >
          H1
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btnClass(editor.isActive('heading', { level: 2 }))}
          title="Título 2"
        >
          H2
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btnClass(editor.isActive('heading', { level: 3 }))}
          title="Título 3"
        >
          H3
        </button>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────── */}
      <div className="toolbar-divider" />

      {/* ── Block elements ───────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive('bulletList'))}
          title="Lista"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive('blockquote'))}
          title="Cita"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
