CREATE TABLE "ParkingSpot" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" TIMESTAMP(3) WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"ownerUserId" uuid NOT NULL,
	"address" text NOT NULL,
	"location" GEOMETRY(POINT,4326) NOT NULL,
	"timeZone" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "ParkingSpot_ownerUserId_idx" ON "ParkingSpot" USING btree ("ownerUserId");--> statement-breakpoint
CREATE INDEX "ParkingSpot_location_idx" ON "ParkingSpot" USING gist ("location");