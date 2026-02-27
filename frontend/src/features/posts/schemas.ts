import { z } from 'zod';

const postStatusSchema = z.enum(['draft', 'published', 'archived']);

export const postFormSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  body: z.string().min(1, '本文を入力してください'),
  excerpt: z.string().nullable().optional(),
  status: postStatusSchema.default('draft'),
  thumbnail_url: z.string().optional().transform((v) => (v === '' ? undefined : v)),
  category_ids: z.array(z.number()).default([]),
  tag_ids: z.array(z.number()).default([]),
});

export type PostFormData = z.infer<typeof postFormSchema>;
