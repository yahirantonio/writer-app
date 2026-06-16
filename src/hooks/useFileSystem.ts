'use client';

import { useCallback } from 'react';
import { useWriterStore, FileNode, CharacterCard } from '@/stores/useWriterStore';

/**
 * Hook that wraps the FileSystem Access API for reading and writing files.
 */
export function useFileSystem() {
  const {
    setDirectoryHandle,
    setFileTree,
    setActiveFile,
    setEditorContent,
  } = useWriterStore();

  const directoryHandle = useWriterStore((s) => s.directoryHandle);
  const activeFile = useWriterStore((s) => s.activeFile);

  // ── Build Tree ────────────────────────────────────────────────────────
  const buildFileTree = useCallback(
    async (
      dirHandle: FileSystemDirectoryHandle,
      parentPath = ''
    ): Promise<FileNode[]> => {
      const nodes: FileNode[] = [];
      for await (const entry of (dirHandle as any).values()) {
        const entryPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
        if (entry.kind === 'directory') {
          const children = await buildFileTree(entry, entryPath);
          nodes.push({
            name: entry.name,
            kind: 'directory',
            handle: entry,
            children,
            path: entryPath,
          });
        } else {
          nodes.push({
            name: entry.name,
            kind: 'file',
            handle: entry,
            path: entryPath,
          });
        }
      }
      nodes.sort((a, b) => {
        if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
      return nodes;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ── Refresh Tree ──────────────────────────────────────────────────────
  const refreshFileTree = useCallback(async () => {
    if (!directoryHandle) return;
    const tree = await buildFileTree(directoryHandle);
    setFileTree(tree);
  }, [directoryHandle, buildFileTree, setFileTree]);

  // ── Open Folder ───────────────────────────────────────────────────────
  const openFolder = useCallback(async () => {
    try {
      const handle = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
      setDirectoryHandle(handle);
      const tree = await buildFileTree(handle);
      setFileTree(tree);
      setActiveFile(null);
      setEditorContent('');

      // Auto-load characters
      await loadCharacters(handle);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Error opening folder:', err);
    }
  }, [buildFileTree, setDirectoryHandle, setFileTree, setActiveFile, setEditorContent]);

  // ── Creation ──────────────────────────────────────────────────────────
  const createFile = useCallback(
    async (dirHandle: FileSystemDirectoryHandle, name: string) => {
      const handle = await (dirHandle as any).getFileHandle(name, { create: true });
      await refreshFileTree();
      return handle;
    },
    [refreshFileTree]
  );

  const createSubfolder = useCallback(
    async (parentHandle: FileSystemDirectoryHandle, name: string) => {
      await parentHandle.getDirectoryHandle(name, { create: true });
      await refreshFileTree();
    },
    [refreshFileTree]
  );

  const createUntitledFile = useCallback(async () => {
    if (directoryHandle) {
      const name = `Nuevo-${Date.now().toString().slice(-4)}.md`;
      const handle = await directoryHandle.getFileHandle(name, { create: true });
      await refreshFileTree();
      const node: FileNode = { name, kind: 'file', handle, path: name };
      setActiveFile(node);
      setEditorContent('');
      return node;
    }
    const node: FileNode = {
      name: 'Sin título.md',
      kind: 'file',
      handle: null,
      path: 'untitled-' + Date.now(),
    };
    setActiveFile(node);
    setEditorContent('');
    return node;
  }, [directoryHandle, refreshFileTree, setActiveFile, setEditorContent]);

  // ── Disk Operations ───────────────────────────────────────────────────
  const readFile = useCallback(async (fileHandle: FileSystemFileHandle) => {
    const file = await fileHandle.getFile();
    return file.text();
  }, []);

  const writeFile = useCallback(async (fileHandle: FileSystemFileHandle, content: string) => {
    const writable = await (fileHandle as any).createWritable();
    await writable.write(content);
    await writable.close();
  }, []);

  // ── Character Management ──────────────────────────────────────────────
  const loadCharacters = async (rootHandle?: FileSystemDirectoryHandle | null) => {
    const root = rootHandle || directoryHandle;
    if (!root) return;
    try {
      const charDir = await root.getDirectoryHandle('personajes', { create: true });
      const cards: CharacterCard[] = [];
      
      // Use entries() for more reliable iteration in some environments
      for await (const [name, handle] of (charDir as FileSystemDirectoryHandle).entries()) {
        console.log(charDir, name, handle);
        if (handle.kind === 'file' && name.endsWith('.json')) {
          const file = await handle.getFile();
          const content = await file.text();
          try {
            const card = JSON.parse(content);
            // Ensure card has an ID, or skip
            if (card.id) cards.push(card);
          } catch (e) {
            console.error('Error parsing character:', name, e);
          }
        }
      }
      
      // Update store with all successfully loaded cards
      useWriterStore.setState({ characterCards: cards });
    } catch (err) {
      console.error('Error loading characters:', err);
    }
  };

  const saveCharacter = async (card: CharacterCard, oldName?: string) => {
    if (!directoryHandle) return;
    try {
      const charDir = await directoryHandle.getDirectoryHandle('personajes', { create: true });
      
      // 1. If name changed, delete old file
      if (oldName && oldName !== card.name) {
        try {
          await charDir.removeEntry(`${oldName}.json`);
        } catch (e) {
          // Ignore if old file doesn't exist
        }
      }

      // 2. Save new file with name as filename
      const safeName = card.name.replace(/[/\\?%*:|"<>]/g, '-'); // Basic sanitization
      const fileHandle = await charDir.getFileHandle(`${safeName}.json`, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(card, null, 2));
      await writable.close();
      
      // 3. Update local state
      const current = useWriterStore.getState().characterCards;
      const existsIdx = current.findIndex(c => c.id === card.id);
      if (existsIdx !== -1) {
        const next = [...current];
        next[existsIdx] = card;
        useWriterStore.setState({ characterCards: next });
      } else {
        useWriterStore.setState({ characterCards: [...current, card] });
      }

      // 4. Also refresh the explorer tree so the folder/files show up
      await refreshFileTree();
    } catch (err) {
      console.error('Error saving character:', err);
    }
  };

  const deleteCharacter = async (card: CharacterCard) => {
    if (!directoryHandle) return;
    try {
      const charDir = await directoryHandle.getDirectoryHandle('personajes', { create: true });
      const safeName = card.name.replace(/[/\\?%*:|"<>]/g, '-');
      await charDir.removeEntry(`${safeName}.json`);
      
      // Update local state
      const current = useWriterStore.getState().characterCards;
      useWriterStore.setState({
        characterCards: current.filter(c => c.id !== card.id)
      });

      await refreshFileTree();
    } catch (err: any) {
      // Still update UI if file not found
      const current = useWriterStore.getState().characterCards;
      useWriterStore.setState({ characterCards: current.filter(c => c.id !== card.id) });
      await refreshFileTree();
      
      if (err.name !== 'NotFoundError') {
        console.error('Error deleting character:', err);
      }
    }
  };

  // ── Management Actions ────────────────────────────────────────────────
  const deleteNode = useCallback(
    async (node: FileNode) => {
      try {
        if (node.handle) {
          if (node.kind === 'directory') {
            await (node.handle as any).remove({ recursive: true });
          } else {
            await (node.handle as any).remove();
          }
          await refreshFileTree();
        }
        if (activeFile?.path === node.path) {
          setActiveFile(null);
          setEditorContent('');
        }
      } catch (err) {
        console.error('Error deleting:', err);
      }
    },
    [activeFile, refreshFileTree, setActiveFile, setEditorContent]
  );

  const renameNode = useCallback(
    async (node: FileNode, newName: string) => {
      try {
        if (!node.handle) {
          // Virtual file case
          if (activeFile?.path === node.path) {
            setActiveFile({ ...node, name: newName, path: newName });
          }
          return;
        }

        if (node.kind === 'file') {
          // File renaming using move()
          if ((node.handle as any).move) {
            await (node.handle as any).move(newName);
          } else {
            throw new Error('Rename not supported for files');
          }
        } else {
          // Directory renaming: Copy & Delete strategy
          if (!directoryHandle) return;

          // 1. Find parent handle
          const pathParts = node.path.split('/');
          pathParts.pop(); // remove current name

          let parentHandle = directoryHandle;
          for (const part of pathParts) {
            parentHandle = await parentHandle.getDirectoryHandle(part);
          }

          // 2. Create new directory
          const newDirHandle = await parentHandle.getDirectoryHandle(newName, { create: true });

          // 3. Helper for recursive copy
          const copyRecursive = async (src: FileSystemDirectoryHandle, dest: FileSystemDirectoryHandle) => {
            for await (const entry of (src as any).values()) {
              if (entry.kind === 'file') {
                const file = await entry.getFile();
                const newFileHandle = await dest.getFileHandle(entry.name, { create: true });
                const writable = await newFileHandle.createWritable();
                await writable.write(file);
                await writable.close();
              } else {
                const newSubDir = await dest.getDirectoryHandle(entry.name, { create: true });
                await copyRecursive(entry, newSubDir);
              }
            }
          };

          // 4. Copy all contents
          await copyRecursive(node.handle as FileSystemDirectoryHandle, newDirHandle);

          // 5. Remove old directory
          await parentHandle.removeEntry(node.name, { recursive: true });
        }

        await refreshFileTree();

        if (activeFile?.path === node.path) {
          setActiveFile({ ...node, name: newName, path: newName });
        }
      } catch (err) {
        console.error('Error renaming:', err);
      }
    },
    [activeFile, directoryHandle, refreshFileTree, setActiveFile]
  );

  const openFile = useCallback(
    async (node: FileNode) => {
      if (node.kind !== 'file') return;
      const content = await readFile(node.handle as FileSystemFileHandle);
      setActiveFile(node);
      setEditorContent(content);
    },
    [readFile, setActiveFile, setEditorContent]
  );

  return {
    openFolder, readFile, writeFile, createFile, createSubfolder,
    createUntitledFile, refreshFileTree, deleteNode, renameNode, openFile,
    loadCharacters, saveCharacter, deleteCharacter
  };
}
