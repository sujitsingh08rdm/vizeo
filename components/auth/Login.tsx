"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import AuthCard from "./AuthCard";
import Link from "next/link";
import FormField from "../shared/FormField";
import { FieldErrors, parseForm } from "@/lib/validations/parseForm";
import Button from "../shared/Button";
import PasswordField from "../shared/PasswordField";
import { loginSchema } from "@/lib/validations/auth";

const FIELDS = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "9999999999",
    autoComplete: "tel",
    inputMode: "numeric",
  },
] as const;

const Login = () => {
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const { data, errors } = parseForm(loginSchema, formData);

    if (errors) {
      return setErrors(errors);
    }

    setErrors({});
    console.log(data);
  };

  const clearError = (e: SyntheticEvent<HTMLFormElement>) => {
    const { name } = e.target as HTMLInputElement;
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <AuthCard
      title="Login"
      subtitle="Welcome, Login to upload & manage your videos effortlessly."
      footer={
        <>
          Already have an Account?{" "}
          <Link
            href="/auth/signup"
            className="font-bold text-indigo-600 hover:underline"
          >
            Signup
          </Link>
        </>
      }
    >
      <form
        onSubmit={handleSubmit}
        onChange={clearError}
        noValidate
        className="space-y-4"
      >
        {FIELDS.map((field) => (
          <FormField {...field} key={field.name} error={errors[field.name]} />
        ))}
        <PasswordField
          name="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
        />
        <Button type="submit">Login</Button>
      </form>
    </AuthCard>
  );
};

export default Login;
