'use client';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang='en'>
      <body>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '0 24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Something went wrong</h1>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Please try again. If the issue persists, contact support.
            </p>
            <button
              type='button'
              onClick={() => reset()}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: '#1C2A45',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
