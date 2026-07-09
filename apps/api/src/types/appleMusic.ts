export type AppleMusicGenreRef = {
    id: string;
    type: "genres";
    href: string;
    attributes: {
        name: string;
        parentId?: string;
        parentName?: string;
    };
};

export type AppleMusicArtwork = {
    url: string;
    bgColor: string;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
};

export type AppleMusicSong = {
    id: string;
    type: "songs";
    href: string;
    attributes: {
        name: string;
        albumName: string;
        artistName: string;
        artwork: AppleMusicArtwork;
        isrc?: string;
        url: string;
        previews?: { url: string }[];
        durationInMillis?: number;
        releaseDate?: string;
        genreNames?: string[];
    };
    relationships: {
        genres: {
            data: AppleMusicGenreRef[];
        };
    };
};

export type AppleMusicDataResponse<T> = {
    data: T[];
};

export type AppleMusicSearchResponse = {
    results: {
        songs?: {
            data: AppleMusicSong[];
        };
    };
};

export type NormalizedAppleGenre = {
    id: string;
    name: string;
    parentAppleGenreId: string | undefined;
    parentAppleGenreName: string | undefined;
};