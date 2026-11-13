import z from "zod";

export const videoSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Descriptions is required"),
});

export type videoType = z.infer<typeof videoSchema>;
