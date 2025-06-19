import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) {
      router.push('/admin-login');
    } else {
      fetch('/api/admin-stats')
        .then(res => res.json())
        .then(data => {
          setUsers(data.users || []);
          setLogs(data.logs || []);
        });
    }
  }, [router]);

  const totalUsers = users.length;
  const totalCreditsUsed = logs.reduce((sum, log) => sum + (log.cost || 0), 0);
  const totalGain = totalCreditsUsed * (0.006 - 0.00115);

  return (
    <div style={{ padding: '2rem', background: '#0d1117', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊 Admin Dashboard</h1>

      <div style={{ marginBottom: '2rem' }}>
        <p><strong>👥 Total Users:</strong> {totalUsers}</p>
        <p><strong>💳 Total Credits Consumed:</strong> ${totalCreditsUsed.toFixed(2)}</p>
        <p><strong>💰 Estimated Profit:</strong> ${totalGain.toFixed(2)}</p>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🧾 Logs</h2>
      <div style={{ maxHeight: '400px', overflowY: 'scroll', border: '1px solid #333', padding: '1rem' }}>
        {logs.map((log, index) => (
          <div key={index} style={{ borderBottom: '1px solid #444', padding: '0.5rem 0' }}>
            <p><strong>Email:</strong> {log.email || 'N/A'}</p>
            <p><strong>Duration:</strong> {log.duration}s</p>
            <p><strong>Cost:</strong> ${log.cost}</p>
            <p><strong>Date:</strong> {new Date(log.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
