// File: src/lastfm/dtos/spice-up-with-deezer.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LastfmRecommendationDto, LastfmSpiceUpRequestDto } from './spice-up.dto';

export class LastfmSpiceUpWithDeezerRequestDto extends LastfmSpiceUpRequestDto {
    @ApiPropertyOptional({
        description: 'Convert Last.fm recommendations to Deezer track IDs',
        default: true,
    })
    convertToDeezer?: boolean;
}

export class LastfmSpiceUpWithDeezerResponseRecommendationDto extends LastfmRecommendationDto {
    @ApiPropertyOptional({ description: 'Deezer track ID if conversion succeeded' })
    deezerId?: number | null;
}

export class LastfmSpiceUpWithDeezerResponseDto {
    @ApiProperty({ description: 'Diversity mode applied' })
    mode: string;

    @ApiProperty({ description: 'Number of input songs provided' })
    inputSongs: number;

    @ApiProperty({ description: 'Number of input songs successfully matched on Last.fm' })
    foundSongs: number;

    @ApiProperty({
        type: [LastfmSpiceUpWithDeezerResponseRecommendationDto],
        description: 'Recommended tracks with optional Deezer IDs',
    })
    recommendations: LastfmSpiceUpWithDeezerResponseRecommendationDto[];

    @ApiPropertyOptional({
        description: 'Summary of Deezer ID conversions',
        example: { converted: 18, total: 20 },
    })
    deezerConversion?: {
        converted: number;
        total: number;
    };
}
