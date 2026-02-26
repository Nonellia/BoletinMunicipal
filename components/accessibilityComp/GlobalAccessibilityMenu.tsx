"use client";

import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Button, Tooltip } from "@heroui/react";
import { Accessibility } from "lucide-react";
import { useAccessibility } from "./AccessibilityContext";
import { AccessibilityToolbar } from "./textComp/AccessibilityToolbar";

export const GlobalAccessibilityMenu: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useAccessibility();

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      <Popover placement="top-end" offset={20}>
        <PopoverTrigger>
          <Button
            isIconOnly
            className="w-14 h-14 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg hover:scale-105 transition-transform"
            aria-label="Opciones de accesibilidad"
          >
            <Accessibility size={28} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl">
          <div className="w-[320px]">
            <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Accessibility size={20} className="text-blue-600" />
              Accesibilidad
            </h3>
            <AccessibilityToolbar
              settings={settings}
              onUpdateSetting={updateSetting}
              onReset={resetSettings}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
