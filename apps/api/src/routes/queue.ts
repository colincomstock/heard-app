import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";
import type { Bindings, AuthVariables } from "../types/bindings";
import keysToCamelCase from "../lib/case";

export const queueRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

queueRoute.get("/", async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseClient(c.env);

    const { data: posts, error: postsError } = await supabase
        .from('post')
        .select(`
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
            ),
            post_comment (
                id,
                user_id,
                profile:profile!post_comment_user_id_fkey (
                    id,
                    handle,
                    display_name,
                    pfp_url
                ),
                body,
                like_count,
                created_at,
                updated_at
            )
        `)
        .eq('user_id', userId)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

    if (postsError) {
        return c.json({ error: "Failed to fetch queue", details: postsError }, 500);
    }

    const formattedPosts = posts?.map(post => {
        return {
            id: post.id,
            caption: post.caption,
            like_count: post.like_count,
            comment_count: post.comment_count,
            visibility: post.visibility,
            created_at: post.created_at,
            updated_at: post.updated_at,
            profile: (() => {
                const profile = Array.isArray(post.profile) ? post.profile[0] : post.profile;
                if (!profile) return null;
                return {
                    id: profile.id,
                    handle: profile.handle,
                    display_name: profile.display_name,
                    pfp_url: profile.pfp_url,
                };
            })(),
            track: (() => {
                const track = Array.isArray(post.track) ? post.track[0] : post.track;
                if (!track) return null;
                return {
                    id: track.id,
                    title: track.title,
                    artist_name: track.artist_name,
                    artist_names: track.artist_name.split(',').map((name: string) => name.trim()),
                    cover_url: track.cover_url,
                    apple_music_url: track.apple_music_url,
                    spotify_url: track.spotify_url,
                    song_preview_url: track.song_preview_url,
                    apple_bg_color: track.apple_bg_color,
                    apple_text_color_1: track.apple_text_color_1 ?? '#000000',
                    apple_text_color_2: track.apple_text_color_2 ?? '#000000',
                    apple_text_color_3: track.apple_text_color_3 ?? '#000000',
                    apple_text_color_4: track.apple_text_color_4 ?? '#000000',
                    genres:
                    (Array.isArray(track.track_genre) ? track.track_genre : [])
                        .map((trackGenre: any) => {
                        const genre = Array.isArray(trackGenre.genre) ? trackGenre.genre[0] : trackGenre.genre;
                        if (!genre) return null;
                            return {
                                id: genre.id,
                                name: genre.name,
                                slug: genre.slug,
                                badge_color: genre.badge_color,
                            };
                            })
                        .filter(Boolean) ?? [],
                    comments: (Array.isArray(post.post_comment) ? post.post_comment : []).map((comment: any) => {
                        const commentProfile = Array.isArray(comment.profile) ? comment.profile[0] : comment.profile;
                        return {
                            id: comment.id,
                            user_id: comment.user_id,
                            body: comment.body,
                            like_count: comment.like_count,
                            created_at: comment.created_at,
                            updated_at: comment.updated_at,
                            profile: commentProfile ? {
                                id: commentProfile.id,
                                handle: commentProfile.handle,
                                display_name: commentProfile.display_name,
                                pfp_url: commentProfile.pfp_url,
                            } : null,
                        };
                    }) ?? [],

                };
            })(),
        };
    }) ?? [];

    return c.json(
        keysToCamelCase({
            posts: formattedPosts,
        })
    );
});
