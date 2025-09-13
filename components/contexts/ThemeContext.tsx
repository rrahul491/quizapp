'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHydration } from '../../hooks/useHydration';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const isHydrated = useHydration();

  useEffect(() => {
    // Check for saved theme preference after hydration
    if (isHydrated && typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('quiz-theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setTheme(savedTheme);
      }
    }
  }, [isHydrated]);

  useEffect(() => {
    // Only update DOM and localStorage after hydration
    if (isHydrated && typeof window !== 'undefined') {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        document.documentElement.className = theme;
        localStorage.setItem('quiz-theme', theme);
      });
    }
  }, [theme, isHydrated]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
