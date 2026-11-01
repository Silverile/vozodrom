CREATE TABLE "car_follow" (
	"user_id" text NOT NULL,
	"car_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "car_follow_user_id_car_id_pk" PRIMARY KEY("user_id","car_id")
);
--> statement-breakpoint
CREATE TABLE "car_like" (
	"user_id" text NOT NULL,
	"car_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "car_like_user_id_car_id_pk" PRIMARY KEY("user_id","car_id")
);
--> statement-breakpoint
CREATE TABLE "catalog_edit" (
	"id" text PRIMARY KEY NOT NULL,
	"make_slug" text NOT NULL,
	"line_slug" text NOT NULL,
	"gen_index" integer,
	"field" text NOT NULL,
	"value" text NOT NULL,
	"author_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_report" (
	"id" text PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"target_id" text NOT NULL,
	"user_id" text NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"decided_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"decided_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "entry_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"entry_id" text NOT NULL,
	"user_id" text NOT NULL,
	"body" text NOT NULL,
	"hidden_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entry_like" (
	"user_id" text NOT NULL,
	"entry_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entry_like_user_id_entry_id_pk" PRIMARY KEY("user_id","entry_id")
);
--> statement-breakpoint
CREATE TABLE "garage_car" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"make_slug" text NOT NULL,
	"line_slug" text NOT NULL,
	"data" jsonb NOT NULL,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"former" boolean DEFAULT false NOT NULL,
	"hidden_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "log_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"car_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"category" text NOT NULL,
	"cost_czk" integer,
	"mileage_km" integer,
	"happened_on" text NOT NULL,
	"photos" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"hidden_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "car_follow" ADD CONSTRAINT "car_follow_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_follow" ADD CONSTRAINT "car_follow_car_id_garage_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."garage_car"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_like" ADD CONSTRAINT "car_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "car_like" ADD CONSTRAINT "car_like_car_id_garage_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."garage_car"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "catalog_edit" ADD CONSTRAINT "catalog_edit_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_report" ADD CONSTRAINT "community_report_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_report" ADD CONSTRAINT "community_report_decided_by_user_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_comment" ADD CONSTRAINT "entry_comment_entry_id_log_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."log_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_comment" ADD CONSTRAINT "entry_comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_like" ADD CONSTRAINT "entry_like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entry_like" ADD CONSTRAINT "entry_like_entry_id_log_entry_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."log_entry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "garage_car" ADD CONSTRAINT "garage_car_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_entry" ADD CONSTRAINT "log_entry_car_id_garage_car_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."garage_car"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_entry" ADD CONSTRAINT "log_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "car_follow_car_idx" ON "car_follow" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX "car_like_car_idx" ON "car_like" USING btree ("car_id");--> statement-breakpoint
CREATE INDEX "catalog_edit_line_idx" ON "catalog_edit" USING btree ("make_slug","line_slug","created_at");--> statement-breakpoint
CREATE INDEX "community_report_status_idx" ON "community_report" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "community_report_target_idx" ON "community_report" USING btree ("kind","target_id");--> statement-breakpoint
CREATE INDEX "entry_comment_entry_idx" ON "entry_comment" USING btree ("entry_id","created_at");--> statement-breakpoint
CREATE INDEX "entry_like_entry_idx" ON "entry_like" USING btree ("entry_id");--> statement-breakpoint
CREATE INDEX "garage_car_user_idx" ON "garage_car" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "garage_car_line_idx" ON "garage_car" USING btree ("make_slug","line_slug");--> statement-breakpoint
CREATE INDEX "log_entry_car_idx" ON "log_entry" USING btree ("car_id","happened_on");--> statement-breakpoint
CREATE INDEX "log_entry_created_idx" ON "log_entry" USING btree ("created_at");