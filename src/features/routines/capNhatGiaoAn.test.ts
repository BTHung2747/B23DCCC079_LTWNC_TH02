import { describe, expect, it } from 'vitest';
import type { Routine } from '../../kieuDuLieu';
import { routineReducer } from './capNhatGiaoAn';

describe('Bộ cập nhật giáo án', () => {
  const initial: Routine[] = [{ id: 'r1', name: 'Ngày ngực', exerciseIds: ['e1'] }];

  it('tạo giáo án mới và loại khoảng trắng thừa', () => {
    expect(routineReducer([], { type: 'create', id: 'r1', name: '  Ngày ngực  ' })).toEqual(initial.map((routine) => ({ ...routine, exerciseIds: [] })));
  });
  it('không tạo giáo án tên trống hoặc trùng tên bất kể hoa thường', () => {
    expect(routineReducer(initial, { type: 'create', id: 'r2', name: ' ' })).toBe(initial);
    expect(routineReducer(initial, { type: 'create', id: 'r2', name: 'ngày NGỰC' })).toBe(initial);
  });
  it('không thêm bài trùng và không sửa state gốc', () => {
    expect(routineReducer(initial, { type: 'addExercise', id: 'r1', exerciseId: 'e1' })).toEqual(initial);
    const next = routineReducer(initial, { type: 'addExercise', id: 'r1', exerciseId: 'e2' });
    expect(next[0].exerciseIds).toEqual(['e1', 'e2']);
    expect(initial[0].exerciseIds).toEqual(['e1']);
  });
  it('bỏ một bài tập khỏi giáo án', () => {
    expect(routineReducer(initial, { type: 'removeExercise', id: 'r1', exerciseId: 'e1' })[0].exerciseIds).toEqual([]);
  });
  it('xóa giáo án không tồn tại thì giữ nguyên nội dung state', () => {
    expect(routineReducer(initial, { type: 'remove', id: 'khong-ton-tai' })).toEqual(initial);
  });
  it('xóa đúng giáo án được chọn', () => {
    expect(routineReducer(initial, { type: 'remove', id: 'r1' })).toEqual([]);
  });
  it('đổi tên giáo án và không chấp nhận tên trống hoặc trùng', () => {
    expect(routineReducer(initial, { type: 'rename', id: 'r1', name: 'Ngày chân' })[0].name).toBe('Ngày chân');
    expect(routineReducer(initial, { type: 'rename', id: 'r1', name: ' ' })).toBe(initial);
    const state = [...initial, { id: 'r2', name: 'Ngày chân', exerciseIds: [] }];
    expect(routineReducer(state, { type: 'rename', id: 'r1', name: 'NGÀY CHÂN' })).toBe(state);
  });
});
