import { Account } from '../src/account.entity';

describe('Account Entity', () => {
  it('should increase balance when directions are the same', () => {
    const acc = new Account('1', 'Cash', 'debit', 100);
    acc.apply(50, 'debit');
    expect(acc.balance).toBe(150);
  });

  it('should decrease balance when directions differ', () => {
    const acc = new Account('1', 'Cash', 'debit', 100);
    acc.apply(40, 'credit');
    expect(acc.balance).toBe(60);
  });

  it('should work symmetrically for credit accounts', () => {
    const acc = new Account('2', 'Liabilities', 'credit', 200);
    acc.apply(50, 'credit');
    expect(acc.balance).toBe(250);
    acc.apply(50, 'debit');
    expect(acc.balance).toBe(200);
  });

  it('should default balance to zero when not provided', () => {
    const acc = new Account('3', 'Wallet', 'debit');
    expect(acc.balance).toBe(0);
  });
});
