// File: src/spotify/dtos/recommendations-from-search.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RecommendationsFromSearchRequestDto {
    @ApiProperty({ description: 'Search query used to find a seed track' })
    query: string;

    @ApiPropertyOptional({ description: 'Number of recommendations to return (1-100)', default: 20 })
    limit?: number;
}
