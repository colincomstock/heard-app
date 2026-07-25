import { firstOrNull } from "../lib/relations";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

type GetUserLikedPostsArgs = {
    supabase: SupabaseClient<Database>;
    userId: string;
};

export default async function getUserLikedPosts({ supabase, userId }: GetUserLikedPostsArgs) {
    const { data: likedPosts, error: likedPostsError } = await supabase
        .from('post_like')
        .select(`
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
        .order('created_at', { ascending: false });
    
    if (likedPostsError) {
        throw new Error(`Failed to fetch liked posts: ${likedPostsError.message}`);
    }

    const formattedLikedPosts = likedPosts?.map(likedPost => {
        const post = firstOrNull(likedPost.post);
        if (!post) return null;

        return {
            id: post.id,
            caption: post.caption,
            like_count: post.like_count,
            comment_count: post.comment_count,
            visibility: post.visibility,
            created_at: post.created_at,
            updated_at: post.updated_at,
            liked_by_me: true,
            track: (() => {
                const track = firstOrNull(post?.track);
                if (!track) return null;

                return {
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
                };
            })(),
            profile: (() => {
                const profile = firstOrNull(post?.profile);
                if (!profile) return null;

                return {
                    id: profile.id,
                    handle: profile.handle,
                    display_name: profile.display_name,
                    pfp_url: profile.pfp_url,
                };
            })(),
        };
    }).filter(Boolean);

    return formattedLikedPosts;
};