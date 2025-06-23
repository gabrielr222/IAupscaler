import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function HistoryPage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await currentUser.reload();
        if (!currentUser.emailVerified) {
          alert('Please verify your email before using the app.');
          await signOut(auth);
          router.push('/login');
          return;
        }
        setUser(currentUser);
        loadHistory(currentUser.uid);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadHistory = async (uid) => {
    try {
      const res = await fetch(`/api/history?uid=${uid}`);
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.error('History load error:', e);
    }
  };

  const handleBack = () => {
    router.push('/app');
  };

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Images History</h1>
        {history.length === 0 ? (
          <p>No history available.</p>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {history.map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <img src={item.imageUrl} alt={`History ${idx}`} style={{ width: '150px', borderRadius: '6px' }} />
                <br />
                <a href={item.imageUrl} download style={{ color: '#3b82f6' }}>
                  Download
                </a>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleBack}
          style={{
            marginTop: '2rem',
            background: 'linear-gradient(to right, #10b981, #3b82f6)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
