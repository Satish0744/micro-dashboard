import { useToast } from '../context/ToastContext.jsx';

const STYLES = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-primary-600 text-white',
  warning: 'bg-yellow-500 text-white'
};

const ICONS = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

export default function ToastContainer() {
  const { toasts, remove } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => remove(t.id)}
          className={`pointer-events-auto cursor-pointer ${STYLES[t.type]} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[260px] max-w-sm animate-fade-in`}
        >
          <span className="text-lg">{ICONS[t.type]}</span>
          <span className="text-sm font-medium flex-1">{t.message}</span>
          <button className="opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}