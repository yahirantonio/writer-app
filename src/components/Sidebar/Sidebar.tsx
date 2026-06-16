'use client';

import React from 'react';
import { useWriterStore, FileNode } from '@/stores/useWriterStore';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useModalStore } from '@/stores/useModalStore';
import { FileTreeItem } from './FileTreeItem';

export function Sidebar() {
  const fileTree = useWriterStore((s) => s.fileTree);
  const directoryHandle = useWriterStore((s) => s.directoryHandle);
  const { openFolder, createUntitledFile, refreshFileTree, createSubfolder } = useFileSystem();
  const openModal = useModalStore((s) => s.openModal);

  return (
    <aside className="sidebar">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="sidebar-header">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 truncate max-w-[140px]">
          {directoryHandle ? directoryHandle.name : 'Explorador'}
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={createUntitledFile}
            className="sidebar-btn"
            title="Nuevo archivo"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </button>
          {directoryHandle && (
            <>
              <button
                onClick={() => {
                  openModal({
                    type: 'prompt',
                    title: 'Nueva Carpeta',
                    placeholder: 'Nombre de la carpeta',
                    confirmLabel: 'Crear',
                    onConfirm: (name) => {
                      if (name) createSubfolder(directoryHandle, name);
                    },
                  });
                }}
                className="sidebar-btn"
                title="Nueva carpeta"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </button>
              <button
                onClick={refreshFileTree}
                className="sidebar-btn"
                title="Refrescar"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 4v6h-6" />
                  <path d="M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={openFolder}
            className="sidebar-btn"
            title="Abrir carpeta"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── File tree ──────────────────────────────────────────────────── */}
      <nav className="sidebar-tree">
        {!directoryHandle && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/60 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed">
              habre una nueva carpeta para empezar a escribir tus historias.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-[160px]">
              <button
                onClick={openFolder}
                className="open-folder-btn"
              >
                Abrir carpeta
              </button>
              {/* <button
                onClick={openFolder}
                className="text-zinc-400 hover:text-zinc-200 text-xs font-medium py-2 transition-colors"
              >
                Abrir Carpeta
              </button> */}
            </div>
          </div>
        )}

        {directoryHandle && fileTree.length === 0 && (
          <p className="text-zinc-500 text-xs p-4 text-center">
            La carpeta está vacía.
          </p>
        )}

        {fileTree.map((node) => {
          if(node.name === 'personajes') return;
          return <FileTreeItem key={node.path} node={node} depth={0} />
        })}
      </nav>
    </aside>
  );
}
