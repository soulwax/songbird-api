// File: src/spotify/dtos/search.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchTracksDto {
    @ApiProperty({ description: 'Search query string' })
    query: string;

    @ApiPropertyOptional({ description: 'Number of results to return (1-50)', default: 10 })
    limit?: number;
}
