import styles from './SignUp.module.css';
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUp() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { session, signUpNewUser } =  UserAuth()!;
    const navigate = useNavigate();
    console.log('Current session:', session);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signUpNewUser(email, password);
            if (result.success) {
                console.log('User signed up successfully:', result.data);
                navigate('/'); // Redirect to queue page after successful signup
            } else {
                console.error('Signup failed:', result.error);            }
        } catch (error) {
            setError('An unexpected error occurred during signup.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.authPage}>
            <div className={styles.signUp}>
                <h1>Sign Up</h1>
                <span>Already have an account? <Link to='/signin'>Sign In</Link></span>
                <form onSubmit={handleSignup}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <br />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <br />
                    <button type="submit" disabled={loading}>Sign Up</button>
                    {error && <p className={styles.error}>{error}</p>}
                </form>
            </div>
        </div>
    )
}
