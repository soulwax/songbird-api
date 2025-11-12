// File: src/spotify/dtos/track.dto.ts

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TrackArtistDto {
    @ApiProperty({ description: 'Artist name' })
    name: string;

    @ApiProperty({ description: 'Spotify artist ID' })
    id: string;
}

export class TrackAlbumDto {
    @ApiProperty({ description: 'Album name' })
    name: string;
}

export class TrackExternalUrlsDto {
    @ApiProperty({ description: 'Spotify URL for the track' })
    spotify: string;
}

export class TrackDto {
    @ApiProperty({ description: 'Spotify track ID' })
    id: string;

    @ApiProperty({ description: 'Track title' })
    name: string;

    @ApiProperty({ type: [TrackArtistDto], description: 'List of track artists' })
    artists: TrackArtistDto[];

    @ApiProperty({ type: TrackAlbumDto, description: 'Album information' })
    album: TrackAlbumDto;

    @ApiProperty({ description: 'Popularity score (0-100)' })
    popularity: number;

    @ApiPropertyOptional({ description: '30 second preview MP3 URL' })
    preview_url: string | null;

    @ApiProperty({ type: TrackExternalUrlsDto, description: 'External URLs for the track' })
    external_urls: TrackExternalUrlsDto;
}
