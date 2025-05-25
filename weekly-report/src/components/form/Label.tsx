import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface LabelProps extends ComponentProps<"label"> {}

export default function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn("block text-sm font-medium text-gray-700 mb-2", className)}
      {...props}
    >
      {children}
    </label>
  );
}
