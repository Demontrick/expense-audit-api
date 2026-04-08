import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Submit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vendor: '',
    amount: '',
    category: '',
    submittedBy: user?.email ?? '',
  });
  const [result, setResult] = useState<{ isFlagged: boolean; flagReason?: string } | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const data = await expenseService.create({
        vendor: form.vendor,
        amount: parseFloat(form.amount),
        category: form.category,
        submittedBy: form.submittedBy,
      });
      setResult(data);
    } catch {
      setError('Failed to submit expense');
    }
  };

  if (result) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#181825' }}>
        <Navbar />
        <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: result.isFlagged ? '#2d1b1b' : '#1a2d1b',
            border: `1px solid ${result.isFlagged ? '#f38ba8' : '#a6e3a1'}`,
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{result.isFlagged ? '⚠️' : '✅'}</p>
            <h2 style={{ color: result.isFlagged ? '#f38ba8' : '#a6e3a1', marginBottom: '0.5rem' }}>
              {result.isFlagged ? 'Expense Flagged' : 'Expense Submitted'}
            </h2>
            {result.flagReason && <p style={{ color: '#cdd6f4', fontSize: '0.9rem' }}>{result.flagReason}</p>}
            <button onClick={() => navigate('/dashboard')} style={{
              marginTop: '1.5rem',
              padding: '0.6rem 1.5rem',
              backgroundColor: '#89b4fa',
              color: '#1e1e2e',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
            }}>View Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#181825' }}>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        <h2 style={{ color: '#cdd6f4', marginBottom: '1.5rem' }}>Submit Expense</h2>

        {error && <p style={{ color: '#f38ba8', marginBottom: '1rem' }}>{error}</p>}

        {[
          { label: 'Vendor', key: 'vendor', type: 'text', placeholder: 'e.g. Acme Corp' },
          { label: 'Amount ($)', key: 'amount', type: 'number', placeholder: 'e.g. 1500' },
          { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. Travel' },
          { label: 'Submitted By', key: 'submittedBy', type: 'email', placeholder: 'email' },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#a6adc8', fontSize: '0.85rem', marginBottom: '6px' }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                backgroundColor: '#181825',
                border: '1px solid #313244',
                borderRadius: '6px',
                color: '#cdd6f4',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
              }}
            />
          </div>
        ))}

        <button onClick={handleSubmit} style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#89b4fa',
          color: '#1e1e2e',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.95rem',
        }}>Submit Expense</button>
      </div>
    </div>
  );
};

export default Submit;