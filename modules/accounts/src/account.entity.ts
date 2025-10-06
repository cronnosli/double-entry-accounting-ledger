import { EntryDirection } from '@shared/models';

export class Account {
  constructor(
    public readonly id: string,
    public name: string,
    public direction: EntryDirection,
    public balance: number = 0,
  ) {}

  public apply(amount: number, entryDirection: EntryDirection) {
    const sameDirection = this.direction === entryDirection;
    this.balance += sameDirection ? amount : -amount;
  }
}
