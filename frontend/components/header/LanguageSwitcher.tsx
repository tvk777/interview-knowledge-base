"use client";

import { Button } from "@/components/ui/button";

const LANGUAGES = ["EN", "UA"];

export default function LanguageSwitcher() {
  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map((language, index) => (
        <Button
          key={language}
          variant={index === 0 ? "secondary" : "ghost"}
          size="sm"
        >
          {language}
        </Button>
      ))}
    </div>
  );
}
