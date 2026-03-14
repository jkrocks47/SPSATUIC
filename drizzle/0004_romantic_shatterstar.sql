CREATE TYPE "public"."image_variant" AS ENUM('full', 'thumbnail');--> statement-breakpoint
CREATE TABLE "images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"data" "bytea" NOT NULL,
	"mime_type" text DEFAULT 'image/webp' NOT NULL,
	"variant" "image_variant" NOT NULL,
	"group_id" uuid NOT NULL,
	"width" integer,
	"height" integer,
	"size_bytes" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "page_content" ALTER COLUMN "club_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD COLUMN "thumbnail_url" text;--> statement-breakpoint
CREATE INDEX "idx_images_group_id" ON "images" USING btree ("group_id");--> statement-breakpoint
ALTER TABLE "page_content" ADD CONSTRAINT "page_content_slug_club_type_section_unique" UNIQUE("slug","club_type","section");