import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@repo/ui/components/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/Card';

const RemoteLogin = lazy(() => import('webAuth/LoginPage'));

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
            <Link to="/login">
              <Button>Ingresar</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Cuentas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Consulta tus saldos y movimientos en tiempo real.
              </p>
            </CardContent>
          </Card>

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

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <RemoteLogin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
