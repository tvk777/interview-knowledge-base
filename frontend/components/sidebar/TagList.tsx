"use client";

import { Badge } from "@/components/ui/badge";

const PLACEHOLDER_TAGS = [
  "useState",
  "useEffect",
  "Closures",
  "Event Loop",
  "Generics",
  "Server Components",
];

export default function TagList() {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PLACEHOLDER_TAGS.map((tag) => (
        <Badge key={tag} variant="outline">
          {tag}
        </Badge>
      ))}
    </div>
  );
}
