"use client";

import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import TagList from "@/components/sidebar/TagList";

export default function Sidebar() {
  return (
    <>
      <aside className="hidden w-64 shrink-0 overflow-y-auto border-r p-4 md:block">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Tags
        </h2>
        <TagList />
      </aside>

      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Tags</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <TagList />
        </div>
      </SheetContent>
    </>
  );
}
