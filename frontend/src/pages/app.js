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
  const [credits, setCredits] = useState(0);
  const [freeUsesLeft, setFreeUsesLeft] = useState(0);
  const [mode, setMode] = useState('creative');
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
        const res = await fetch(`/api/credits?uid=${currentUser.uid}`);
        const data = await res.json();
        setCredits(data.credits);
        setFreeUsesLeft(data.freeUsesLeft);
        loadHistory(currentUser.uid);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);
@@ -76,51 +77,51 @@ export default function AppPage() {
  const handleEnhance = async () => {
    if (!selectedFile) return;
    if (credits <= 0 && freeUsesLeft <= 0) {
      alert('You have no credits or free uses left. Please recharge.');
      return;
    }

    setProcessing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const imageBase64 = reader.result;

        const uploadRes = await fetch('/api/cloudinary-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 }),
        });

        const { imageUrl } = await uploadRes.json();

        const predictionRes = await fetch('/api/predictions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageUrl, uid: user.uid }),
          body: JSON.stringify({ image: imageUrl, uid: user.uid, mode }),
        });

        const {
          imageUrl: result,
          updatedCredits,
          updatedFreeUsesLeft,
          durationSeconds,
          costCharged
        } = await predictionRes.json();

        alert(`Processing time: ${durationSeconds}s - Charged: $${costCharged}`);
        setResultUrl(result);
        setCredits(updatedCredits);
        setFreeUsesLeft(updatedFreeUsesLeft);
        loadHistory(user.uid);
      } catch (error) {
        console.error('Enhancement error:', error);
        alert('Error during image enhancement.');
      }

      setProcessing(false);
    };

    reader.readAsDataURL(selectedFile);
  };
@@ -160,50 +161,66 @@ export default function AppPage() {
          Free images left: {freeUsesLeft}
        </p>
        <p style={{ fontSize: '1rem', color: '#ccc', marginBottom: '1rem' }}>
          Balance: ${typeof credits === 'number' ? credits.toFixed(2) : '0.00'}
        </p>
        <button onClick={handleRecharge} style={{ background: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', marginBottom: '1rem', cursor: 'pointer' }}>
          Buy Credits
        </button>
        <button
          onClick={() => router.push('/history')}
          style={{
            background: 'linear-gradient(to right, #10b981, #3b82f6)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            marginBottom: '1rem',
            cursor: 'pointer'
          }}
        >
          Images History
        </button>
        <label htmlFor="upload" style={{ display: 'block', marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold', color: '#ccc' }}>Select an image to upscale:</label>
        <input id="upload" type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '1.5rem' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <span style={{ marginRight: '0.5rem' }}>Creative</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={mode === 'precise'}
              onChange={(e) => setMode(e.target.checked ? 'precise' : 'creative')}
            />
            <span className="slider"></span>
          </label>
          <span style={{ marginLeft: '0.5rem' }}>Precise</span>
        </div>
        <p style={{ maxWidth: '600px', margin: '0 auto 1rem', color: '#ccc', fontSize: '0.9rem' }}>
          Creative mode adds extra details, perfect for renders or digital images. Precise mode improves quality without altering the content, ideal for real photos, faces and landscapes.
        </p>

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
                cursor: 'pointer'
              }}
            >
              {processing ? (
                <>
                  Enhancing...
                  <span className="spinner"></span>
                </>
              ) : (
                'Enhance Image'
