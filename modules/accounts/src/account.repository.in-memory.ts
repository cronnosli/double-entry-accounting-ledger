import { Account } from './account.entity';
import { AccountRepository } from './account.repository';
import { Storage } from '../../../core/database/storage';

export class InMemoryAccountRepository implements AccountRepository {
  constructor(private readonly storage: Storage<string, Account>) {}

  findById(id: string): Account | undefined {
    return this.storage.get(id);
  }

  save(account: Account): void {
    this.storage.set(account.id, account);
  }

  exists(id: string): boolean {
    return this.storage.has(id);
  }
}
