import {
  ReactNode,
} from "react";

import { cn } from "../../utils";

interface CardProps {
  children: ReactNode;

  className?: string;
}

function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        `
        rounded-xl
        bg-white
        p-6
        shadow-sm
        `,
        className
      )}
    >
      {children}
    </div>
  );
}

export default Card;