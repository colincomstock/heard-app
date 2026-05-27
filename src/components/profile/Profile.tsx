import profileIcon from '../../assets/profile-picture-icon.png';
import albumArt from '../../assets/fauxlennium-album-art.jpg';

export default function Profile() {
    return (
        <div className='profile-page'>
            <div className='profile-header'>
                <div className='pfp-user'>
                    <img src={profileIcon} alt="Profile" />
                    <h3>@userhandle</h3>
                </div>
                <div className='profile-info'>
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