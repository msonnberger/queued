<p align="center">
    <h3 align="center">Queued</h3>
</p>
<p align="center">
    	Your interactive playlist
    	<br />
    	<a href="https://queued.live"><strong>Learn more »</strong></a>
    	<br />
    	<br />
    	<a href="https://queued.live">Website</a>
    	·
    	<a href="https://github.com/msonnberger/queued/issues">Issues</a>
    </p>

## About the Project

Queued is an interactive playlist, which lets you and your friends decide together on
the upcoming song. A host with a Spotify Premium account can create a Queue
and invite others to join them. All participants can add song suggestions and vote for each suggestion
with upvotes and downvotes. The songs with the highest upvote ratio automatically plays next.

Queued was done as a final year project for the
[MultiMediaTechnology](https://www.fh-salzburg.ac.at/en/study/ct/multimediatechnology-bachelor) Bachelor's degree program at Salzburg University of Applied Sciences and is developed by:

- [Martin Sonnberger](https://github.com/msonnberger)
- [Maximilian Hajek](https://github.com/Bluuax)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Here is what you need to be able to run Queued:

- Node.js (Version 19 or higher)
- Postgres Database
- Spotify OAuth App ([setup instructions](https://developer.spotify.com/documentation/web-api/concepts/apps))
- [Pusher](https://pusher.com) Server
- pnpm _(recommended)_

## Development

### Setup

1. Clone the repo

   ```sh
   git clone https://github.com/msonnberger/queued.git
   ```

1. Go to the project folder

   ```sh
   cd queued
   ```

1. Install packages with pnpm

   ```sh
   pnpm install
   ```

1. Set up your database

   - Create a Postgres database, either locally or in the cloud
   - Run the migrations inside `src/lib/server/db/migrations` to set up the schema

1. Set up your .env file

   - Duplicate `.env.example` to `.env`
   - Fill in values for the database connection, Spotify and Pusher API keys

1. Start dev server

   ```sh
   pnpm dev
   ```

### Testing

Make sure you set all environment variables mentioned in `.env.example`

```sh
# Unit tests
pnpm test:unit

# E2E tests
pnpm test:browser
```
