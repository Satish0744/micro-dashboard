import { NavLink } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊', end: true },
  { to: '/users', label: 'User Management', icon: '👥' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/products', label: 'Products', icon: '📦' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' }
];

export default function Sidebar({ open, onClose }) {
  const { collapsed, toggle } = useSidebar();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'w-64'}`}
      >
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              title={collapsed ? item.label : ''}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${
                  collapsed ? 'lg:justify-center' : ''
                } ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <span className="text-xl shrink-0">{item.icon}</span>
              <span className={collapsed ? 'lg:hidden' : ''}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* collapse toggle (desktop only) */}
        <button
          onClick={toggle}
          className="hidden lg:flex items-center justify-center m-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs"
        >
          {collapsed ? '→' : '← Collapse'}
        </button>

        {!collapsed && (
          <div className="hidden lg:block p-3">
            <div className="card !p-3 text-xs text-gray-500 dark:text-gray-400">
              <p className="font-semibold mb-1">🚀 Micro-Frontend</p>
              <p>Modular architecture demo</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}