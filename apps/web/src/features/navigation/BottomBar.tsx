import styles from './BottomBar.module.css'
import { Link } from 'react-router-dom'
import queueIcon from '../../assets/queue-icon-4.png'
import discoverIcon from '../../assets/search-icon-2.png'
import newPostIcon from '../../assets/new-post-icon-2.png'
import savedIcon from '../../assets/saved-icon-2.png'
import profileIcon from '../../assets/profile-icon.png'

type BottomBarProps = {
    onOpenNewPostDrawer: () => void;
};

export default function BottomBar({ onOpenNewPostDrawer }: BottomBarProps) {
    return (
        <div className={styles['bottom-bar']}>
            <Link to="/">
                <button>
                    <img src={queueIcon} alt="Queue icon" style={{ width: '25px', height: '25px' }} />
                </button>
            </Link>
            <Link to="/discover">
                <button>
                    <img src={discoverIcon} alt="Discover icon" style={{ width: '25px', height: '25px' }} />
                </button>
            </Link>
            <button onClick={onOpenNewPostDrawer}>
                <img src={newPostIcon} alt="New Post icon" style={{ width: '25px', height: '25px' }} />
            </button>
            <Link to="/saved">
                <button>
                    <img src={savedIcon} alt="Saved icon" style={{ width: '25px', height: '25px' }} />
                </button>
            </Link>
            <Link to="/profile">
                <button>
                    <img src={profileIcon} alt="Profile icon" style={{ width: '25px', height: '25px' }} />
                </button>
            </Link>
        </div>
    )
};