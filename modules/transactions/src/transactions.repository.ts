import { Transaction } from './transactions.entity';

export interface TransactionsRepository {
  findById(id: string): Transaction | undefined;
  save(tx: Transaction): void;
  exists(id: string): boolean;
}
