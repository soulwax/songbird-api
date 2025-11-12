# Spotify Recommendation API Playground Server

## Overview

A NestJS REST API that integrates with the Spotify Web API to search tracks and get recommendations. It uses client credentials authentication. This server acts as a proxy/wrapper around the Spotify Web API, adding token management, error handling, and a structured response format.

## Architecture & Flow

### 1. Application Bootstrap (`main.ts`)
- Entry point that creates the NestJS app
- Reads `PORT` from config (defaults to 3000)
- Starts the HTTP server

### 2. Module Structure

#### Root Module (`app.module.ts`)
- ConfigModule: Global config with Joi validation
  - Requires: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`
  - Optional: `PORT` (default: 3000), `NODE_ENV` (default: development)
- HttpModule: Axios for HTTP requests
- SpotifyModule: Feature module for Spotify functionality

#### Spotify Module (`spotify.module.ts`)
- Controllers: `SpotifyController`
- Providers: `SpotifyService`, `SpotifyAuthService`
- Exports: `SpotifyService` (for use in other modules)

### 3. Authentication Flow (`spotify-auth.service.ts`)

`SpotifyAuthService` handles OAuth 2.0 Client Credentials:

- Token caching: Stores access token in memory
- Expiration check: Refreshes if expired (with 60s buffer)
- Token request: Uses `client_id:client_secret` as Basic auth
- Returns: Access token for API requests

### 4. API Endpoints (`spotify.controller.ts`)

Three endpoints under `/api/spotify`:

#### a) `GET /api/spotify/search/tracks`
- Query params: `query` (required), `limit` (optional)
- Returns: Array of `TrackDto`

#### b) `GET /api/spotify/recommendations`
- Query params: `seed_tracks`, `seed_artists`, `seed_genres`, `limit`, `market`, `target_danceability`, `target_popularity`
- Returns: `RecommendationResponseDto` with seeds and tracks

#### c) `POST /api/spotify/recommendations/from-search`
- Body: `{ query: string, limit?: number }`
- Flow:
  1. Searches for tracks matching the query
  2. Uses the first result as a seed
  3. Gets recommendations with default targets (danceability: 0.6, popularity: 60)

### 5. Business Logic (`spotify.service.ts`)

`SpotifyService` handles Spotify API calls:

- `searchTracks()`:
  - Validates query
  - Gets access token
  - Calls Spotify Search API
  - Maps response to `TrackDto[]`

- `getRecommendations()`:
  - Validates at least one seed
  - Gets access token
  - Builds query params (defaults: danceability 0.5, popularity 50)
  - Calls Spotify Recommendations API
  - Maps response to `RecommendationResponseDto`

### 6. Data Transfer Objects (DTOs)

Located in `src/spotify/dtos/`:
- `TrackDto`: Track information
- `SearchTracksDto`: Search query parameters
- `RecommendationQueryDto`: Recommendation query parameters
- `RecommendationResponseDto`: Recommendation response structure

## Request Flow Example

Example: `GET /api/spotify/search/tracks?query=beatles&limit=5`

1. Request hits `SpotifyController.searchTracks()`
2. Controller calls `SpotifyService.searchTracks()`
3. Service calls `SpotifyAuthService.getAccessToken()`
   - Checks cached token
   - If expired/missing, requests new token from Spotify
4. Service makes HTTP request to `https://api.spotify.com/v1/search`
5. Response is mapped to `TrackDto[]` and returned

## Key Features

- Token caching: Reduces auth requests
- Error handling: Try-catch with logging
- Validation: Joi for env vars, DTOs for requests
- Modular design: Separation of concerns
- Type safety: TypeScript with DTOs

## Dependencies

- `@nestjs/axios`: HTTP client
- `@nestjs/config`: Configuration management
- `joi`: Environment variable validation
- `class-validator` & `class-transformer`: DTO validation (configured but not actively used in controllers)
