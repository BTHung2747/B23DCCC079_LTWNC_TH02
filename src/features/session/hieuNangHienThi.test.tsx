import { Profiler } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EXERCISES } from '../../data/baiTap';
import { renderWithProviders } from '../../test/hienThiVoiProvider';
import * as durationUtils from '../../utils/dinhDangThoiGian';
import LibraryPage from '../library/TrangKhoBaiTap';
import RoutineCreateForm from '../routines/BieuMauTaoGiaoAn';
import { useRoutineDispatch } from '../routines/NguCanhGiaoAn';
import SessionBar from './ThanhBuoiTap';
import { useSessionStore } from './khoBuoiTap';

// Tách phần đếm ngược để Profiler đo riêng việc cập nhật phần điều khiển.
vi.mock('./ThanhDemNguoc', () => ({ default: () => <span data-testid="countdown-placeholder" /> }));

describe('Hiệu năng hiển thị', () => {
  beforeEach(() => {
    localStorage.clear();
    useSessionStore.setState({ queue: [], manuallyAddedIds: [], currentIndex: -1, elapsed: 0, isRunning: false });
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

  it('không cập nhật kho bài tập và phần điều khiển sau mỗi giây', () => {
    const libraryCommits = vi.fn();
    const controlsCommits = vi.fn();
    useSessionStore.getState().startSession(EXERCISES.slice(0, 3));
    const { unmount } = renderWithProviders(
      <>
        <Profiler id="library" onRender={libraryCommits}><LibraryPage /></Profiler>
        <Profiler id="controls" onRender={controlsCommits}><SessionBar /></Profiler>
      </>,
    );
    // react-window hoàn tất cập nhật cuộn ban đầu trước khi đo các tick đồng hồ.
    act(() => vi.advanceTimersByTime(350));
    libraryCommits.mockClear();
    controlsCommits.mockClear();
    act(() => vi.advanceTimersByTime(2000));
    expect(useSessionStore.getState().elapsed).toBe(2);
    expect(libraryCommits).not.toHaveBeenCalled();
    expect(controlsCommits).not.toHaveBeenCalled();
    unmount();
  });

  it('phần đếm ngược thực tế cập nhật theo elapsed', async () => {
    const { default: RealCountdownBar } = await vi.importActual<typeof import('./ThanhDemNguoc')>('./ThanhDemNguoc');
    const countdownCommits = vi.fn();
    useSessionStore.getState().startSession([EXERCISES[0]]);
    render(<Profiler id="countdown" onRender={countdownCommits}><RealCountdownBar /></Profiler>);
    countdownCommits.mockClear();
    act(() => {
      useSessionStore.getState().tick();
      useSessionStore.getState().tick();
      useSessionStore.getState().tick();
    });
    expect(screen.getByText('0:27')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('value', '10');
    expect(countdownCommits).toHaveBeenCalled();
  });

  it('không tính lại thời lượng các dòng khi gõ trước mốc debounce', () => {
    const formatSpy = vi.spyOn(durationUtils, 'formatDuration');
    renderWithProviders(<LibraryPage />);
    expect(formatSpy).toHaveBeenCalled();
    formatSpy.mockClear();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'đẩy' } });
    act(() => vi.advanceTimersByTime(299));
    expect(formatSpy).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(formatSpy).toHaveBeenCalled();
  });

  it('form chỉ đọc dispatch không cập nhật theo danh sách giáo án', () => {
    function AddRoutineButton() {
      const dispatch = useRoutineDispatch();
      return <button onClick={() => dispatch({ type: 'create', id: 'r1', name: 'Ngày chân' })}>Thêm giáo án từ nơi khác</button>;
    }
    const formCommits = vi.fn();
    const isNameTaken = () => false;
    renderWithProviders(
      <>
        <Profiler id="routine-form" onRender={formCommits}><RoutineCreateForm isNameTaken={isNameTaken} /></Profiler>
        <AddRoutineButton />
      </>,
    );
    formCommits.mockClear();
    fireEvent.click(screen.getByRole('button', { name: 'Thêm giáo án từ nơi khác' }));
    expect(localStorage.getItem('workout-routines')).toContain('Ngày chân');
    expect(formCommits).not.toHaveBeenCalled();
  });
});
