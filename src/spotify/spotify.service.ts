// File: src/spotify/spotify.service.ts

import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { SpotifyAuthService } from './auth/spotify-auth.service';
import {
    RecommendationQueryDto,
    RecommendationResponseDto,
    SearchTracksDto,
    SpiceUpRequestDto,
    SpiceUpResponseDto,
    TrackDto
} from './dtos/index';

@Injectable()
export class SpotifyService {
    private readonly logger = new Logger(SpotifyService.name);
    private readonly baseUrl = 'https://api.spotify.com/v1';

    constructor(
        private readonly httpService: HttpService,
        private readonly authService: SpotifyAuthService,
    ) { }

    async searchTracks(query: SearchTracksDto): Promise<TrackDto[]> {
        if (!query.query || query.query.trim().length === 0) {
            throw new BadRequestException('Search query cannot be empty');
        }

        try {
            const token = await this.authService.getAccessToken();
            const params = new URLSearchParams({
                q: query.query,
                type: 'track',
                limit: (query.limit || 10).toString(),
            });

            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/search`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );

            return response.data.tracks.items.map((track: any) => ({
                id: track.id,
                name: track.name,
                artists: track.artists.map((a: any) => ({
                    name: a.name,
                    id: a.id,
                })),
                album: { name: track.album.name },
                popularity: track.popularity,
                preview_url: track.preview_url,
                external_urls: { spotify: track.external_urls.spotify },
            }));
        } catch (error) {
            this.logger.error('Track search failed', error);
            
            // Extract more detailed error information
            if (error.response) {
                // Axios error with response
                const status = error.response.status;
                const statusText = error.response.statusText;
                const data = error.response.data;
                
                this.logger.error(
                    `Spotify API error: ${status} ${statusText}`,
                    JSON.stringify(data, null, 2),
                );
                
                if (status === 400) {
                    throw new BadRequestException(
                        data?.error?.message || 'Invalid search query',
                    );
                } else if (status === 401) {
                    throw new BadRequestException('Spotify authentication failed. Please check your credentials.');
                } else if (status === 403) {
                    throw new BadRequestException('Spotify API access forbidden. Check your app permissions.');
                } else if (status === 429) {
                    throw new BadRequestException('Rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(
                        `Spotify API error: ${status} ${statusText} - ${data?.error?.message || 'Unknown error'}`,
                    );
                }
            } else if (error.request) {
                // Request made but no response received
                this.logger.error('No response from Spotify API', error.request);
                throw new Error('No response from Spotify API. Please check your network connection.');
            } else {
                // Error setting up the request
                this.logger.error('Error setting up search request', error.message);
                throw new Error(`Failed to search tracks: ${error.message}`);
            }
        }
    }

    async getRecommendations(
        query: RecommendationQueryDto,
    ): Promise<RecommendationResponseDto> {
        const hasSeeds =
            (query.seed_tracks && query.seed_tracks.trim().length > 0) ||
            (query.seed_artists && query.seed_artists.trim().length > 0) ||
            (query.seed_genres && query.seed_genres.trim().length > 0);

        if (!hasSeeds) {
            throw new BadRequestException(
                'At least one seed (tracks, artists, or genres) is required',
            );
        }

        try {
            const token = await this.authService.getAccessToken();
            const params: Record<string, any> = {
                limit: Math.min(query.limit || 20, 100),
            };

            if (query.seed_tracks) params.seed_tracks = query.seed_tracks;
            if (query.seed_artists) params.seed_artists = query.seed_artists;
            if (query.seed_genres) params.seed_genres = query.seed_genres;
            if (query.market) params.market = query.market;
            if (query.target_danceability !== undefined)
                params.target_danceability = Number(query.target_danceability);
            if (query.target_popularity !== undefined)
                params.target_popularity = Number(query.target_popularity);

            // Add any additional parameters (min/max values, etc.)
            Object.keys(query).forEach((key) => {
                if (
                    !['seed_tracks', 'seed_artists', 'seed_genres', 'limit', 'market', 'target_danceability', 'target_popularity'].includes(key)
                ) {
                    const value = (query as any)[key];
                    if (value !== undefined && value !== null) {
                        params[key] = typeof value === 'number' ? value : Number(value);
                    }
                }
            });

            // Default values for diversity
            if (params.target_danceability === undefined)
                params.target_danceability = 0.5;
            if (params.target_popularity === undefined)
                params.target_popularity = 50;

            // Log request parameters for debugging
            this.logger.debug('Requesting recommendations with params:', {
                limit: params.limit,
                seed_tracks: params.seed_tracks,
                seed_artists: params.seed_artists,
                seed_genres: params.seed_genres,
                target_danceability: params.target_danceability,
                target_popularity: params.target_popularity,
            });

            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/recommendations`, {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );

            return {
                seeds: response.data.seeds,
                tracks: response.data.tracks.map((track: any) => ({
                    id: track.id,
                    name: track.name,
                    artists: track.artists.map((a: any) => ({
                        name: a.name,
                        id: a.id,
                    })),
                    album: { name: track.album.name },
                    popularity: track.popularity,
                    preview_url: track.preview_url,
                    external_urls: { spotify: track.external_urls.spotify },
                })),
            };
        } catch (error) {
            this.logger.error('Recommendation fetch failed', error);
            
            // Extract more detailed error information
            if (error.response) {
                // Axios error with response
                const status = error.response.status;
                const statusText = error.response.statusText;
                const data = error.response.data;
                
                this.logger.error(
                    `Spotify API error: ${status} ${statusText}`,
                    JSON.stringify(data, null, 2),
                );
                
                if (status === 400) {
                    throw new BadRequestException(
                        data?.error?.message || 'Invalid recommendation request parameters',
                    );
                } else if (status === 401) {
                    throw new BadRequestException('Spotify authentication failed. Please check your credentials.');
                } else if (status === 403) {
                    throw new BadRequestException('Spotify API access forbidden. Check your app permissions.');
                } else if (status === 404) {
                    // 404 usually means invalid seed track/artist/genre IDs
                    const errorMessage = data?.error?.message || 
                        (typeof data === 'string' && data.length > 0 ? data : null) ||
                        'One or more seed IDs (tracks, artists, or genres) are invalid or not found. Please verify the IDs exist.';
                    throw new BadRequestException(errorMessage);
                } else if (status === 429) {
                    throw new BadRequestException('Rate limit exceeded. Please try again later.');
                } else {
                    const errorMsg = data?.error?.message || 
                        (typeof data === 'string' && data.length > 0 ? data : null) ||
                        'Unknown error';
                    throw new Error(
                        `Spotify API error: ${status} ${statusText} - ${errorMsg}`,
                    );
                }
            } else if (error.request) {
                // Request made but no response received
                this.logger.error('No response from Spotify API', error.request);
                throw new Error('No response from Spotify API. Please check your network connection.');
            } else {
                // Error setting up the request
                this.logger.error('Error setting up recommendation request', error.message);
                throw new Error(`Failed to get recommendations: ${error.message}`);
            }
        }
    }

