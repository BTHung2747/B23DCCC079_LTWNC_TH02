import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRoutineDispatch, useRoutines } from './NguCanhGiaoAn';

describe('Phạm vi sử dụng Context giáo án', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => vi.restoreAllMocks());

  it('báo lỗi rõ ràng khi đọc giáo án ngoài Provider', () => {
    expect(() => renderHook(() => useRoutines())).toThrow('useRoutines phải được dùng bên trong RoutineProvider.');
  });

  it('báo lỗi rõ ràng khi lấy dispatch ngoài Provider', () => {
    expect(() => renderHook(() => useRoutineDispatch())).toThrow('useRoutineDispatch phải được dùng bên trong RoutineProvider.');
  });
});
