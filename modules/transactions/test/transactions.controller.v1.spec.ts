/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionsControllerV1 } from '../src/transactions.controller.v1';
import { TransactionsUseCase } from '../src/transactions.usecase';
import { Transaction, Entry } from '../src/transactions.entity';

describe('TransactionsControllerV1', () => {
  let controller: TransactionsControllerV1;
  let usecase: jest.Mocked<TransactionsUseCase>;

  beforeEach(() => {
    usecase = {
      register: jest.fn(),
    } as unknown as jest.Mocked<TransactionsUseCase>;
    controller = new TransactionsControllerV1(usecase);
  });

  it('POST /transactions -> registerTransaction (maps missing entry.id to empty string)', async () => {
    const dto = {
      name: 't',
      entries: [
        { account_id: 'a1', direction: 'debit', amount: 50 }, // sem id
        { account_id: 'a2', direction: 'credit', amount: 50 }, // sem id
      ],
    };

    const tx = new Transaction('tx-1', 't', [
      new Entry('e1', 'a1', 'debit', 50),
      new Entry('e2', 'a2', 'credit', 50),
    ]);

    usecase.register.mockResolvedValue(tx);

    const result = await controller.registerTransaction(dto as any);
    expect(result).toEqual(tx);

    expect(usecase.register).toHaveBeenCalledWith({
      ...dto,
      entries: [
        { ...dto.entries[0], id: '' },
        { ...dto.entries[1], id: '' },
      ],
    });
  });

  it('POST /transactions -> registerTransaction (error path)', async () => {
    usecase.register.mockRejectedValue(new Error('unbalanced'));
    const dto = {
      name: 't',
      entries: [
        { account_id: 'a1', direction: 'debit', amount: 100 },
        { account_id: 'a2', direction: 'credit', amount: 50 },
      ],
    };
    const result = await controller.registerTransaction(dto as any);
    expect(result).toEqual({ error: 'unbalanced' });
  });

  it('POST /transactions -> registerTransaction (unknown error type)', async () => {
    usecase.register.mockRejectedValue('some string error');

    const dto = {
      name: 't',
      entries: [
        { account_id: 'a1', direction: 'debit', amount: 100 },
        { account_id: 'a2', direction: 'credit', amount: 100 },
      ],
    };

    const result = await controller.registerTransaction(dto as any);
    expect(result).toEqual({ error: 'Unknown error' });
  });
});
