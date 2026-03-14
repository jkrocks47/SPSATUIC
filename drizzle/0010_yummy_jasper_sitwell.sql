CREATE TABLE "event_announcement_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"member_id" uuid NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "event_announcement_logs_event_id_member_id_unique" UNIQUE("event_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "announcement_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "email_opt_out" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "unsubscribe_token" text;--> statement-breakpoint
UPDATE "members" SET "unsubscribe_token" = encode(gen_random_bytes(32), 'hex') WHERE "unsubscribe_token" IS NULL;--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "unsubscribe_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event_announcement_logs" ADD CONSTRAINT "event_announcement_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_announcement_logs" ADD CONSTRAINT "event_announcement_logs_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_unsubscribe_token_unique" UNIQUE("unsubscribe_token");
