import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestStore } from '../store/questStore';

export default function QuestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentQuest, fetchQuestById, isLoading, error, deleteQuest } = useQuestStore();

  useEffect(() => {
    if (id) {
      fetchQuestById(id);
    }
  }, [id, fetchQuestById]);

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this quest?')) {
      try {
        await deleteQuest(id);
        navigate('/quests');
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuest) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <div style={{ padding: '20px', border: '1px solid #fcc', borderRadius: '8px', background: '#fee' }}>
          <h2>Error Loading Quest</h2>
          <p><strong>Error:</strong> {error || 'Quest not found'}</p>
          <Link to="/quests" style={{ color: '#007bff', textDecoration: 'none' }}>
            ← Back to Quests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <Link 
        to="/quests" 
        style={{ 
          display: 'inline-block', 
          marginBottom: '20px', 
          color: '#007bff', 
          textDecoration: 'none' 
        }}
      >
        ← Back to Quests
      </Link>

      <div style={{ padding: '30px', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
          <h1 style={{ margin: 0 }}>{currentQuest.title}</h1>
          <span style={{ 
            padding: '6px 16px', 
            background: currentQuest.status === 'open' ? '#28a745' : '#6c757d', 
            color: 'white', 
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {currentQuest.status}
          </span>
        </div>

        <p style={{ fontSize: '18px', color: '#666', lineHeight: '1.8', marginBottom: '30px' }}>
          {currentQuest.description}
        </p>

        <div style={{ 
          padding: '20px', 
          background: '#f9f9f9', 
          borderRadius: '8px', 
          marginBottom: '30px' 
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Quest Details</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {currentQuest.category && (
              <div>
                <strong>Category:</strong> {currentQuest.category}
              </div>
            )}
            {currentQuest.location_from && (
              <div>
                <strong>From:</strong> {currentQuest.location_from}
              </div>
            )}
            {currentQuest.location_to && (
              <div>
                <strong>To:</strong> {currentQuest.location_to}
              </div>
            )}
            {currentQuest.bounty && (
              <div>
                <strong>Bounty:</strong> ${currentQuest.bounty}
              </div>
            )}
            <div>
              <strong>Created:</strong> {new Date(currentQuest.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {currentQuest.poster && (
          <div style={{ marginBottom: '30px', padding: '15px', background: '#f0f0f0', borderRadius: '8px' }}>
            <strong>Posted by:</strong> {currentQuest.poster.name} ({currentQuest.poster.email})
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link 
            to={`/quests/${currentQuest.id}/edit`}
            style={{ 
              padding: '10px 20px', 
              background: '#007bff', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px' 
            }}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            style={{ 
              padding: '10px 20px', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

