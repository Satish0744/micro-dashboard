import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const COMMANDS = [
  { id: 'dash', label: 'Go to Dashboard', icon: '📊', path: '/' },
  { id: 'users', label: 'Go to User Management', icon: '👥', path: '/users' },
  { id: 'analytics', label: 'Go to Analytics', icon: '📈', path: '/analytics' },
  { id: 'notifications', label: 'Go to Notifications', icon: '🔔', path: '/notifications' },
  { id: 'products', label: 'Go to Products', icon: '📦', path: '/products' }
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { toggleTheme, theme } = useTheme();
  const { logout } = useAuth();

  const actions = useMemo(
    () => [
      ...COMMANDS,
      {
        id: 'theme',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
        icon: theme === 'dark' ? '☀️' : '🌙',
        run: toggleTheme
      },
      { id: 'logout', label: 'Logout', icon: '🚪', run: logout }
    ],
    [theme, toggleTheme, logout]
  );

  const filtered = useMemo(
    () =>
      actions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase())
      ),
    [actions, query]
  );

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const execute = (action) => {
    if (action.path) navigate(action.path);
    if (action.run) action.run();
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands or navigate..."
            className="w-full py-4 bg-transparent focus:outline-none text-sm"
          />
          <kbd className="hidden sm:block text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500">
              No commands found
            </p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                onClick={() => execute(a)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-left text-sm"
              >
                <span className="text-lg">{a.icon}</span>
                <span className="flex-1">{a.label}</span>
                <span className="text-xs text-gray-400">↵</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}