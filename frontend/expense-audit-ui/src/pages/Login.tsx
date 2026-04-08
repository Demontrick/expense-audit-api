import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = await authService.login(email, password);
      login(data);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#181825',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: '#1e1e2e',
        padding: '2.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #313244',
      }}>
        <h1 style={{ color: '#cdd6f4', marginBottom: '0.25rem', fontSize: '1.5rem' }}>ExpenseAudit</h1>
        <p style={{ color: '#6c7086', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to your account</p>

        {error && <p style={{ color: '#f38ba8', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</p>}

        <div style={{ marginBottom: '1rem' }}>
          <label style={label}>Email</label>
          <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@test.com" />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={label}>Password</label>
          <input style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
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
        }}>Sign in</button>
      </div>
    </div>
  );
};

const label: React.CSSProperties = {
  display: 'block',
  color: '#a6adc8',
  fontSize: '0.85rem',
  marginBottom: '6px',
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  backgroundColor: '#181825',
  border: '1px solid #313244',
  borderRadius: '6px',
  color: '#cdd6f4',
  fontSize: '0.9rem',
  boxSizing: 'border-box',
};

export default Login;