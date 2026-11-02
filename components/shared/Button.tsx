import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition",
        "hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
