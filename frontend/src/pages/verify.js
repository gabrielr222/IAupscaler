import { useRouter } from 'next/router';

export default function VerifyPage() {
  const router = useRouter();

  return (
    <div style={{ background: '#0d1117', color: 'white', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📩 Check your email</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#ccc' }}>
          We’ve sent a verification link to your email address.
          <br />
          Please confirm your account by clicking the link, then come back and log in again.
        </p>
        <button
          onClick={() => router.push('/login')}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
