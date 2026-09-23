export default function Pagination({ current, total, onChange, pageSize = 1 }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  const getPages = () => {
    const arr = [];
    const delta = 1;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= current - delta && i <= current + delta)) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== '...') {
        arr.push('...');
      }
    }
    return arr;
  };

  const btn = 'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors';

  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className={`${btn} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40`}
      >
        ←
      </button>
      {getPages().map((p, i) =>
        p === '...' ? (
          <span key={i} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(p)}
            className={`${btn} ${
              p === current
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={current === pages}
        onClick={() => onChange(current + 1)}
        className={`${btn} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40`}
      >
        →
      </button>
    </div>
  );
}