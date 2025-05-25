import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";

interface ButtonProps extends ComponentProps<"button"> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...otherProps }, ref) => {
    return (
      <button
        className={cn(
          "flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
          className
        )}
        {...otherProps}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Button;
