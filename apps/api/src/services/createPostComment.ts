import type { SupabaseClient } from "@supabase/supabase-js";

type CreatePostCommentArgs = {
    supabase: SupabaseClient;
    userId: string;
    postId: string;
    body: string;
};

export default async function createPostComment({
    supabase,
    userId,
    postId,
    body,
}: CreatePostCommentArgs) {
    try {
        const { data: newComment, error: insertError } = await supabase
            .from('post_comment')
            .insert({
                user_id: userId,
                post_id: postId,
                body: body,
            })
            .select("*")
            .single();
        
        if (insertError || !newComment) {
            console.error("Failed to create comment:", insertError);
            throw new Error("Failed to create comment");
        }

        return newComment;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw new Error("Create comment failed", { cause: error });
    }
};
