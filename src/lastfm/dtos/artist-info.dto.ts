export class ArtistInfoDto {
    name: string;
    mbid?: string;
    url: string;
    image?: Array<{
        '#text': string;
        size: string;
    }>;
    streamable?: string;
    ontour?: string;
    stats?: {
        listeners: string;
        playcount: string;
    };
    similar?: {
        artist: Array<{
            name: string;
            url: string;
            image: Array<{
                '#text': string;
                size: string;
            }>;
        }>;
    };
    tags?: {
        tag: Array<{
            name: string;
            url: string;
        }>;
    };
    bio?: {
        links?: {
            link: {
                '#text': string;
                rel: string;
                href: string;
            };
        };
        published?: string;
        summary?: string;
        content?: string;
    };
}

