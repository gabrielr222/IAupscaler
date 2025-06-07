// frontend/src/pages/login.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import { getFirebaseAuth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/app');
    } catch (err) {
      try {
        const auth = getFirebaseAuth();
        await createUserWithEmailAndPassword(auth, email, password);
        router.push('/app');
      } catch (signupErr) {
        setError(signupErr.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div style={{ background: '#161b22', padding: '3rem', borderRadius: '12px', boxShadow: '0 0 20px rgba(0,0,0,0.4)', maxWidth: '400px', width: '100%' }}>
        <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <span style={{ background: 'linear-gradient(to right, #00c6ff, #00ffcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sign up or log in
          </span>
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: '6px', border: 'none', fontSize: '1rem' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.75rem', borderRadius: '6px', border: 'none', fontSize: '1rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out'
            }}
            onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)'}
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        <p style={{ color: '#888', fontSize: '0.9rem', textAlign: 'center', marginTop: '1.5rem' }}>
          No account yet? Just enter your email and password to create one instantly.
        </p>
      </div>
    </div>
  );
}
