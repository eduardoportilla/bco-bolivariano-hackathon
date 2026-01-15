import { Link } from 'react-router-dom';
import type { Account } from '@repo/core/domains/accounts';
import { Button } from '@repo/ui/components/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@repo/ui/components/Card';
import { useAccounts } from '../hooks';

/**
 * Format currency amount.
 */
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Account type labels in Spanish.
 */
const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Cuenta Corriente',
  savings: 'Cuenta de Ahorros',
};

interface AccountCardProps {
  account: Account;
}

/**
 * Card component for displaying account summary.
 */
function AccountCard({ account }: AccountCardProps) {
  return (
    <Link to={account.id}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{account.name}</CardTitle>
              <CardDescription>
                {ACCOUNT_TYPE_LABELS[account.type] ?? account.type} - ****
                {account.number.slice(-4)}
              </CardDescription>
            </div>
            {account.isPrimary && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                Principal
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <p className="text-2xl font-bold">
              {formatCurrency(account.balance, account.currency)}
            </p>
            <p className="text-sm text-muted-foreground">
              Disponible: {formatCurrency(account.availableBalance, account.currency)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Loading skeleton for accounts list.
 */
function AccountsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Accounts list page component.
 */
export function AccountsListPage() {
  const { data: accounts, isLoading, error } = useAccounts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Mis Cuentas</h1>
            <p className="text-muted-foreground">
              Consulta tus saldos y movimientos
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">Volver</Button>
          </Link>
        </div>

        {isLoading && <AccountsSkeleton />}

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">
                Error al cargar las cuentas. Por favor, intenta nuevamente.
              </p>
            </CardContent>
          </Card>
        )}

        {accounts && accounts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No tienes cuentas registradas.
              </p>
            </CardContent>
          </Card>
        )}

        {accounts && accounts.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
