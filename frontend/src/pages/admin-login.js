import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (user === process.env.NEXT_PUBLIC_ADMIN_USER && pass === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div style={{ padding: 50, color: 'white', background: '#0d1117', minHeight: '100vh' }}>
      <h1>Admin Login</h1>
      <input
        placeholder="Email"
        value={user}
        onChange={e => setUser(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', padding: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={e => setPass(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', padding: '0.5rem' }}
      />
      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem' }}>Login</button>
    </div>
  );
}
