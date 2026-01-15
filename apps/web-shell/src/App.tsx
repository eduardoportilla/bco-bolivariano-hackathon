import { Suspense, lazy, Component, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@repo/ui/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/Card';
import {
  LoginPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './features/auth';

// Lazy load microfrontend apps
const AccountsApp = lazy(() => import('webAccounts/App'));

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error boundary for handling remote microfrontend failures.
 */
class RemoteErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

interface RemoteUnavailableProps {
  name: string;
  port?: number;
}

/**
 * Fallback component when a remote microfrontend is unavailable.
 */
function RemoteUnavailable({ name, port = 3001 }: RemoteUnavailableProps) {
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
          <Link to="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Home page component.
 */
function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Banco Bolivariano</h1>
          <nav className="flex gap-4">
            <Link to="/">
              <Button variant="ghost">Inicio</Button>
            </Link>
            <Link to="/accounts">
              <Button variant="ghost">Cuentas</Button>
            </Link>
            <Link to="/login">
              <Button>Ingresar</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/accounts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Cuentas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Consulta tus saldos y movimientos en tiempo real.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Transferencias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Realiza transferencias de forma segura y rapida.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Paga tus servicios desde cualquier lugar.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

/**
 * Loading fallback component.
 */
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  );
}

/**
 * Main application component with routing.
 */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shell-owned routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth routes (owned by shell - not a microfrontend) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Microfrontend routes - lazy loaded with error boundaries */}
        <Route
          path="/accounts/*"
          element={
            <RemoteErrorBoundary
              fallback={<RemoteUnavailable name="Cuentas" port={3001} />}
            >
              <Suspense fallback={<Loading />}>
                <AccountsApp />
              </Suspense>
            </RemoteErrorBoundary>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
