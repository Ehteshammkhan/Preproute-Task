import { cn } from "../../utils";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  value?: string;
  options: RadioOption[];
  onChange: (value: string) => void;
}

function RadioGroup({ value, options, onChange }: RadioGroupProps) {
  return (
    <div className="flex items-center gap-10">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
        >
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border",
              value === option.value
                ? "border-blue-600"
                : "border-gray-300"
            )}
          >
            {value === option.value && (
              <span className="h-2 w-2 rounded-full bg-blue-600" />
            )}
          </span>

          <input
            type="radio"
            className="hidden"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />

          {option.label}
        </label>
      ))}
    </div>
  );
}

export default RadioGroup;