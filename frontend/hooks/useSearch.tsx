"use client";

import { createContext, useContext, useState } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  selectedTag: string | null;
  selectTag: (tag: string) => void;
}

interface SearchProviderProps {
  children: React.ReactNode;
  initialSelectedTag?: string | null;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({
  children,
  initialSelectedTag = null,
}: Readonly<SearchProviderProps>) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(
    initialSelectedTag,
  );

  function selectTag(tag: string) {
    setSelectedTag((current) => (current === tag ? null : tag));
  }

  return (
    <SearchContext.Provider
      value={{ query, setQuery, selectedTag, selectTag }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
