/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from '../src/account.entity';
import { AccountRepository } from '../src/account.repository';

export function createMockAccountRepo(): jest.Mocked<AccountRepository> {
  return {
    findById: jest.fn(),
    save: jest.fn(),
    exists: jest.fn(),
  } as any;
}

export function makeAccount(overrides?: Partial<Account>): Account {
  return new Account(
    overrides?.id ?? 'acc-1',
    overrides?.name ?? 'Test Account',
    overrides?.direction ?? 'debit',
    overrides?.balance ?? 0,
  );
}
