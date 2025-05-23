import { reset, seed } from "drizzle-seed";
import { db } from "./client.ts";
import { schema } from "./schema/index.ts";

await reset(db, { schema })

console.log('Database reset!')

const oneDayAgo = new Date();

oneDayAgo.setDate(oneDayAgo.getDate() - 1);

await seed(db, schema).refine(f => {
  return {
    issues: {
      count: 10_000,
      columns: {
        title: f.loremIpsum({ sentencesCount: 1 }),
        description: f.loremIpsum({ sentencesCount: 6 }),
        createdAt: f.valuesFromArray({
          values: [
            oneDayAgo as any,
          ],
        })
      },
    },

    users: {
      count: 5,
      columns: {
        name: f.fullName(),
      },
    },
  }
})

console.log('Database seeded!')