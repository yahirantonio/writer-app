'use client';

import React from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { WriterEditor } from '@/components/Editor/WriterEditor';
import { ContextPanel } from '@/components/ContextPanel/ContextPanel';
import { ModalProvider } from '@/components/UI/ModalProvider';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useWriterStore } from '@/stores/useWriterStore';

export function AppShell() {
  const { isSaving } = useAutoSave();
  const activeFile = useWriterStore((s) => s.activeFile);
  const isDirty = useWriterStore((s) => s.isDirty);

  return (
    <div className="app-shell">
      <ModalProvider />
      {/* ── Status bar ─────────────────────────────────────────────────── */}
      <header className="status-bar">
        <div className="flex items-center gap-2">
          <span className="status-bar-brand">✦ Writer</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          {activeFile && (
            <span className="text-zinc-400 font-mono">
              {activeFile.path}
            </span>
          )}
          {isSaving && (
            <span className="text-amber-400 animate-pulse">Guardando…</span>
          )}
          {!isSaving && isDirty && (
            <span className="text-zinc-500">Sin guardar</span>
          )}
          {!isSaving && !isDirty && activeFile && (
            <span className="text-emerald-400">✓ Guardado</span>
          )}
        </div>
      </header>

      {/* ── 3-column grid ──────────────────────────────────────────────── */}
      <main className="app-grid">
        <Sidebar />
        <WriterEditor />
        <ContextPanel />
      </main>
    </div>
  );
}
