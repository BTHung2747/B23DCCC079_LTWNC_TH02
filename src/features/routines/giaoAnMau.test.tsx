import { fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SAMPLE_ROUTINES, SAMPLE_ROUTINES_KEY } from '../../data/giaoAnMau';
import { EXERCISE_BY_ID } from '../../data/baiTap';
import { renderWithProviders } from '../../test/hienThiVoiProvider';
import RoutinesPage from './TrangGiaoAn';
import type { Routine } from '../../kieuDuLieu';

describe('Giáo án mẫu', () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(console, 'log').mockImplementation(() => {}); });
  afterEach(() => vi.restoreAllMocks());

  it('mẫu có mã riêng, bài tập hợp lệ và không trùng bài', () => {
    expect(new Set(SAMPLE_ROUTINES.map((routine) => routine.id)).size).toBe(3);
    for (const routine of SAMPLE_ROUTINES) {
      expect(routine.exerciseIds.length).toBeGreaterThan(0);
      expect(new Set(routine.exerciseIds).size).toBe(routine.exerciseIds.length);
      expect(routine.exerciseIds.every((id) => EXERCISE_BY_ID.has(id))).toBe(true);
    }
  });

  it('thêm 3 mẫu và giữ nguyên giáo án cá nhân đã lưu', () => {
    const personal = { id: 'my-routine', name: 'Giáo án riêng', exerciseIds: ['e1'] };
    localStorage.setItem('workout-routines', JSON.stringify([personal]));
    renderWithProviders(<RoutinesPage />, '/routines', true);
    expect(screen.getByRole('link', { name: 'Giáo án riêng' })).toBeInTheDocument();
    for (const sample of SAMPLE_ROUTINES) expect(screen.getByRole('link', { name: sample.name })).toBeInTheDocument();
    const stored: Routine[] = JSON.parse(localStorage.getItem('workout-routines')!);
    expect(stored).toHaveLength(4);
    expect(stored.find((routine) => routine.id === personal.id)).toEqual(personal);
    expect(localStorage.getItem(SAMPLE_ROUTINES_KEY)).toBe('1');
  });

  it('không thêm lặp mẫu khi tải lại và không khôi phục mẫu đã xóa', () => {
    const firstRender = renderWithProviders(<RoutinesPage />, '/routines', true);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    firstRender.unmount();
    const secondRender = renderWithProviders(<RoutinesPage />, '/routines', true);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: 'Xóa giáo án Ngày chân' }));
    secondRender.unmount();
    renderWithProviders(<RoutinesPage />, '/routines', true);
    expect(screen.queryByRole('link', { name: 'Ngày chân' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('không tạo tên trùng với giáo án cá nhân đã có', () => {
    const personal = { id: 'personal-legs', name: 'NGÀY CHÂN', exerciseIds: ['e7'] };
    localStorage.setItem('workout-routines', JSON.stringify([personal]));
    renderWithProviders(<RoutinesPage />, '/routines', true);
    const stored: Routine[] = JSON.parse(localStorage.getItem('workout-routines')!);
    expect(stored).toHaveLength(3);
    expect(stored.filter((routine) => routine.name.toLocaleLowerCase('vi') === 'ngày chân')).toEqual([personal]);
  });
});
