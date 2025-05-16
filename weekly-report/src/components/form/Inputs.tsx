import { ComponentProps } from "react";
import { cn } from "../../utils/helpers";
import Label from "./Label";

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

export function SelectInput({
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

interface SwitchInputProps extends ComponentProps<'input'> {}

export function SwitchInput({ id, ...props}: SwitchInputProps) {
  return (
    <Label className="relative mb-0 inline-flex cursor-pointer items-center align-text-bottom">
      <input id={id} type="checkbox" className="peer sr-only" {...props} />
      <Label htmlFor={id} className="hidden" />
      <div className="peer h-5 w-9 rounded-full border bg-slate-200 after:absolute after:left-[2px] after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-green-300"></div>
    </Label>
  )
}
