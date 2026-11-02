import React, { ComponentType, useState } from "react";
import FormField from "./FormField";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<ComponentType<typeof FormField>, "type" | "endAdornment">;

const PasswordField = (props: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="text-zinc-700 hover:text-zinc-900"
        >
          {visible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      }
    />
  );
};

export default PasswordField;
