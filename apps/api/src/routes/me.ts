import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";
import type { Bindings, AuthVariables } from "../types/bindings";
import keysToCamelCase from "../lib/case";
import getUserLikedPosts from "../services/getUserLikedPosts";
import getMe from "../services/getMe";

export const MeRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

// Endpoint to fetch the authenticated user's profile and posts
MeRoute.get("/", async (c) => {
    try {    
        const userId = c.get('userId');
        const supabase = createSupabaseClient(c.env);

        const { profile, posts } = await getMe({ supabase, userId });

        return c.json(
            keysToCamelCase({
                profile, posts
            })
        );
    } catch (error) {
        console.error("Error fetching user profile and posts:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Failed to fetch user profile and posts",
            },
            500
        );
    }
});

// Endpoint to fetch the liked posts of the authenticated user
MeRoute.get("/liked", async (c) => {
    try {    
        const userId = c.get('userId');
        const supabase = createSupabaseClient(c.env);

        const likedPosts = await getUserLikedPosts({ supabase, userId });

        return c.json(
            keysToCamelCase({
                liked_posts: likedPosts,
            })
        );
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Failed to fetch liked posts",
            },
            500
        );
    }
});
    