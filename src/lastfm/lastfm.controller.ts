// File: src/lastfm/lastfm.controller.ts

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { DeezerService } from '../deezer/deezer.service';
import {
    LastfmSpiceUpWithDeezerRequestDto,
    LastfmSpiceUpWithDeezerResponseDto,
} from './dtos/spice-up-with-deezer.dto';
import {
    LastfmSpiceUpRequestDto,
    LastfmSpiceUpResponseDto,
} from './dtos/spice-up.dto';
import { LastfmService } from './lastfm.service';

@ApiTags('Last.fm')
@Controller('api/lastfm')
export class LastfmController {
    constructor(
        private readonly lastfmService: LastfmService,
        private readonly deezerService: DeezerService,
    ) {}

    @Get('track/info')
    @ApiOperation({ summary: 'Get detailed information for a track' })
    @ApiQuery({ name: 'artist', required: true, description: 'Artist name' })
    @ApiQuery({ name: 'track', required: true, description: 'Track name' })
    @ApiQuery({ name: 'mbid', required: false, description: 'MusicBrainz ID' })
    @ApiResponse({ status: 200, description: 'Track information object' })
    async getTrackInfo(
        @Query('artist') artist: string,
        @Query('track') track: string,
        @Query('mbid') mbid?: string,
    ) {
        return this.lastfmService.getTrackInfo(artist, track, mbid);
    }

    @Get('artist/info')
    @ApiOperation({ summary: 'Get detailed information for an artist' })
    @ApiQuery({ name: 'artist', required: true, description: 'Artist name' })
    @ApiQuery({ name: 'mbid', required: false, description: 'MusicBrainz ID' })
    @ApiResponse({ status: 200, description: 'Artist information object' })
    async getArtistInfo(
        @Query('artist') artist: string,
        @Query('mbid') mbid?: string,
    ) {
        return this.lastfmService.getArtistInfo(artist, mbid);
    }

    @Get('track/search')
    @ApiOperation({ summary: 'Search for tracks on Last.fm' })
    @ApiQuery({ name: 'query', required: true, description: 'Search query' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results per page' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiResponse({ status: 200, description: 'Last.fm search result object' })
    async searchTracks(
        @Query('query') query: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.lastfmService.searchTracks(query, limit, page);
    }

    @Get('artist/search')
    @ApiOperation({ summary: 'Search for artists on Last.fm' })
    @ApiQuery({ name: 'query', required: true, description: 'Search query' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of results per page' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiResponse({ status: 200, description: 'Last.fm search result object' })
    async searchArtists(
        @Query('query') query: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.lastfmService.searchArtists(query, limit, page);
    }

    @Get('artist/top-tracks')
    @ApiOperation({ summary: 'Get top tracks for an artist' })
    @ApiQuery({ name: 'artist', required: true, description: 'Artist name' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of tracks to return' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiResponse({ status: 200, description: 'Top tracks response from Last.fm' })
    async getArtistTopTracks(
        @Query('artist') artist: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.lastfmService.getArtistTopTracks(artist, limit, page);
    }

    @Get('track/similar')
    @ApiOperation({ summary: 'Get similar tracks for a given track' })
    @ApiQuery({ name: 'artist', required: true, description: 'Artist name' })
    @ApiQuery({ name: 'track', required: true, description: 'Track name' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of similar tracks to return' })
    @ApiResponse({ status: 200, description: 'Similar tracks response from Last.fm' })
    async getSimilarTracks(
        @Query('artist') artist: string,
        @Query('track') track: string,
        @Query('limit') limit?: number,
    ) {
        return this.lastfmService.getSimilarTracks(artist, track, limit);
    }

    @Post('recommendations/spice-up')
    @ApiOperation({ summary: 'Generate recommendations using Last.fm similarity data' })
    @ApiBody({ type: LastfmSpiceUpRequestDto })
    @ApiResponse({ status: 200, type: LastfmSpiceUpResponseDto })
    async spiceUpPlaylist(
        @Body() body: LastfmSpiceUpRequestDto,
    ): Promise<LastfmSpiceUpResponseDto> {
        return this.lastfmService.spiceUpPlaylist(body);
    }

    @Post('recommendations/spice-up-with-deezer')
    @ApiOperation({
        summary: 'Generate Last.fm recommendations and convert them to Deezer track IDs',
    })
    @ApiBody({ type: LastfmSpiceUpWithDeezerRequestDto })
    @ApiResponse({ status: 200, type: LastfmSpiceUpWithDeezerResponseDto })
    async spiceUpPlaylistWithDeezer(
        @Body() body: LastfmSpiceUpWithDeezerRequestDto,
    ): Promise<LastfmSpiceUpWithDeezerResponseDto> {
        const { convertToDeezer = true, ...spiceUpRequest } = body;
        return this.lastfmService.spiceUpPlaylistWithDeezer(
            spiceUpRequest,
            this.deezerService,
            convertToDeezer,
        );
    }
}
