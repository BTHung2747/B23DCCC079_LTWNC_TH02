import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/baiTap';
import ExerciseRow from './DongBaiTap';

describe('Dòng bài tập', () => {
  it('hiển thị tên bài tập và thời lượng 0:30', () => {
    render(<ExerciseRow exercise={EXERCISES[0]} index={0} onStart={vi.fn()} />);
    expect(screen.getByText('Đẩy tạ đơn 1')).toBeInTheDocument();
    expect(screen.getByText('0:30')).toBeInTheDocument();
  });
  it('gọi hàm bắt đầu với đúng bài tập khi bấm nút', () => {
    const onStart = vi.fn();
    render(<ExerciseRow exercise={EXERCISES[0]} index={0} onStart={onStart} />);
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
    expect(onStart).toHaveBeenCalledWith(EXERCISES[0]);
  });
});
