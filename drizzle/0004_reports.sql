CREATE TABLE "report" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"category" text NOT NULL,
	"explanation" text NOT NULL,
	"notifier_name" text NOT NULL,
	"notifier_email" text NOT NULL,
	"user_id" text,
	"status" text DEFAULT 'open' NOT NULL,
	"decision" text,
	"decided_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_listing_id_listing_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listing"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_decided_by_user_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "report_listing_idx" ON "report" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "report_status_idx" ON "report" USING btree ("status","created_at");