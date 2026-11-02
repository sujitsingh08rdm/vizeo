import { HTMLAttributes, ReactNode } from "react";
import Divider from "./Divider";
import { cn } from "cn";

interface CardPropsInterface extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  divider?: boolean;
  children: ReactNode;
}

const Card = ({
  title,
  divider = false,
  children,
  className,
  ...props
}: CardPropsInterface) => {
  return (
    <div
      className={cn(
        "bg-white py-6 px-4 shadow-lg rounded-lg border border-gray-200 space-y-2",
        className,
      )}
      {...props}
    >
      {title && <h2 className="text-lg font-semibold capitalize">{title}</h2>}
      {divider && <Divider />}
      {children && <>{children}</>}
    </div>
  );
};

export default Card;
