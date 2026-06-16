import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FileNode {
  name: string;
  kind: 'file' | 'directory';
  handle?: FileSystemFileHandle | FileSystemDirectoryHandle | null;
  children?: FileNode[];
  path: string;
}

export interface CharacterCard {
  id: string;
  name: string;
  role: string;
  description: string;
}

interface WriterState {
  // File system
  directoryHandle: FileSystemDirectoryHandle | null;
  fileTree: FileNode[];
  activeFile: FileNode | null;

  // Editor
  editorContent: string;
  isDirty: boolean;
  isSaving: boolean;

  // Context panel
  characterCards: CharacterCard[];
  quickNotes: string;

  // Sidebar
  expandedDirs: Set<string>;

  // Actions — file system
  setDirectoryHandle: (handle: FileSystemDirectoryHandle | null) => void;
  setFileTree: (tree: FileNode[]) => void;
  setActiveFile: (file: FileNode | null) => void;

  // Actions — editor
  setEditorContent: (content: string) => void;
  setIsDirty: (dirty: boolean) => void;
  setIsSaving: (saving: boolean) => void;

  // Actions — context panel
  addCharacterCard: (card: CharacterCard) => void;
  removeCharacterCard: (id: string) => void;
  updateCharacterCard: (id: string, updates: Partial<CharacterCard>) => void;
  setQuickNotes: (notes: string) => void;

  // Actions — sidebar
  toggleDir: (path: string) => void;
}

export const useWriterStore = create<WriterState>((set) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  directoryHandle: null,
  fileTree: [],
  activeFile: null,

  editorContent: '',
  isDirty: false,
  isSaving: false,

  characterCards: [],
  quickNotes: '',

  expandedDirs: new Set<string>(),

  // ── File system actions ────────────────────────────────────────────────────
  setDirectoryHandle: (handle) => set({ directoryHandle: handle }),
  setFileTree: (tree) => set({ fileTree: tree }),
  setActiveFile: (file) => set({ activeFile: file, isDirty: false }),

  // ── Editor actions ─────────────────────────────────────────────────────────
  setEditorContent: (content) => set({ editorContent: content, isDirty: true }),
  setIsDirty: (dirty) => set({ isDirty: dirty }),
  setIsSaving: (saving) => set({ isSaving: saving }),

  // ── Context panel actions ──────────────────────────────────────────────────
  addCharacterCard: (card) =>
    set((state) => ({ characterCards: [...state.characterCards, card] })),

  removeCharacterCard: (id) =>
    set((state) => ({
      characterCards: state.characterCards.filter((c) => c.id !== id),
    })),

  updateCharacterCard: (id, updates) =>
    set((state) => ({
      characterCards: state.characterCards.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  setQuickNotes: (notes) => set({ quickNotes: notes }),

  // ── Sidebar actions ────────────────────────────────────────────────────────
  toggleDir: (path) =>
    set((state) => {
      const next = new Set(state.expandedDirs);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return { expandedDirs: next };
    }),
}));
