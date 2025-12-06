import { useEffect } from 'react';
import { useQuestStore } from '../store/questStore';

export default function TestQuests() {
  const { quests, fetchQuests, isLoading, error } = useQuestStore();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
        <h2>Loading Quests...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', border: '1px solid #fcc', borderRadius: '8px', margin: '20px', background: '#fee' }}>
        <h2>❌ Error Loading Quests</h2>
        <p><strong>Error:</strong> {error}</p>
        <button onClick={fetchQuests} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h2>Quests ({quests.length})</h2>
      
      {quests.length === 0 ? (
        <p>No quests found. Make sure you're authenticated and the backend is running.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
          {quests.map((quest) => (
            <div
              key={quest.id}
              style={{
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f9f9f9',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{quest.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{quest.description}</p>
              <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#888' }}>
                <span><strong>Status:</strong> {quest.status}</span>
                {quest.category && <span><strong>Category:</strong> {quest.category}</span>}
                {quest.price && <span><strong>Price:</strong> ${quest.price}</span>}
              </div>
              {quest.poster && (
                <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#666' }}>
                  <strong>Posted by:</strong> {quest.poster.name} ({quest.poster.email})
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchQuests}
        style={{ marginTop: '15px', padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Refresh Quests
      </button>
    </div>
  );
}

