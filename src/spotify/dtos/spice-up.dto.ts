// File: src/spotify/dtos/spice-up.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TrackDto } from './track.dto';

export class SongInputDto {
    @ApiPropertyOptional({ description: 'Song title to use for seed search' })
    name?: string;

    @ApiPropertyOptional({ description: 'Artist name to use for seed search' })
    artist?: string;

    @ApiPropertyOptional({ description: 'Album name to use for seed search' })
    album?: string;
}

export class SpiceUpRequestDto {
    @ApiProperty({ type: [SongInputDto], minItems: 1, description: 'Songs used to generate seed information' })
    songs: SongInputDto[];

    @ApiPropertyOptional({ description: 'Number of recommendations to return (1-100)', default: 20 })
    limit?: number;

    @ApiPropertyOptional({
        description: 'Diversity mode. strict -> most similar, diverse -> most variety',
        enum: ['strict', 'normal', 'diverse'],
        default: 'normal',
    })
    mode?: 'strict' | 'normal' | 'diverse';
}

export class SpiceUpSeedDto {
    @ApiProperty({ description: 'Seed identifier used by Spotify' })
    id: string;

    @ApiProperty({ description: 'Seed type (track, artist, genre)' })
    type: string;

    @ApiProperty({ description: 'Initial pool size for the seed' })
    initialPoolSize: number;
}

export class SpiceUpResponseDto {
    @ApiProperty({ description: 'Diversity mode applied' })
    mode: string;

    @ApiProperty({ description: 'Number of input songs provided' })
    inputSongs: number;

    @ApiProperty({ type: [TrackDto], description: 'Recommended Spotify tracks' })
    recommendations: TrackDto[];

    @ApiProperty({ type: [SpiceUpSeedDto], description: 'Seed data returned by Spotify' })
    seeds: SpiceUpSeedDto[];
}
