import styles from './PostCondensed.module.css';
import { ArrowUpRight } from "lucide-react";
import { Heart } from 'lucide-react';
import { MessageCircleMore } from 'lucide-react';
import timeAgo from "@/lib/utils";
import type { ProfilePost as ProfilePostType } from '@heard/types';
import derivePostColors from '@/lib/colors';

export default function ProfilePost(post: ProfilePostType & { style?: React.CSSProperties }) {
    if (!post.track) return null;

    const derivedColors = derivePostColors(post.track.appleBgColor, post.track.genres[0].badgeColor);

    return (
        <div 
            className={`${styles.profilePostBase} ${derivedColors.isLight ? styles.profilePostLight : styles.profilePostDark}`}
            style={
                {
                    ...post.style,
                    '--applebgColor': derivedColors.bgColor,
                    '--bgColorBorder': derivedColors.border,
                    '--appleTextColor1': post.track.appleTextColor1,
                    '--appleTextColor2': post.track.appleTextColor2,
                    '--appleTextColor3': post.track.appleTextColor3,
                    '--appleTextColor4': post.track.appleTextColor4,
                } as React.CSSProperties
            }
        >
            <div className={styles.profilePostCard}>
                <img src={post.track.coverUrl} alt="Album cover" className={`${styles.albumCoverBase} ${derivedColors.isLight ? '' : styles.albumCoverDark}`} />
                <div className={styles.profilePostBody}>
                    <div className={styles.profilePostInfo}>
                        <div className={styles.profilePostTitleArtist}>
                            <div>
                                <span className={`${styles.profilePostTitle} single-line-clamp`}>{post.track.title}</span>
                                <ArrowUpRight size={20} className={styles.openPostIcon} />
                            </div>
                            <span className={`${styles.profilePostArtist} single-line-clamp`}>{post.track.artistName}</span>
                        </div>
                        <div className={styles.postGenreBadges}>
                            {post.track.genres.slice(0, 2).map((genre) => (
                                <div
                                key={genre.name}
                                className={`${styles.indvBadge} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}
                                style={{ '--badgeColor': genre.badgeColor } as React.CSSProperties}
                                >
                                    <span className={styles.badgeColorDot}>⬤ </span>
                                    <span>{genre.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.profilePostInteractions}>
                            <div>
                                <div>
                                    <MessageCircleMore size={14} />
                                    <span>{post.commentCount}</span>
                                </div>
                                <div>
                                    <Heart size={14} />
                                    <span>{post.likeCount}</span>
                                </div>
                            </div>
                            <span className={styles.profilePostTime}>{timeAgo(post.updatedAt)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${styles.profilePostCaption} ${derivedColors.isLight ? 'glass-area-light-bg' : 'glass-area'}`}>
                <span className="single-line-clamp">{post.caption}</span>
            </div>
        </div>
    )
}
