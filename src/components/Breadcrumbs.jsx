import { Link, useLocation } from 'react-router-dom';

const LABELS = {
  '': 'Dashboard',
  users: 'User Management',
  analytics: 'Analytics',
  notifications: 'Notifications',
  products: 'Products'
};

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  const crumbs = [
    { to: '/', label: 'Home' },
    ...parts.map((p, i) => ({
      to: '/' + parts.slice(0, i + 1).join('/'),
      label: LABELS[p] || p
    }))
  ];

  if (crumbs.length === 1) {
    crumbs.push({ to: '/', label: 'Dashboard' });
  }

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="opacity-50">/</span>}
          {i === crumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {c.label}
            </span>
          ) : (
            <Link
              to={c.to}
              className="hover:text-primary-600 transition-colors"
            >
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}