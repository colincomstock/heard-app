import { Hono } from "hono";
import type { Bindings, AuthVariables } from "../types/bindings";
import { createSupabaseClient } from "../lib/supabase";
import { ensureTrackFromAppleMusicId } from "../services/tracks";

export const postRoute = new Hono<{ 
    Bindings: Bindings, 
    Variables: AuthVariables 
}>();

postRoute.post("/", async (c) => {
    try {
        const { caption, appleMusicTrackId } = await c.req.json();
        
        if (!caption || !appleMusicTrackId) {
            return c.json({ error: "Missing caption or appleMusicTrackId" }, 400);
        }
        
        const supabase = createSupabaseClient(c.env);
        
        const track = await ensureTrackFromAppleMusicId({
            supabase,
            env: c.env,
            appleMusicTrackId,
        });

        return c.json({
            message: "Song created successfully",
            caption,
            track,
        });
    } catch (error) {
        console.error("Error creating post:", error);

        return c.json(
            {
                error: error instanceof Error ? error.message : "Create post failed",
            },
            500
        );
    }
});