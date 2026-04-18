'use client';

import { create } from 'zustand';

interface UIStore {
  isPaletteOpen: boolean;
  isConfigPanelOpen: boolean;
  isTemplateModalOpen: boolean;
  togglePalette: () => void;
  openConfigPanel: () => void;
  closeConfigPanel: () => void;
  openTemplateModal: () => void;
  closeTemplateModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isPaletteOpen: true,
  isConfigPanelOpen: false,
  isTemplateModalOpen: false,
  togglePalette: () => set((s) => ({ isPaletteOpen: !s.isPaletteOpen })),
  openConfigPanel: () => set({ isConfigPanelOpen: true }),
  closeConfigPanel: () => set({ isConfigPanelOpen: false }),
  openTemplateModal: () => set({ isTemplateModalOpen: true }),
  closeTemplateModal: () => set({ isTemplateModalOpen: false }),
}));
