import { Controller, Get, Query } from '@nestjs/common';
import { LastfmService } from './lastfm.service';

@Controller('api/lastfm')
export class LastfmController {
    constructor(private readonly lastfmService: LastfmService) {}

    @Get('track/info')
    async getTrackInfo(
        @Query('artist') artist: string,
        @Query('track') track: string,
        @Query('mbid') mbid?: string,
    ) {
        return this.lastfmService.getTrackInfo(artist, track, mbid);
    }

    @Get('artist/info')
    async getArtistInfo(
        @Query('artist') artist: string,
        @Query('mbid') mbid?: string,
    ) {
        return this.lastfmService.getArtistInfo(artist, mbid);
    }

    @Get('track/search')
    async searchTracks(
        @Query('query') query: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.lastfmService.searchTracks(query, limit, page);
    }

    @Get('artist/search')
    async searchArtists(
        @Query('query') query: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.lastfmService.searchArtists(query, limit, page);
    }

    @Get('artist/top-tracks')
    async getArtistTopTracks(
        @Query('artist') artist: string,
        @Query('limit') limit?: number,
        @Query('page') page?: number,
    ) {
        return this.lastfmService.getArtistTopTracks(artist, limit, page);
    }

    @Get('track/similar')
    async getSimilarTracks(
        @Query('artist') artist: string,
        @Query('track') track: string,
        @Query('limit') limit?: number,
    ) {
        return this.lastfmService.getSimilarTracks(artist, track, limit);
    }
}

