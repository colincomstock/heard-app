export type TrackSearchResult = {
    id: string;
    name: string;
    artistName: string;
    coverUrl: string;
    previewUrl: string | null;
    appleMusicUrl: string;
    genres: string[];
};

export type TrackSearchResultResponse = {
    tracks: TrackSearchResult[];
};