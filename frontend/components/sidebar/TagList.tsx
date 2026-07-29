"use client";

import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import type { Tag } from "@/types/tag";

interface TagListProps {
  tags: Tag[];
}

export default function TagList({ tags }: TagListProps) {
  const { selectedTag, selectTag } = useSearch();
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-wrap gap-1.5">
      {sortedTags.map((tag) => {
        const isSelected = selectedTag === tag.name;
        return (
          <Button
            key={tag.name}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            onClick={() => selectTag(tag.name)}
          >
            {tag.name}
          </Button>
        );
      })}
    </div>
  );
}
