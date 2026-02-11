import { useState, useEffect } from 'react';

const STORAGE_KEY = 'jobportal-theme';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }, [dark]);

  const toggle = () => setDark(prev => !prev);

  return { dark, toggle };
}
