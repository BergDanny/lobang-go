import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestStore } from '../store/questStore';

export default function CreateQuest() {
  const navigate = useNavigate();
  const { createQuest, isLoading, error } = useQuestStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location_from: '',
    location_to: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createQuest({
        ...formData,
        price: formData.price ? parseFloat(formData.price) : undefined,
        status: 'open',
      });
      navigate('/quests');
    } catch (err) {
      console.error('Create quest error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Create New Quest</h1>

      {error && (
        <div style={{ padding: '15px', background: '#fee', color: '#c00', borderRadius: '4px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
            placeholder="Enter quest title"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={6}
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', fontFamily: 'inherit' }}
            placeholder="Enter quest description"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              placeholder="e.g., Delivery, Shopping"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Price</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              placeholder="0.00"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Location From</label>
            <input
              type="text"
              value={formData.location_from}
              onChange={(e) => setFormData({ ...formData, location_from: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              placeholder="Starting location"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Location To</label>
            <input
              type="text"
              value={formData.location_to}
              onChange={(e) => setFormData({ ...formData, location_to: e.target.value })}
              style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }}
              placeholder="Destination"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              padding: '12px 24px', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {isLoading ? 'Creating...' : 'Create Quest'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/quests')}
            style={{ 
              padding: '12px 24px', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

