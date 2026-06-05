import { ArrowUpRight } from "lucide-react";
import timeAgo from "@/lib/utils";

export default function ProfilePost(post: any) {
    return (
        <div className='profile-post'>
            <div className='profile-post-card glass-area' style={post.style}>
                <img src={post.songInfo.coverUrl} alt="Album cover" className='album-cover' />
                <div className='profile-post-body'>
                    <div className='profile-post-info'>
                        <div className='profile-post-title-artist'>
                            <span className='profile-post-title'>{post.songInfo.title}</span>
                            <span className='profile-post-artist'>{post.songInfo.artists.primary}</span>
                        </div>
                        <div className='post-genre-badges'>
                            <div className='indv-badge glass-area' style={{ backgroundColor: '#8f00ff60', color: 'white' }}>
                                <span>{post.songInfo.genres.secondary[0]}</span>
                            </div>
                        </div>
                        <div>
                            <span className='profile-post-caption'>{post.postInfo.caption}</span>
                        </div>
                    </div>
                    <div className='profile-post-meta'>
                        <ArrowUpRight size={20} />
                        <span className='profile-post-time'>{timeAgo(post.postInfo.timestamp)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}