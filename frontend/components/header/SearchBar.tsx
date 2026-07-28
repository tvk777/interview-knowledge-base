"use client";

import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search questions..."
        disabled
        className="pl-8"
      />
    </div>
  );
}
