import { AccountsUseCase } from '../src/accounts.usecase';
import { createMockAccountRepo, makeAccount } from './accounts.mocks';
import { Account } from '../src/account.entity';

describe('AccountsUseCase', () => {
  let usecase: AccountsUseCase;
  let repo: ReturnType<typeof createMockAccountRepo>;

  beforeEach(() => {
    repo = createMockAccountRepo();
    usecase = new AccountsUseCase(repo);
  });

  it('should create a new account successfully', () => {
    repo.exists.mockReturnValue(false);
    const input = { name: 'Cash', direction: 'debit' } as Partial<Account>;

    const acc = usecase.createAccount(input);

    expect(acc.id).toBeDefined();
    expect(acc.name).toBe('Cash');
    expect(acc.direction).toBe('debit');
    expect(repo.save).toHaveBeenCalledWith(acc);
  });

  it('should throw if direction is missing', () => {
    repo.exists.mockReturnValue(false);
    const input = { name: 'Cash' } as Partial<Account>;

    expect(() => usecase.createAccount(input)).toThrow('Direction is required');
  });

  it('should throw if account already exists', () => {
    repo.exists.mockReturnValue(true);
    const input = makeAccount();
    expect(() => usecase.createAccount(input)).toThrow('Account already exists');
  });

  it('should get an existing account', () => {
    const acc = makeAccount();
    repo.findById.mockReturnValue(acc);

    const found = usecase.getAccount(acc.id);
    expect(found).toBe(acc);
  });

  it('should throw if account not found', () => {
    repo.findById.mockReturnValue(undefined);
    expect(() => usecase.getAccount('not-found')).toThrow('Account not found');
  });

  it('should create with provided id & balance and default empty name', () => {
    repo.exists.mockReturnValue(false);

    const input = { id: 'acc-custom', direction: 'debit', balance: 123 } as Partial<Account>;
    const acc = usecase.createAccount(input);

    expect(acc.id).toBe('acc-custom');
    expect(acc.balance).toBe(123);
    expect(acc.name).toBe('');
    expect(acc.direction).toBe('debit');
    expect(repo.save).toHaveBeenCalledWith(acc);
  });
});
