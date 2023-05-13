CREATE TABLE IF NOT EXISTS "auth_key" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"primary_key" boolean NOT NULL,
	"hashed_password" text,
	"expires" bigint
);

CREATE TABLE IF NOT EXISTS "queues" (
	"id" varchar(7) PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"current_track_uri" text,
	"owner_id" varchar(15) NOT NULL
);

CREATE TABLE IF NOT EXISTS "auth_session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS "spotify_tokens" (
	"user_id" varchar(15) PRIMARY KEY NOT NULL,
	"refresh_token" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"spotify_uri" text NOT NULL,
	"qid" varchar(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS "auth_user" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"name" text
);

CREATE TABLE IF NOT EXISTS "votes" (
	"id" serial NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"value" integer NOT NULL,
	"voter_id" uuid NOT NULL,
	"track_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_track_id" PRIMARY KEY("voter_id","track_id");

CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "queues" ADD CONSTRAINT "queues_owner_id_auth_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "spotify_tokens" ADD CONSTRAINT "spotify_tokens_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "tracks" ADD CONSTRAINT "tracks_qid_queues_id_fk" FOREIGN KEY ("qid") REFERENCES "queues"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "votes" ADD CONSTRAINT "votes_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "qid_spotify_uri_unique_idx" ON "tracks" ("qid","spotify_uri");
CREATE INDEX IF NOT EXISTS "qid_idx" ON "tracks" ("qid");
CREATE UNIQUE INDEX IF NOT EXISTS "email_unique_idx" ON "waitlist" ("email");