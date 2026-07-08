import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";
import type { Bindings, AuthVariables } from "../types/bindings";
import keysToCamelCase from "../lib/case";

export const meRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

meRoute.get("/", async (c) => {
    const userId = c.get('userId');
    const supabase = createSupabaseClient(c.env);

    const { data: profile, error: profileError } = await supabase
        .from('profile')
        .select(`
            id,
            handle,
            display_name,
            pfp_url,
            bio,
            is_private,
            post_count,
            following_count,
            follower_count,
            created_at,
            updated_at
        `)
        .eq('id', userId)
        .single();
    if (profileError) {
        return c.json({ error: "Failed to fetch profile" }, 500);
    }

    const [postsResult, topGenresResult] = await Promise.all([
        supabase
        .from('post')
        .select(`
            id,
            caption,
            like_count,
            comment_count,
            visibility,
            created_at,
            updated_at,
            track (
            id,
            title,
            artist_name,
            cover_url,
            cover_color_vibrant,
            cover_color_dark_vibrant,
            cover_color_dark_contrast,
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
        `)
        .eq('user_id', profile.id)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(30),

        supabase.rpc('get_user_top_genres', {
            target_user_id: userId,
            result_limit: 3,
        }),
    ]);

    const { data: posts, error: postsError } = postsResult;

    const { data: topGenres, error: topGenresError } = topGenresResult;

    if (postsError) {
        return c.json({ error: postsError?.message || 'Posts not found' }, 500);
    }
    
    if (topGenresError) {
        return c.json({ error: topGenresError?.message || 'Failed to fetch top genres' }, 500);
    }

    const postIds = posts?.map(post => post.id) || [];

    const likedPostIds = new Set<string>();

    if (postIds.length > 0) {
        const { data: currentUserLikedPosts, error: currentUserLikedPostsError } = await supabase
            .from('post_like')
            .select('post_id')
            .eq('user_id', userId)
            .in('post_id', postIds);
    
        if (currentUserLikedPostsError) {
            return c.json({ error: "Failed to fetch liked posts", details: currentUserLikedPostsError }, 500);
    
        }

        for (const like of currentUserLikedPosts ?? []) {
            likedPostIds.add(like.post_id);
        }
    }

    const formattedPosts = posts?.map(post => {
    return {
        id: post.id,
        caption: post.caption,
        like_count: post.like_count,
        comment_count: post.comment_count,
        created_at: post.created_at,
        updated_at: post.updated_at,
        visibility: post.visibility,
        liked_by_me: likedPostIds.has(post.id),
        track: (() => {
        const track = Array.isArray(post.track) ? post.track[0] : post.track;
        if (!track) return null;
        return {
            id: track.id,
            title: track.title,
            artist_name: track.artist_name,
            artist_names: track.artist_name.split(',').map((name: string) => name.trim()),
            cover_url: track.cover_url,
            cover_color_vibrant: track.cover_color_vibrant,
            cover_color_dark_vibrant: track.cover_color_dark_vibrant,
            cover_color_dark_contrast: track.cover_color_dark_contrast,
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
        };
        })(),
    };
    }) ?? [];


    return c.json(
        keysToCamelCase({
            profile: {
                ...profile,
                top_genres: topGenres ?? [],
            },
            posts: formattedPosts,
        })
    );
});