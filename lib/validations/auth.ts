import { z } from "zod";

export const signupSchema = z.object({
  fullname: z.string().trim().min(2, "Enter Your Full name"),
  email: z.email("Enter a valid Email"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  password: z
    .string()
    .min(8, "Atleast 8 Characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/\d/, "Include a number"),
});

export type signupValues = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number"),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "Include an uppercase letter")
    .regex(/\d/, "Include a number"),
});

export type LoginValues = z.infer<typeof loginSchema>;
