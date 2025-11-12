import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LastfmAuthService } from './auth/lastfm-auth.service';

@Injectable()
export class LastfmService {
    private readonly logger = new Logger(LastfmService.name);
    private readonly baseUrl = 'https://ws.audioscrobbler.com/2.0';

    constructor(
        private readonly httpService: HttpService,
        private readonly authService: LastfmAuthService,
    ) {}

    /**
     * Make a GET request to Last.fm API
     */
    private async makeRequest(
        method: string,
        params: Record<string, string> = {},
        requireSignature: boolean = false,
    ): Promise<any> {
        try {
            const queryParams = {
                method,
                ...params,
            };

            const queryString = this.authService.buildQueryString(queryParams, requireSignature);
            const url = `${this.baseUrl}?${queryString}`;

            this.logger.debug(`Making Last.fm API request: ${method}`);

            const response = await firstValueFrom(
                this.httpService.get(url),
            );

            if (response.data.error) {
                throw new BadRequestException(
                    `Last.fm API error: ${response.data.message || response.data.error}`,
                );
            }

            return response.data;
        } catch (error) {
            this.logger.error(`Last.fm API request failed for method: ${method}`, error);
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 400) {
                    throw new BadRequestException(
                        data?.message || 'Invalid Last.fm API request',
                    );
                } else if (status === 401) {
                    throw new BadRequestException('Last.fm API authentication failed');
                } else if (status === 403) {
                    throw new BadRequestException('Last.fm API access forbidden');
                } else {
                    throw new Error(
                        `Last.fm API error: ${status} - ${data?.message || 'Unknown error'}`,
                    );
                }
            } else if (error.request) {
                throw new Error('No response from Last.fm API. Please check your network connection.');
            } else {
                throw new Error(`Failed to make Last.fm API request: ${error.message}`);
            }
        }
    }

    /**
     * Get track information
     * @param artist Artist name
     * @param track Track name
     * @param mbid Optional MusicBrainz ID
     */
    async getTrackInfo(artist: string, track: string, mbid?: string): Promise<any> {
        if (!artist || !track) {
            throw new BadRequestException('Artist and track are required');
        }

        const params: Record<string, string> = {
            artist,
            track,
        };

        if (mbid) {
            params.mbid = mbid;
        }

        const response = await this.makeRequest('track.getInfo', params);
        return response.track;
    }

    /**
     * Get artist information
     * @param artist Artist name
     * @param mbid Optional MusicBrainz ID
     */
    async getArtistInfo(artist: string, mbid?: string): Promise<any> {
        if (!artist) {
            throw new BadRequestException('Artist is required');
        }

        const params: Record<string, string> = {
            artist,
        };

        if (mbid) {
            params.mbid = mbid;
        }

        const response = await this.makeRequest('artist.getInfo', params);
        return response.artist;
    }

    /**
     * Search for tracks
     * @param query Search query
     * @param limit Number of results (default: 30, max: 30)
     * @param page Page number (default: 1)
     */
    async searchTracks(query: string, limit: number = 30, page: number = 1): Promise<any> {
        if (!query || query.trim().length === 0) {
            throw new BadRequestException('Search query cannot be empty');
        }

        const params: Record<string, string> = {
            track: query,
            limit: Math.min(limit, 30).toString(),
            page: page.toString(),
        };

        const response = await this.makeRequest('track.search', params);
        return response.results;
    }

    /**
     * Search for artists
     * @param query Search query
     * @param limit Number of results (default: 30, max: 30)
     * @param page Page number (default: 1)
     */
    async searchArtists(query: string, limit: number = 30, page: number = 1): Promise<any> {
        if (!query || query.trim().length === 0) {
            throw new BadRequestException('Search query cannot be empty');
        }

        const params: Record<string, string> = {
            artist: query,
            limit: Math.min(limit, 30).toString(),
            page: page.toString(),
        };

        const response = await this.makeRequest('artist.search', params);
        return response.results;
    }

    /**
     * Get top tracks for an artist
     * @param artist Artist name
     * @param limit Number of results (default: 50, max: 1000)
     * @param page Page number (default: 1)
     */
    async getArtistTopTracks(artist: string, limit: number = 50, page: number = 1): Promise<any> {
        if (!artist) {
            throw new BadRequestException('Artist is required');
        }

        const params: Record<string, string> = {
            artist,
            limit: Math.min(limit, 1000).toString(),
            page: page.toString(),
        };

        const response = await this.makeRequest('artist.getTopTracks', params);
        return response.toptracks;
    }

    /**
     * Get similar tracks
     * @param artist Artist name
     * @param track Track name
     * @param limit Number of results (default: 50, max: 1000)
     */
    async getSimilarTracks(artist: string, track: string, limit: number = 50): Promise<any> {
        if (!artist || !track) {
            throw new BadRequestException('Artist and track are required');
        }

        const params: Record<string, string> = {
            artist,
            track,
            limit: Math.min(limit, 1000).toString(),
        };

        const response = await this.makeRequest('track.getSimilar', params);
        return response.similartracks;
    }
}

