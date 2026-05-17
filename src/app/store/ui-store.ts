import { create } from 'zustand';

type ModalId = 'addCollection' | 'pickCollection' | null;

type UiState = {
  activeModal: ModalId;
  modalBookId: string | null;
  openModal: (id: Exclude<ModalId, null>, bookId?: string | null) => void;
  closeModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  activeModal: null,
  modalBookId: null,
  openModal: (id, bookId = null) => set({ activeModal: id, modalBookId: bookId }),
  closeModal: () => set({ activeModal: null, modalBookId: null }),
}));
