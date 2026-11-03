import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/hienThiVoiProvider';
import { useSessionStore } from '../session/khoBuoiTap';
import RoutineDetailPage from './TrangChiTietGiaoAn';

describe('Chi tiết giáo án', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => vi.restoreAllMocks());
  function showPage() {
    return renderWithProviders(<Routes><Route path="/routines/:id" element={<RoutineDetailPage />} /></Routes>, '/routines/r1');
  }
  function seed(exerciseIds = ['e1', 'e2']) {
    localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds }, { id: 'r2', name: 'Ngày chân', exerciseIds: [] }]));
  }
  it('báo không tìm thấy khi mã giáo án không tồn tại', () => {
    showPage();
    expect(screen.getByText('Không tìm thấy giáo án')).toBeInTheDocument();
  });
  it('tính tổng 1 phút 37 giây, tập tất cả và bỏ bài', () => {
    seed();
    showPage();
    expect(screen.getByText('Tổng thời gian: 1 phút 37 giây')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Tập tất cả' }));
    expect(useSessionStore.getState().queue.map((exercise) => exercise.id)).toEqual(['e1', 'e2']);
    fireEvent.click(screen.getByRole('button', { name: 'Bỏ Đẩy tạ đơn 1' }));
    expect(screen.getByText('Tổng thời gian: 1 phút 7 giây')).toBeInTheDocument();
  });
  it('hướng dẫn thêm bài và khóa nút tập khi giáo án rỗng', () => {
    seed([]);
    showPage();
    expect(screen.getByText('Giáo án chưa có bài tập')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tập tất cả' })).toBeDisabled();
  });
  it('kiểm tra tên trống, tên trùng và lưu tên mới', async () => {
    seed();
    const user = userEvent.setup();
    showPage();
    await user.click(screen.getByRole('button', { name: 'Đổi tên' }));
    const input = screen.getByLabelText('Tên giáo án mới');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án không được để trống');
    await user.type(input, 'NGÀY CHÂN');
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án đã tồn tại');
    await user.clear(input);
    await user.type(input, 'Buổi sáng');
    await user.click(screen.getByRole('button', { name: 'Lưu tên' }));
    expect(screen.getByRole('heading', { name: 'Buổi sáng.' })).toBeInTheDocument();
  });
});
