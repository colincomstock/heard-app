import { Hono } from "hono";
import type { Bindings, AuthVariables } from "../types/bindings";
import { createSupabaseClient } from "../lib/supabase";
import { LikeComment, UnlikeComment } from "../services/updateCommentLike";

export const CommentsRoute = new Hono<{ 
    Bindings: Bindings, 
    Variables: AuthVariables 
}>();

// Endpoint to like a comment
CommentsRoute.post("/:commentId/like", async (c) => {
    try {
        const commentId = c.req.param("commentId");

        if (!commentId) {
            return c.json({ error: "Missing commentId" }, 400);
        }

        const supabase = createSupabaseClient(c.env);
        const userId = c.get("userId");

        const newCommentLike = await LikeComment({ supabase, userId, commentId });

        return c.json({ message: "Comment liked successfully", newCommentLike });
    
    } catch (error) {
        console.error("Error liking comment:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Like comment failed",
            },
            500
        );
    }
});

// Endpoint to unlike a comment
CommentsRoute.delete("/:commentId/unlike", async (c) => {
    try {
        const commentId = c.req.param("commentId");

        if (!commentId) {
            return c.json({ error: "Missing commentId" }, 400);
        }

        const supabase = createSupabaseClient(c.env);
        const userId = c.get("userId");

        const deletedCommentLike = await UnlikeComment({ supabase, userId, commentId });

        return c.json({ message: "Comment unliked successfully", deletedCommentLike });
    
    } catch (error) {
        console.error("Error unliking comment:", error);
        return c.json(
            {
                error: error instanceof Error ? error.message : "Unlike comment failed",
            },
            500
        );
    }
});