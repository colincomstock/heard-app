import { firstOrNull } from "../lib/relations";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

type GetUserLikedPostsArgs = {
    supabase: SupabaseClient<Database>;
    userId: string;
    limit: number;
    cursor?: string | null;
};

export default async function getUserLikedPosts({ 
    supabase, 
    userId,
    limit,
    cursor,
}: GetUserLikedPostsArgs) {
    let query = supabase
        .from('post_like')
        .select(`
            created_at,
            post (
                id,
                caption,
                like_count,
                comment_count,
                visibility,
                created_at,
                updated_at,
                profile:profile!post_user_id_fkey (
                    id,
                    handle,
                    display_name,
                    pfp_url
                ),
                track (
                    id,
                    title,
                    artist_name,
                    cover_url,
                    song_preview_url,
                    apple_music_url,
                    spotify_url,
                    apple_bg_color,
                    apple_text_color_1,
                    apple_text_color_2,
                    apple_text_color_3,
                    apple_text_color_4,
                    track_genre (
                        genre (
                            id,
                            name,
                            slug,
                            badge_color
                        )
                    )
                )
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit + 1);
    
    if (cursor) {
        query = query.lt('created_at', cursor);
    }
    
    const { data: likedPosts, error: likedPostsError } = await query;

    if (likedPostsError) {
        throw new Error(`Failed to fetch liked posts: ${likedPostsError.message}`);
    }

    const rows = likedPosts ?? [];
    const pageRows = rows.slice(0, limit);
    const hasMore = rows.length > limit;
    const nextCursor = hasMore 
        ? pageRows[pageRows.length - 1]?.created_at ?? null 
        : null;

    const formattedLikedPosts = pageRows.map(likedPost => {
        const post = firstOrNull(likedPost.post);
        if (!post) return null;

        const track = firstOrNull(post.track);
        const profile = firstOrNull(post.profile);

        return {
            id: post.id,
            caption: post.caption,
            like_count: post.like_count,
            comment_count: post.comment_count,
            visibility: post.visibility,
            created_at: post.created_at,
            updated_at: post.updated_at,
            liked_by_me: true,
            track: track 
                ? {
                    id: track.id,
                    title: track.title,
                    artist_name: track.artist_name,
                    cover_url: track.cover_url,
                    song_preview_url: track.song_preview_url,
                    apple_music_url: track.apple_music_url,
                    spotify_url: track.spotify_url,
                    apple_bg_color: track.apple_bg_color,
                    apple_text_color_1: track.apple_text_color_1,
                    apple_text_color_2: track.apple_text_color_2,
                    apple_text_color_3: track.apple_text_color_3,
                    apple_text_color_4: track.apple_text_color_4,
                    genres: track.track_genre
                        .map((trackGenre) => {
                            const genre = firstOrNull(trackGenre.genre);

                            return genre ? {
                                id: genre.id,
                                name: genre.name,
                                slug: genre.slug,
                                badge_color: genre.badge_color,
                            } : null;
                        })
                        .filter(Boolean),
                } 
            : null,
            profile: profile 
                ? {
                    id: profile.id,
                    handle: profile.handle,
                    display_name: profile.display_name,
                    pfp_url: profile.pfp_url,
                } : null,
        };
    }).filter(Boolean);

    return { liked_posts: formattedLikedPosts, next_cursor: nextCursor };
};
