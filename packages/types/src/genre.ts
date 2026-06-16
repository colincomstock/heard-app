export type Genre = {
  id: string;
  name: string;
  slug: string;
  badgeColor: string;
};

export type GenreCore = {
  id: string;
  name: string;
  slug: string;
  badgeColor: string;
}

export type GenreProfile = GenreCore & {
  postCount: number;
}
