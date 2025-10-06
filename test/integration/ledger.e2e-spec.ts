/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID as uuid } from 'node:crypto';

const BASE = 'http://localhost:5000/api';

type Json = Record<string, any>;

async function request<T = any>(method: string, path: string, body?: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: T | string;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return { status: res.status, data };
}

describe('🧾 Ledger API', () => {
  beforeAll(async () => {
    let ok = false;
    for (let i = 0; i < 20; i++) {
      try {
        const r = await fetch(`${BASE}/accounts/nonexistent`);
        if (r.status === 404 || r.status === 200) {
          ok = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 300));
    }
    if (!ok) {
      throw new Error(`Server did not respond at ${BASE}`);
    }
  });

  it('POST /accounts → creates account (id provided, name optional, default balance 0, direction required)', async () => {
    const accId = uuid();
    const { status, data } = await request<Json>('POST', '/accounts', {
      id: accId,
      name: 'Cash',
      direction: 'debit',
    });

    expect(status).toBe(201);
    expect(data).toMatchObject({ id: accId, name: 'Cash', direction: 'debit', balance: 0 });
  });

  it('POST /accounts → rejects duplicate id', async () => {
    const accId = uuid();
    await request('POST', '/accounts', { id: accId, direction: 'debit' });
    const { data } = await request<Json>('POST', '/accounts', {
      id: accId,
      direction: 'debit',
    });

    expect(typeof (data as any).error).toBe('string');
  });

  it('POST /accounts → rejects missing direction', async () => {
    const { data } = await request<Json>('POST', '/accounts', { name: 'NoDir' });
    expect(typeof (data as any).error).toBe('string');
  });

  it('GET /accounts/:id → returns existing account; 404 when not found', async () => {
    const accId = uuid();
    await request('POST', '/accounts', { id: accId, direction: 'debit' });

    const ok = await request<Json>('GET', `/accounts/${accId}`);
    expect(ok.status).toBe(200);
    expect(ok.data).toHaveProperty('id', accId);

    const missing = await request('GET', `/accounts/${uuid()}`);
    expect(missing.status).toBe(404);
  });

  it('POST /transactions → applies balanced transaction and updates balances (debit +100, credit +100)', async () => {
    const debitId = uuid();
    const creditId = uuid();
    await request('POST', '/accounts', { id: debitId, name: 'Cash', direction: 'debit' });
    await request('POST', '/accounts', { id: creditId, name: 'Revenue', direction: 'credit' });

    const txId = uuid();
    const tx = await request<Json>('POST', '/transactions', {
      id: txId,
      name: 'Initial funding',
      entries: [
        { account_id: debitId, direction: 'debit', amount: 100 },
        { account_id: creditId, direction: 'credit', amount: 100 },
      ],
    });

    expect(tx.status).toBe(201);
    expect((tx.data as any).entries?.length).toBe(2);

    const accD = await request<Json>('GET', `/accounts/${debitId}`);
    const accC = await request<Json>('GET', `/accounts/${creditId}`);
    expect(accD.data).toHaveProperty('balance', 100);
    expect(accC.data).toHaveProperty('balance', 100);
  });

  it('Rule: different directions subtract (debit with credit; credit with debit)', async () => {
    const debitId = uuid();
    const offsetC = uuid();
    await request('POST', '/accounts', {
      id: debitId,
      direction: 'debit',
      name: 'D',
      balance: 100,
    });
    await request('POST', '/accounts', { id: offsetC, direction: 'credit', name: 'OffsetC' });

    await request('POST', '/transactions', {
      name: 'Reduce debit 100',
      entries: [
        { account_id: debitId, direction: 'credit', amount: 100 },
        { account_id: offsetC, direction: 'debit', amount: 100 },
      ],
    });

    const d = await request<Json>('GET', `/accounts/${debitId}`);
    expect(d.data).toHaveProperty('balance', 0);

    const creditId = uuid();
    const offsetD = uuid();
    await request('POST', '/accounts', {
      id: creditId,
      direction: 'credit',
      name: 'C',
      balance: 100,
    });
    await request('POST', '/accounts', { id: offsetD, direction: 'debit', name: 'OffsetD' });

    await request('POST', '/transactions', {
      name: 'Reduce credit 100',
      entries: [
        { account_id: creditId, direction: 'debit', amount: 100 },
        { account_id: offsetD, direction: 'credit', amount: 100 },
      ],
    });

    const c = await request<Json>('GET', `/accounts/${creditId}`);
    expect(c.data).toHaveProperty('balance', 0);
  });

  it('POST /transactions → rejects unbalanced transaction (debits ≠ credits)', async () => {
    const a1 = uuid();
    const a2 = uuid();
    await request('POST', '/accounts', { id: a1, direction: 'debit' });
    await request('POST', '/accounts', { id: a2, direction: 'credit' });

    const res = await request<Json>('POST', '/transactions', {
      name: 'Unbalanced',
      entries: [
        { account_id: a1, direction: 'debit', amount: 200 },
        { account_id: a2, direction: 'credit', amount: 100 },
      ],
    });

    expect(typeof (res.data as any).error).toBe('string');
  });

  it('POST /transactions → rejects transaction with fewer than 2 entries', async () => {
    const a1 = uuid();
    const off = uuid();
    await request('POST', '/accounts', { id: a1, direction: 'debit' });
    await request('POST', '/accounts', { id: off, direction: 'credit' });

    const res = await request<Json>('POST', '/transactions', {
      name: 'One entry only',
      entries: [{ account_id: a1, direction: 'debit', amount: 50 }],
    });

    expect(typeof (res.data as any).error).toBe('string');
  });

  it('POST /transactions → rejects non-existent account', async () => {
    const res = await request<Json>('POST', '/transactions', {
      name: 'Missing account',
      entries: [
        { account_id: uuid(), direction: 'debit', amount: 50 },
        { account_id: uuid(), direction: 'credit', amount: 50 },
      ],
    });

    expect(typeof (res.data as any).error).toBe('string');
  });

  it('POST /transactions → rejects negative amount', async () => {
    const a1 = uuid();
    const a2 = uuid();
    await request('POST', '/accounts', { id: a1, direction: 'debit' });
    await request('POST', '/accounts', { id: a2, direction: 'credit' });

    const res = await request<Json>('POST', '/transactions', {
      name: 'Negative amount',
      entries: [
        { account_id: a1, direction: 'debit', amount: -10 },
        { account_id: a2, direction: 'credit', amount: 10 },
      ],
    });

    expect(typeof (res.data as any).error).toBe('string');
  });

  it('POST /transactions → rejects duplicate transaction id', async () => {
    const a1 = uuid();
    const a2 = uuid();
    await request('POST', '/accounts', { id: a1, direction: 'debit' });
    await request('POST', '/accounts', { id: a2, direction: 'credit' });

    const txId = uuid();
    const ok = await request('POST', '/transactions', {
      id: txId,
      name: 'once',
      entries: [
        { account_id: a1, direction: 'debit', amount: 10 },
        { account_id: a2, direction: 'credit', amount: 10 },
      ],
    });
    expect(ok.status).toBe(201);

    const dup = await request<Json>('POST', '/transactions', {
      id: txId,
      name: 'twice',
      entries: [
        { account_id: a1, direction: 'debit', amount: 10 },
        { account_id: a2, direction: 'credit', amount: 10 },
      ],
    });
    expect(typeof (dup.data as any).error).toBe('string');
  });
});
