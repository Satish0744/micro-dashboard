import { useEffect, useMemo, useState } from 'react';
import Loader from '../../components/Loader.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { getUsers } from '../../utils/api.js';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.company?.name.toLowerCase().includes(q)
    );
  }, [users, search]);

  if (loading) return <Loader text="Loading users..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {users.length} users total
          </p>
        </div>
        <input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:max-w-xs"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No users match your search"
          message="Try a different keyword."
        />
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold hidden md:table-cell">Company</th>
                  <th className="px-4 py-3 font-semibold hidden lg:table-cell">City</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold text-xs">
                          {u.name[0]}
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600 dark:text-gray-400">
                      {u.company?.name}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                      {u.address?.city}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelected(u)}
                        className="text-primary-600 hover:underline text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="card max-w-md w-full !p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                  {selected.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-base">{selected.name}</p>
                  <p className="text-gray-500">{selected.email}</p>
                </div>
              </div>
              <Row label="Phone" value={selected.phone} />
              <Row label="Website" value={selected.website} />
              <Row label="Company" value={selected.company?.name} />
              <Row label="City" value={selected.address?.city} />
              <Row label="Street" value={selected.address?.street} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-right truncate">{value}</span>
    </div>
  );
}