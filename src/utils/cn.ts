import clsx from "clsx";

export const cn = (
  ...classes: Parameters<typeof clsx>
) => {
  return clsx(...classes);
};

// className={cn(
//  active && "bg-blue-500",
//  "p-3"
// )}