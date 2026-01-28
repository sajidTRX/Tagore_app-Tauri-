"use client";

import { useEffect } from "react";

// Font theme storage key (must match legacy)
const FONT_THEME_KEY = "tagore-font-theme";
const FONT_SIZE_KEY = "tagore-font-size";

type FontTheme = "geist" | "inter" | "serif" | "mono";
type FontSize = "sm" | "base" | "lg" | "xl";

const fontThemeClasses: Record<FontTheme, string> = {
  geist: "font-geist",
  inter: "font-inter",
  serif: "font-serif",
  mono: "font-mono",
};

const fontSizeClasses: Record<FontSize, string> = {
  sm: "text-size-sm",
  base: "text-size-base",
  lg: "text-size-lg",
  xl: "text-size-xl",
};

export function FontThemeInitializer() {
  useEffect(() => {
    // Load and apply font theme
    const savedTheme = localStorage.getItem(FONT_THEME_KEY) as FontTheme | null;
    const savedSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;

    const theme =
      savedTheme && fontThemeClasses[savedTheme] ? savedTheme : "geist";
    const size = savedSize && fontSizeClasses[savedSize] ? savedSize : "base";

    // Remove all font theme classes first
    Object.values(fontThemeClasses).forEach((cls) => {
      document.documentElement.classList.remove(cls);
    });

    // Remove all font size classes first
    Object.values(fontSizeClasses).forEach((cls) => {
      document.documentElement.classList.remove(cls);
    });

    // Apply the saved or default classes
    document.documentElement.classList.add(fontThemeClasses[theme]);
    document.documentElement.classList.add(fontSizeClasses[size]);

    // Persist defaults if not set
    if (!savedTheme) {
      localStorage.setItem(FONT_THEME_KEY, theme);
    }
    if (!savedSize) {
      localStorage.setItem(FONT_SIZE_KEY, size);
    }
  }, []);

  return null;
}

// Helper functions for components to use
export function setFontTheme(theme: FontTheme) {
  // Remove all font theme classes
  Object.values(fontThemeClasses).forEach((cls) => {
    document.documentElement.classList.remove(cls);
  });

  // Add new theme class
  document.documentElement.classList.add(fontThemeClasses[theme]);

  // Persist
  localStorage.setItem(FONT_THEME_KEY, theme);
}

export function setFontSize(size: FontSize) {
  // Remove all font size classes
  Object.values(fontSizeClasses).forEach((cls) => {
    document.documentElement.classList.remove(cls);
  });

  // Add new size class
  document.documentElement.classList.add(fontSizeClasses[size]);

  // Persist
  localStorage.setItem(FONT_SIZE_KEY, size);
}

export function getFontTheme(): FontTheme {
  const saved = localStorage.getItem(FONT_THEME_KEY) as FontTheme | null;
  return saved && fontThemeClasses[saved] ? saved : "geist";
}

export function getFontSize(): FontSize {
  const saved = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
  return saved && fontSizeClasses[saved] ? saved : "base";
}

export { fontThemeClasses, fontSizeClasses };
export type { FontTheme, FontSize };
