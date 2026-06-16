'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useWriterStore } from '@/stores/useWriterStore';
import { useFileSystem } from './useFileSystem';

const AUTO_SAVE_DELAY = 1500; // ms

/**
 * Auto-save hook.
 * Watches `editorContent` in the store and writes it to disk
 * after a debounce period of 1.5 s following the last change.
 */
export function useAutoSave() {
  const { writeFile } = useFileSystem();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editorContent = useWriterStore((s) => s.editorContent);
  const activeFile = useWriterStore((s) => s.activeFile);
  const isDirty = useWriterStore((s) => s.isDirty);
  const isSaving = useWriterStore((s) => s.isSaving);
  const setIsDirty = useWriterStore((s) => s.setIsDirty);
  const setIsSaving = useWriterStore((s) => s.setIsSaving);
  const setActiveFile = useWriterStore((s) => s.setActiveFile);

  const save = useCallback(async () => {
    if (!activeFile || activeFile.kind !== 'file') return;
    
    let handle = activeFile.handle as FileSystemFileHandle;
    
    // If it's a virtual/untitled file, prompt to save for the first time
    if (!handle) {
      try {
        handle = await (window as any).showSaveFilePicker({
          suggestedName: activeFile.name,
          types: [
            {
              description: 'Markdown File',
              accept: { 'text/markdown': ['.md'] },
            },
          ],
        });
        
        // Update the active file with the new handle and path
        const updatedNode = { ...activeFile, handle, path: handle.name };
        setActiveFile(updatedNode);
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        throw err;
      }
    }

    setIsSaving(true);
    try {
      await writeFile(handle, editorContent);
      setIsDirty(false);
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [activeFile, editorContent, writeFile, setIsDirty, setIsSaving, setActiveFile]);

  useEffect(() => {
    if (!isDirty || !activeFile) return;

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      save();
    }, AUTO_SAVE_DELAY);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isDirty, editorContent, activeFile, save]);

  return { isSaving };
}
