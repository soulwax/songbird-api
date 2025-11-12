// File: src/lastfm/dtos/spice-up.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LastfmSongInputDto {
    @ApiPropertyOptional({ description: 'Song title to use for Last.fm search' })
    name?: string;

    @ApiPropertyOptional({ description: 'Artist name to use for Last.fm search' })
    artist?: string;

    @ApiPropertyOptional({ description: 'Album name to use for Last.fm search' })
    album?: string;
}

export class LastfmSpiceUpRequestDto {
    @ApiProperty({ type: [LastfmSongInputDto], minItems: 1, description: 'Songs used as seeds for Last.fm search' })
    songs: LastfmSongInputDto[];

    @ApiPropertyOptional({ description: 'Number of recommended tracks to return (1-100)', default: 20 })
    limit?: number;

    @ApiPropertyOptional({
        description: 'Diversity mode for recommendation variety',
        enum: ['strict', 'normal', 'diverse'],
        default: 'normal',
    })
    mode?: 'strict' | 'normal' | 'diverse';
}

export class LastfmRecommendationDto {
    @ApiProperty({ description: 'Track name' })
    name: string;

    @ApiProperty({ description: 'Artist name' })
    artist: string;

    @ApiProperty({ description: 'Last.fm track URL' })
    url: string;

    @ApiPropertyOptional({ description: 'Match score provided by Last.fm' })
    match?: number;

    @ApiPropertyOptional({ description: 'MusicBrainz ID if available' })
    mbid?: string;
}

export class LastfmSpiceUpResponseDto {
    @ApiProperty({ description: 'Diversity mode applied' })
    mode: string;

    @ApiProperty({ description: 'Number of input songs provided' })
    inputSongs: number;

    @ApiProperty({ type: [LastfmRecommendationDto], description: 'Recommended Last.fm tracks' })
    recommendations: LastfmRecommendationDto[];

    @ApiProperty({ description: 'Number of input songs successfully matched on Last.fm' })
    foundSongs: number;
}
