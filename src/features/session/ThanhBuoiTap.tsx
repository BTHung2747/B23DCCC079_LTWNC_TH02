import { useEffect } from 'react';
import { useSessionStore } from './khoBuoiTap';
import CountdownBar from './ThanhDemNguoc';

export default function SessionBar() {
  const currentExercise = useSessionStore((state) => state.queue[state.currentIndex]);
  const queueLength = useSessionStore((state) => state.queue.length);
  const isRunning = useSessionStore((state) => state.isRunning);
  const toggleRun = useSessionStore((state) => state.toggleRun);
  const next = useSessionStore((state) => state.next);
  const prev = useSessionStore((state) => state.prev);
  const tick = useSessionStore((state) => state.tick);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, tick]);

  return (
    <aside className="session-bar" aria-label="Đồng hồ buổi tập">
      <div className="session-inner">
        <div className="session-info">
          <span className={`session-symbol ${isRunning ? 'is-running' : ''}`} aria-hidden="true">▶</span>
          <div>
            <p className="session-title">{currentExercise ? `Đang tập: ${currentExercise.name}` : 'Chưa bắt đầu buổi tập'}</p>
            <p className="session-subtitle">{currentExercise ? `HLV ${currentExercise.trainer}` : 'Chọn bài tập để bắt nhịp.'}</p>
          </div>
        </div>
        <CountdownBar />
        <div className="session-controls">
          <button className="button button-quiet" onClick={prev} disabled={!currentExercise}>Trước</button>
          <button className="button button-primary run-button" onClick={toggleRun} disabled={queueLength === 0}>{isRunning ? 'Tạm dừng' : 'Bắt đầu'}</button>
          <button className="button button-quiet" onClick={next} disabled={!currentExercise}>Sau</button>
        </div>
        <p className="queue-count">Buổi tập: <strong>{queueLength}</strong> bài</p>
      </div>
    </aside>
  );
}
