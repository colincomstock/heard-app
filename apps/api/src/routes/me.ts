import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";
import type { Bindings, AuthVariables } from "../types/bindings";
import keysToCamelCase from "../lib/case";
import getUserLikedPosts from "../services/getUserLikedPosts";
import getMe from "../services/getMe";
import { createUserProfile, getUserProfile } from "../services/userProfile";
import validatePageSize from "../lib/validatePageSize";

export const MeRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

const handlePattern = /^[a-z0-9_]{3,30}$/;
const maxDisplayNameLength = 60;

MeRoute.get('/profile', async (c) => {
    try {
        const { supabase, userId } = c.var;
        const profile = await getUserProfile({ supabase, userId });
        return c.json({ profile });
    } catch (error) {
        console.error('Error fetching onboarding profile:', error);
        return c.json({ error: 'Could not load your profile.' }, 500);
    }
});

MeRoute.post('/profile', async (c) => {
    const input: unknown = await c.req.json().catch(() => null);
    if (!input || typeof input !== 'object' || !('handle' in input) || !('displayName' in input)) {
        return c.json({ error: 'Handle and display name are required.' }, 400);
    }

    const handle = typeof input.handle === 'string' ? input.handle.trim().toLowerCase() : '';
    const displayName = typeof input.displayName === 'string' ? input.displayName.trim() : '';
    if (!handlePattern.test(handle)) {
        return c.json({ error: 'Use 3–30 letters, numbers, or underscores for your handle.' }, 400);
    }
    if (!displayName || Array.from(displayName).length > maxDisplayNameLength || displayName.includes('\0')) {
        return c.json({ error: 'Enter a display name between 1 and 60 characters.' }, 400);
    }

    try {
        const { supabase, userId } = c.var;
        const result = await createUserProfile({ supabase, userId, handle, displayName });
        if (result.outcome === 'handle_taken') {
            return c.json({ code: 'HANDLE_TAKEN', error: 'That handle is already taken.' }, 409);
        }
        if (result.outcome === 'profile_exists') {
            return c.json({ code: 'PROFILE_EXISTS', error: 'You already have a profile.' }, 409);
        }
        return c.json({ profile: result.profile }, result.outcome === 'created' ? 201 : 200);
    } catch (error) {
        console.error('Error creating profile:', error);
        return c.json({ error: 'Could not create your profile.' }, 500);
    }
});

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

        const limit = validatePageSize(c.req.query('limit'), {
            defaultSize: 10,
            maxSize: 20,
        });
        const cursor = c.req.query('cursor') ?? null;
        const result = await getUserLikedPosts({ supabase, userId, limit, cursor });

        return c.json(
            keysToCamelCase(result)
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
