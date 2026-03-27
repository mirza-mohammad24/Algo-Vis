/**
 * @file ErrorBoundary.tsx
 *
 * @description
 * A protective wrapper that catches JavaScript errors anywhere in its child component tree.
 * Instead of letting the application crash to a blank white screen, it intercepts the error,
 * logs it, and displays a graceful fallback UI.
 *
 * @architecture
 * WHY A CLASS COMPONENT?
 * In modern React, functional components and hooks are the standard. However, React currently
 * does not provide a hook equivalent for error boundaries. The lifecycle methods required to
 * catch rendering errors (`getDerivedStateFromError` and `componentDidCatch`) only exist in
 * Class Components. Therefore, this component is intentionally implemented as a class to
 * provide robust application-level crash protection.
 */

import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

/**
 * Props outline what the component accepts.
 * `children` represents whatever components are wrapped inside <ErrorBoundary>...</ErrorBoundary>
 */
interface Props {
  children: ReactNode;
}

/**
 * State tracks whether an error has occurred and stores the error details.
 */
interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  /**
   * Initializes the component's state. We start assuming there are no errors.
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * THE TRIPWIRE (`getDerivedStateFromError`)
   * This is a special React lifecycle method. If any component inside the boundary throws an error,
   * React automatically calls this method before the next render.
   * We return a new state object flipping `hasError` to true.
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * THE BLACK BOX RECORDER (`componentDidCatch`)
   * This is used for side-effects, like logging the error to an external service
   * (e.g., Sentry) or the browser console so developers can debug it later.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Engine Error Caught:', error, errorInfo);
  }

  /**
   * THE SWITCH (`render`)
   * React calls this to figure out what to draw on the screen.
   * If the tripwire was triggered (`this.state.hasError`), we draw the fallback UI.
   * If everything is fine, we just return `this.props.children` (the normal application).
   */
  render() {
    if (this.state.hasError) {
      // The Graceful Fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-100 p-8 text-center bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-900/50 m-4 animate-in fade-in duration-300">
          <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-3">
            Visualization Engine Crashed
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-8 max-w-md mx-auto">
            {this.state.error?.message || 'An unexpected error occurred in the sorting logic.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Reboot Engine
          </button>
        </div>
      );
    }

    // Normal Execution: Render the wrapped components
    return this.props.children;
  }
}
