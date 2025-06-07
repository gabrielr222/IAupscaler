// frontend/src/pages/index.js

export default function Home() {
  return (
    <>
      <header style={{ background: '#0d1117', color: 'white', padding: '2rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: '1.2' }}>
          Upscale and enhance your images with <span style={{ background: 'linear-gradient(to right, #00c6ff, #00ffcc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>PixUpscaler</span>
        </h1>
        <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#ccc' }}>
          PixUpscaler is a high-resolution AI image enhancer that improves your photos in just one click.
        </p>
      </header>

      <div style={{ background: '#0d1117', textAlign: 'center', paddingBottom: '3rem' }}>
        <a href="/login" style={{
          display: 'inline-block',
          background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
          color: 'white',
          padding: '0.9rem 2rem',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 'bold',
          fontSize: '1rem',
          transition: 'transform 0.2s ease-in-out',
          marginTop: '2rem'
        }} onMouseOver={e => e.target.style.transform = 'scale(1.05)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>
          Start upscaling now →
        </a>

        <p style={{ marginTop: '1rem', color: '#aaa', fontSize: '0.9rem' }}>✨ Millions of images enhanced</p>

        <div style={{ marginTop: '2rem', color: '#eee', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto', fontSize: '1.4rem', fontWeight: '600' }}>
          <p><strong>Affordable and flexible pricing:</strong> PixUpscaler is the most cost-effective AI upscaling service on the market. You only pay for what you use — no mandatory monthly subscriptions.</p>
        </div>
      </div>

      <div style={{ background: '#0d1117', color: 'white', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.6rem', marginBottom: '3rem', textAlign: 'center', fontWeight: '800', color: 'white' }}>
            <span style={{ background: 'linear-gradient(to right, #06b6d4, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Examples</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ transition: 'transform 0.3s ease', cursor: 'pointer', textAlign: 'center' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.01)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)' }>
                <img src={`/examples/sample${i}.jpg`} alt={`Example ${i}`} style={{ width: '100%', maxWidth: '1200px', borderRadius: '12px', boxShadow: '0 6px 30px rgba(0,0,0,0.4)' }} />
                <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc', fontSize: '1.3rem' }}>Before / After</p>
                {i < 4 && <hr style={{ marginTop: '3rem', borderColor: '#333' }} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background: '#0d1117', textAlign: 'center', fontSize: '0.9rem', color: '#777', padding: '2rem 0' }}>
        © 2025 PixUpscaler. All rights reserved.
      </footer>
    </>
  );
}
