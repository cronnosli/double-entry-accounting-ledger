import { randomUUID as uuid } from 'node:crypto';

export type EntryDirection = 'debit' | 'credit';

export class Entry {
  constructor(
    public readonly id: string,
    public readonly account_id: string,
    public readonly direction: EntryDirection,
    public readonly amount: number,
  ) {}

  static create(data: Partial<Entry>): Entry {
    if (!data.account_id) {
      throw new Error('Entry requires account_id');
    }
    if (!data.direction) {
      throw new Error('Entry requires direction');
    }
    if (data.amount == null || data.amount < 0) {
      throw new Error('Invalid amount');
    }
    return new Entry(data.id ?? uuid(), data.account_id, data.direction, data.amount);
  }
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly entries: Entry[],
  ) {}

  static fromRaw(data: Partial<Transaction>): Transaction {
    const id = data.id ?? uuid();
    const entries = (data.entries ?? []).map(Entry.create);
    return new Transaction(id, data.name, entries);
  }

  validate(): void {
    if (this.entries.length < 2) {
      throw new Error('A transaction must have at least two entries');
    }

    const total = this.entries.reduce(
      (sum, e) => sum + (e.direction === 'debit' ? e.amount : -e.amount),
      0,
    );
    if (total !== 0) {
      throw new Error('Entries do not balance (debits must equal credits)');
    }
  }
}
