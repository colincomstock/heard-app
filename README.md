# Heard
heard is a social music app built around human-curated song discovery from a user's trusted network. It is designed as a transparent alternative to streaming recommendations that feel increasingly algorithmic, promotional, or disconnected from real human taste.

## The Problem
Streaming platforms have historically been one of my main sources of new music discovery. Over time, that experience has started to feel less trustworthy.

Recommendations are increasingly shaped by opaque ranking systems, promoted content, non-music media, and platform incentives that do not align with the listener's. As AI-generated music becomes more common, I am increasingly interested in discovery experiences that are rooted in people rather than automated recommendation systems.

In short, I wanted a better way to discover music human made music through people I trust.

## My solution
Heard is a space for human-to-human music recommendations. Users can follow people they trust, browse a chronological feed of song posts, sample tracks quickly, interact with posts, and jump into their streaming service of choice to hear the full track.

The app is designed with 4 main sections for navigation:
- queue
- discover
- saved
- profile

## Queue

The Queue is the main feed. It shows song recommendation posts from people the user follows.

Posts are presented chronologically and only from accounts the user has chosen to follow. This makes the feed transparent: users know why each post is being shown, and the experience is built around trust rather than opaque ranking.

The Queue UI takes inspiration from interaction patterns found in apps like Instagram Reels and TikTok: full-screen, swipeable, media-forward cards that are easy to browse quickly. The difference is the content model. Heard's feed is finite, chronological, and based on a user's chosen network rather than an engagement-optimized recommendation algorithm.

Each post card includes:

- Album artwork
- Audio preview playback
- Like and comment actions
- A button to open the full track in a streaming service
- Song and artist metadata
- Clickable genre badges
- User metadata with a link to open their profile
- The post caption

Tracks autoplay as the user scrolls, allowing them to quickly sample recommendations from people they trust, like, comment, save, open the full track elsewhere, and move on.

## Discover

Discover is planned as the place where users can expand their trusted network and browse genre-based recommendation feeds.

If the Queue is built around people a user already follows, Discover is built around finding new people and musical interests worth following. It gives users a way to search for other accounts directly, browse genres represented on the platform, and find posts from people whose taste may overlap with their own.

The Discover UI is planned to include:

- User search by handle and display name
- A browsable list of genres represented across posts
- Genre pages that open into queue-style feeds
- Sorting options such as top of the week, month, and year

When a track is posted, Heard stores the track's genre data and associates those genres with the track. Genre badges then become navigation points throughout the app. A user can click a genre from Discover, from a post, or from a profile card to open a feed of posts containing tracks associated with that genre.

The goal is to make discovery transparent. Rather than hiding ranking behind an opaque recommendation model, genre feeds will expose clear sorting options so users understand why they are seeing what they are seeing. This gives new users a way to find music, posts, and people that match their interests even before they have built out a following list.

## Saved

Saved is planned as a place for users to return to recommendations they liked.

A common problem with music discovery is that recommendations are easy to lose. Someone may send a song, post a track, or mention an artist, but the moment often disappears before the listener has time to fully engage with it.

In Heard, liking a post also acts as a lightweight save action. The Saved section will collect those liked posts so users can revisit tracks later, listen again, open them in their streaming service, or use them as a record of what caught their attention.

The goal is to make saving feel natural rather than requiring a separate organizational workflow.

## Profile

The Profile section gives each user a space to represent their taste and recommendation history.

A profile includes user identity, profile metadata, follower/following counts, post history, and top genres based on the music they share. Posts on a profile are displayed in a condensed format so other users can quickly scan someone's taste and decide whether they want to follow them. Clicking any of these posts brings a user into a queue style feed of posts from that user's profile.

Profiles are important to the trust model of Heard. A user should be able to look at someone's posts, genres, and taste patterns to quickly determine if that user aligns with their interests before adding them to their network.

## Current Status

Heard is currently in active development.

Implemented or partially implemented areas include:

- Supabase authentication
- Protected frontend routes
- Queue feed
- Profile page
- Post creation flow
- Apple Music track search
- Track metadata storage
- Spotify link enrichment
- Genre association
- Advanced UI color processing logic
- Audio preview playback
- Like and unlike actions
- Shared TypeScript types
- Frontend and backend linting/typechecking
- Supabase hosted PostgreSQL database and schema
- Cloudflare Workers + Hono API

Some areas, including Discover, Saved, comments, and broader social features, are still being built.

The current goal is to continue developing Heard toward an initial iOS release using Capacitor, with Android and web releases planned afterward.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Supabase client
- shadcn/ui-style components
- Radix UI / Vaul primitives
- Tailwind CSS utilities
- Lucide React icons
- Capacitor (Future)

### Backend

- Cloudflare Workers
- Hono
- TypeScript
- Supabase
- Apple Music API
- Spotify API
- Wrangler
- Firebase Messaging (Future)

### Monorepo

- npm workspaces
- Shared `@heard/types` package
- Separate frontend and backend applications

## Project Structure

```txt
apps/
  web/      React/Vite frontend
  api/      Hono API running on Cloudflare Workers

packages/
  types/    Shared TypeScript contracts
```

The frontend owns the user experience: routing, authentication state, queue UI, profile views, post creation, audio previews, and API calls.

The backend validates Supabase auth tokens, reads and writes application data through Supabase, fetches Apple Music metadata, enriches tracks with Spotify links, normalizes genres, and returns response data to the frontend.

The shared types package keeps app-level contracts consistent between the frontend and backend.

## Engineering Highlights
- Built a full-stack TypeScript monorepo with separate frontend, backend, and shared type workspaces
- Implemented Supabase authentication and protected React Router routes
- Used TanStack Query for authenticated fetching, cache management, placeholder data, mutations, and optimistic like/unlike behavior
- Built a Hono API on Cloudflare Workers with route-level organization and Supabase auth middleware
- Integrated Apple Music search and track lookup for post creation
- Integrated Spotify lookup by ISRC to provide streaming-service links
- Implemented backend track ingestion that checks for existing records, fetches external metadata, stores normalized track data, and associates genres
- Built a global audio preview system with a single audio instance, active post ownership, playback progress, mute state, and play/pause controls
- Used IntersectionObserver to auto-play and pause previews as queue posts enter and leave view
- Derived post visual styling from Apple Music artwork metadata and genre colors
- Added linting and typechecking across frontend and backend workspaces

## Quality Checks
The project includes linting, typechecking, and production build checks.
```text
npm run build:web
npm run lint:web
npm run typecheck:web
npm run lint:api
npm run typecheck:api
```
A root-level check script can be used to run the main validation suite:
```text
npm run check
```

## Local Development
Heard is not currently packaged as a plug-and-play open-source app. Running the full project locally requires Supabase configuration, Cloudflare Worker bindings, Apple Music credentials, and Spotify credentials.

Basic setup:
```text
npm install
npm run dev:web
npm run dev:api
```

Required environment values include:
```text
VITE_API_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
APPLE_MUSIC_TEAM_ID
APPLE_MUSIC_KEY_ID
APPLE_MUSIC_PRIVATE_KEY
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
```
