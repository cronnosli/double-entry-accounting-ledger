/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account } from '@accounts/account.entity';

import { TransactionsUseCase } from '../src/transactions.usecase';
import {
  createMockAccountRepo,
  createMockTransactionRepo,
  makeTransaction,
  makeEntry,
} from './transactions.mocks';

describe('TransactionsUseCase', () => {
  let usecase: TransactionsUseCase;
  let txRepo: ReturnType<typeof createMockTransactionRepo>;
  let accRepo: ReturnType<typeof createMockAccountRepo>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let account: Account;

  beforeEach(() => {
    txRepo = createMockTransactionRepo();
    accRepo = createMockAccountRepo();
    account = new Account('acc-1', 'Cash', 'debit', 0);
    usecase = new TransactionsUseCase(txRepo, accRepo);
  });

  it('should register a valid transaction and update balances', async () => {
    const tx = makeTransaction({
      entries: [
        makeEntry({ account_id: 'acc-1', direction: 'debit', amount: 50 }),
        makeEntry({ account_id: 'acc-2', direction: 'credit', amount: 50 }),
      ],
    });

    accRepo.findById.mockImplementation((id: string) =>
      id === 'acc-1' || id === 'acc-2'
        ? new Account(id, id, id === 'acc-1' ? 'debit' : 'credit', 0)
        : undefined,
    );

    txRepo.exists.mockReturnValue(false);
    txRepo.findById.mockReturnValue(tx);

    const result = await usecase.register(tx);

    expect(result.id).toBe(tx.id);
    expect(accRepo.save).toHaveBeenCalledTimes(2);
    expect(txRepo.save).toHaveBeenCalledWith(tx);
  });

  it('should throw if transaction already exists', async () => {
    const tx = makeTransaction();
    txRepo.exists.mockReturnValue(true);

    await expect(usecase.register(tx)).rejects.toThrow('Transaction already exists');
  });

  it('should throw if account is missing', async () => {
    const tx = makeTransaction();
    accRepo.findById.mockReturnValue(undefined);
    txRepo.exists.mockReturnValue(false);

    await expect(usecase.register(tx)).rejects.toThrow(/Account not found/);
  });

  it('should throw if transaction not found when calling get()', () => {
    txRepo.findById.mockReturnValue(undefined);

    const call = () => (usecase as any).get('missing-id');

    expect(call).toThrow('Transaction not found');
  });
});
