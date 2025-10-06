import { Module } from '@nestjs/common';
import { InMemoryStore } from '@core/database/storage';
import { AccountsModule } from '@accounts/accounts.module';
import { AccountRepository } from '@accounts/account.repository';
import { ACCOUNTS_REPOSITORY } from '@accounts/accounts.tokens';

import { TransactionsControllerV1 } from './transactions.controller.v1';
import { TransactionsUseCase } from './transactions.usecase';
import { InMemoryTransactionRepository } from './transactions.repository.in-memory';
import { Transaction } from './transactions.entity';
import { TRANSACTIONS_STORE, TRANSACTIONS_REPOSITORY } from './transactions.tokens';

@Module({
  imports: [AccountsModule],
  controllers: [TransactionsControllerV1],
  providers: [
    {
      provide: TRANSACTIONS_STORE,
      useFactory: () => new InMemoryStore<string, Transaction>(),
    },
    {
      provide: TRANSACTIONS_REPOSITORY,
      useFactory: (store: InMemoryStore<string, Transaction>) =>
        new InMemoryTransactionRepository(store),
      inject: [TRANSACTIONS_STORE],
    },
    {
      provide: TransactionsUseCase,
      useFactory: (txRepo: InMemoryTransactionRepository, accountsRepo: AccountRepository) =>
        new TransactionsUseCase(txRepo, accountsRepo),
      inject: [TRANSACTIONS_REPOSITORY, ACCOUNTS_REPOSITORY],
    },
  ],
})
export class TransactionsModule {}
