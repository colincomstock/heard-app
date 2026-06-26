import styles from './NewPost.module.css'
import { getSearchResults } from '@/lib/api/search';
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserAuth } from '@/context/AuthContext';
import { Search } from 'lucide-react';
import { X, Play, Check } from 'lucide-react';

type NewPostProps = {
    onDone: () => void;
};

type TrackSearchResult = {
    id: string;
    name: string;
    artistName: string;
    coverUrl: string;
    previewUrl: string;
};

export default function NewPost({ onDone: _onDone }: NewPostProps) {
    
    const [searchTerm, setSearchTerm] = useState('')
    const [caption, setCaption] = useState('')
    const [selectedSong, setSelectedSong] = useState<TrackSearchResult | null>(null)

    function handleCaptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setCaption(e.target.value.replace(/[\r\n]+/g, " "))
    }
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    
    const { session } = UserAuth()!;

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchTerm(e.target.value)
    }

    function handlePlayPauseClick(previewUrl: string) {
        const audio = new Audio(previewUrl);
        audio.play();
    }

    function handletrackSelect(track: TrackSearchResult) {
        setSelectedSong(track)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timeout);
    }, [searchTerm]);

    const { data } = useQuery({
        queryKey: ['search', debouncedSearchTerm],
        queryFn: () => getSearchResults(debouncedSearchTerm, session!.access_token),
        enabled: debouncedSearchTerm.length > 2,
        placeholderData: (previousData) => previousData,
    });

    const hasResults = Boolean(data?.tracks?.length) && debouncedSearchTerm.length > 2;

    useEffect(() => {
        console.log('Search term:', searchTerm)
    }, [searchTerm]);

    useEffect(() => {
        console.log('Search results:', data)
    }, [data]);

    return (
        <div className={styles['new-post-page']}>
            <div className={styles['new-post-header-area']}>
                <button className={styles['new-post-back-btn']} onClick={_onDone}>
                    <span>back</span>
                </button>
                <h1>New Post</h1>
                <button className={`${styles['new-post-submit-btn']} glass-area`} disabled={!selectedSong || !caption.trim()} onClick={() => {
                    _onDone();
                }}>
                    post
                </button>
            </div>
            <label htmlFor="song-search" className={styles['new-post-label']}>song</label>
            <div className={styles['search-area']}>
                <div className={`${styles['search-box-area']} glass-area`} style={{ background: searchTerm.length > 0 ? 'transparent' : undefined }}>
                    <Search size={24} style={{ marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder='search a song to post...'
                        id="song-search"
                        className={styles['new-post-search-input']}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {searchTerm.length > 0 && <X size={24} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} onClick={() => setSearchTerm('')} />}
                </div>
                <div className={`${styles['search-results-area']} ${hasResults ? styles['is-open'] : ''} glass-area`}>
                    {hasResults ? 
                        (
                            <div className={styles['search-results-list']}>
                                {data.tracks.map((track: TrackSearchResult) => (
                                    <button
                                        key={track.id}
                                        type='button'
                                        className={styles['search-result-item']}
                                        onClick={() => handletrackSelect(track)}
                                    >
                                        {selectedSong?.id === track.id && (
                                            <div className={`${styles['search-result-selected-indicator']} glass-area`}>
                                                <Check size={16} />
                                            </div>
                                        )}
                                        <div className={styles['search-result-cover-meta-container']}>
                                            <img src={track.coverUrl} alt={`${track.name} cover`} />
                                            <div className={styles['search-result-meta']}>
                                                <span className={`${styles['search-result-title']} single-line-clamp`}>{track.name}</span>
                                                <span className={`${styles['search-result-artist']} single-line-clamp`}>{track.artistName}</span>
                                            </div>
                                        </div>
                                        <div
                                            className={`${styles['play-btn-area']} glass-area`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handlePlayPauseClick(track.previewUrl);
                                            }}
                                        >
                                            <Play size={20} fill='white' style={{ cursor: 'pointer' }} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : 
                            // Search placeholder div
                            <div></div>
                    }
                </div>
                
            </div>
            <label htmlFor="post-caption" className={styles['new-post-label']}>caption</label>
            <div className={styles['caption-area']}>
                    <textarea
                    id="post-caption"
                    name="caption"
                    value={caption}
                    onChange={handleCaptionChange}
                    placeholder="share your thoughts..."
                    className={`glass-area`}
                    rows={3}
                    maxLength={140}
                    style={caption.length > 0 ? { background: 'transparent' } : {} }
                />
            </div>
            <span className={styles['new-post-character-count']}>{caption.length}/140</span>
        </div>
    )
}
