import type { AccountElement } from '../auth/auth-db.reponse';
import { DocumentType } from '../auth/auth-db.reponse';
import type { Account, AccountType, Currency } from './types';

const DEFAULT_CREATED_AT = '1970-01-01T00:00:00Z';

function mapAccountType(code: DocumentType): AccountType {
  switch (code) {
    case DocumentType.A:
      return 'savings';
    case DocumentType.C:
    case DocumentType.T:
    default:
      return 'checking';
  }
}

function mapCurrency(currency: string | undefined): Currency {
  return currency === 'EUR' ? 'EUR' : 'USD';
}

function getBalanceAndAvailable(element: AccountElement): { balance: number; availableBalance: number } {
  const balances = element.balances ?? [];
  if (balances.length === 0) {
    return { balance: 0, availableBalance: 0 };
  }
  const available = balances.find(
    (b) =>
      b.balanceType?.toUpperCase() === 'AVAILABLE' || b.balanceType?.toUpperCase() === 'DISPONIBLE'
  );
  const first = balances[0];
  const balance = first?.amount ?? 0;
  const availableBalance = available?.amount ?? balance;
  return { balance, availableBalance };
}

export class AccountsMapper {
  static toAccount(element: AccountElement): Account {
    const { balance, availableBalance } = getBalanceAndAvailable(element);
    const currency = element.balances?.[0]?.currency;
    return {
      id: element.accountIdentifier || String(element.accountId),
      name: element.accountAliasName || element.accountTypeLabel || '',
      number: element.accountNumber,
      type: mapAccountType(element.accountTypeCode),
      balance,
      availableBalance,
      currency: mapCurrency(currency),
      isPrimary: element.isFavorite,
      createdAt: DEFAULT_CREATED_AT,
    };
  }

  static toAccountList(elements: AccountElement[]): Account[] {
    return elements.map((el) => AccountsMapper.toAccount(el));
  }
}
