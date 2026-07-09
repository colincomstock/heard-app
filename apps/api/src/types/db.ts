export type DbGenreCore = {
    id: string;
    name: string;
    slug: string;
    badge_color: string;
};

export type TrackGenreRow = {
    genre: DbGenreCore | DbGenreCore[] | null;
};