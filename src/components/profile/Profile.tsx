import profileIcon from '../../assets/profile-picture-icon.png';
import albumArt from '../../assets/fauxlennium-album-art.jpg';

export default function Profile() {
    return (
        <div className='profile-page'>
            <div className='profile-header'>
                <div className='profile-header-top'>
                    <div className='pfp-card'>
                        <img src={profileIcon} alt="Profile" />
                        <h3>@userhandle</h3>
                    </div>
                    <div className='profile-info-card'>
                        <div className='profile-stats'>
                            <div>
                                <span>100</span>
                                <span>Posts</span>
                            </div>
                            <div>
                                <span>250</span>
                                <span>Followers</span>
                            </div>
                            <div>
                                <span>180</span>
                                <span>Following</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='profile-header-bottom'>
                    <div className='usr-top-genre-card'>
                        <h4>Top Genres</h4>
                        <div className='post-genre-badges'>
                            <span className='indv-badge' style={{backgroundColor: '#ff0000'}}>rock</span>
                            <span className='indv-badge' style={{backgroundColor: '#00ff00'}}>hiphop</span>
                            <span className='indv-badge' style={{backgroundColor: '#0000ff'}}>electronic</span>
                        </div>
                    </div>
                    <div className='follow-btn-area'>
                        <button className='follow-btn'>Follow</button>
                    </div>
                </div>
            </div>
            <div className='profile-posts'>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>
                <div className='post-placeholder'>
                    <img src={albumArt} alt="Album Art"/>
                </div>

            </div>
        </div>
    )
}