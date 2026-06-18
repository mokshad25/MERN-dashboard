import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  commandPaletteOpen: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  setCommandPalette: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      darkMode: false,
      commandPaletteOpen: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleDarkMode: () =>
        set((s) => {
          const next = !s.darkMode;
          document.documentElement.classList.toggle('dark', next);
          return { darkMode: next };
        }),
      setCommandPalette: (open) => set({ commandPaletteOpen: open }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed, darkMode: state.darkMode }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
