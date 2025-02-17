CREATE TABLE "Team" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"leagueId" uuid NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
DROP TABLE "LeagueMember" CASCADE;--> statement-breakpoint
ALTER TABLE "Team" ADD CONSTRAINT "Team_leagueId_League_id_fk" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "Team_leagueId_idx" ON "Team" USING btree ("leagueId");--> statement-breakpoint
CREATE INDEX "Team_userId_idx" ON "Team" USING btree ("userId");