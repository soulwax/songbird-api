// File: src/spotify/spotify.controller.ts

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    RecommendationQueryDto,
    RecommendationResponseDto,
    RecommendationsFromSearchRequestDto,
    SpiceUpRequestDto,
    SpiceUpResponseDto,
    TrackDto,
} from './dtos/index';
import { SpotifyService } from './spotify.service';

@ApiTags('Spotify')
@Controller('api/spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) { }

    @Get('search/tracks')
    @ApiOperation({ summary: 'Search for tracks on Spotify' })
    @ApiQuery({ name: 'query', required: true, description: 'Search query string' })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of results to return (default 10)',
    })
    @ApiResponse({ status: 200, type: [TrackDto] })
    async searchTracks(
        @Query('query') query: string,
        @Query('limit') limit?: number,
    ): Promise<TrackDto[]> {
        return this.spotifyService.searchTracks({ query, limit });
    }

    @Get('recommendations')
    @ApiOperation({ summary: 'Get Spotify recommendations using seeds' })
    @ApiQuery({ name: 'seed_tracks', required: false, description: 'Comma-separated Spotify track IDs' })
    @ApiQuery({ name: 'seed_artists', required: false, description: 'Comma-separated Spotify artist IDs' })
    @ApiQuery({ name: 'seed_genres', required: false, description: 'Comma-separated genre names' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recommendations (1-100)' })
    @ApiQuery({ name: 'market', required: false, description: 'Market code (ISO 3166-1 alpha-2)' })
    @ApiQuery({ name: 'target_danceability', required: false, type: Number, description: 'Target danceability (0.0-1.0)' })
    @ApiQuery({ name: 'target_popularity', required: false, type: Number, description: 'Target popularity (0-100)' })
    @ApiResponse({ status: 200, type: RecommendationResponseDto })
    async getRecommendations(
        @Query() queryParams: RecommendationQueryDto,
    ): Promise<RecommendationResponseDto> {
        return this.spotifyService.getRecommendations(queryParams);
    }

    @Post('recommendations/from-search')
    @ApiOperation({ summary: 'Search for a track and get recommendations seeded from it' })
    @ApiBody({ type: RecommendationsFromSearchRequestDto })
    @ApiResponse({ status: 200, type: RecommendationResponseDto })
    async getRecommendationsFromSearch(
        @Body() body: RecommendationsFromSearchRequestDto,
    ): Promise<RecommendationResponseDto> {
        const tracks = await this.spotifyService.searchTracks({
            query: body.query,
            limit: 1,
        });

        if (tracks.length === 0) {
            throw new Error('No tracks found');
        }

        return this.spotifyService.getRecommendations({
            seed_tracks: tracks[0].id,
            limit: body.limit || 20,
            target_danceability: 0.6,
            target_popularity: 60,
        });
    }

    @Post('recommendations/spice-up')
    @ApiOperation({ summary: 'Generate recommendations to spice up a playlist' })
    @ApiBody({ type: SpiceUpRequestDto })
    @ApiResponse({ status: 200, type: SpiceUpResponseDto })
    async spiceUpPlaylist(
        @Body() body: SpiceUpRequestDto,
    ): Promise<SpiceUpResponseDto> {
        return this.spotifyService.spiceUpPlaylist(body);
    }
}
