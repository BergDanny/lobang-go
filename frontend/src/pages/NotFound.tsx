import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '100px auto', 
      padding: '40px', 
      textAlign: 'center' 
    }}>
      <h1 style={{ fontSize: '72px', margin: 0, color: '#007bff' }}>404</h1>
      <h2 style={{ margin: '20px 0' }}>Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        The page you're looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        style={{ 
          padding: '12px 24px', 
          background: '#007bff', 
          color: 'white', 
          textDecoration: 'none', 
          borderRadius: '4px',
          display: 'inline-block'
        }}
      >
        Go Home
      </Link>
    </div>
  );
}

