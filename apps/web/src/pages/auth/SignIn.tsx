import styles from './SignIn.module.css';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import { useAppChrome } from '@/context/useAppChrome';
import { ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import queueIcon from '../../assets/queue-icon-4.png';
import googleIcon from '../../assets/google-signin.svg';
import appleIcon from '../../assets/apple-signin.svg';
import SignInBackground from './SignInBackground';

export default function SignIn() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { signInUser } = useAuth()!;
    const navigate = useNavigate();
    const { setHeader, resetHeader, setBottomBarVisible } = useAppChrome();

    useEffect(() => {
        setHeader({
            visible: false,
            title: '',
            left: null,
            right: null,
        });

        setBottomBarVisible(false);

        return () => {
            resetHeader();
            setBottomBarVisible(true);
        };
    }, [setHeader, resetHeader, setBottomBarVisible]);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            const result = await signInUser(email.trim(), password);
            if (result.success) {
                navigate('/'); // Redirect to queue page after successful signin
            } else {
                setError('We couldn\'t sign you in. Check your email and password and try again.');
            }
        } catch {
            setError('Something went wrong. Please try again in a moment.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className={styles.authPage}>
            <SignInBackground />
            <div className={styles.signIn}>
                <div className={styles.brand} aria-label="Heard">
                    <img src={queueIcon} alt="" width={36} height={36} />
                    <span>heard</span>
                </div>
                <header className={styles.intro}>
                    <h1>Welcome back.</h1>
                    <p>We mised you.</p>
                </header>
                <form className={styles.form} onSubmit={handleSignIn} aria-busy={loading}>
                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <div className={styles.inputShell}>
                            <Mail size={18} aria-hidden="true" />
                            <input
                                type="email" id="email" name="email"
                                autoComplete="username" autoCapitalize="none" spellCheck={false}
                                placeholder="you@example.com" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-describedby={error ? 'signin-error' : undefined}
                                readOnly={loading} required
                            />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputShell}>
                            <LockKeyhole size={18} aria-hidden="true" />
                            <input
                                type={passwordVisible ? 'text' : 'password'} id="password" name="password"
                                autoComplete="current-password" placeholder="Your password"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                aria-describedby={error ? 'signin-error' : undefined}
                                readOnly={loading} required
                            />
                            <button
                                type="button" className={styles.visibilityButton}
                                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                                title={passwordVisible ? 'Hide password' : 'Show password'}
                                aria-controls="password"
                                onClick={() => setPasswordVisible((visible) => !visible)}
                            >
                                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <p className={styles.error} id="signin-error" role="alert">
                            <CircleAlert size={18} aria-hidden="true" />
                            <span>{error}</span>
                        </p>
                    )}
                    <button className={styles.submitButton} type="submit" disabled={loading}>
                        <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                        {loading
                            ? <LoaderCircle className={styles.spinner} size={18} aria-hidden="true" />
                            : <ArrowRight size={18} aria-hidden="true" />}
                    </button>
                </form>
                <div className={styles.divider} aria-hidden="true">or</div>
                <div className={styles.socialSignIn} role="group" aria-label="Other sign-in options">
                    <button
                        type="button"
                        className={styles.providerButton}
                        aria-label="Continue with Google (not available yet)"
                        title="Google sign-in is not available yet"
                        disabled
                    >
                        <img src={googleIcon} alt="" width={22} height={22} />
                    </button>
                    <button
                        type="button"
                        className={styles.providerButton}
                        aria-label="Continue with Apple (not available yet)"
                        title="Apple sign-in is not available yet"
                        disabled
                    >
                        <img src={appleIcon} alt="" width={22} height={22} />
                    </button>
                </div>
            </div>
            <div className={styles.signUp}>
                <span>Don't have an account?</span>
                <Link to='/signup'>Sign up</Link>
            </div>
        </main>
    )
}
