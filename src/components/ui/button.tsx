import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "gold" | "dark" | "outline" | "ghost" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "gold", type = "button", ...props }: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    gold: "bg-primary text-primary-foreground hover:bg-primary/90",
    dark: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
    icon: "bg-transparent text-foreground hover:bg-secondary",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        variant === "icon" && "size-11 p-0",
        className,
      )}
      {...props}
    />
  );
}
