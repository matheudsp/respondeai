ALTER TABLE "question_upvotes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "question_upvotes" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "questions" DROP CONSTRAINT "questions_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "author" text NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "answered" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "questions" DROP COLUMN "isAnswered";