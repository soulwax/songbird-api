// File: src/lastfm/dtos/spice-up.dto.ts

export class LastfmSongInputDto {
    name?: string;
    artist?: string;
    album?: string;
}

export class LastfmSpiceUpRequestDto {
    songs: LastfmSongInputDto[];
    limit?: number;
    mode?: 'strict' | 'normal' | 'diverse';
}

export class LastfmSpiceUpResponseDto {
    mode: string;
    inputSongs: number;
    recommendations: Array<{
        name: string;
        artist: string;
        url: string;
        match?: number;
        mbid?: string;
    }>;
    foundSongs: number;
}
