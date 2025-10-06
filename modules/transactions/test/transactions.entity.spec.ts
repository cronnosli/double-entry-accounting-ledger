import { Entry, Transaction } from '../src/transactions.entity';

describe('Entry', () => {
  it('should create a valid entry', () => {
    const entry = Entry.create({
      account_id: 'acc-1',
      direction: 'debit',
      amount: 100,
    });
    expect(entry.account_id).toBe('acc-1');
    expect(entry.direction).toBe('debit');
    expect(entry.amount).toBe(100);
  });

  it('should throw if missing required fields', () => {
    expect(() => Entry.create({})).toThrow('Entry requires account_id');
    expect(() => Entry.create({ account_id: 'acc-1' })).toThrow('Entry requires direction');
    expect(() => Entry.create({ account_id: 'acc-1', direction: 'debit', amount: -10 })).toThrow(
      'Invalid amount',
    );
  });
});

describe('Transaction', () => {
  it('should create and validate a balanced transaction', () => {
    const tx = Transaction.fromRaw({
      entries: [
        { id: 'entry-1', account_id: 'a1', direction: 'debit', amount: 100 },
        { id: 'entry-2', account_id: 'a2', direction: 'credit', amount: 100 },
      ],
    });

    expect(() => tx.validate()).not.toThrow();
  });

  it('should throw when entries are unbalanced', () => {
    const tx = Transaction.fromRaw({
      entries: [
        { id: 'entry-1', account_id: 'a1', direction: 'debit', amount: 100 },
        { id: 'entry-2', account_id: 'a2', direction: 'credit', amount: 50 },
      ],
    });
    expect(() => tx.validate()).toThrow('Entries do not balance');
  });

  it('should throw when less than two entries', () => {
    const tx = Transaction.fromRaw({
      entries: [{ id: 'entry-1', account_id: 'a1', direction: 'debit', amount: 100 }],
    });
    expect(() => tx.validate()).toThrow('A transaction must have at least two entries');
  });

  it('should handle transaction with no entries', () => {
    const tx = Transaction.fromRaw({ name: 'Empty TX' });

    expect(tx.entries).toEqual([]);
    expect(tx.name).toBe('Empty TX');
    expect(tx.id).toBeDefined();
  });
});
