import styles from './NewPost.module.css'
import { getSearchResults } from '@/lib/api/search';
import { useState, useEffect } from 'react'
import { UserAuth } from '@/context/AuthContext';
import { Search } from 'lucide-react';
import { X, Play, Pause, Check } from 'lucide-react';
import { useAudioPlayer } from '@/context/useAudioPlayer';
import { createPost } from '@/lib/api/post';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TrackSearchResult } from '@heard/types';

type NewPostProps = {
    onDone: () => void;
};

export default function NewPost({ onDone: _onDone }: NewPostProps) {
    
    const [searchTerm, setSearchTerm] = useState('')
    const [caption, setCaption] = useState('')
    const [selectedSong, setSelectedSong] = useState<TrackSearchResult | null>(null)

    const queryClient = useQueryClient();

    const {
        activeId,
        isPlaying,
        progress,
        toggle,
        pause,
    } = useAudioPlayer();

    function handlePlayPauseClick(previewUrl: string, trackId: string) {
        void toggle(previewUrl, trackId);
    }

    function handleCaptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setCaption(e.target.value.replace(/[\r\n]+/g, " "))
    }
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    
    const { session } = UserAuth()!;

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        pause();
        setSelectedSong(null);
        setSearchTerm(e.target.value)
    }

    function handleTrackSelect(track: TrackSearchResult) {
        setSelectedSong(track)
    }

    function handleClearSelection() {
        setSelectedSong(null);
        setSearchTerm('');
        pause();
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

    const createPostMutation = useMutation({
        mutationFn: (newPost: { caption: string; appleMusicTrackId: string }) => createPost(session!.access_token, newPost),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            queryClient.invalidateQueries({ queryKey: ['queue'] });
            _onDone();
        }
    });

    const tracks = data?.tracks || [];
    const hasResults = tracks.length > 0 && debouncedSearchTerm.length > 2;

    return (
        <div className={styles.newPostPage}>
            <div className={styles.newPostHeaderArea}>
                <button className={styles.newPostBackBtn} onClick={_onDone}>
                    <span>back</span>
                </button>
                <h1>New Post</h1>
                <button className={`${styles.newPostSubmitBtn} glass-area`} disabled={!selectedSong || !caption.trim()} onClick={async () => {
                    if (selectedSong && caption.trim()) {
                        try {
                            await createPostMutation.mutateAsync({ caption, appleMusicTrackId: selectedSong.id });
                        } catch (error) {
                            console.error('Failed to create post:', error);
                        }
                    }
                }}>
                    post
                </button>
            </div>
            <label htmlFor="song-search" className={styles.newPostLabel}>song</label>
            <div className={styles.searchArea}>
                <div className={`${styles.searchBoxArea} glass-area`} style={{ background: searchTerm.length > 0 ? 'transparent' : undefined }}>
                    <Search size={24} style={{ marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder='search a song to post...'
                        id="song-search"
                        className={styles.newPostSearchInput}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {searchTerm.length > 0 && <X size={24} style={{ marginLeft: '0.5rem', cursor: 'pointer' }} onClick={handleClearSelection} />}
                </div>
                <div className={`${styles.searchResultsArea} ${hasResults ? styles.isOpen : ''} glass-area`}>
                    {hasResults ? 
                        (
                            <div className={styles.searchResultsList}>
                                {tracks.map((track) => {
                                    const isTrackActive = activeId === track.id;
                                    const showTrackPause = isPlaying && isTrackActive;
                                    const trackDisplayProgress = isTrackActive ? progress : 0;
                                    return(
                                        <div
                                            key={track.id}
                                        
                                            className={styles.searchResultItem}
                                            onClick={() => handleTrackSelect(track)}
                                        >
                                            {selectedSong?.id === track.id && (
                                                <div className={`${styles.searchResultSelectedIndicator} glass-area`}>
                                                    <Check size={16} />
                                                </div>
                                            )}
                                            <div className={styles.searchResultCoverMetaContainer}>
                                                <img src={track.coverUrl} alt={`${track.name} cover`} />
                                                <div className={styles.searchResultMeta}>
                                                    <span className={`${styles.searchResultTitle} single-line-clamp`}>{track.name}</span>
                                                    <span className={`${styles.searchResultArtist} single-line-clamp`}>{track.artistName}</span>
                                                </div>
                                            </div>
                                            <div
                                                className={`${styles.playBtnArea} glass-area`}
                                                style = {
                                                    { '--track-progress': `${trackDisplayProgress}%` } as React.CSSProperties
                                                }
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    if (!track.previewUrl) return;
                                                    handlePlayPauseClick(track.previewUrl, track.id);
                                                }}
                                            >
                                                {showTrackPause ? <Pause size={20} fill='white' /> : <Play size={20} fill='white' />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : 
                            // Search placeholder div
                            <div></div>
                    }
                </div>
                
            </div>
            <label htmlFor="post-caption" className={styles.newPostLabel}>caption</label>
            <div className={styles.captionArea}>
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
            <span className={styles.newPostCharacterCount}>{caption.length}/140</span>
        </div>
    )
}
