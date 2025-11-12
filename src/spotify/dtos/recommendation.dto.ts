// File: src/spotify/dtos/recommendation.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackDto } from './track.dto';

export class RecommendationSeedDto {
    @ApiProperty({ description: 'Seed identifier' })
    id: string;

    @ApiProperty({ description: 'Seed type (track, artist, genre)' })
    type: string;

    @ApiProperty({ description: 'Initial pool size used by Spotify' })
    initialPoolSize: number;
}

export class RecommendationQueryDto {
    @ApiPropertyOptional({
        description: 'Comma-separated list of seed track IDs (max 5 seeds total)',
        example: '4iV5W9uYEdYUVa79Axb7Rh,0VjIjW4GlUZ9YafUnjvTv7',
    })
    seed_tracks?: string;

    @ApiPropertyOptional({
        description: 'Comma-separated list of seed artist IDs (max 5 seeds total)',
        example: '4Z8W4fKeB5YxbusRsdQVPb',
    })
    seed_artists?: string;

    @ApiPropertyOptional({
        description: 'Comma-separated list of seed genres (max 5 seeds total)',
        example: 'rock,pop,indie',
    })
    seed_genres?: string;

    @ApiPropertyOptional({ description: 'Number of recommendations to return (1-100)', default: 20 })
    limit?: number;

    @ApiPropertyOptional({ description: 'ISO 3166-1 alpha-2 country code for market filtering' })
    market?: string;

    @ApiPropertyOptional({ description: 'Target danceability (0.0 - 1.0)' })
    target_danceability?: number;

    @ApiPropertyOptional({ description: 'Target popularity (0 - 100)' })
    target_popularity?: number;
}

export class RecommendationResponseDto {
    @ApiProperty({ type: [RecommendationSeedDto], description: 'Seed details provided by Spotify' })
    seeds: RecommendationSeedDto[];

    @ApiProperty({ type: [TrackDto], description: 'Recommended tracks' })
    tracks: TrackDto[];
}
