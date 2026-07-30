"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Header from "@/components/header/Header";
import TechnologyTabs from "@/components/header/TechnologyTabs";
import type { Technology } from "@/types/technology";

interface LandingHeaderProps {
  technologies: Technology[];
}

export default function LandingHeader({ technologies }: LandingHeaderProps) {
  return (
    <Sheet>
      <Header
        technologies={technologies}
        currentTechnology={null}
        showSearch={false}
      />

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <TechnologyTabs technologies={technologies} currentTechnology={null} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
