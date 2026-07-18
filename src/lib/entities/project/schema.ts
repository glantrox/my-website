import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().optional(),
  date: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  techStack: z.string().optional(),
  links: z.object({
    live: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal(''))
  })
});
