import { InMemoryStore } from '@core/database/storage';

import { InMemoryTransactionRepository } from '../src/transactions.repository.in-memory';
import { Transaction, Entry } from '../src/transactions.entity';

describe('InMemoryTransactionRepository', () => {
  it('save/findById/exists', () => {
    const store = new InMemoryStore<string, Transaction>();
    const repo = new InMemoryTransactionRepository(store);

    const tx = new Transaction('tx-1', 't', [
      new Entry('e1', 'acc-1', 'debit', 100),
      new Entry('e2', 'acc-2', 'credit', 100),
    ]);

    expect(repo.exists(tx.id)).toBe(false);
    repo.save(tx);
    expect(repo.exists(tx.id)).toBe(true);
    expect(repo.findById(tx.id)).toEqual(tx);
  });
});
