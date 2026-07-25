import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";
import type { Bindings, AuthVariables } from "../types/bindings";
import keysToCamelCase from "../lib/case";
import type { TrackGenreRow } from "../types/db";
import getQueue from "../services/getQueue";

export const QueueRoute = new Hono<{ Bindings: Bindings, Variables: AuthVariables }>();

QueueRoute.get("/", async (c) => {
    try {
        const userId = c.get('userId');
        const supabase = createSupabaseClient(c.env);

        const posts = await getQueue({ supabase, userId });

        return c.json(
            keysToCamelCase({
                posts,
            })
        );
    } catch (error) {
        console.error("Error fetching queue posts:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Failed to fetch queue posts",
            },
            500
        );
    }
});
