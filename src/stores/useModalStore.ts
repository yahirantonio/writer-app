import { create } from 'zustand';

export type ModalType = 'confirm' | 'prompt';

interface ModalConfig {
  type: ModalType;
  title: string;
  message?: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: (value?: string) => void | Promise<void>;
  onCancel?: () => void;
}

interface ModalState {
  isOpen: boolean;
  config: ModalConfig | null;
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  config: null,
  openModal: (config) => set({ isOpen: true, config }),
  closeModal: () => set({ isOpen: false, config: null }),
}));
