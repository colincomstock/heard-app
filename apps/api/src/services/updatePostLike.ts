type LikePostArgs = {
    supabase: any;
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
        .insert({
            user_id: userId,
            post_id: postId,
        })
        .select("*")
        .single();

    if (postLikeResult.error) {
        console.error("Failed to like post:", postLikeResult.error);
        throw new Error("Failed to like post");
    }

    const likeCountResult = await supabase.rpc('increment_post_like_count', { post_id: postId });

    if (likeCountResult.error) {
        console.error("Failed to increment like count for post:", likeCountResult.error);
        throw new Error("Failed to increment like count for post");
    }
    
    return { postLike: postLikeResult.data, likeCount: likeCountResult.data };
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
        .single();

    if (postUnlikeResult.error) {
        console.error("Failed to unlike post:", postUnlikeResult.error);
        throw new Error("Failed to unlike post");
    }

    const likeCountResult = await supabase.rpc('decrement_post_like_count', { post_id: postId });

    if (likeCountResult.error) {
        console.error("Failed to decrement like count for post:", likeCountResult.error);
        throw new Error("Failed to decrement like count for post");
    }

    return { postUnlike: postUnlikeResult.data, likeCount: likeCountResult.data };
};
