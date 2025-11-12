// File: src/deezer/dtos/convert.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackToConvertDto {
    @ApiProperty({ description: 'Track title to search on Deezer' })
    name: string;

    @ApiPropertyOptional({ description: 'Artist name to improve Deezer search accuracy' })
    artist?: string;
}

export class ConvertToDeezerRequestDto {
    @ApiProperty({ type: [TrackToConvertDto], minItems: 1, description: 'Tracks to convert to Deezer IDs' })
    tracks: TrackToConvertDto[];
}

export class ConvertedTrackResultDto {
    @ApiProperty({ description: 'Original track title' })
    name: string;

    @ApiPropertyOptional({ description: 'Original artist name' })
    artist?: string;

    @ApiPropertyOptional({ description: 'Matched Deezer track ID' })
    deezerId: number | null;
}

export class ConvertToDeezerResponseDto {
    @ApiProperty({ description: 'Number of tracks successfully converted' })
    converted: number;

    @ApiProperty({ description: 'Total number of tracks processed' })
    total: number;

    @ApiProperty({ type: [ConvertedTrackResultDto], description: 'Conversion results per track' })
    tracks: ConvertedTrackResultDto[];
}

export class FindTrackIdResponseDto extends ConvertedTrackResultDto {}
