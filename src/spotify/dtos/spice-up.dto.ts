import { TrackDto } from './track.dto';

export class SongInputDto {
    name?: string;
    artist?: string;
    album?: string;
}

export class SpiceUpRequestDto {
    songs: SongInputDto[];
    limit?: number;
    mode?: 'strict' | 'normal' | 'diverse';
}

export class SpiceUpResponseDto {
    mode: string;
    inputSongs: number;
    recommendations: TrackDto[];
    seeds: Array<{
        id: string;
        type: string;
        initialPoolSize: number;
    }>;
}

