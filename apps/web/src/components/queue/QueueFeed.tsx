import postDataAll from '../../postData.json'
import Post from '../post/Post'
import { useOutletContext } from 'react-router-dom'

type AppContext = {
    isMuted: boolean
}

export default function QueueFeed() {
    const { isMuted } = useOutletContext<AppContext>()
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