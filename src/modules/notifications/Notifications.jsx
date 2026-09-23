import { useEffect, useState } from 'react';
import Skeleton from '../../components/Skeleton.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { getComments } from '../../utils/api.js';
import { timeAgo } from '../../utils/format.js';
import { useToast } from '../../context/ToastContext.jsx';

const TYPE_STYLES = {
  info: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: 'ℹ️' },
  success: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', icon: '✅' },
  warning: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400', icon: '⚠️' },
  error: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', icon: '🚨' }
};

const STORAGE_KEY = 'mf_notifications_state';

export default function Notifications() {
  const { push } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const comments = await getComments();
      const types = ['info', 'success', 'warning', 'error'];
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const mapped = comments.slice(0, 30).map((c, i) => ({
        id: c.id,
        title: c.name,
        body: c.body,
        email: c.email,
        type: types[i % types.length],
        read: saved[c.id]?.read ?? false,
        pinned: saved[c.id]?.pinned ?? false,
        time: Date.now() - i * 3600000 * Math.random() * 6
      }));
      setNotifications(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // persist state
  useEffect(() => {
    if (!notifications.length) return;
    const obj = {};
    notifications.forEach((n) => {
      obj[n.id] = { read: n.read, pinned: n.pinned };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  }, [notifications]);

  const filtered = (() => {
    let list = notifications;
    if (filter === 'unread') list = list.filter((n) => !n.read);
    else if (filter === 'read') list = list.filter((n) => n.read);
    else if (filter === 'pinned') list = list.filter((n) => n.pinned);
    else if (filter !== 'all') list = list.filter((n) => n.type === filter);

    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  })();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    push('All marked as read', 'success');
  };

  const toggleRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  const togglePin = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  if (loading)
    return (
      <div className="space-y-4">
        <Skeleton className="w-1/3 h-8" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-24" />
        ))}
      </div>
    );

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            You have <span className="text-primary-600 font-semibold">{unreadCount}</span> unread
          </p>
        </div>
        <button onClick={markAllRead} className="btn-secondary text-sm self-start sm:self-auto">
          Mark all as read
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['all', 'unread', 'read', 'pinned', 'info', 'success', 'warning', 'error'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="All clear!" message="No notifications to show here." />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const style = TYPE_STYLES[n.type];
            return (
              <div
                key={n.id}
                className={`card !p-4 hover:shadow-md transition-all ${
                  !n.read ? 'border-l-4 border-l-primary-600' : ''
                } ${n.pinned ? 'ring-1 ring-primary-300 dark:ring-primary-700' : ''}`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-lg`}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className="font-semibold capitalize truncate cursor-pointer"
                        onClick={() => toggleRead(n.id)}
                      >
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => togglePin(n.id)}
                          title={n.pinned ? 'Unpin' : 'Pin'}
                          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                            n.pinned ? 'text-primary-600' : 'text-gray-400'
                          }`}
                        >
                          📌
                        </button>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary-600 mt-1.5" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {n.body}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      <span className="text-xs text-gray-500 truncate">
                        {n.email} · {timeAgo(n.time)}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                        {n.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}