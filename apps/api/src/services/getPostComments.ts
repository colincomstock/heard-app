import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { firstOrNull } from '../lib/relations';
import type { CommentCursor } from '../lib/commentCursor';

type GetPostCommentsArgs = {
    supabase: SupabaseClient<Database>;
    userId: string;
    postId: string;
    limit: number;
    cursor?: CommentCursor | null;
};

export default async function getPostComments({
    supabase,
    userId,
    postId,
    limit,
    cursor,
}: GetPostCommentsArgs) {
    let query = supabase
        .from('post_comment')
        .select(`
            id,
            body,
            like_count,
            created_at,
            updated_at,
            user_id,
            profile:profile!post_comment_user_id_fkey (
                id,
                handle,
                display_name,
                pfp_url
            )
        `)
        .eq('post_id', postId)
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .limit(limit + 1);

    // Magic looking cursor-based pagination logic that prioritizes like_count, then created_at, 
    // then id for consistent pagination
    if (cursor) {
        query = query.or([
            `like_count.lt.${cursor.likeCount}`,
            `and(like_count.eq.${cursor.likeCount},created_at.lt.${cursor.createdAt})`,
            `and(like_count.eq.${cursor.likeCount},created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`,
        ].join(','));
    }

    const { data: comments, error: commentsError } = await query;

    if (commentsError) {
        throw new Error(`Failed to fetch comments: ${commentsError.message}`);
    }

    const rows = comments ?? [];
    const pageRows = rows.slice(0, limit);
    const hasMore = rows.length > limit;
    const nextCursor: CommentCursor | null = hasMore 
        ? {
            likeCount: pageRows[pageRows.length - 1]!.like_count,
            createdAt: pageRows[pageRows.length - 1]!.created_at,
            id: pageRows[pageRows.length - 1]!.id,
        }
        : null;

    const commentIds = pageRows.map(comment => comment.id);
    const likedCommentIds = new Set<string>();

    if (commentIds.length > 0) {
        const { data: likedComments, error: likedCommentsError } = await supabase
            .from('comment_like')
            .select('comment_id')
            .eq('user_id', userId)
            .in('comment_id', commentIds);

        if (likedCommentsError) {
            throw new Error(`Failed to fetch liked comments: ${likedCommentsError.message}`);
        }

        for (const like of likedComments ?? []) {
            likedCommentIds.add(like.comment_id);
        }
    }

    const formattedComments = pageRows.map(comment => {
        return {
            id: comment.id,
            body: comment.body,
            like_count: comment.like_count,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            user_id: comment.user_id,
            profile: (() => {
                const profile = firstOrNull(comment.profile);
                if (!profile) return null;
                return {
                        id: profile.id,
                        handle: profile.handle,
                        display_name: profile.display_name,
                        pfp_url: profile.pfp_url,
                    };
            })(),
            liked_by_me: likedCommentIds.has(comment.id),
        };
    });


    return {
        comments: formattedComments,
        nextCursor,
        hasMore,
    };
}
