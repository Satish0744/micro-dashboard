export default function EmptyState({ title = 'No data found', message = 'Nothing to display here.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <span className="text-3xl">📭</span>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm">{message}</p>
    </div>
  );
}