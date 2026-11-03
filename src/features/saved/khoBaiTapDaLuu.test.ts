import { beforeEach, describe, expect, it } from 'vitest';
import { useSavedStore } from './khoBaiTapDaLuu';

describe('Bài tập đã lưu', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
  });
  it('thêm và bỏ bài đã lưu bằng cùng một thao tác', () => {
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual(['e1']);
    useSavedStore.getState().toggle('e1');
    expect(useSavedStore.getState().ids).toEqual([]);
  });
  it('ghi dữ liệu với key workout-saved và khôi phục sau khi nạp lại', async () => {
    useSavedStore.getState().toggle('e1');
    useSavedStore.getState().toggle('e3');
    const persisted = localStorage.getItem('workout-saved');
    expect(persisted).toContain('e1');
    expect(persisted).toContain('e3');
    useSavedStore.setState({ ids: [] });
    localStorage.setItem('workout-saved', persisted!);
    await useSavedStore.persist.rehydrate();
    expect(useSavedStore.getState().ids).toEqual(['e1', 'e3']);
  });
});
