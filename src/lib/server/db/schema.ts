import { relations } from 'drizzle-orm';
import {
	bigint,
	boolean,
	index,
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar
} from 'drizzle-orm/pg-core';

export const users = pgTable('auth_user', {
	id: varchar('id', { length: 15 }).primaryKey(),
	name: text('name')
});

export const sessions = pgTable('auth_session', {
	id: varchar('id', { length: 128 }).primaryKey(),
	user_id: varchar('user_id', { length: 15 })
		.references(() => users.id)
		.notNull(),
	active_expires: bigint('active_expires', { mode: 'number' }).notNull(),
	idle_expires: bigint('idle_expires', { mode: 'number' }).notNull()
});

export const keys = pgTable('auth_key', {
	id: text('id').primaryKey(),
	user_id: varchar('user_id', { length: 15 })
		.references(() => users.id)
		.notNull(),
	primary_key: boolean('primary_key').notNull(),
	hashed_password: text('hashed_password'),
	expires: bigint('expires', { mode: 'number' })
});

export const spotify_tokens = pgTable('spotify_tokens', {
	user_id: varchar('user_id', { length: 15 })
		.references(() => users.id, { onDelete: 'cascade' })
		.notNull()
		.primaryKey(),
	refresh_token: text('refresh_token').notNull()
});

export const waitlist = pgTable(
	'waitlist',
	{
		id: serial('id').primaryKey(),
		email: text('email').notNull()
	},
	(waitlist) => ({
		unique_idx: uniqueIndex('email_unique_idx').on(waitlist.email)
	})
);

export const queues = pgTable('queues', {
	id: varchar('id', { length: 7 }).primaryKey(),
	created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
	name: text('name').notNull(),
	current_track_uri: text('current_track_uri'),
	owner_id: varchar('owner_id', { length: 15 })
		.references(() => users.id)
		.notNull()
});

export const tracks = pgTable(
	'tracks',
	{
		id: serial('id').primaryKey(),
		created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
		spotify_uri: text('spotify_uri').notNull(),
		qid: varchar('qid', { length: 7 })
			.references(() => queues.id, { onDelete: 'cascade' })
			.notNull()
	},
	(queues) => ({
		unique_idx: uniqueIndex('qid_spotify_uri_unique_idx').on(queues.qid, queues.spotify_uri),
		qid_idx: index('qid_idx').on(queues.qid)
	})
);

export const votes = pgTable(
	'votes',
	{
		id: serial('id').notNull(),
		created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
		value: integer('value').notNull(),
		voter_id: uuid('voter_id').notNull(),
		track_id: integer('track_id')
			.references(() => tracks.id, { onDelete: 'cascade' })
			.notNull()
	},
	(votes) => ({
		cpk: primaryKey(votes.voter_id, votes.track_id)
	})
);

export const queues_relations = relations(queues, ({ many }) => ({
	tracks: many(tracks)
}));

export const tracks_relations = relations(tracks, ({ many, one }) => ({
	votes: many(votes),
	queue: one(queues, { fields: [tracks.qid], references: [queues.id] })
}));

export const votes_relations = relations(votes, ({ one }) => ({
	track: one(tracks, { fields: [votes.track_id], references: [tracks.id] })
}));
