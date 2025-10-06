import { randomUUID as uuid } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { Account } from './account.entity';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountsUseCase {
  constructor(private readonly repo: AccountRepository) {}

  createAccount(input: Partial<Account>): Account {
    const id = input.id ?? uuid();
    if (this.repo.exists(id)) throw new Error('Account already exists');

    if (!input.direction) throw new Error('Direction is required');

    const account = new Account(id, input.name ?? '', input.direction, input.balance ?? 0);
    this.repo.save(account);
    return account;
  }

  getAccount(id: string): Account {
    const acc = this.repo.findById(id);
    if (!acc) throw new Error('Account not found');
    return acc;
  }
}
