"use client";

import { Sheet } from "@/components/ui/sheet";
import { SearchProviderFromUrl } from "@/components/layout/SearchProviderFromUrl";
import Header from "@/components/header/Header";
import type { Technology } from "@/types/technology";

interface AppLayoutProps {
  technology: string;
  technologies: Technology[];
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function AppLayout({
  technology,
  technologies,
  sidebar,
  children,
}: Readonly<AppLayoutProps>) {
  return (
    <SearchProviderFromUrl key={technology}>
      <Sheet>
        <div className="flex h-full flex-col">
          <Header technologies={technologies} currentTechnology={technology} />
          <div className="flex flex-1 overflow-hidden">
            {sidebar}
            {children}
          </div>
        </div>
      </Sheet>
    </SearchProviderFromUrl>
  );
}
