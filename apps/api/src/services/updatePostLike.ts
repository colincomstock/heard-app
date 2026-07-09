import type { SupabaseClient } from "@supabase/supabase-js";

type LikePostArgs = {
    supabase: SupabaseClient;
    userId: string;
    postId: string;
};

export async function likePost({
    supabase,
    userId,
    postId,
}: LikePostArgs) {
    const postLikeResult = await supabase
        .from('post_like')
        .upsert(
            { user_id: userId, post_id: postId },
            { onConflict: 'post_id,user_id', ignoreDuplicates: true }
        )
        .select("*")
        .maybeSingle();

    if (postLikeResult.error) {
        console.error("Failed to like post:", postLikeResult.error);
        throw new Error("Failed to like post");
    }

    return { postLike: postLikeResult.data };
};

export async function unlikePost({
    supabase,
    userId,
    postId,
}: LikePostArgs) {
    const postUnlikeResult = await supabase
        .from('post_like')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId)
        .select("*")
        .maybeSingle();

    if (postUnlikeResult.error) {
        console.error("Failed to unlike post:", postUnlikeResult.error);
        throw new Error("Failed to unlike post");
    }

    return { postUnlike: postUnlikeResult.data };
};
