import { z } from "zod";

export type FieldErrors = Record<string, string | undefined>;

export function parseForm<S extends z.ZodType>(schema: S, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData));

  if (result.success) {
    return { data: result.data, errors: null };
  }

  const fieldErrors = z.flattenError(result.error).fieldErrors as FieldErrors;
  console.log(fieldErrors);

  const errors: FieldErrors = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    errors[key] = messages?.[0];
  }
  return { data: null, errors };
}
