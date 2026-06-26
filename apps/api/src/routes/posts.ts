import { Hono } from "hono";
import type { Bindings, AuthVariables } from "../types/bindings";
import { createSupabaseClient } from "../lib/supabase";
import { ensureTrackFromAppleMusicId } from "../services/ensureTrackFromAppleMusicId";
import { searchTracksToPost } from "../services/searchTracksToPost";
import { searchAppleMusicTracksByQuery } from "../services/getAppleMusicResource";
import createUserPost from "../services/createUserPost";

export const PostsRoute = new Hono<{ 
    Bindings: Bindings, 
    Variables: AuthVariables 
}>();

// Endpoint to create a new post
PostsRoute.post("/", async (c) => {
    try {
        const { caption, appleMusicTrackId } = await c.req.json();
        
        if (!appleMusicTrackId) {
            return c.json({ error: "Missing appleMusicTrackId" }, 400);
        }
        
        const supabase = createSupabaseClient(c.env);
        
        const track = await ensureTrackFromAppleMusicId({
            supabase,
            env: c.env,
            appleMusicTrackId,
        });

        const userPost = await createUserPost({
            supabase,
            userId: c.get("userId"),
            trackId: track.id,
            caption,
        });

        return c.json({
            message: "Post created successfully",
            userPost,
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

// Endpoint to search for tracks to post
PostsRoute.get("/search-tracks", async (c) => {
    try {
        const rawTerm = c.req.query("term");
        if (!rawTerm) {
            return c.json({ error: "Missing search term" }, 400);
        }
        const term = rawTerm.replace(/\+/g, " ");
    
        const results = await searchTracksToPost({ env: c.env, query: term });

        return c.json({ tracks: results });

    } catch (error) {
        console.error("Search error:", error);
        
        return c.json(
            { 
                error: "Search failed", detail: error instanceof Error ? error.message : String(error) }, 500);
    }
});

PostsRoute.get("/search-tracks-test", async (c) => {
    try {
        const rawTerm = c.req.query("term");
        if (!rawTerm) {
            return c.json({ error: "Missing search term" }, 400);
        }
        const term = rawTerm.replace(/\+/g, " ");
        const res = await searchAppleMusicTracksByQuery(c.env, term);
        return c.json({ tracks: res });
    } catch (error) {
        console.error("Search error:", error);
        return c.json(
            {
                error: "Search failed", detail: error instanceof Error ? error.message : String(error) }, 500);
    }
});