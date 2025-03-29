import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithoutRef } from "react";
import { MdTaskAlt } from "react-icons/md";

const alert = cva("flex gap-2 border-l-4 px-4 py-3", {
  variants: {
    variant: {
      primary: "bg-teal-100 border-teal-500 rounded-b text-teal-900",
      success: "bg-green-100 border-green-500 rounded-b text-green-900",
      error: "bg-red-100 border-red-500 rounded-b text-red-900",
    },
    elevated: {
      false: null,
      true: "shadow-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface AlertProps
  extends ComponentPropsWithoutRef<"div">,
    VariantProps<typeof alert> {}

export default function Alert({
  variant,
  elevated,
  className,
  children,
}: AlertProps) {
  return (
    <div className={alert({ variant, elevated, className })}>
      {variant === "success" ? <MdTaskAlt className="text-xl" /> : null}
      {children}
    </div>
  );
}
