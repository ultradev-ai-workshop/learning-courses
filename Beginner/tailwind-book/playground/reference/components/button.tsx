import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Complete class names in lookup objects, so Tailwind finds them all when it scans this file.
const variants = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary: "bg-surface text-ink ring-1 ring-line hover:bg-surface-muted",
  ghost: "text-muted hover:bg-surface-muted hover:text-ink",
};
const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
};

type Props = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
