import { Injectable } from '@nestjs/common';
import { AccountRepository } from '@accounts/account.repository';

import { Transaction } from './transactions.entity';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsUseCase {
  constructor(
    private readonly transactionRepo: TransactionsRepository,
    private readonly accountsRepo: AccountRepository,
  ) {}

  private get(id: string) {
    const transaction = this.transactionRepo.findById(id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  public async register(input: Partial<Transaction>) {
    const transaction = Transaction.fromRaw(input);
    transaction.validate();

    if (this.transactionRepo.exists(transaction.id)) {
      throw new Error('Transaction already exists');
    }

    for (const entry of transaction.entries) {
      const account = this.accountsRepo.findById(entry.account_id);
      if (!account) {
        throw new Error(`Account not found: ${entry.account_id}`);
      }

      account.apply(entry.amount, entry.direction);

      this.accountsRepo.save(account);
    }

    this.transactionRepo.save(transaction);
    return this.get(transaction.id);
  }
}
