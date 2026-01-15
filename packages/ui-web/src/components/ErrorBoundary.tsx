import { Component, type ReactNode } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Generic error boundary component for catching React errors.
 * Can be used with a custom fallback or the default error UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">
                Algo salio mal
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Ha ocurrido un error inesperado.
              </p>
              <Button onClick={this.handleReset} variant="outline">
                Intentar nuevamente
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

interface RemoteErrorBoundaryProps {
  children: ReactNode;
  name: string;
  port?: number;
  homePath?: string;
}

interface RemoteErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary specifically for remote microfrontend failures.
 * Shows a user-friendly message when a remote module fails to load.
 */
export class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  constructor(props: RemoteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): RemoteErrorBoundaryState {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { name, port = 3001, homePath = '/' } = this.props;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-destructive">
                Servicio no disponible
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                El modulo de {name} no esta disponible en este momento.
              </p>
              <p className="text-sm text-muted-foreground">
                Asegurate de que el servicio este corriendo en el puerto {port}.
              </p>
              <a href={homePath}>
                <Button variant="outline">Volver al inicio</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
