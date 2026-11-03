CREATE TABLE "article" (
	"slug" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"perex" text NOT NULL,
	"body" text NOT NULL,
	"icon" text NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"published_on" text NOT NULL,
	"deleted" boolean DEFAULT false NOT NULL,
	"author_id" text,
	"updated_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_published_idx" ON "article" USING btree ("deleted","published_on");