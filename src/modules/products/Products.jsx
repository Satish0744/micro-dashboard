import { useEffect, useMemo, useState } from 'react';
import { SkeletonCard } from '../../components/Skeleton.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import Pagination from '../../components/Pagination.jsx';
import { getProducts, getPhotos } from '../../utils/api.js';
import { useToast } from '../../context/ToastContext.jsx';

const PAGE_SIZE = 8;

export default function Products() {
  const { push } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [posts, photos] = await Promise.all([getProducts(), getPhotos()]);
      const merged = posts.slice(0, 24).map((p, i) => ({
        ...p,
        image: photos[i % photos.length]?.thumbnailUrl,
        price: ((i * 13) % 90) + 10
      }));
      setItems(merged);
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
    return items.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q)
    );
  }, [items, search]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  useEffect(() => setPage(1), [search]);

  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filtered.length} items available
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field sm:max-w-xs"
          />
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            {['grid', 'list'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-2 text-sm ${
                  view === v
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {v === 'grid' ? '⊞' : '☰'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No products found" message="Try a different keyword." />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginated.map((p) => (
            <div
              key={p.id}
              className="card !p-0 overflow-hidden card-hover flex flex-col"
            >
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1">
                  #{p.id} · ${p.price}
                </p>
                <h3 className="font-semibold text-sm capitalize line-clamp-2 mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 flex-1">{p.body}</p>
                <button
                  onClick={() => push(`Added "${p.title.slice(0, 20)}..." to cart`, 'success')}
                  className="btn-primary w-full mt-3 text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((p) => (
            <div key={p.id} className="card !p-3 flex gap-4 items-center">
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                className="w-20 h-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold capitalize truncate">{p.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.body}</p>
                <p className="text-sm font-bold text-primary-600 mt-1">${p.price}</p>
              </div>
              <button
                onClick={() => push('Added to cart', 'success')}
                className="btn-primary text-sm shrink-0"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      )}

      <Pagination
        current={page}
        total={filtered.length}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />
    </div>
  );
}