import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    const { uid } = router.query;

    if (uid) {
      fetch('/api/credit-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      })
        .then(() => {
          alert('Credits added successfully!');
          router.push('/app');
        })
        .catch(() => {
          alert('Error updating credits');
          router.push('/app');
        });
    }
  }, [router.isReady, router.query.uid]);

  return (
    <div style={{ color: 'white', backgroundColor: '#0d1117', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Processing your purchase...</h1>
    </div>
  );
}
