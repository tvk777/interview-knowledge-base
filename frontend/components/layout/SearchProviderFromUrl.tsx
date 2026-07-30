"use client";

import { useSearchParams } from "next/navigation";

import { SearchProvider } from "@/hooks/useSearch";

export function SearchProviderFromUrl({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchParams = useSearchParams();

  return (
    <SearchProvider initialSelectedTag={searchParams.get("tag")}>
      {children}
    </SearchProvider>
  );
}
