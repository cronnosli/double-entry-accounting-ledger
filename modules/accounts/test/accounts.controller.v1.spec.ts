/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common';

import { AccountsControllerV1 } from '../src/accounts.controller.v1';
import { AccountsUseCase } from '../src/accounts.usecase';
import { Account } from '../src/account.entity';

describe('AccountsControllerV1', () => {
  let controller: AccountsControllerV1;
  let usecase: jest.Mocked<AccountsUseCase>;

  beforeEach(() => {
    usecase = {
      createAccount: jest.fn(),
      getAccount: jest.fn(),
    } as unknown as jest.Mocked<AccountsUseCase>;
    controller = new AccountsControllerV1(usecase);
  });

  it('POST /accounts -> create (success)', () => {
    const acc = new Account('id-1', 'Cash', 'debit', 0);
    usecase.createAccount.mockReturnValue(acc);

    const result = controller.create({ name: 'Cash', direction: 'debit' } as any);
    expect(result).toEqual(acc);
    expect(usecase.createAccount).toHaveBeenCalledWith({ name: 'Cash', direction: 'debit' });
  });

  it('POST /accounts -> create (error path)', () => {
    usecase.createAccount.mockImplementation(() => {
      throw new Error('boom');
    });
    const result = controller.create({ name: 'X', direction: 'debit' } as any);
    expect(result).toEqual({ error: 'boom' });
  });

  it('GET /accounts/:id -> findOne (success)', async () => {
    const acc = new Account('id-2', 'Bank', 'credit', 0);
    usecase.getAccount.mockReturnValue(acc);

    await expect(controller.findOne('id-2')).resolves.toEqual(acc);
    expect(usecase.getAccount).toHaveBeenCalledWith('id-2');
  });

  it('GET /accounts/:id -> findOne (not found)', async () => {
    usecase.getAccount.mockImplementation(() => {
      throw new Error('Account not found');
    });
    await expect(controller.findOne('missing')).rejects.toThrow(NotFoundException);
  });

  it('POST /accounts -> create (unknown error branch)', () => {
    (usecase.createAccount as jest.Mock).mockImplementation(() => {
      throw 'weird';
    });
    const result = controller.create({ name: 'X', direction: 'debit' } as any);
    expect(result).toEqual({ error: 'An unknown error occurred' });
  });

  it('GET /accounts/:id -> findOne (returns undefined -> NotFound via if)', async () => {
    (usecase.getAccount as jest.Mock).mockReturnValue(undefined);
    await expect(controller.findOne('id-x')).rejects.toThrow(NotFoundException);
  });

  it('GET /accounts/:id -> findOne (unknown thrown -> default NotFound)', async () => {
    (usecase.getAccount as jest.Mock).mockImplementation(() => {
      throw 'weird';
    });
    await expect(controller.findOne('id-y')).rejects.toThrow(NotFoundException);
  });
});
