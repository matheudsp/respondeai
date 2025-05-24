import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const questions = pgTable('questions', {
  id: serial().primaryKey(),
  content: text().notNull(),
  author: text().notNull(),
  upvotes: integer().default(0).notNull(),
  answered: boolean().default(false).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
})