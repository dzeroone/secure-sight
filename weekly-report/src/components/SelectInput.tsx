import { ComponentPropsWithoutRef } from "react";

interface SelectInputProps extends ComponentPropsWithoutRef<"select"> {}

export default function SelectInput({
  className,
  children,
  ...props
}: SelectInputProps) {
  return (
    <select
      className={[
        "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </select>
  );
}
