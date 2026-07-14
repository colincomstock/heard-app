import { Hono } from "hono";
import type { Bindings, AuthVariables } from "../types/bindings";
import { createSupabaseClient } from "../lib/supabase";
import { ensureTrackFromAppleMusicId } from "../services/ensureTrackFromAppleMusicId";
import { searchTracksToPost } from "../services/searchTracksToPost";
import { searchAppleMusicTracksByQuery } from "../services/getAppleMusicResource";
import createUserPost from "../services/createUserPost";
import { likePost, unlikePost } from "../services/updatePostLike";
import createPostComment from "../services/createPostComment";

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

// Endpoint to like a post
PostsRoute.post("/:postId/like", async (c) => {
    try {
        const postId = c.req.param("postId");
        if (!postId) {
            return c.json({ error: "Missing postId" }, 400);
        }

        const supabase = createSupabaseClient(c.env);
        const userId = c.get("userId");

        const newLike = await likePost({ supabase, userId, postId });

        return c.json({ message: "Post liked successfully", newLike });

    } catch (error) {
        console.error("Error liking post:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Like post failed",
            },
            500
        );
    }
});

// Endpoint to unlike a post
PostsRoute.delete("/:postId/unlike", async (c) => {
    try {
        const postId = c.req.param("postId");
        if (!postId) {
            return c.json({ error: "Missing postId" }, 400);
        }

        const supabase = createSupabaseClient(c.env);
        const userId = c.get("userId");

        const newUnlike = await unlikePost({ supabase, userId, postId });

        return c.json({ message: "Post unliked successfully", newUnlike });

    } catch (error) {
        console.error("Error unliking post:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Unlike post failed",
            },
            500
        );
    }
});

// Endpoint to create a comment on a post
PostsRoute.post("/:postId/add-comment", async (c) => {
    try {
        const postId = c.req.param("postId");
        if (!postId) {
            return c.json({ error: "Missing postId" }, 400);
        }

        const { body } = await c.req.json();

        if (!body) {
            return c.json({ error: "Missing comment body" }, 400);
        }

        const supabase = createSupabaseClient(c.env);
        const userId = c.get("userId");

        const newComment = await createPostComment({ 
            supabase,
            userId,
            postId,
            body
        });

        return c.json({ message: "Comment created successfully", newComment });

    } catch (error) {
        console.error("Error creating comment:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Create comment failed",
            },
            500
        );
    }
});
        
