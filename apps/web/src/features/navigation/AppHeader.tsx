import type { HeaderConfig, HeaderAction } from '../../context/AppChromeContext';
import styles from './AppHeader.module.css';

type AppHeaderProps = {
  header: HeaderConfig;
};

function HeaderButton({ action }: { action: HeaderAction }) {
    return (
        <button
            type="button"
            aria-label={action.label}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`${styles.headerButton}`}
        >
            {action.icon}
        </button>
    );
};

// The AppHeader component renders the app's header based on the provided header configuration. It displays the title and any left or right actions as buttons.
export default function AppHeader({ header }: AppHeaderProps) {
    if (!header.visible) {
        return null;
    }

    const rightActions = header.right ?? [];

    return (
        <div className={styles.header}>
            {header.left && <div className={`${styles.leftSlot} ${styles.glassBlur}`}>
                <HeaderButton action={header.left} />
            </div>}
            <div className={`${styles.mainSlot} ${styles.glassBlur}`}>
                <div className={`${styles.titleArea}`}>
                    {header.image && <img src={header.image} alt="App Logo" className={`${styles.icon} ${header.pfp ? styles.pfp : ''}`} />}
                    <h1>{header.title}</h1>            
                </div>
                <div className={`${styles.rightSlots}`}>
                    {rightActions.map((action) => (
                        <HeaderButton key={action.id} action={action} />
                    ))}
                </div>
            </div>
        </div>
    );
};