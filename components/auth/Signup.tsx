"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import { FieldErrors, parseForm } from "@/lib/validations/parseForm";
import AuthLayout from "./AuthLayout";
import Link from "next/link";
import FormField from "../shared/FormField";
import PasswordField from "../shared/PasswordField";
import Button from "../shared/Button";
import { signupSchema } from "@/lib/validations/auth";
import httpRequest from "@/lib/http-request/axios-http-request";

import { useRouter } from "next/navigation";

export default function Signup() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [serverError, setServerError] = useState("");

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
      name: "mobile",
      label: "Mobile",
      type: "tel",
      placeholder: "9999999999",
      autoComplete: "tel",
      inputMode: "numeric",
    },
  ] as const;

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      setServerError("");
      const formData = new FormData(e.currentTarget);

      const { data, errors } = parseForm(signupSchema, formData);
      if (errors) return setErrors(errors);

      setErrors({});
      await httpRequest.post("/auth/signup", data);

      setLoading(false);
      router.replace("/auth/login");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  const clearError = (e: SyntheticEvent<HTMLFormElement>) => {
    const { name } = e.target as HTMLInputElement;
    setServerError("");
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <AuthLayout
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
        {serverError && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-red-200
    bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
          >
            {serverError}
          </div>
        )}
        <Button disabled={loading} type="submit">
          {loading ? "Registering Account" : "Create account"}
        </Button>
      </form>
    </AuthLayout>
  );
}
