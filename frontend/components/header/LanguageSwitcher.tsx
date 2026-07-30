"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/types/common";

const LANGUAGES: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "uk", label: "UA" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((entry) => (
        <Button
          key={entry.value}
          variant={language === entry.value ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setLanguage(entry.value)}
        >
          {entry.label}
        </Button>
      ))}
    </div>
  );
}
