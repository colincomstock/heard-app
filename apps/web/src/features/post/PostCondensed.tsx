import styles from './PostCondensed.module.css';
import { ArrowUpRight } from "lucide-react";
import { Heart } from 'lucide-react';
import { MessageSquareMore } from 'lucide-react';
import timeAgo from "@/lib/utils";
import type { ProfilePost as ProfilePostType } from '@heard/types';

export default function ProfilePost(post: ProfilePostType & { style?: React.CSSProperties }) {
    if (!post.track) return null;

    return (
        <div className={`${styles['profile-post']} glass-area`} style={post.style}>
            <div className={styles['profile-post-card']}>
                <img src={post.track.coverUrl} alt="Album cover" className={styles['album-cover']} />
                <div className={styles['profile-post-body']}>
                    <div className={styles['profile-post-info']}>
                        <div className={styles['profile-post-title-artist']}>
                            <div>
                                <span className={`${styles['profile-post-title']} single-line-clamp`}>{post.track.title}</span>
                                <ArrowUpRight size={20} style={{ marginLeft: '0.25rem' }} />
                            </div>
                            <span className={`${styles['profile-post-artist']} single-line-clamp`}>{post.track.artistName}</span>
                        </div>
                        <div className={styles['post-genre-badges']}>
                            <div className={`${styles['indv-badge']} glass-area`} style={{ backgroundColor: `${post.track.genres[0].badgeColor}99`, color: 'white' }}>
                                <span>{post.track.genres[0].name}</span>
                            </div>
                        </div>
                        <div className={styles['profile-post-interactions']}>
                            <div>
                                <div>
                                    <MessageSquareMore size={14} />
                                    <span>12</span>
                                </div>
                                <div>
                                    <Heart size={14} />
                                    <span>30</span>
                                </div>
                            </div>
                            <span className={styles['profile-post-time']}>{timeAgo(post.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles['profile-post-caption']} glass-area`}>
                <span className={'single-line-clamp'}>{post.caption}</span>
            </div>
        </div>
    )
}