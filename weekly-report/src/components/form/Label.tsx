import { ComponentProps } from "react";
import { cn } from "../../utils/helpers";

interface LabelProps extends ComponentProps<'label'>{}

export default function Label({children, className, ...props}: LabelProps) {
  return (
    <label className={cn("block text-sm font-medium text-gray-700 mb-2", className)} {...props}>{children}</label>
  )
}