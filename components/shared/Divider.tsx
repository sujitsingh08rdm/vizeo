import { cn } from "cn";

interface DividerProps {
  className?: string;
}

const Divider = ({ className }: DividerProps) => {
  return <div className={cn("border-b text-gray-400 py-2", className)} />;
};

export default Divider;
