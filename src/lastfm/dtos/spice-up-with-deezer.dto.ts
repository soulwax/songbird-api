// File: src/lastfm/dtos/spice-up-with-deezer.dto.ts

import { LastfmSpiceUpRequestDto } from './spice-up.dto';

export class LastfmSpiceUpWithDeezerRequestDto extends LastfmSpiceUpRequestDto {
    convertToDeezer?: boolean; // Optional flag to convert to Deezer IDs
}

export class LastfmSpiceUpWithDeezerResponseDto {
    mode: string;
    inputSongs: number;
    foundSongs: number;
    recommendations: Array<{
        name: string;
        artist: string;
        url: string;
        match?: number;
        mbid?: string;
        deezerId?: number | null;
    }>;
    deezerConversion?: {
        converted: number;
        total: number;
    };
}
