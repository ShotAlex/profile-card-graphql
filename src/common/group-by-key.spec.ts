import { groupByKey } from './group-by-key';

describe('groupByKey', () => {
  it('returns one group per key in the order of keys, empty for keys without rows', () => {
    const rows = [
      { parentId: 2, value: 'b1' },
      { parentId: 1, value: 'a1' },
      { parentId: 2, value: 'b2' },
    ];

    const groups = groupByKey([1, 3, 2], rows, (row) => row.parentId);

    expect(groups.map((group) => group.map((row) => row.value))).toEqual([['a1'], [], ['b1', 'b2']]);
  });

  it('ignores rows whose key was not requested', () => {
    expect(groupByKey([1], [{ id: 9 }], (row) => row.id)).toEqual([[]]);
  });
});
