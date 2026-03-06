ALTER TABLE "boards" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "ip_address" text;--> statement-breakpoint
ALTER TABLE "suggestions" ADD COLUMN "ip_address" text;