import { fastifyCors } from "@fastify/cors";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastify } from "fastify";
import { z } from "zod";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";
import { eq, sql } from "drizzle-orm";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: '*',
})

// Create new question
app.post('/questions', {
  schema: {
    body: z.object({
      content: z.string().min(1),
      author: z.string().min(1),
    }),
  },
}, async (request, reply) => {
  const { content, author } = request.body

  await db.insert(schema.questions).values({
    content,
    author,
  })

  return reply.status(201).send()
})

// Upvote question
app.patch('/questions/:id/upvote', {
  schema: {
    params: z.object({
      id: z.coerce.number().int(),
    }),
  },
}, async (request, reply) => {
  const { id } = request.params

  await db.update(schema.questions)
    .set({ 
      upvotes: sql`${schema.questions.upvotes} + 1`
    })
    .where(eq(schema.questions.id, id))

  return reply.status(200).send()
})

// Mark question as answered
app.patch('/questions/:id/answer', {
  schema: {
    params: z.object({
      id: z.coerce.number().int(),
    }),
  },
}, async (request, reply) => {
  const { id } = request.params

  await db.update(schema.questions)
    .set({ answered: true })
    .where(eq(schema.questions.id, id))

  return reply.status(200).send()
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})