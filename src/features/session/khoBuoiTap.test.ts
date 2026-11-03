import { beforeEach, describe, expect, it } from 'vitest';
import { EXERCISES } from '../../data/baiTap';
import { useSessionStore } from './khoBuoiTap';

describe('Kho trạng thái buổi tập', () => {
  beforeEach(() => useSessionStore.setState({ queue: [], manuallyAddedIds: [], currentIndex: -1, isRunning: false, elapsed: 0 }));
  const state = () => useSessionStore.getState();

  it('bắt đầu đúng bài và đặt lại số giây', () => {
    useSessionStore.setState({ elapsed: 12 });
    state().startSession(EXERCISES.slice(0, 3), 1);
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true });
    expect(state().queue[1]).toEqual(EXERCISES[1]);
  });
  it('tự chuyển sang bài sau khi tick ở giây cuối', () => {
    state().startSession(EXERCISES.slice(0, 2));
    useSessionStore.setState({ elapsed: 29 });
    state().tick();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0, isRunning: true });
  });
  it('dừng đồng hồ khi bấm sau ở bài cuối', () => {
    state().startSession([EXERCISES[0]]);
    state().next();
    expect(state().isRunning).toBe(false);
  });
  it('dừng tại đúng thời lượng khi hoàn tất bài cuối', () => {
    state().startSession([EXERCISES[0]]);
    useSessionStore.setState({ elapsed: 29 });
    state().tick();
    expect(state()).toMatchObject({ elapsed: 30, currentIndex: 0, isRunning: false });
  });
  it('không tăng thời gian khi đang tạm dừng', () => {
    state().startSession([EXERCISES[0]]);
    state().toggleRun();
    state().tick();
    expect(state().elapsed).toBe(0);
    state().toggleRun();
    state().tick();
    expect(state().elapsed).toBe(1);
  });
  it('bấm trước sau hơn 3 giây chỉ đặt lại bài hiện tại', () => {
    state().startSession(EXERCISES.slice(0, 3), 1);
    useSessionStore.setState({ elapsed: 4 });
    state().prev();
    expect(state()).toMatchObject({ currentIndex: 1, elapsed: 0 });
  });
  it('bấm trước tại giây thứ 3 sẽ quay về bài trước', () => {
    state().startSession(EXERCISES.slice(0, 3), 1);
    useSessionStore.setState({ elapsed: 3 });
    state().prev();
    expect(state()).toMatchObject({ currentIndex: 0, elapsed: 0 });
  });
  it('không quay về vị trí âm ở bài đầu', () => {
    state().startSession([EXERCISES[0]]);
    state().prev();
    expect(state().currentIndex).toBe(0);
  });
  it('bỏ qua bài đã có trong buổi tập', () => {
    state().addToSession(EXERCISES[0]);
    state().addToSession(EXERCISES[0]);
    expect(state().queue).toHaveLength(1);
    expect(state().manuallyAddedIds).toEqual(['e1']);
    state().toggleRun();
    expect(state()).toMatchObject({ currentIndex: 0, isRunning: true });
  });
  it('không chạy với danh sách rỗng hoặc vị trí không hợp lệ', () => {
    state().startSession([]);
    state().toggleRun();
    state().tick();
    state().next();
    state().prev();
    expect(state()).toMatchObject({ currentIndex: -1, isRunning: false, elapsed: 0 });
    state().startSession([EXERCISES[0]], 5);
    expect(state().isRunning).toBe(false);
  });
  it('bắt đầu lại bài đã hoàn tất từ giây 0', () => {
    state().startSession([EXERCISES[0]]);
    useSessionStore.setState({ elapsed: 30, isRunning: false });
    state().toggleRun();
    expect(state()).toMatchObject({ elapsed: 0, isRunning: true });
  });
  it('bắt đầu buổi mới đặt lại dấu thêm thủ công', () => {
    state().addToSession(EXERCISES[0]);
    expect(state().manuallyAddedIds).toEqual(['e1']);
    state().startSession(EXERCISES.slice(0, 3));
    expect(state().queue).toHaveLength(3);
    expect(state().manuallyAddedIds).toEqual([]);
    state().addToSession(EXERCISES[1]);
    state().addToSession(EXERCISES[1]);
    expect(state().queue).toHaveLength(3);
    expect(state().manuallyAddedIds).toEqual(['e2']);
  });
});
