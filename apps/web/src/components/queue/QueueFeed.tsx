import postDataAll from '../../postData.json'
import Post from '../post/Post'

// Define the props for the QueueFeed component
interface QueueFeedProps {
    isMuted: boolean
}

export default function QueueFeed({ isMuted }: QueueFeedProps) {
    return (
        <>
            <div className='feed'>
                {postDataAll.posts.map((post) => (
                    <Post key={post.post.id} {...post.post} isMuted={isMuted} />
                ))}
            </div>
            
        </>
    )
}