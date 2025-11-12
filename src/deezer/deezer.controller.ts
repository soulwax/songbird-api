// File: src/deezer/deezer.controller.ts

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { DeezerService } from './deezer.service';
import {
    ConvertToDeezerRequestDto,
    ConvertToDeezerResponseDto,
    FindTrackIdResponseDto,
} from './dtos/convert.dto';

@ApiTags('Deezer')
@Controller('api/deezer')
export class DeezerController {
    constructor(private readonly deezerService: DeezerService) {}

    @Get('search/tracks')
    @ApiOperation({ summary: 'Search for tracks on Deezer' })
    @ApiQuery({ name: 'query', required: true, description: 'Search query string' })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of results to return (max 25)',
    })
    @ApiResponse({ status: 200, description: 'Raw response from Deezer search API' })
    async searchTracks(
        @Query('query') query: string,
        @Query('limit') limit?: number,
    ) {
        return this.deezerService.searchTracks(query, limit);
    }

    @Get('track/find-id')
    @ApiOperation({ summary: 'Find a Deezer track ID by name and artist' })
    @ApiQuery({ name: 'name', required: true, description: 'Track title' })
    @ApiQuery({ name: 'artist', required: false, description: 'Artist name to improve accuracy' })
    @ApiResponse({ status: 200, type: FindTrackIdResponseDto })
    async findTrackId(
        @Query('name') name: string,
        @Query('artist') artist?: string,
    ) {
        const trackId = await this.deezerService.findTrackId(name, artist);
        return {
            name,
            artist,
            deezerId: trackId,
        };
    }

    @Post('tracks/convert')
    @ApiOperation({ summary: 'Convert an array of tracks to Deezer track IDs' })
    @ApiBody({ type: ConvertToDeezerRequestDto })
    @ApiResponse({ status: 200, type: ConvertToDeezerResponseDto })
    async convertTracksToDeezerIds(
        @Body() body: ConvertToDeezerRequestDto,
    ): Promise<ConvertToDeezerResponseDto> {
        if (!body.tracks || body.tracks.length === 0) {
            throw new Error('At least one track is required');
        }

        const results = await this.deezerService.convertTracksToDeezerIds(
            body.tracks,
        );

        const converted = results.filter((r) => r.deezerId !== null).length;

        return {
            converted,
            total: results.length,
            tracks: results,
        };
    }
}
