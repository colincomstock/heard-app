import styles from './SignIn.module.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignIn() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { session, signInUser } = UserAuth()!;
    const navigate = useNavigate();
    console.log('Current session:', session);

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signInUser(email, password);
            if (result.success) {
                console.log('User signed in successfully:', result.data);
                navigate('/'); // Redirect to queue page after successful signin
            } else {
                console.error('Signin failed:', result.error);            }
        } catch (error) {
            setError('An unexpected error occurred during signin.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.authPage}>
            <div className={styles.signIn}>
                <h1>Sign In</h1>
                <span>Don't have an account? <Link to='/signup'>Sign Up</Link></span>
                <form onSubmit={handleSignIn}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <br />
                    <button type="submit" disabled={loading}>Sign In</button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    )
}
