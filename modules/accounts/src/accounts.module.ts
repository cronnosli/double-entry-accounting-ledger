import { Module } from '@nestjs/common';
import { InMemoryStore } from '@core/database/storage';

import { AccountsControllerV1 } from './accounts.controller.v1';
import { AccountsUseCase } from './accounts.usecase';
import { InMemoryAccountRepository } from './account.repository.in-memory';
import { Account } from './account.entity';
import { ACCOUNTS_STORE, ACCOUNTS_REPOSITORY } from './accounts.tokens';

@Module({
  controllers: [AccountsControllerV1],
  providers: [
    {
      provide: ACCOUNTS_STORE,
      useFactory: () => new InMemoryStore<string, Account>(),
    },
    {
      provide: ACCOUNTS_REPOSITORY,
      useFactory: (store: InMemoryStore<string, Account>) => new InMemoryAccountRepository(store),
      inject: [ACCOUNTS_STORE],
    },
    {
      provide: AccountsUseCase,
      useFactory: (repo: InMemoryAccountRepository) => new AccountsUseCase(repo),
      inject: [ACCOUNTS_REPOSITORY],
    },
  ],
  exports: [ACCOUNTS_REPOSITORY],
})
export class AccountsModule {}
