import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonCard } from '../../components/Skeleton.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import { getUsers, getProducts, getTodos } from '../../utils/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { getGreeting, formatNumber } from '../../utils/format.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { push } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [now, setNow] = useState(new Date());

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [users, products, todos] = await Promise.all([
        getUsers(),
        getProducts(),
        getTodos()
      ]);
      setStats({
        users: users.length,
        products: products.length,
        todos: todos.length,
        completed: todos.filter((t) => t.completed).length,
        recentUsers: users.slice(0, 5),
        recentProducts: products.slice(0, 5)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (error) return <ErrorState message={error} onRetry={load} />;

  const cards = stats
    ? [
        { label: 'Total Users', value: stats.users, icon: '👥', color: 'from-blue-500 to-blue-700', to: '/users' },
        { label: 'Products', value: stats.products, icon: '📦', color: 'from-purple-500 to-purple-700', to: '/products' },
        { label: 'Tasks', value: stats.todos, icon: '✅', color: 'from-green-500 to-green-700' },
        { label: 'Completed', value: stats.completed, icon: '🎯', color: 'from-orange-500 to-orange-700', to: '/analytics' }
      ]
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {getGreeting()}, {user?.name} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} ·{' '}
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <button
          onClick={() => {
            load();
            push('Dashboard refreshed', 'success');
          }}
          className="btn-secondary text-sm self-start sm:self-auto"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((c) => {
              const Card = c.to ? Link : 'div';
              const props = c.to ? { to: c.to } : {};
              return (
                <Card
                  key={c.label}
                  {...props}
                  className="card hover:shadow-md hover:-translate-y-0.5 cursor-pointer block"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{c.label}</p>
                      <p className="text-3xl font-bold mt-1">{formatNumber(c.value)}</p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl`}
                    >
                      {c.icon}
                    </div>
                  </div>
                </Card>
              );
            })}
      </div>

      {/* Recent lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Users</h2>
            <Link to="/users" className="text-xs text-primary-600 hover:underline">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton variant="circle" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-1/2" />
                    <Skeleton className="w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold">
                    {u.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{u.name}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Products</h2>
            <Link to="/products" className="text-xs text-primary-600 hover:underline">
              View all →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton variant="circle" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-1/2" />
                    <Skeleton />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {stats.recentProducts.map((p) => (
                <li key={p.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                    📦
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm capitalize truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}