import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "coral" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-primary-600 text-white shadow-soft hover:bg-primary-700 hover:shadow-medium disabled:bg-primary-600/60",
  secondary:
    "bg-secondary-600 text-white shadow-soft hover:bg-secondary-700 disabled:opacity-60",
  coral:
    "bg-brand-coral text-white shadow-soft hover:bg-brand-coral-dark hover:shadow-medium disabled:opacity-60",
  outline:
    "border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-60",
  ghost: "bg-transparent text-primary-700 hover:bg-primary-50 disabled:opacity-60",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-5 py-3.5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
