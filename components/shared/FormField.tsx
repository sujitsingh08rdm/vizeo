"use client";
import { cn } from "cn";
import { InputHTMLAttributes, ReactNode, useId } from "react";

interface FormFieldPropsInterface extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: ReactNode;
}

const FormField = ({
  id,
  error,
  endAdornment,
  className,
  label,
  ...props
}: FormFieldPropsInterface) => {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-zinc-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "input-field",
            endAdornment && "pr-12",
            error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            className,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs font-light text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
