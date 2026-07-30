import type { ComponentProps } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TagChipProps extends ComponentProps<typeof Button> {
  selected?: boolean;
}

export default function TagChip({
  selected = false,
  className,
  ...props
}: TagChipProps) {
  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      className={cn("rounded-full", className)}
      {...props}
    />
  );
}

/**
 * Same visual style as TagChip, for contexts that need link semantics
 * (e.g. `next/link`) instead of button semantics. Base UI's Button
 * should not be composed with links via `render` — see its docs.
 */
export function tagChipLinkClassName(className?: string) {
  return cn(
    buttonVariants({ variant: "outline", size: "sm" }),
    "rounded-full",
    className,
  );
}
