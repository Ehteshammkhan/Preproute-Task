import { cn } from "../../utils";

interface TabItem {
  label: string;
  value: string;
}

interface TabsProps {
  value: string;
  items: TabItem[];
  onChange: (value: string) => void;
}

function Tabs({ value, items, onChange }: TabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-md px-5 py-2 text-sm transition",
            value === item.value
              ? "bg-blue-50 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;