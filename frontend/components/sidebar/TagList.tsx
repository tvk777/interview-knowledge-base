"use client";

import TagChip from "@/components/common/TagChip";
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
      {sortedTags.map((tag) => (
        <TagChip
          key={tag.name}
          selected={selectedTag === tag.name}
          onClick={() => selectTag(tag.name)}
        >
          {tag.name}
        </TagChip>
      ))}
    </div>
  );
}
