CREATE TABLE "values_League_status" (
	"status" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "League" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"adminUserId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "League" ADD CONSTRAINT "League_status_values_League_status_status_fk" FOREIGN KEY ("status") REFERENCES "public"."values_League_status"("status") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "League_adminUserId_idx" ON "League" USING btree ("adminUserId");