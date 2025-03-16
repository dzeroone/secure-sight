import { ComponentPropsWithoutRef } from "react";

interface TextInputProps extends ComponentPropsWithoutRef<"input"> {}

export default function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      className={[
        "block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
