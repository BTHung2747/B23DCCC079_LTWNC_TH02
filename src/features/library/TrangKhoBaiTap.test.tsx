import { act, fireEvent, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/hienThiVoiProvider';
import { useSavedStore } from '../saved/khoBaiTapDaLuu';
import { useSessionStore } from '../session/khoBuoiTap';
import { EXERCISES } from '../../data/baiTap';
import LibraryPage from './TrangKhoBaiTap';

describe('Kho bài tập', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({ queue: [], manuallyAddedIds: [], currentIndex: -1, elapsed: 0, isRunning: false });
    useSavedStore.setState({ ids: [] });
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  function search(value: string) {
    fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), { target: { value } });
    act(() => vi.advanceTimersByTime(300));
  }

  it('có 10.000 bài nhưng chỉ dựng tối đa 15 dòng trong DOM', () => {
    renderWithProviders(<LibraryPage />);
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '+ Tạo giáo án' })).toHaveAttribute('href', '/routines');
    expect(screen.getAllByRole('listitem').length).toBeLessThanOrEqual(15);
    expect(screen.getAllByRole('button', { name: '+ Giáo án' }).every((button) => button.hasAttribute('disabled'))).toBe(true);
  });
  it('tìm sau 300ms, kết hợp nhóm cơ và tìm theo huấn luyện viên', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'đẩy' } });
    expect(screen.getByText('10000')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(300));
    expect(screen.getByText('1250')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nhóm cơ'), { target: { value: 'Vai' } });
    expect(screen.getByText('250')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Nhóm cơ'), { target: { value: 'all' } });
    search('đức anh');
    expect(screen.getByText('1000')).toBeInTheDocument();
    search('xyz');
    expect(screen.getByText('Không tìm thấy bài tập nào')).toBeInTheDocument();
  });
  it('sắp xếp tên theo tiếng Việt và thời lượng tăng dần', () => {
    renderWithProviders(<LibraryPage />);
    fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'name' } });
    expect(within(screen.getAllByRole('listitem')[0]).getByText('Bật chậm 1')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'duration' } });
    expect(within(screen.getAllByRole('listitem')[0]).getByText('0:30')).toBeInTheDocument();
  });
  it('bắt đầu theo danh sách đang lọc và thêm bài vào buổi tập', () => {
    renderWithProviders(<LibraryPage />);
    search('đẩy');
    const row = within(screen.getAllByRole('listitem')[1]);
    fireEvent.click(row.getByRole('button', { name: '+ Buổi tập' }));
    expect(useSessionStore.getState().queue).toHaveLength(1);
    fireEvent.click(row.getByRole('button', { name: 'Bắt đầu' }));
    expect(useSessionStore.getState().queue).toHaveLength(1250);
    expect(useSessionStore.getState().currentIndex).toBe(1);
    useSessionStore.getState().next();
    expect(useSessionStore.getState().queue[2].name).toContain('Đẩy');
  });
  it('thêm bài vào giáo án đã chọn và báo khi thêm trùng', () => {
    localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]));
    renderWithProviders(<LibraryPage />);
    const row = within(screen.getAllByRole('listitem')[0]);
    fireEvent.click(row.getByRole('button', { name: '+ Giáo án' }));
    expect(screen.getByRole('status')).toHaveTextContent('Đã thêm Đẩy tạ đơn 1 vào giáo án Ngày ngực.');
    expect(row.getByRole('button', { name: 'Đã thêm vào giáo án' })).toHaveClass('button-added');
    fireEvent.click(row.getByRole('button', { name: 'Đã thêm vào giáo án' }));
    expect(screen.getByRole('status')).toHaveTextContent('Đẩy tạ đơn 1 đã có trong giáo án Ngày ngực.');
    const stored: { exerciseIds: string[] }[] = JSON.parse(localStorage.getItem('workout-routines')!);
    expect(stored[0].exerciseIds).toEqual(['e1']);
  });

  it('đổi trạng thái nút theo đúng giáo án đang chọn', () => {
    localStorage.setItem('workout-routines', JSON.stringify([
      { id: 'r1', name: 'Giáo án một', exerciseIds: ['e1'] },
      { id: 'r2', name: 'Giáo án hai', exerciseIds: [] },
    ]));
    renderWithProviders(<LibraryPage />);
    const row = within(screen.getAllByRole('listitem')[0]);
    fireEvent.click(row.getByRole('button', { name: '+ Buổi tập' }));
    expect(row.getByRole('button', { name: 'Đã thêm vào giáo án' })).toHaveClass('button-added');
    fireEvent.change(screen.getByLabelText('Giáo án đang chọn'), { target: { value: 'r2' } });
    expect(row.getByRole('button', { name: '+ Giáo án' })).not.toHaveClass('button-added');
    fireEvent.click(row.getByRole('button', { name: '+ Giáo án' }));
    expect(row.getByRole('button', { name: 'Đã thêm vào giáo án' })).toHaveClass('button-added');
    expect(row.getByRole('button', { name: 'Đã thêm vào buổi tập' })).toHaveClass('button-added');
    expect(screen.getByRole('status')).toHaveTextContent('vào giáo án Giáo án hai');
  });

  it('đổi màu nút buổi tập theo queue thật và báo khi thêm trùng', () => {
    renderWithProviders(<LibraryPage />);
    const firstRow = within(screen.getAllByRole('listitem')[0]);
    fireEvent.click(firstRow.getByRole('button', { name: '+ Buổi tập' }));
    expect(firstRow.getByRole('button', { name: 'Đã thêm vào buổi tập' })).toHaveClass('button-added');
    expect(screen.getByRole('status')).toHaveTextContent('Đã thêm Đẩy tạ đơn 1 vào buổi tập.');
    fireEvent.click(firstRow.getByRole('button', { name: 'Đã thêm vào buổi tập' }));
    expect(useSessionStore.getState().queue).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Đẩy tạ đơn 1 đã có trong buổi tập.');
    act(() => useSessionStore.getState().startSession([EXERCISES[1]], 0));
    expect(firstRow.getByRole('button', { name: '+ Buổi tập' })).not.toHaveClass('button-added');
    expect(within(screen.getAllByRole('listitem')[1]).getByRole('button', { name: '+ Buổi tập' })).not.toHaveClass('button-added');
  });

  it('bắt đầu cả danh sách không đánh dấu tất cả nút thêm buổi tập', () => {
    renderWithProviders(<LibraryPage />);
    const rows = screen.getAllByRole('listitem');
    fireEvent.click(within(rows[0]).getByRole('button', { name: 'Bắt đầu' }));
    expect(useSessionStore.getState().queue).toHaveLength(10000);
    expect(screen.queryByRole('button', { name: 'Đã thêm vào buổi tập' })).not.toBeInTheDocument();
    fireEvent.click(within(rows[1]).getByRole('button', { name: '+ Buổi tập' }));
    expect(useSessionStore.getState().queue).toHaveLength(10000);
    expect(screen.getAllByRole('button', { name: 'Đã thêm vào buổi tập' })).toHaveLength(1);
    expect(within(rows[0]).getByRole('button', { name: '+ Buổi tập' })).not.toHaveClass('button-added');
    expect(within(rows[1]).getByRole('button', { name: 'Đã thêm vào buổi tập' })).toHaveClass('button-added');
  });

  it('thông báo tự ẩn sau 4 giây và có thể đóng ngay', () => {
    renderWithProviders(<LibraryPage />);
    const row = within(screen.getAllByRole('listitem')[0]);
    fireEvent.click(row.getByRole('button', { name: '+ Buổi tập' }));
    expect(screen.getByRole('status')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(row.getByRole('button', { name: 'Đã thêm vào buổi tập' }));
    fireEvent.click(screen.getByRole('button', { name: 'Đóng thông báo' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
