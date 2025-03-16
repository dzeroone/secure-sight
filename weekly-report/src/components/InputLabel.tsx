import { ComponentPropsWithoutRef } from "react";

interface InputLabelProps extends ComponentPropsWithoutRef<"label"> {}

export default function InputLabel({
  className,
  children,
  ...props
}: InputLabelProps) {
  return (
    <label className={["", className].join(" ")} {...props}>
      {children}
    </label>
  );
}