    /**
     * Get recommendations to spice up a list of songs
     * Supports three diversity modes: strict, normal, diverse
     */
    async spiceUpPlaylist(request: SpiceUpRequestDto): Promise<SpiceUpResponseDto> {
        if (!request.songs || request.songs.length === 0) {
            throw new BadRequestException('At least one song is required');
        }

        const mode = request.mode || 'normal';
        const limit = Math.min(request.limit || 20, 100);

        // Search for each song and collect track/artist IDs
        const trackIds: string[] = [];
        const artistIds: Set<string> = new Set();

        this.logger.debug(`Processing ${request.songs.length} songs for spice-up with mode: ${mode}`);

        for (const song of request.songs) {
            try {
                // Build search query from available fields
                const searchTerms: string[] = [];
                if (song.name) searchTerms.push(song.name);
                if (song.artist) searchTerms.push(song.artist);
                if (song.album) searchTerms.push(song.album);

                if (searchTerms.length === 0) {
                    this.logger.warn('Skipping song with no searchable fields', song);
                    continue;
                }

                const searchQuery = searchTerms.join(' ');
                const searchResults = await this.searchTracks({
                    query: searchQuery,
                    limit: 1,
                });

                if (searchResults.length > 0) {
                    const track = searchResults[0];
                    trackIds.push(track.id);
                    // Collect unique artist IDs
                    track.artists.forEach((artist: { id: string }) => {
                        artistIds.add(artist.id);
                    });
                } else {
                    this.logger.warn(`No results found for: ${searchQuery}`);
                }
            } catch (error) {
                this.logger.warn(`Failed to search for song: ${JSON.stringify(song)}`, error);
            }
        }

        if (trackIds.length === 0 && artistIds.size === 0) {
            throw new BadRequestException(
                'Could not find any matching tracks or artists. Please check your song information.',
            );
        }

        // Apply diversity mode settings
        const diversityParams = this.getDiversityParams(mode, trackIds, Array.from(artistIds));

        // Get recommendations with diversity params
        const recQuery: RecommendationQueryDto & Record<string, any> = {
            seed_tracks: diversityParams.seed_tracks,
            seed_artists: diversityParams.seed_artists,
            limit,
            target_danceability: diversityParams.target_danceability,
            target_popularity: diversityParams.target_popularity,
            ...diversityParams.additionalParams,
        };

        const recommendations = await this.getRecommendations(recQuery);

        return {
            mode,
            inputSongs: request.songs.length,
            recommendations: recommendations.tracks,
            seeds: recommendations.seeds,
        };
    }

