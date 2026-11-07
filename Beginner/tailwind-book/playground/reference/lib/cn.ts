// Joins class names, skipping false/undefined: cn("p-2", isActive && "bg-brand-50").
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
