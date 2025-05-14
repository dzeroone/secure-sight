import { ComponentProps } from "react";
import { cn } from "../../utils/helpers";

interface TextInputProps extends ComponentProps<"input"> {}

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        className
      )}
      type="text"
      {...props}
    />
  );
}

interface TextAreaInputProps extends ComponentProps<"textarea"> {}

export function TextAreaInput({
  className,
  value,
  ...props
}: TextAreaInputProps) {
  return (
    <textarea
      className={cn(
        "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        className
      )}
      value={value}
      {...props}
    />
  );
}

interface SelectInputProps extends ComponentProps<"select"> {}

export default function SelectInput({
  className,
  children,
  ...props
}: SelectInputProps) {
  return (
    <select
      className={cn(
        "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
