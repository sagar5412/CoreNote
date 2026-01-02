import z from "zod";

export const createPageSchema = z.object({
  title: z.string().min(1).max(255).optional().default("Untitled"),
  icon: z.string().optional(),
  coverImage: z.url().optional(),
  content: z.json().optional(),
  parentId: z.string().optional(),
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
