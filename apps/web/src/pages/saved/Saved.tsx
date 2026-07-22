import { useAppChrome } from '@/context/useAppChrome';
import styles from './Saved.module.css';
import { useEffect } from 'react';
import { Ellipsis } from 'lucide-react';
import saveIcon from '../../assets/saved-icon-2.png';

export default function Saved() {

    const { setHeader, resetHeader } = useAppChrome();

    // Reset the header to its default state when the component unmounts
    // Separated from the other effect to prevent unnecessary re-renders of the header when the profile data changes.
    useEffect(() => {
        return resetHeader;
    }, [resetHeader]);

    useEffect(() => {
        setHeader({
            visible: true,
            title: 'saved',
            image: saveIcon,
            pfp: false,
            right: [
                {
                    id: 'edit-profile',
                    label: 'Edit Profile',
                    icon: <Ellipsis />,
                    onClick: () => {}
                }
            ],
        });
    }, [setHeader]);

    return (
        <div className = {styles.savedPage}>
            <div className={styles.savedHeader}>
                <h1>Saved</h1>
            </div>
            <div className={styles.savedContent}>
                <p>Your saved items will appear here.</p>
            </div>
        </div>
    );
}