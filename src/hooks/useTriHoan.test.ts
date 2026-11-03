import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useTriHoan';

describe('Trì hoãn giá trị tìm kiếm', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('giữ giá trị cũ trước 300ms và cập nhật sau 300ms', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 'cũ' } });
    rerender({ value: 'mới' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('cũ');
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('mới');
  });

  it('hủy bộ đếm cũ khi người dùng tiếp tục nhập', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: '' } });
    rerender({ value: 'đ' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'đẩy' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('');
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('đẩy');
  });
});
