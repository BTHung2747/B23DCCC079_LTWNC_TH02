import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../test/hienThiVoiProvider';
import RoutinesPage from './TrangGiaoAn';

describe('Trang giáo án', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => vi.restoreAllMocks());

  it('báo lỗi khi bấm tạo với tên trống', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án không được để trống');
  });
  it('hiển thị tên trong danh sách sau khi tạo thành công', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.type(screen.getByLabelText('Tên giáo án'), 'Ngày ngực');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('link', { name: 'Ngày ngực' })).toBeInTheDocument();
    expect(screen.getByLabelText('Tên giáo án')).toHaveValue('');
    expect(localStorage.getItem('workout-routines')).toContain('Ngày ngực');
  });
  it('từ chối tên trùng không phân biệt hoa thường và cho phép xóa giáo án', async () => {
    localStorage.setItem('workout-routines', JSON.stringify([{ id: 'r1', name: 'Ngày ngực', exerciseIds: [] }]));
    const user = userEvent.setup();
    renderWithProviders(<RoutinesPage />);
    await user.type(screen.getByLabelText('Tên giáo án'), 'ngày NGỰC');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Tên giáo án đã tồn tại');
    const card = screen.getByRole('article');
    await user.click(within(card).getByRole('button', { name: 'Xóa giáo án Ngày ngực' }));
    expect(screen.getByText('Chưa có giáo án nào')).toBeInTheDocument();
  });
});
