import { TransactionsRepository } from './transactions.repository';
import { Transaction } from './transactions.entity';
import { Storage } from '../../../core/database/storage';

export class InMemoryTransactionRepository implements TransactionsRepository {
  constructor(private readonly storage: Storage<string, Transaction>) {}

  findById(id: string): Transaction | undefined {
    return this.storage.get(id);
  }

  save(tx: Transaction): void {
    this.storage.set(tx.id, tx);
  }

  exists(id: string): boolean {
    return this.storage.has(id);
  }
}
