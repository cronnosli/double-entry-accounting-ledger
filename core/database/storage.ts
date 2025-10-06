export interface Storage<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): void;
  keys(): K[];
  values(): V[];
  entries(): Array<[K, V]>;
  snapshot(): Map<K, V>;
  restore(from: Map<K, V>): void;
  withSandbox<T>(op: (s: Storage<K, V>) => T): T;
}
export class InMemoryStore<K, V> implements Storage<K, V> {
  private map = new Map<K, V>();
  get(key: K): V | undefined {
    return this.map.get(key);
  }

  set(key: K, value: V): void {
    this.map.set(key, value);
  }

  has(key: K): boolean {
    return this.map.has(key);
  }

  delete(key: K): void {
    this.map.delete(key);
  }

  keys(): K[] {
    return [...this.map.keys()];
  }

  values(): V[] {
    return [...this.map.values()];
  }

  entries(): Array<[K, V]> {
    return [...this.map.entries()];
  }

  snapshot(): Map<K, V> {
    return new Map(this.map);
  }

  restore(from: Map<K, V>): void {
    this.map = new Map(from);
  }

  withSandbox<T>(op: (s: Storage<K, V>) => T): T {
    const snap = this.snapshot();
    try {
      return op(this);
    } catch (e) {
      this.restore(snap);
      throw e;
    }
  }
}
