import type { Bindings } from "../types/bindings";
import { getAppleMusicGenreById } from "./getAppleMusicResource";

type EnsureGenreArgs = {
    supabase: any;
    env: Bindings;
    appleGenre: NormalizedAppleGenre;
};

type DbGenre = {
    id: string;
    name: string;
    slug: string;
    apple_genre_id: string;
    apple_parent_genre_id: string | null;
    parent_genre_id: string | null;
    root_genre_id: string | null;
    depth: number;
    badge_color: string | null;
    color_status: "manual" | "auto" | "inherited";
    needs_review: boolean;
    created_at: string;
    updated_at: string;
};

type AppleMusicGenreRef = {
    id: string;
    type: "genres";
    href: string;
    attributes: {
        name: string;
        parentId?: string;
        parentName?: string;
    };
};

type NormalizedAppleGenre = {
    id: string;
    name: string;
    parentAppleGenreId: string | undefined;
    parentAppleGenreName: string | undefined;
};

const MUSIC_GENRE_ID = "34"; // The Apple Music genre ID for the top-level "Music" genre

const FALLBACK_ROOT_COLORS = [
    "#F97316",
    "#8B5CF6",
    "#EAB308",
    "#EC4899",
];

function normalizeAppleMusicGenre(raw: AppleMusicGenreRef): NormalizedAppleGenre {
    return {
        id: raw.id,
        name: raw.attributes.name,
        parentAppleGenreId: raw.attributes.parentId,
        parentAppleGenreName: raw.attributes.parentName,
    };
}

export async function ensureGenreByAppleGenre({
    supabase,
    env,
    appleGenre,
}: EnsureGenreArgs) {

    const missingGenres: NormalizedAppleGenre[] = [];
    let currentGenre = appleGenre;
    let existingAncestor: DbGenre | null = null;

    while (!existingAncestor) {
        const { data: existingGenre, error: genreLookupError } = await supabase
            .from('genre')
            .select('*')
            .eq('apple_genre_id', currentGenre.id)
            .maybeSingle();

        if (genreLookupError) {
            console.error("DB Genre lookup failed:", genreLookupError);
            throw new Error("Failed to check whether genre already exists");
        }

        if (existingGenre) {
            existingAncestor = existingGenre;
            break;
        }

        missingGenres.push(currentGenre);

        if (!currentGenre.parentAppleGenreId) {
            throw new Error(`Genre ${currentGenre.name} is missing parent genre info`);
        }

        if (currentGenre.parentAppleGenreId === MUSIC_GENRE_ID) {
            const {data: musicGenre, error: musicGenreError } = await supabase
                .from('genre')
                .select('*')
                .eq('apple_genre_id', MUSIC_GENRE_ID)
                .single();
            
            if (musicGenreError || !musicGenre) {
                console.error("Music genre lookup failed:", musicGenreError);
                throw new Error("Failed to find the top-level Music genre in the database");
            }

            existingAncestor = musicGenre;
            break;
        }

        const rawParentGenre = await getAppleMusicGenreById(
            env, 
            currentGenre.parentAppleGenreId
        );

        if (!rawParentGenre) {
            throw new Error(`Parent genre with ID ${currentGenre.parentAppleGenreId} not found in Apple Music`);
        }

        currentGenre = normalizeAppleMusicGenre(rawParentGenre);
    }

    if (!existingAncestor) {
        throw new Error("Failed to find an existing ancestor genre in the database");
    }

    let parentGenre: DbGenre = existingAncestor;

    for (const missingGenre of missingGenres.reverse()) {
        const now = new Date().toISOString();

        const isRootGenre = parentGenre.apple_genre_id === MUSIC_GENRE_ID;

        let badgeColor: string | null;
        let colorStatus: "manual" | "auto" | "inherited";
        let needsReview: boolean;
        let rootGenreId: string | null;

        if (isRootGenre) {
            const fallbackColor = FALLBACK_ROOT_COLORS[Math.floor(Math.random() * FALLBACK_ROOT_COLORS.length)];

            badgeColor = fallbackColor;
            colorStatus = "auto";
            needsReview = true;
            rootGenreId = null;
        } else {
            badgeColor = parentGenre.badge_color;
            colorStatus = "inherited";
            needsReview = false;
            rootGenreId = parentGenre.root_genre_id;
        }

        const { data: insertedGenre, error: insertError } = await supabase
            .from('genre')
            .insert({
                name: missingGenre.name,
                slug: slugifyGenreName(missingGenre.name),
                apple_genre_id: missingGenre.id,
                apple_parent_genre_id: missingGenre.parentAppleGenreId,
                parent_genre_id: parentGenre.id,
                root_genre_id: rootGenreId,
                depth: parentGenre.depth + 1,
                badge_color: badgeColor,
                color_status: colorStatus,
                needs_review: needsReview,
                created_at: now,
                updated_at: now,
            })
            .select("*")
            .single();
        
        if (insertError || !insertedGenre) {
            console.error(`Failed to insert genre ${missingGenre.name}:`, insertError);
            throw new Error(`Failed to insert genre ${missingGenre.name}: ${insertError?.message}`);
        }

        if (isRootGenre) {
            const { data: updatedRootGenre, error: updateError } = await supabase
                .from('genre')
                .update({
                    root_genre_id: insertedGenre.id,
                    updated_at: now,
                })
                .eq('id', insertedGenre.id)
                .select("*")
                .single();
            
            if (updateError || !updatedRootGenre) {
                console.error(`Failed to update root genre ID for ${insertedGenre.name}:`, updateError);
                throw new Error(`Failed to update root genre ID for ${insertedGenre.name}: ${updateError?.message}`);
            }

            parentGenre = updatedRootGenre;
            continue;
        }

        parentGenre = insertedGenre;
    }

    return parentGenre;  
}

function slugifyGenreName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}