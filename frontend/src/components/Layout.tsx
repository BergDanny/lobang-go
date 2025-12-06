import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ 
        background: '#fff', 
        borderBottom: '1px solid #ddd', 
        padding: '15px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link to="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#007bff', 
            textDecoration: 'none' 
          }}>
            Lobang Go
          </Link>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>Home</Link>
                <Link to="/quests" style={{ color: '#333', textDecoration: 'none' }}>Quests</Link>
                <span style={{ color: '#666' }}>{user?.name}</span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: '#333', textDecoration: 'none' }}>Login</Link>
                <Link 
                  to="/register" 
                  style={{ 
                    padding: '8px 16px', 
                    background: '#007bff', 
                    color: 'white', 
                    textDecoration: 'none', 
                    borderRadius: '4px' 
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, background: '#f5f5f5' }}>
        {children}
      </main>

      <footer style={{ 
        background: '#fff', 
        borderTop: '1px solid #ddd', 
        padding: '20px', 
        textAlign: 'center', 
        color: '#666',
        marginTop: 'auto'
      }}>
        <p style={{ margin: 0 }}>© 2025 Lobang Go. All rights reserved.</p>
      </footer>
    </div>
  );
}

