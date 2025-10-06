export type EntryDirection = 'debit' | 'credit';
export class AccountModel {
  id!: string;
  name?: string;
  direction!: EntryDirection;
  balance!: number;
}
export class EntryModel {
  id!: string;
  account_id!: string;
  direction!: EntryDirection;
  amount!: number;
}
export class TransactionModel {
  id!: string;
  name?: string;
  entries!: EntryModel[];
}
