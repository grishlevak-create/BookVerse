import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

import { ru } from '@/shared/i18n';
import { reportClientError } from '@/shared/lib/error-monitoring';

import { Button } from './Button';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportClientError(
      error.message,
      error.stack,
      `ErrorBoundary:${errorInfo.componentStack?.slice(0, 200) ?? ''}`,
    );
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center backdrop-blur">
          <AlertTriangle className="h-10 w-10 text-rose-200" aria-hidden />
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-50">
              {ru.errors.boundaryTitle}
            </h2>
            <p className="mt-2 text-sm text-rose-100/80">
              {this.state.message ?? ru.errors.boundaryUnknown}
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={this.handleReset}>
            {ru.errors.retry}
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
