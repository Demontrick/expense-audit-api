import { useEffect, useState } from 'react';
import type { Expense } from '../types';
import { expenseService } from '../services/api';
import ExpenseTable from '../components/ExpenseTable';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filter, setFilter] = useState<'all' | 'flagged' | 'clean'>('all');
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    setLoading(true);
    const flagged = filter === 'flagged' ? true : filter === 'clean' ? false : undefined;
    const data = await expenseService.getAll(flagged);
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => { fetchExpenses(); }, [filter]);

  const handleDelete = (id: number) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const flaggedCount = expenses.filter(e => e.isFlagged).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#181825' }}>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Expenses', value: expenses.length },
            { label: 'Flagged', value: flaggedCount },
            { label: 'Clean', value: expenses.length - flaggedCount },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: '#1e1e2e',
              border: '1px solid #313244',
              borderRadius: '10px',
              padding: '1.25rem 1.5rem',
              flex: 1,
            }}>
              <p style={{ color: '#6c7086', fontSize: '0.8rem', marginBottom: '4px' }}>{stat.label}</p>
              <p style={{ color: '#cdd6f4', fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['all', 'flagged', 'clean'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              border: '1px solid #313244',
              backgroundColor: filter === f ? '#89b4fa' : 'transparent',
              color: filter === f ? '#1e1e2e' : '#cdd6f4',
              cursor: 'pointer',
              fontWeight: filter === f ? 600 : 400,
              textTransform: 'capitalize',
            }}>{f}</button>
          ))}
        </div>

        {loading ? (
          <p style={{ color: '#6c7086' }}>Loading...</p>
        ) : expenses.length === 0 ? (
          <p style={{ color: '#6c7086' }}>No expenses found.</p>
        ) : (
          <ExpenseTable expenses={expenses} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;