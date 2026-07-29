"use client";

import { Sheet } from "@/components/ui/sheet";
import { SearchProvider } from "@/hooks/useSearch";
import Header from "@/components/header/Header";

export default function AppLayout({
  sidebar,
  children,
}: Readonly<{ sidebar: React.ReactNode; children: React.ReactNode }>) {
  return (
    <SearchProvider>
      <Sheet>
        <div className="flex h-full flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            {sidebar}
            {children}
          </div>
        </div>
      </Sheet>
    </SearchProvider>
  );
}
