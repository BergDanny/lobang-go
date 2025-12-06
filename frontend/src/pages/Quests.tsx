import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestStore } from '../store/questStore';

export default function Quests() {
  const { quests, fetchQuests, isLoading, error } = useQuestStore();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading quests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #fcc', borderRadius: '8px', background: '#fee' }}>
          <h2>Error Loading Quests</h2>
          <p><strong>Error:</strong> {error}</p>
          <button 
            onClick={fetchQuests} 
            style={{ marginTop: '10px', padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>All Quests</h1>
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

      {quests.length === 0 ? (
        <div style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>No quests found.</p>
          <Link to="/quests/create" style={{ color: '#007bff', textDecoration: 'none', fontSize: '16px' }}>
            Create your first quest!
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {quests.map((quest) => (
            <Link
              key={quest.id}
              to={`/quests/${quest.id}`}
              style={{
                display: 'block',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#fff',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                <h2 style={{ margin: 0, color: '#007bff' }}>{quest.title}</h2>
                <span style={{ 
                  padding: '4px 12px', 
                  background: quest.status === 'open' ? '#28a745' : '#6c757d', 
                  color: 'white', 
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {quest.status}
                </span>
              </div>
              <p style={{ margin: '0 0 15px 0', color: '#666', lineHeight: '1.6' }}>{quest.description}</p>
              <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#888', flexWrap: 'wrap' }}>
                {quest.category && <span><strong>Category:</strong> {quest.category}</span>}
                {quest.location_from && <span><strong>From:</strong> {quest.location_from}</span>}
                {quest.location_to && <span><strong>To:</strong> {quest.location_to}</span>}
                {quest.price && <span><strong>Price:</strong> ${quest.price}</span>}
              </div>
              {quest.poster && (
                <p style={{ margin: '15px 0 0 0', fontSize: '14px', color: '#666' }}>
                  <strong>Posted by:</strong> {quest.poster.name}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

