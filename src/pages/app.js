// frontend/src/pages/app.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function AppPage() {
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl(null);
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;
    setProcessing(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const upload = await fetch('/api/cloudinary-upload', {
        method: 'POST',
        body: formData,
      });

      const { imageUrl } = await upload.json();

      const response = await fetch('/api/replicate-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await response.json();
      if (data?.output) {
        setResultUrl(data.output);
      } else {
        alert('Failed to enhance image');
      }
    } catch (err) {
      console.error(err);
      alert('Error during enhancement');
    }

    setProcessing(false);
  };

  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', color: 'white', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Welcome to <span style={{ background: 'linear-gradient(to right, #00c6ff, #00ffcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PixUpscaler</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '0.5rem' }}>
          Logged in as <strong>{user?.email}</strong>
        </p>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '2rem' }}>
          The most affordable upscaler on the market — only pay per use, no subscriptions required.
        </p>

        <label htmlFor="upload" style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold', color: '#ccc' }}>Select an image to upscale:</label>
        <input id="upload" type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '1.5rem' }} />

        {previewUrl && (
          <div style={{ marginBottom: '2rem' }}>
            <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
            <br />
            <button
              onClick={handleEnhance}
              disabled={processing}
              style={{
                background: 'linear-gradient(to right, #10b981, #3b82f6)',
                color: 'white',
                padding: '0.75rem 1.5rem',
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
              {processing ? 'Enhancing...' : 'Enhance Image'}
            </button>
          </div>
        )}

        {resultUrl && (
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Result</h2>
            <img src={resultUrl} alt="Upscaled Result" style={{ maxWidth: '100%', borderRadius: '8px' }} />
          </div>
        )}

        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(to right, #f87171, #ef4444)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '3rem',
            transition: 'transform 0.2s ease-in-out'
          }}
          onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.target.style.transform = 'scale(1)'}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
