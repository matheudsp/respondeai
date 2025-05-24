// web/src/db/collections/questions.ts
import { createElectricCollection } from '@tanstack/db-collections'
import { z } from 'zod/v4-mini'

export const questionSchema = z.object({
  id: z.int(),
  content: z.string(),
  author: z.string(),
  upvotes: z.int(),
  answered: z.boolean(),
  createdAt: z.string(),
})

export type Question = z.infer<typeof questionSchema>

export const questions = createElectricCollection({
  id: 'questions',
  streamOptions: {
    url: 'http://localhost:3000/v1/shape',
    params: {
      table: 'questions',
    },
  },
  primaryKey: ['id'],
  schema: questionSchema,
})