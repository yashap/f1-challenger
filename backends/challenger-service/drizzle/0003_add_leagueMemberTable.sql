CREATE TABLE "LeagueMember" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"leagueId" uuid NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "LeagueMember" ADD CONSTRAINT "LeagueMember_leagueId_League_id_fk" FOREIGN KEY ("leagueId") REFERENCES "public"."League"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "LeagueMember_leagueId_idx" ON "LeagueMember" USING btree ("leagueId");--> statement-breakpoint
CREATE INDEX "LeagueMember_userId_idx" ON "LeagueMember" USING btree ("userId");