"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Editor settings interface
interface EditorSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  theme: "light" | "dark" | "sepia";
  autoSave: boolean;
  autoSaveInterval: number; // in seconds
  spellCheck: boolean;
  wordWrap: boolean;
  showLineNumbers: boolean;
}

interface EditorSettingsContextType {
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: EditorSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: "var(--font-geist-sans)",
  theme: "light",
  autoSave: true,
  autoSaveInterval: 30,
  spellCheck: true,
  wordWrap: true,
  showLineNumbers: false,
};

const STORAGE_KEY = "tagore-editor-settings";

const EditorSettingsContext = createContext<
  EditorSettingsContextType | undefined
>(undefined);

export function EditorSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load editor settings:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.error("Failed to save editor settings:", e);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <EditorSettingsContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </EditorSettingsContext.Provider>
  );
}

export function useEditorSettings() {
  const context = useContext(EditorSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useEditorSettings must be used within an EditorSettingsProvider",
    );
  }
  return context;
}

export { defaultSettings };
export type { EditorSettings, EditorSettingsContextType };
