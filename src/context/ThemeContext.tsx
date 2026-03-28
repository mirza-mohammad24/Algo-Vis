/**
 * @file ThemeContext.tsx
 *
 * @description
 * Provides global state management for the application's light/dark theme.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { flushSync } from 'react-dom';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e: React.MouseEvent) => void;
}

//Creating the Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/*This could have been done in a very simple manner this all is just added
to get that cinematic effect of theme change there is no extra architectural logic
here */

//Context Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  //On mount, check if the local storage previously saved a preference or check the OS
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to OS preference
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
    return 'light'; // Default
  });

  //Whenever theme changes, we update the HTML document class and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (e: React.MouseEvent) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    //Fallback for older browsers that don't support view transitions
    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    //1. Get exact x and y coordinate of the user's click
    const x = e.clientX;
    const y = e.clientY;

    //2. Pass them to CSS variables
    document.documentElement.style.setProperty('--click-x', `${x}px`);
    document.documentElement.style.setProperty('--click-y', `${y}px`);

    //3. Trigger the animation and update React state synchronously
    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

//Custom hook for easy consumption
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
