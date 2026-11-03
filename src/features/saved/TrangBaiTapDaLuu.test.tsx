import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../test/hienThiVoiProvider';
import { useSessionStore } from '../session/khoBuoiTap';
import { useSavedStore } from './khoBaiTapDaLuu';
import SavedPage from './TrangBaiTapDaLuu';

describe('Trang bài tập đã lưu', () => {
  beforeEach(() => {
    localStorage.clear();
    useSavedStore.setState({ ids: [] });
    useSessionStore.setState({ queue: [], manuallyAddedIds: [], currentIndex: -1, elapsed: 0, isRunning: false });
  });
  it('hướng dẫn người dùng khi chưa lưu bài nào', () => {
    renderWithProviders(<SavedPage />);
    expect(screen.getByText('Bạn chưa lưu bài tập nào')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Khám phá kho bài tập' })).toHaveAttribute('href', '/');
  });
  it('liệt kê bài hợp lệ, bắt đầu cả danh sách và bỏ lưu', () => {
    useSavedStore.setState({ ids: ['e1', 'khong-ton-tai', 'e3'] });
    renderWithProviders(<SavedPage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e3']);
    const secondRow = within(screen.getAllByRole('listitem')[1]);
    fireEvent.click(secondRow.getByRole('button', { name: 'Bắt đầu' }));
    expect(useSessionStore.getState().currentIndex).toBe(1);
    expect(secondRow.getByRole('button', { name: '+ Buổi tập' })).not.toHaveClass('button-added');
    fireEvent.click(secondRow.getByRole('button', { name: '+ Buổi tập' }));
    expect(secondRow.getByRole('button', { name: 'Đã thêm vào buổi tập' })).toHaveClass('button-added');
    expect(useSessionStore.getState().queue).toHaveLength(2);
    expect(screen.getByRole('status')).toHaveTextContent('đã có trong buổi tập');
    fireEvent.click(secondRow.getByRole('button', { name: 'Bỏ lưu' }));
    expect(screen.queryByText('Gập tạ đơn 1')).not.toBeInTheDocument();
  });
});
