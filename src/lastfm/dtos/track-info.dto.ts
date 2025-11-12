// File: src/lastfm/dtos/track-info.dto.ts

export class TrackInfoDto {
    name: string;
    artist: string;
    album?: string;
    url: string;
    listeners?: number;
    playcount?: number;
    duration?: number;
    wiki?: {
        published?: string;
        summary?: string;
        content?: string;
    };
    toptags?: {
        tag: Array<{
            name: string;
            url: string;
        }>;
    };
}
