import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useQuestStore } from '../store/questStore';

export default function Home() {
  const { user } = useAuthStore();
  const { quests, fetchQuests, isLoading } = useQuestStore();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1>Welcome, {user?.name}!</h1>
        <p style={{ color: '#666' }}>Email: {user?.email}</p>
      </div>

      <div style={{ marginBottom: '30px', display: 'flex', gap: '15px' }}>
        <Link 
          to="/quests" 
          style={{ 
            padding: '12px 24px', 
            background: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          View All Quests
        </Link>
        <Link 
          to="/quests/create" 
          style={{ 
            padding: '12px 24px', 
            background: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: '500'
          }}
        >
          Create New Quest
        </Link>
      </div>

      <div>
        <h2>Recent Quests</h2>
        {isLoading ? (
          <p>Loading quests...</p>
        ) : quests.length === 0 ? (
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
            <p>No quests found. <Link to="/quests/create" style={{ color: '#007bff' }}>Create your first quest!</Link></p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
            {quests.slice(0, 5).map((quest) => (
              <Link
                key={quest.id}
                to={`/quests/${quest.id}`}
                style={{
                  display: 'block',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  background: '#f9f9f9',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{quest.title}</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666' }}>{quest.description}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#888' }}>
                  <span><strong>Status:</strong> {quest.status}</span>
                  {quest.category && <span><strong>Category:</strong> {quest.category}</span>}
                  {quest.price && <span><strong>Price:</strong> ${quest.price}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
        {quests.length > 5 && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/quests" style={{ color: '#007bff', textDecoration: 'none' }}>
              View all {quests.length} quests →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

