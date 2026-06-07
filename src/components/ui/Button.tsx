import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  loading?: boolean;
}

function Button({
  children,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={cn(
        `
        inline-flex
        items-center
        justify-center
        rounded-lg
        bg-blue-600
        px-4
        py-3
        text-white
        font-medium
        transition
        hover:bg-blue-700
        disabled:opacity-60
        disabled:cursor-not-allowed
        `,
        className,
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
