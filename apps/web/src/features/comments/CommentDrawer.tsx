import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { PencilLine } from 'lucide-react';
import styles from "./CommentDrawer.module.css";
import pfpPlaceholder from "../../assets/profile-picture-icon.png";
import type { Comment } from "@heard/types";
import { useAddPostComment } from "./hooks/useAddPostComment";
import CommentItem from "./CommentItem";

type CommentDrawerProps = {
    postId: string;
    comments: Comment[];
    commentsOpen: boolean;
    setCommentsOpen: (open: boolean) => void;
    incrementPostCommentCount: () => void;
    decrementPostCommentCount: () => void;
};


export default function CommentDrawer({ postId, comments, commentsOpen, setCommentsOpen, incrementPostCommentCount, decrementPostCommentCount }: CommentDrawerProps) {
    
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

    return(
        <Drawer open={commentsOpen} onOpenChange={setCommentsOpen}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle style={{padding: "1rem 1rem 0.5rem 1rem"}}>Comments</DrawerTitle>
                </DrawerHeader>
                <div className={styles.commentArea}>
                    <div className={`${styles.userComments} hide-scrollbar`}>
                        {comments.length > 0 ? comments.map((comment) => (
                            <CommentItem 
                                comment={comment} 
                                key={comment.id} 
                            />
                        )) 
                            : <div className={styles.noCommentsYet}>
                                <PencilLine size={20} color={'#ffffffa9'} />
                                <span>be the first to share your thoughts.</span>
                            </div>
                        }
                    </div>
                    <div className={styles.commentInputContainer}>
                        <div className={styles.commentDivider}></div>
                        <div className={styles.commentInputArea}>
                            <img src={pfpPlaceholder} alt="User profile picture" className={styles.commentInputPfp} />
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
                                className={`${comment.length > 0 ? styles.activeBtn : styles.inactiveBtn} ${styles.commentPostBtn} glass-area`} 
                                disabled={comment.length === 0} 
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
