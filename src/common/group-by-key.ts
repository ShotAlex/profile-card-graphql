/**
 * DataLoader contract: the batch function must return one result per key,
 * in the same order as the keys. This helper turns a flat list of rows
 * (from a single `WHERE fk IN (...)` query) into that shape.
 */
export function groupByKey<K, T>(keys: readonly K[], rows: readonly T[], keyOf: (row: T) => K): T[][] {
  const groups = new Map<K, T[]>();
  for (const key of keys) groups.set(key, []);
  for (const row of rows) groups.get(keyOf(row))?.push(row);
  return keys.map((key) => groups.get(key) ?? []);
}
