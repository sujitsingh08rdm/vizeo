"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import { FieldErrors, parseForm } from "@/lib/validations/parseForm";
import AuthCard from "./AuthCard";
import Link from "next/link";
import FormField from "../shared/FormField";
import PasswordField from "../shared/PasswordField";
import Button from "../shared/Button";
import { signupSchema } from "@/lib/validations/auth";

export default function Signup() {
  const [errors, setErrors] = useState<FieldErrors>({});

  const FIELDS = [
    {
      name: "fullname",
      label: "Full name",
      type: "text",
      placeholder: "John Doe",
      autoComplete: "name",
    },
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

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const { data, errors } = parseForm(signupSchema, formData);
    if (errors) return setErrors(errors);

    setErrors({});
    console.log(data); // call your API / server action here
  };

  const clearError = (e: SyntheticEvent<HTMLFormElement>) => {
    const { name } = e.target as HTMLInputElement;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <AuthCard
      title="Sign Up"
      subtitle="Signup to get started with your journey with Us."
      footer={
        <>
          Dont have an account?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-indigo-600 hover:underline"
          >
            Login
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
          <FormField key={field.name} {...field} error={errors[field.name]} />
        ))}
        <PasswordField
          name="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
        />

        <Button type="submit">Create account</Button>
      </form>
    </AuthCard>
  );
}
