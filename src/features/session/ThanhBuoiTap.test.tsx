import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/baiTap';
import { useSessionStore } from './khoBuoiTap';
import SessionBar from './ThanhBuoiTap';

describe('Thanh đồng hồ', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSessionStore.setState({ queue: [], manuallyAddedIds: [], currentIndex: -1, isRunning: false, elapsed: 0 });
  });
  afterEach(() => vi.useRealTimers());

  it('hiển thị trạng thái chưa bắt đầu và khóa nút chạy', () => {
    render(<SessionBar />);
    expect(screen.getByText('Chưa bắt đầu buổi tập')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
  });
  it('đếm mỗi giây, dừng khi tạm dừng và dọn interval khi gỡ component', () => {
    useSessionStore.getState().startSession(EXERCISES.slice(0, 3), 1);
    const { unmount } = render(<SessionBar />);
    expect(screen.getByText('1:07')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByText('1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tạm dừng' }));
    expect(screen.getByRole('button', { name: 'Tiếp tục' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('1:02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp tục' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sau' }));
    expect(screen.getByText('1:44')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trước' }));
    expect(screen.getByText('1:07')).toBeInTheDocument();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
