import type { SupabaseClient } from "@supabase/supabase-js";

type LikeCommentArgs = {
    supabase: SupabaseClient;
    userId: string;
    commentId: string;
};

export async function LikeComment({
    supabase,
    userId,
    commentId,
}: LikeCommentArgs) {
    const commentLikeResult = await supabase
    .from('comment_like')
    .upsert(
        { user_id: userId, comment_id: commentId },
        { onConflict: 'comment_id,user_id', ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle();

    if (commentLikeResult.error) {
        console.error("Failed to like comment:", commentLikeResult.error);
        throw new Error("Failed to like comment");
    }

    return { commentLike: commentLikeResult.data };
};

export async function UnlikeComment({
    supabase,
    userId,
    commentId,
}: LikeCommentArgs) {
    const commentUnlikeResult = await supabase
    .from('comment_like')
    .delete()
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .select("*")
    .maybeSingle();

    if (commentUnlikeResult.error) {
        console.error("Failed to unlike comment:", commentUnlikeResult.error);
        throw new Error("Failed to unlike comment");
    }

    return { commentUnlike: commentUnlikeResult.data };
};