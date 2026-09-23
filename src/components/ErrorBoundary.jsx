import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (or send to error tracking service like Sentry)
    console.error('🛑 ErrorBoundary caught an error:', error);
    console.error('📌 Component stack:', errorInfo?.componentStack);

    this.setState({ errorInfo });

    // OPTIONAL: Send to your error logging service
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4 animate-fade-in">
          <div className="card max-w-lg w-full text-center !p-8">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
              <span className="text-4xl">💥</span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              An unexpected error occurred while rendering this section.
              You can try to recover or reload the page.
            </p>

            {/* Error message (only in dev) */}
            {isDev && error && (
              <div className="mb-5 text-left">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Error message
                </p>
                <pre className="text-xs bg-gray-100 dark:bg-gray-900 text-red-600 dark:text-red-400 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-words border border-gray-200 dark:border-gray-700">
                  {error.toString()}
                </pre>
              </div>
            )}

            {/* Component stack (dev only) */}
            {isDev && errorInfo?.componentStack && (
              <details className="mb-5 text-left">
                <summary className="cursor-pointer text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide hover:text-primary-600">
                  Component Stack
                </summary>
                <pre className="mt-2 text-[10px] bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap break-words border border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button onClick={this.handleReset} className="btn-primary">
                🔄 Try Again
              </button>
              <button onClick={this.handleReload} className="btn-secondary">
                ♻️ Reload Page
              </button>
              <button onClick={this.handleGoHome} className="btn-secondary">
                🏠 Go Home
              </button>
            </div>

            {/* Support hint */}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}