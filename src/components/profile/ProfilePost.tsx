import { ArrowUpRight } from "lucide-react";
import { Heart } from 'lucide-react';
import { MessageSquareMore } from 'lucide-react';
import timeAgo from "@/lib/utils";

export default function ProfilePost(post: any) {
    return (
        <div className='profile-post glass-area' style={post.style}>
            <div className='profile-post-card'>
                <img src={post.songInfo.coverUrl} alt="Album cover" className='album-cover' />
                <div className='profile-post-body'>
                    <div className='profile-post-info'>
                        <div className='profile-post-title-artist'>
                            <div>
                                <span className='profile-post-title single-line-clamp'>{post.songInfo.title}</span>
                                <ArrowUpRight size={20} style={{ marginLeft: '0.25rem' }} />
                            </div>
                            <span className='profile-post-artist single-line-clamp'>{post.songInfo.artists.primary}</span>
                        </div>
                        <div className='post-genre-badges'>
                            <div className='indv-badge glass-area' style={{ backgroundColor: '#8f00ff60', color: 'white' }}>
                                <span>{post.songInfo.genres.secondary[0]}</span>
                            </div>
                        </div>
                        <div className='profile-post-interactions'>
                            <div>
                                <div>
                                    <Heart size={14} />
                                    <span>30</span>
                                </div>
                                <div>
                                    <MessageSquareMore size={14} />
                                    <span>12</span>
                                </div>
                            </div>
                            <span className='profile-post-time'>{timeAgo(post.postInfo.timestamp)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div  className='profile-post-caption glass-area'>
                <span className='single-line-clamp'>{post.postInfo.caption}</span>
            </div>
        </div>
    )
}