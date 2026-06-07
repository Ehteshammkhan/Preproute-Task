import {
  InputHTMLAttributes,
} from "react";

import { cn } from "../../utils";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;

  error?: string;
}

function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">

      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <input
        className={cn(
          `
          w-full
          rounded-lg
          border
          border-gray-300
          px-4
          py-3
          outline-none
          focus:border-blue-500
          `,
          error &&
            "border-red-500",
          className
        )}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}

export default Input;