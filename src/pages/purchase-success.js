import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PurchaseSuccess() {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    if (!session_id) return;
    fetch('/api/confirm-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session_id }),
    }).then(() => router.push('/app'));
  }, [session_id, router]);

  return (
    <div style={{ color: 'white', background: '#0d1117', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Processing purchase...</h1>
    </div>
  );
}
