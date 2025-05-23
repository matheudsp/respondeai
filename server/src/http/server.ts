import { fastifyCors } from "@fastify/cors";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { fastify } from "fastify";
import { z } from "zod";
import { db } from "../db/client.ts";
import { schema } from "../db/schema/index.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: '*',
})

app.post('/issues', {
  schema: {
    body: z.object({
      title: z.string(),
      userId: z.coerce.number().int(),
    }),
  },
}, async (request, reply) => {
  const { title, userId } = request.body

  await db.insert(schema.issues).values({
    title,
    userId,
  })

  return reply.status(201).send()
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})