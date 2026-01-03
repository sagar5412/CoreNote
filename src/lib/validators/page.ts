import z from "zod";

export const createPageSchema = z.object({
  title: z.string().min(1).max(255).optional().default("Untitled"),
  icon: z.string().optional(),
  coverImage: z.url().optional(),
  content: z.json().optional(),
  parentId: z.string().nullable().optional(),
});

export const updatePageSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.json().nullable().optional(),
  icon: z.string().nullable().optional(),
  coverImage: z.url().nullable().optional(),
});

export const deletePageSchema = z.object({
  pageId: z.string(),
});

export const movePageSchema = z.object({
  newParentId: z.string().nullable(),
  newPosition: z.number().int().min(0),
});

export const publishPageSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug"),
  isPublished: z.boolean(),
});

export type CreatePageSchema = z.infer<typeof createPageSchema>;
export type UpdatePageSchema = z.infer<typeof updatePageSchema>;
export type DeletePageSchema = z.infer<typeof deletePageSchema>;
export type MovePageSchema = z.infer<typeof movePageSchema>;
export type PublishPageSchema = z.infer<typeof publishPageSchema>;
