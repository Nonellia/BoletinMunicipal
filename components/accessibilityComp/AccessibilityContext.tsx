"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTheme } from "next-themes";
import { AccessibilitySettings } from "@/types/interfaces";

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  applyTheme: (theme: "light" | "dark" | "sepia" | "high-contrast") => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  backgroundColor: "#ffffff",
  textColor: "#000000",
  lineHeight: 1.6,
  letterSpacing: 0,
  fontFamily: "Arial, sans-serif",
  highContrast: false,
  dyslexiaFont: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const { setTheme } = useTheme();

  // Persist settings (optional, can be added later with localStorage)

  // Sync with next-themes if needed, or override
  // When settings change, apply to document root or body
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--font-size-base", `${settings.fontSize}px`);
    root.style.setProperty("--line-height-base", settings.lineHeight.toString());
    root.style.setProperty("--letter-spacing-base", `${settings.letterSpacing}px`);
    
    if (settings.dyslexiaFont) {
        root.classList.add('font-dyslexic');
        root.style.setProperty("--font-primary", "OpenDyslexic, sans-serif");
    } else {
        root.classList.remove('font-dyslexic');
        root.style.removeProperty("--font-primary");
    }

    // Colors - override theme if high contrast or sepia
    if (settings.highContrast) {
        root.classList.add('high-contrast');
        root.style.setProperty("--background", "#000000");
        root.style.setProperty("--foreground", "#ffff00");
    } else if (settings.backgroundColor !== "#ffffff" && settings.backgroundColor !== "#1f1f1f") {
         // Custom bg (e.g. sepia)
         root.classList.add('custom-theme');
         root.style.setProperty("--background", settings.backgroundColor);
         root.style.setProperty("--foreground", settings.textColor);
    } else {
        root.classList.remove('high-contrast');
        root.classList.remove('custom-theme');
        root.style.removeProperty("--background");
        root.style.removeProperty("--foreground");
    }

  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setTheme("system");
  };

  const applyTheme = (themeMode: "light" | "dark" | "sepia" | "high-contrast") => {
    switch (themeMode) {
      case "dark":
        setTheme("dark");
        setSettings(prev => ({ ...prev, backgroundColor: "#1f1f1f", textColor: "#ffffff", highContrast: false }));
        break;
      case "light":
        setTheme("light");
        setSettings(prev => ({ ...prev, backgroundColor: "#ffffff", textColor: "#000000", highContrast: false }));
        break;
      case "sepia":
        setTheme("light"); // Base light
        setSettings(prev => ({ ...prev, backgroundColor: "#f4ecd8", textColor: "#5b4636", highContrast: false }));
        break;
      case "high-contrast":
        setTheme("dark"); // Base dark
        setSettings(prev => ({ ...prev, backgroundColor: "#000000", textColor: "#ffff00", highContrast: true }));
        break;
    }
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings, applyTheme }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};