    /**
     * Get diversity parameters based on mode
     */
    private getDiversityParams(
        mode: 'strict' | 'normal' | 'diverse',
        trackIds: string[],
        artistIds: string[],
    ): {
        seed_tracks?: string;
        seed_artists?: string;
        target_danceability?: number;
        target_popularity?: number;
        additionalParams: Record<string, any>;
    } {
        const params: {
            seed_tracks?: string;
            seed_artists?: string;
            target_danceability?: number;
            target_popularity?: number;
            additionalParams: Record<string, any>;
        } = {
            additionalParams: {},
        };

        switch (mode) {
            case 'strict':
                // Strict: Use fewer seeds, tighter ranges, specific targets
                params.seed_tracks = trackIds.slice(0, 2).join(',');
                if (artistIds.length > 0) {
                    params.seed_artists = artistIds.slice(0, 1).join(',');
                }
                params.target_danceability = 0.5;
                params.target_popularity = 50;
                // Narrow ranges for strict mode
                params.additionalParams = {
                    min_danceability: 0.4,
                    max_danceability: 0.6,
                    min_popularity: 40,
                    max_popularity: 60,
                    min_energy: 0.4,
                    max_energy: 0.6,
                };
                break;

            case 'normal':
                // Normal: Balanced approach
                params.seed_tracks = trackIds.slice(0, 3).join(',');
                if (artistIds.length > 0) {
                    params.seed_artists = artistIds.slice(0, 2).join(',');
                }
                params.target_danceability = 0.5;
                params.target_popularity = 50;
                // Moderate ranges
                params.additionalParams = {
                    min_danceability: 0.3,
                    max_danceability: 0.7,
                    min_popularity: 30,
                    max_popularity: 70,
                    min_energy: 0.3,
                    max_energy: 0.7,
                };
                break;

            case 'diverse':
                // Diverse: More seeds, wider ranges, more variety
                params.seed_tracks = trackIds.slice(0, 5).join(',');
                if (artistIds.length > 0) {
                    params.seed_artists = artistIds.slice(0, 3).join(',');
                }
                params.target_danceability = 0.5;
                params.target_popularity = 50;
                // Wide ranges for maximum diversity
                params.additionalParams = {
                    min_danceability: 0.2,
                    max_danceability: 0.8,
                    min_popularity: 20,
                    max_popularity: 80,
                    min_energy: 0.2,
                    max_energy: 0.8,
                    min_valence: 0.2,
                    max_valence: 0.8,
                };
                break;
        }

        return params;
    }
}
