import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = /*#__PURE__*/(0, createContext)(null);
const THEME_KEY = 'lms_theme';
function ThemeProvider({
  children
}) {
  const [theme, setTheme] = (0, useState)(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // ignore storage errors
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });
  (0, useEffect)(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore storage errors
    }
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement(ThemeContext.Provider, {
    value: {
      theme,
      isDark,
      toggleTheme,
      setTheme
    }
  }, children);
}
function useTheme() {
  const context = (0, useContext)(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeProvider, useTheme };
