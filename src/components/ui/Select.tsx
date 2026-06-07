import { SelectHTMLAttributes } from "react";

import { cn } from "../../utils";

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <select
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
          error && "border-red-500",
          className,
        )}
        {...props}
      >
        <option value="">Select Option</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Select;
