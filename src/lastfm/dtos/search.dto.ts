export class LastfmSearchTrackDto {
    name: string;
    artist: string;
    url: string;
    streamable: string;
    listeners: string;
    image: Array<{
        '#text': string;
        size: string;
    }>;
    mbid?: string;
}

export class LastfmSearchResultDto {
    trackmatches: {
        track: LastfmSearchTrackDto[];
    };
    '@attr': {
        for: string;
        page: string;
        perPage: string;
        totalPages: string;
        total: string;
    };
}

