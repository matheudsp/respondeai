CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"author" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"answered" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
