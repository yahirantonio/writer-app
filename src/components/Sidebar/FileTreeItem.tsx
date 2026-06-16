'use client';

import React from 'react';
import { FileNode, useWriterStore } from '@/stores/useWriterStore';
import { useFileSystem } from '@/hooks/useFileSystem';
import { useModalStore } from '@/stores/useModalStore';

interface FileTreeItemProps {
  node: FileNode;
  depth: number;
}

export function FileTreeItem({ node, depth }: FileTreeItemProps) {
  const activeFile = useWriterStore((s) => s.activeFile);
  const expandedDirs = useWriterStore((s) => s.expandedDirs);
  const toggleDir = useWriterStore((s) => s.toggleDir);
  const { openFile, deleteNode, renameNode, createSubfolder, createFile } = useFileSystem();
  const openModal = useModalStore((s) => s.openModal);

  const isExpanded = expandedDirs.has(node.path);
  const isActive = activeFile?.path === node.path;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (node.kind === 'directory') {
      toggleDir(node.path);
    } else {
      openFile(node);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      type: 'confirm',
      title: 'Eliminar elemento',
      message: `¿Estás seguro de que quieres eliminar "${node.name}"? Esta acción no se puede deshacer.`,
      confirmLabel: 'Eliminar',
      onConfirm: () => deleteNode(node),
    });
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal({
      type: 'prompt',
      title: 'Renombrar',
      initialValue: node.name,
      confirmLabel: 'Renombrar',
      placeholder: 'ej. nuevo-nombre.md',
      onConfirm: (newName) => {
        if (newName && newName !== node.name) {
          renameNode(node, newName);
        }
      },
    });
  };

  const handleNewFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.kind !== 'directory') return;
    openModal({
      type: 'prompt',
      title: 'Nueva Carpeta',
      placeholder: 'Nombre de la carpeta',
      confirmLabel: 'Crear',
      onConfirm: (name) => {
        if (name) createSubfolder(node.handle as FileSystemDirectoryHandle, name);
      },
    });
  };

  const handleNewFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (node.kind !== 'directory') return;
    openModal({
      type: 'prompt',
      title: 'Nuevo Archivo',
      placeholder: 'ej. notas.md',
      confirmLabel: 'Crear',
      onConfirm: (name) => {
        if (name) createFile(node.handle as FileSystemDirectoryHandle, name);
      },
    });
  };

  const ext = node.name.split('.').pop()?.toLowerCase();
  const getFileColor = () => {
    switch (ext) {
      case 'html': case 'htm': return 'text-orange-400';
      case 'txt': return 'text-zinc-400';
      case 'md': return 'text-blue-400';
      case 'json': return 'text-yellow-400';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="flex flex-col">
      <div className="group relative">
        <div
          onClick={handleClick}
          className={`tree-item ${isActive ? 'tree-item-active' : ''} pr-20 cursor-pointer flex items-center`}
          style={{ paddingLeft: `${12 + depth * 16}px`, minHeight: '32px' }}
        >
          {/* Icon */}
          {node.kind === 'directory' ? (
            <span className="text-amber-400/80 text-[11px] mr-1.5 w-4 flex-shrink-0 text-center">
              {isExpanded ? '▾' : '▸'}
            </span>
          ) : (
            <span className={`text-[11px] mr-1.5 w-4 flex-shrink-0 text-center ${getFileColor()}`}>
              ◆
            </span>
          )}

          {/* Name */}
          <span className="truncate select-none pointer-events-none">{node.name}</span>

          {/* Actions - visible on hover */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 px-1.5 bg-zinc-900/90 rounded-md py-1 border border-zinc-800 backdrop-blur-sm shadow-xl z-20">
            {node.kind === 'directory' && (
              <>
                <button
                  onClick={handleNewFile}
                  className="p-1 hover:text-zinc-100 transition-colors rounded hover:bg-zinc-800 focus:outline-none"
                  title="Nuevo archivo"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>
                </button>
                <button
                  onClick={handleNewFolder}
                  className="p-1 hover:text-zinc-100 transition-colors rounded hover:bg-zinc-800 focus:outline-none"
                  title="Nueva carpeta"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1="12" y1="11" x2="12" y2="17" /><line x1="9" y1="14" x2="15" y2="14" /></svg>
                </button>
              </>
            )}
            <button
              onClick={handleRename}
              className="p-1 hover:text-zinc-100 transition-colors rounded hover:bg-zinc-800 focus:outline-none"
              title="Renombrar"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:text-red-400 transition-colors rounded hover:bg-red-400/10 focus:outline-none"
              title="Eliminar"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
            </button>
          </div>
        </div>
      </div>

      {node.kind === 'directory' && isExpanded && node.children && (
        <div className="border-l border-zinc-800/30 ml-2.5">
          {node.children.map((child) => (
            <FileTreeItem key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
