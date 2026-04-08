import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e1e2e',
      color: '#fff',
    }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>ExpenseAudit</span>
        <Link to="/dashboard" style={{ color: '#cdd6f4', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/submit" style={{ color: '#cdd6f4', textDecoration: 'none' }}>Submit Expense</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#a6adc8' }}>{user?.email} · {user?.role}</span>
        <button onClick={handleLogout} style={{
          padding: '0.4rem 1rem',
          backgroundColor: 'transparent',
          border: '1px solid #6c7086',
          color: '#cdd6f4',
          borderRadius: '6px',
          cursor: 'pointer',
        }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;