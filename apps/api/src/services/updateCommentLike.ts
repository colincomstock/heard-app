import type { SupabaseClient } from "@supabase/supabase-js";

type likeCommentArgs = {
    supabase: SupabaseClient;
    userId: string;
    commentId: string;
};

export async function LikeComment({
    supabase,
    userId,
    commentId,
}: likeCommentArgs) {
    const commentLikeResult = await supabase
    .from('comment_like')
    .upsert(
        { user_id: userId, comment_id: commentId },
        { onConflict: 'comment_id,user_id', ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle();

    if (commentLikeResult.error) {
        throw commentLikeResult.error;
    }

    return { commentLike: commentLikeResult.data };
};

export async function UnlikeComment({
    supabase,
    userId,
    commentId,
}: likeCommentArgs) {
    const commentUnlikeResult = await supabase
    .from('comment_like')
    .delete()
    .eq('user_id', userId)
    .eq('comment_id', commentId)
    .select("*")
    .maybeSingle();

    if (commentUnlikeResult.error) {
        throw commentUnlikeResult.error;
    }

    return { commentUnlike: commentUnlikeResult.data };
};