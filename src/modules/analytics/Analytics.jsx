import { useEffect, useState } from 'react';
import Skeleton from '../../components/Skeleton.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import { getUsers, getProducts, getTodos } from '../../utils/api.js';
import { exportToJSON } from '../../utils/export.js';
import { useToast } from '../../context/ToastContext.jsx';
import { formatNumber } from '../../utils/format.js';

export default function Analytics() {
  const { push } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState('7d');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [users, products, todos] = await Promise.all([
        getUsers(),
        getProducts(),
        getTodos()
      ]);
      const completed = todos.filter((t) => t.completed).length;
      const pending = todos.length - completed;

      const cities = {};
      users.forEach((u) => {
        const c = u.address?.city || 'Unknown';
        cities[c] = (cities[c] || 0) + 1;
      });
      const cityData = Object.entries(cities)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const points = range === '7d' ? 7 : range === '30d' ? 30 : 90;
      const weekly = Array.from({ length: points }, (_, i) => ({
        label: `${i + 1}`,
        value: Math.floor(Math.random() * 80) + 20
      }));

      setData({
        users: users.length,
        products: products.length,
        todos: todos.length,
        completed,
        pending,
        cityData,
        weekly,
        completionRate: Math.round((completed / todos.length) * 100)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [range]);

  if (error) return <ErrorState message={error} onRetry={load} />;

  if (loading)
    return (
      <div className="space-y-6">
        <Skeleton className="w-1/3 h-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
        <Skeleton variant="card" className="h-64" />
      </div>
    );

  const maxWeekly = Math.max(...data.weekly.map((w) => w.value));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Insights & performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="input-field !w-auto text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => {
              exportToJSON(data, 'analytics.json');
              push('Analytics exported', 'success');
            }}
            className="btn-secondary text-sm"
          >
            ⬇ Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Total Users" value={formatNumber(data.users)} color="text-blue-600 dark:text-blue-400" />
        <KPI label="Products" value={formatNumber(data.products)} color="text-purple-600 dark:text-purple-400" />
        <KPI label="Pending Tasks" value={formatNumber(data.pending)} color="text-orange-600 dark:text-orange-400" />
        <KPI label="Completion Rate" value={`${data.completionRate}%`} color="text-green-600 dark:text-green-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold">Activity Trend</h2>
            <span className="text-xs text-gray-500">{range}</span>
          </div>
          <div className="flex items-end justify-between gap-1 h-56 px-1 overflow-x-auto no-scrollbar">
            {data.weekly.map((w, i) => (
              <div key={i} className="flex-1 min-w-[14px] flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-md transition-all duration-500 hover:from-primary-700 hover:to-primary-500"
                    style={{ height: `${(w.value / maxWeekly) * 100}%` }}
                    title={`${w.value}`}
                  />
                </div>
                {(range === '7d' || i % 5 === 0) && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {w.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col items-center justify-center">
          <h2 className="font-semibold mb-4">Task Completion</h2>
          <div className="relative w-40 h-40">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200 dark:text-gray-700" />
              <circle
                cx="80" cy="80" r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 70}
                strokeDashoffset={2 * Math.PI * 70 * (1 - data.completionRate / 100)}
                strokeLinecap="round"
                className="text-primary-600 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold">{data.completionRate}%</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-600" />
              Done: {data.completed}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              Pending: {data.pending}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Top Cities by Users</h2>
        <div className="space-y-3">
          {data.cityData.map(([city, count]) => {
            const pct = (count / data.users) * 100;
            return (
              <div key={city}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{city}</span>
                  <span className="text-gray-500">{count} users</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-700 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, color }) {
  return (
    <div className="card">
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}