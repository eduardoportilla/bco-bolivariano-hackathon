import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { TransactionType } from '@repo/core/domains/accounts';
import { Button } from '@repo/ui/components/Button';
import { Input } from '@repo/ui/components/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/Card';
import { useAccount, useTransactions } from '../hooks';

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
 * Format date for display.
 */
function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

/**
 * Account movements page component.
 */
export function AccountMovementsPage() {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');

  const { data: account } = useAccount(id ?? '');
  const { data: transactions, isLoading, error } = useTransactions(id ?? '', {
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    type: typeFilter || undefined,
    limit: 50,
  });

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Movimientos</h1>
            {account && (
              <p className="text-muted-foreground">
                {account.name} - {account.number}
              </p>
            )}
          </div>
          <Link to={`/accounts/${id}`}>
            <Button variant="outline">Volver a la cuenta</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Fecha inicio
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  Fecha fin
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Tipo
                </label>
                <select
                  id="type"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as TransactionType | '')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Todos</option>
                  <option value="credit">Creditos</option>
                  <option value="debit">Debitos</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setTypeFilter('');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Historial de movimientos
              {transactions && ` (${transactions.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            )}

            {error && (
              <p className="text-destructive text-center py-4">
                Error al cargar los movimientos. Por favor, intenta nuevamente.
              </p>
            )}

            {transactions && transactions.length === 0 && (
              <p className="text-muted-foreground text-center py-8">
                No se encontraron movimientos con los filtros seleccionados.
              </p>
            )}

            {transactions && transactions.length > 0 && account && (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.createdAt)}
                      </p>
                      {transaction.reference && (
                        <p className="text-xs text-muted-foreground">
                          Referencia: {transaction.reference}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'credit'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        {formatCurrency(transaction.amount, account.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {transaction.type === 'credit' ? 'Credito' : 'Debito'}
                      </p>
                    </div>
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
