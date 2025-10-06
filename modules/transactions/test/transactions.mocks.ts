/* eslint-disable @typescript-eslint/no-explicit-any */
import { AccountRepository } from '@accounts/account.repository';

import { TransactionsRepository } from '../src/transactions.repository';
import { Transaction, Entry } from '../src/transactions.entity';

export function createMockAccountRepo(): jest.Mocked<AccountRepository> {
  return {
    findById: jest.fn(),
    save: jest.fn(),
    exists: jest.fn(),
  } as any;
}

export function createMockTransactionRepo(): jest.Mocked<TransactionsRepository> {
  return {
    findById: jest.fn(),
    save: jest.fn(),
    exists: jest.fn(),
  } as any;
}

export function makeEntry(overrides?: Partial<Entry>): Entry {
  return new Entry(
    overrides?.id ?? 'entry-1',
    overrides?.account_id ?? 'acc-1',
    overrides?.direction ?? 'debit',
    overrides?.amount ?? 100,
  );
}

export function makeTransaction(overrides?: Partial<Transaction>): Transaction {
  return new Transaction(
    overrides?.id ?? 'tx-1',
    overrides?.name ?? 'test',
    overrides?.entries ?? [makeEntry(), makeEntry({ direction: 'credit' })],
  );
}
