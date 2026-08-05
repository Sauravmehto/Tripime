import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const fieldClass =
  "h-11 sm:h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-soft outline-none transition placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:bg-neutral-100";

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
  dense?: boolean;
}

export function Field({ label, children, className = "", dense = false }: FieldProps) {
  return (
    <label className={`block ${dense ? "text-xs" : "text-sm"} ${className}`}>
      <span
        className={`block font-medium text-neutral-700 ${dense ? "mb-1 text-xs" : "mb-1.5"}`}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${fieldClass} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldClass} ${className}`} {...props} />;
}
