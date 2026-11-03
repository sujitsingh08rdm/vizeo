"use client";

import { ChangeEvent, SyntheticEvent, useState } from "react";
import AuthCard from "./AuthCard";
import Link from "next/link";
import FormField from "../shared/FormField";
import { FieldErrors, parseForm } from "@/lib/validations/parseForm";
import Button from "../shared/Button";
import PasswordField from "../shared/PasswordField";
import { loginSchema } from "@/lib/validations/auth";
import httpRequest from "@/lib/http-request/axios-http-request";
import { useRouter } from "next/navigation";

const FIELDS = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
  },
] as const;

const Login = () => {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      setServerError("");
      const formData = new FormData(e.currentTarget);
      const { data, errors } = parseForm(loginSchema, formData);

      if (errors) {
        return setErrors(errors);
      }

      setErrors({});

      await httpRequest.post("/auth/login", data);

      setLoading(false);
      router.replace("/app");
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
          {loading ? "Logging In..." : "Login"}
        </Button>
      </form>
    </AuthCard>
  );
};

export default Login;
