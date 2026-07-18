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
            className={`${styles.headerButton} ${styles.glassBlur}`}
        >
            {action.icon}
        </button>
    );
};

export default function AppHeader({ header }: AppHeaderProps) {
    if (!header.visible) {
        return null;
    }

    const rightActions = header.right ?? [];

    return (
        <div className={styles.header}>
            <div className={`${styles.leftSlot}`}>
                {header.left && <HeaderButton action={header.left} />}
            </div>
            <div className={`${styles.centerSlot} ${styles.glassBlur}`}>
                <h1 className={styles.title}>{header.title}</h1>            
            </div>
            <div className={`${styles.rightSlots}`}>
                {rightActions.map((action) => (
                    <HeaderButton key={action.id} action={action} />
                ))}
            </div>
        </div>
    );
};