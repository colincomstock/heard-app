export type SpotifyTrackMatch = {
    spotifyTrackId: string;
    spotifyUrl: string;
};

export type SpotifyTrackSearchItem = {
    id: string;
    external_urls?: {
        spotify?: string;
    };
};

export type SpotifySearchResponse = {
    tracks?: {
        items?: SpotifyTrackSearchItem[];
    };
};