ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "announcements" DROP CONSTRAINT "announcements_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "events" DROP CONSTRAINT "events_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "gallery_images" DROP CONSTRAINT "gallery_images_uploaded_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "page_content" DROP CONSTRAINT "page_content_updated_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "members" ADD COLUMN "admin_role" "role";--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_members_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_uploaded_by_members_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_updated_by_members_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;