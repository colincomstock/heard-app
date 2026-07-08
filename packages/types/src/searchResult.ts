export type TrackSearchResult = {
    id: string;
    name: string;
    artistName: string;
    coverUrl: string;
    previewUrl: string;
    appleMusicUrl: string;
    genres: string[];
};

export type TrackSearchResultResponse = {
    tracks: TrackSearchResult[];
};