import { useState, useEffect } from 'react'

export default function NewPost() {
    
    let [searchTerm, setSearchTerm] = useState('')
    
    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value)
    }

    useEffect(() => {
        console.log('Search term:', searchTerm)
    }, [searchTerm]);

    return (
        <div className='new-post-page'>
            <h1>New Post</h1>
            <input 
                type="text"
                placeholder='What are you listening to?'
                className='new-post-input'
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </div>
    )
}