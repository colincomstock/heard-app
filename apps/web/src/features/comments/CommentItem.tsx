import { useState } from "react";
import type { Comment } from "@heard/types";
import styles from './CommentItem.module.css';
import { Heart } from "lucide-react";
import timeAgo from '../../lib/utils';
import { useLikePostComment } from "./hooks/useLikePostComment";
import { useUnlikePostComment } from "./hooks/useUnlikePostComment";

export default function CommentItem({ comment }: { comment: Comment }) {

    const [likedByMe, setLikedByMe] = useState(comment.likedByMe);
    const [likeCount, setLikeCount] = useState(comment.likeCount);

    const likeCommentMutation = useLikePostComment(comment.id, {
        onRollback: () => {
            setLikedByMe(false);
            setLikeCount(prev => prev - 1);
        }
    });

    const unlikeCommentMutation = useUnlikePostComment(comment.id, {
        onRollback: () => {
            setLikedByMe(true);
            setLikeCount(prev => prev + 1);
        }
    });

    function handleLikeClick() {
        if ( likeCommentMutation.isPending || unlikeCommentMutation.isPending ) {
            return;
        }

        const nextLiked = !likedByMe;

        setLikedByMe(nextLiked);
        setLikeCount(count => nextLiked ? count + 1 : count - 1);

        if (nextLiked) {
            likeCommentMutation.mutate();
        } else {
            unlikeCommentMutation.mutate();
        }
    };

    return(
        <div className={styles.indivComment}>
            <img src={comment.profile.pfpUrl} alt={comment.profile.displayName} className={styles.commentPfp} />
            <div className={styles.commentContent}>
                <div className={styles.commentHeader}>
                    <div className={styles.commentDisplayName}>{comment.profile.displayName}</div>
                    <div className={styles.commentMeta}>{timeAgo(comment.createdAt)}</div>
                </div>
                <div className={styles.bodyActions}>
                    <div className={styles.commentBody}>{comment.body}</div>
                    <div>
                        <button
                            type="button"
                            aria-label={likedByMe ? "Unlike comment" : "Like comment"}
                            onClick={handleLikeClick}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                            }}
                        >
                            <Heart 
                                size={20}
                                color='white'
                                fill={likedByMe ? 'white' : 'none'} 
                            />
                        </button>
                    </div>
                </div>
                <div className={styles.commentMeta}>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</div>
            </div>
        </div>
    )

}