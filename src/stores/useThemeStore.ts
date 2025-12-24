import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          updateDocumentTheme(newTheme);
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        updateDocumentTheme(theme);
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme after rehydration
        if (state) {
          updateDocumentTheme(state.theme);
        }
      },
    }
  )
);

function updateDocumentTheme(theme: Theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('theme-storage');
  if (stored) {
    try {
      const { state } = JSON.parse(stored);
      updateDocumentTheme(state.theme);
    } catch {
      // Fallback to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      updateDocumentTheme(prefersDark ? 'dark' : 'light');
    }
  } else {
    // Use system preference if no stored theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateDocumentTheme(prefersDark ? 'dark' : 'light');
  }
}
