import { formatDuration } from '../../utils/dinhDangThoiGian';
import { useSessionStore } from './khoBuoiTap';

export default function CountdownBar() {
  const elapsed = useSessionStore((state) => state.elapsed);
  const duration = useSessionStore((state) => state.queue[state.currentIndex]?.duration ?? 0);
  const remaining = Math.max(0, duration - elapsed);
  const progress = duration > 0 ? Math.min(100, (elapsed / duration) * 100) : 0;

  return (
    <div className="countdown" data-testid="countdown">
      <div className="countdown-label"><span>Còn lại: <strong>{formatDuration(remaining)}</strong></span><span>{Math.round(progress)}%</span></div>
      <progress aria-label="Tiến trình bài tập" max={100} value={progress} />
    </div>
  );
}
