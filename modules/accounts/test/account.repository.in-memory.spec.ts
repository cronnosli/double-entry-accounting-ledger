import { InMemoryStore } from '@core/database/storage';

import { InMemoryAccountRepository } from '../src/account.repository.in-memory';
import { Account } from '../src/account.entity';

describe('InMemoryAccountRepository', () => {
  it('save/findById/exists', () => {
    const store = new InMemoryStore<string, Account>();
    const repo = new InMemoryAccountRepository(store);

    const acc = new Account('acc-1', 'Cash', 'debit', 10);

    expect(repo.exists(acc.id)).toBe(false);
    repo.save(acc);
    expect(repo.exists(acc.id)).toBe(true);
    expect(repo.findById(acc.id)).toEqual(acc);
  });
});
