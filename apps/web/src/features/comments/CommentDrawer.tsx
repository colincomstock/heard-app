import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { PencilLine } from 'lucide-react';
import styles from "./CommentDrawer.module.css";
import pfpPlaceholder from "../../assets/profile-picture-icon.png";
import { useAddPostComment } from "./hooks/useAddPostComment";
import CommentItem from "./CommentItem";
import { useMe } from "@/hooks/useMe";
import { usePostComments } from "./hooks/usePostComments";
import { Spinner } from "@/components/ui/spinner";

type CommentDrawerProps = {
    postId: string;
    commentsOpen: boolean;
    setCommentsOpen: (open: boolean) => void;
    incrementPostCommentCount: () => void;
    decrementPostCommentCount: () => void;
};


export default function CommentDrawer({ postId, commentsOpen, setCommentsOpen, incrementPostCommentCount, decrementPostCommentCount }: CommentDrawerProps) {
    
    // State for the comment input
    const [comment, setComment] = useState('');

    function handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const textarea = e.currentTarget;

        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        setComment(e.target.value.replace(/[\r\n]+/g, " "));
    };
    
    const addCommentMutation = useAddPostComment(postId);

    function handleCommentSubmit() {
        const body = comment.trim();

        if (body.length === 0 || addCommentMutation.isPending) {
            return;
        }

        incrementPostCommentCount();
        addCommentMutation.mutate(body, {
            onSuccess: () => {
                setComment('');
            },
            onError: () => {
                decrementPostCommentCount();
            },
        });
    };

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetchNextPageError,
        refetch,
    } = usePostComments(postId, commentsOpen);

    const comments = data?.pages.flatMap(page => page.comments) ?? [];

    const commentsListRef = useRef<HTMLDivElement>(null);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = commentsListRef.current;
        const target = loadMoreRef.current;

        if (
            !commentsOpen ||
            !root ||
            !target ||
            !hasNextPage ||
            isFetchingNextPage
        ) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                }
            },
            {
                root,
                rootMargin: '0px 0px 160px 0px',
                threshold: 0,
            }
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [commentsOpen, fetchNextPage, hasNextPage, isFetchingNextPage]);

    const { data: meData } = useMe();

    return(
        <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle style={{padding: "1rem 1rem 0.5rem 1rem"}}>Comments</DrawerTitle>
                </DrawerHeader>
                <div className={styles.commentArea}>
                    <div 
                        ref={commentsListRef}
                        className={`${styles.userComments} hide-scrollbar`}
                    >
                        {isLoading ? (
                            <div className={styles.noCommentsYet}>
                                <Spinner />
                            </div>
                        ) : comments.length === 0 && isError ? (
                            <div className={styles.noCommentsYet}>
                                <span>Unable to load comments.</span>
                                <button 
                                    type="button"
                                    className={styles.commentRetryButton}
                                    onClick={() => void refetch()}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className={styles.noCommentsYet}>
                                <PencilLine size={20} color={'#ffffffa9'} />
                                <span>be the first to share your thoughts.</span>
                            </div>
                        ) : (
                            <>
                                {comments.map((comment) => (
                                    <CommentItem 
                                        comment={comment} 
                                        key={comment.id} 
                                    />
                                ))}
                                {hasNextPage ? (
                                    <div 
                                        ref={loadMoreRef}
                                        className={styles.commentLoadMoreSentinel}
                                    />
                                ) : null}
                                {isFetchingNextPage ? (
                                    <div className={styles.commentPaginationStatus}>
                                        <Spinner />
                                    </div>
                                ) : null}
                                {isFetchNextPageError ? (
                                    <button 
                                        type="button"
                                        className={styles.commentRetryButton}
                                        onClick={() => void fetchNextPage()}
                                    >
                                        Retry loading more
                                    </button>
                                ) : null}
                            </>
                        )}
                    </div>
                    <div className={styles.commentInputContainer}>
                        <div className={styles.commentDivider}></div>
                        <div className={styles.commentInputArea}>
                            <img src={meData?.profile?.pfpUrl || pfpPlaceholder} alt="User profile picture" className={styles.commentInputPfp} />
                            <textarea
                                id="post-comment"
                                name="comment"
                                value={comment}
                                onChange={(e) => {
                                    handleCommentChange(e);
                                }}
                                disabled={addCommentMutation.isPending}
                                placeholder="add a comment..."
                                maxLength={140}
                                rows={1}
                                style={comment.length > 0 ? { background: 'transparent' } : {} }
                            />
                            <button 
                                className={`${comment.trim().length > 0 ? styles.activeBtn : styles.inactiveBtn} ${styles.commentPostBtn} glass-area`} 
                                disabled={comment.trim().length === 0} 
                                onClick={async () => {
                                    handleCommentSubmit();
                                }}>
                                post
                            </button>
                        </div>
                        {
                            comment.length > 0 && <span className={styles.commentCharacterCount}>{comment.length}/140</span>
                        }
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
};
