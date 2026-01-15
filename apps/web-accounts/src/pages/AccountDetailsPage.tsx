import { Link, useParams } from 'react-router-dom';
import { formatCurrency, formatDate } from '@repo/core/shared/utils';
import { Button } from '@repo/ui/components/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@repo/ui/components/Card';
import { useAccount, useTransactions } from '../hooks';

/**
 * Account type labels in Spanish.
 */
const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: 'Cuenta Corriente',
  savings: 'Cuenta de Ahorros',
};

/**
 * Loading skeleton for account details.
 */
function AccountDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-muted rounded w-1/4" />
        </CardContent>
      </Card>
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-5 bg-muted rounded w-1/4" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Account details page component.
 */
export function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: account, isLoading: isLoadingAccount, error: accountError } = useAccount(id ?? '');
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactions(id ?? '', { limit: 10 });

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">ID de cuenta no especificado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingAccount) {
    return (
      <div className="container mx-auto px-4 py-8">
        <AccountDetailsSkeleton />
      </div>
    );
  }

  if (accountError || !account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6 space-y-4">
            <p className="text-destructive">
              Error al cargar la cuenta. Por favor, intenta nuevamente.
            </p>
            <Link to="/accounts">
              <Button variant="outline">Volver a cuentas</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{account.name}</h1>
            <p className="text-muted-foreground">
              {ACCOUNT_TYPE_LABELS[account.type] ?? account.type} - {account.number}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/accounts/${id}/movements`}>
              <Button variant="outline">Ver todos los movimientos</Button>
            </Link>
            <Link to="/accounts">
              <Button variant="ghost">Volver</Button>
            </Link>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Saldo</CardTitle>
            <CardDescription>Ultima actualizacion: {formatDate(account.createdAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Saldo total</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(account.balance, account.currency)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo disponible</p>
                <p className="text-2xl font-semibold text-muted-foreground">
                  {formatCurrency(account.availableBalance, account.currency)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Ultimos movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            )}

            {transactions && transactions.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No hay movimientos recientes.
              </p>
            )}

            {transactions && transactions.length > 0 && (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                        {transaction.reference && ` - Ref: ${transaction.reference}`}
                      </p>
                    </div>
                    <p
                      className={`font-bold ${
                        transaction.type === 'credit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : '-'}
                      {formatCurrency(transaction.amount, account.currency)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
