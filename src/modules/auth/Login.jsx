import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Pre-filled demo credentials
  const [form, setForm] = useState({
    email: 'admin@gmail.com',
    password: '123456'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 dark:bg-gray-900">
      {/* ==============================
          LEFT SIDE — BRANDING (60%)
          ============================== */}
      <div className="relative lg:w-[60%] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[420px] h-[420px] bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl animate-pulse-soft" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8 lg:p-14">
          {/* Top — Logo */}
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold text-xl">
              M
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">MicroDash</p>
              <p className="text-xs text-white/70">Micro-Frontend Platform</p>
            </div>
          </div>

          {/* Middle — Hero */}
          <div className="my-10 lg:my-0 max-w-xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-medium mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              All systems operational
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Welcome to your{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Micro-Frontend
              </span>{' '}
              Dashboard
            </h1>

            <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-8">
              A modular, scalable dashboard where every feature runs as an
              independent micro-frontend — users, analytics, products, and
              notifications all in one place.
            </p>

            {/* Feature summary cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <Feature icon="📊" title="Dashboard" text="Real-time overview" />
              <Feature icon="👥" title="Users" text="Manage your team" />
              <Feature icon="📈" title="Analytics" text="Track performance" />
              <Feature icon="🔔" title="Notifications" text="Never miss updates" />
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-6 border-t border-white/15">
              <Stat value="5+" label="Modules" />
              <Stat value="99.9%" label="Uptime" />
              <Stat value="24/7" label="Support" />
            </div>
          </div>

          {/* Bottom — footer note */}
          <p className="text-white/60 text-xs hidden lg:block">
            © {new Date().getFullYear()} MicroDashboard. Built with React + Vite + Tailwind.
          </p>
        </div>
      </div>

      {/* ==============================
          RIGHT SIDE — LOGIN (40%)
          ============================== */}
      <div className="lg:w-[40%] flex items-center justify-center p-6 sm:p-10 bg-white dark:bg-gray-900 relative">
        {/* Theme toggle (top right corner) */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>

        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile-only logo (since left panel is hidden on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-2xl mb-3">
              M
            </div>
            <p className="font-bold text-lg">MicroDash</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Micro-Frontend Platform
            </p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Welcome back 👋</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Demo credentials hint */}
          <div className="mb-5 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">💡</span>
            <div>
              <p className="font-semibold mb-0.5">Demo credentials pre-filled</p>
              <p className="opacity-90">
                Just click <span className="font-semibold">Sign In</span> to explore.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label !mb-0">Password</label>
                <button
                  type="button"
                  className="text-xs text-primary-600 hover:underline font-medium"
                  onClick={() => setError('Contact your admin to reset the password.')}
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              Remember me for 30 days
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Social buttons (placeholder) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setError('Google sign-in is not configured in this demo.')}
              className="btn-secondary text-sm"
            >
              <span className="text-base">🔵</span> Google
            </button>
            <button
              type="button"
              onClick={() => setError('GitHub sign-in is not configured in this demo.')}
              className="btn-secondary text-sm"
            >
              <span className="text-base">🐙</span> GitHub
            </button>
          </div>

          {/* Sign-up link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-[11px] text-gray-400 dark:text-gray-500 mt-6 leading-relaxed">
            By signing in you agree to our{' '}
            <span className="underline cursor-pointer">Terms</span> &{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small helper components ---------- */

function Feature({ icon, title, text }) {
  return (
    <div className="p-3 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm hover:bg-white/15 transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-white/70 mt-0.5">{text}</p>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/60 uppercase tracking-wider mt-0.5">
        {label}
      </p>
    </div>
  );
}