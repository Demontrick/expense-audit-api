import type { Expense } from '../types';
import { useAuth } from '../context/AuthContext';
import { expenseService } from '../services/api';

interface Props {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

const ExpenseTable = ({ expenses, onDelete }: Props) => {
  const { user } = useAuth();

  const handleDelete = async (id: number) => {
    await expenseService.delete(id);
    onDelete(id);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e1e2e', color: '#cdd6f4' }}>
            <th style={th}>Vendor</th>
            <th style={th}>Amount</th>
            <th style={th}>Category</th>
            <th style={th}>Submitted By</th>
            <th style={th}>Date</th>
            <th style={th}>Status</th>
            <th style={th}>Flag Reason</th>
            {user?.role === 'Admin' && <th style={th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id} style={{
              backgroundColor: e.isFlagged ? '#2d1b1b' : '#1e1e2e',
              borderBottom: '1px solid #313244',
            }}>
              <td style={td}>{e.vendor}</td>
              <td style={td}>${e.amount.toLocaleString()}</td>
              <td style={td}>{e.category}</td>
              <td style={td}>{e.submittedBy}</td>
              <td style={td}>{new Date(e.submittedAt).toLocaleDateString()}</td>
              <td style={td}>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '99px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: e.isFlagged ? '#f38ba8' : '#a6e3a1',
                  color: e.isFlagged ? '#1e0a0a' : '#0a1e0a',
                }}>
                  {e.isFlagged ? 'Flagged' : 'Clean'}
                </span>
              </td>
              <td style={{ ...td, color: '#f38ba8', fontSize: '0.8rem' }}>{e.flagReason ?? '—'}</td>
              {user?.role === 'Admin' && (
                <td style={td}>
                  <button onClick={() => handleDelete(e.id)} style={{
                    padding: '3px 10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #f38ba8',
                    color: '#f38ba8',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const th: React.CSSProperties = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const td: React.CSSProperties = {
  padding: '0.75rem 1rem',
  color: '#cdd6f4',
};

export default ExpenseTable;