import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Exercise } from '../../kieuDuLieu';
import { formatDuration } from '../../utils/dinhDangThoiGian';
import { useSavedStore } from '../saved/khoBaiTapDaLuu';

export interface ExerciseRowProps {
  exercise: Exercise;
  index: number;
  style?: CSSProperties;
  onStart: (exercise: Exercise) => void;
  onAdd?: (exercise: Exercise) => void;
  onAddToRoutine?: (exercise: Exercise) => void;
  canAddToRoutine?: boolean;
  isAddedToSession?: boolean;
  isInRoutine?: boolean;
}

const ExerciseRow = memo(function ExerciseRow({ exercise, index, style, onStart, onAdd, onAddToRoutine, canAddToRoutine = false, isAddedToSession = false, isInRoutine = false }: ExerciseRowProps) {
  const isSaved = useSavedStore((state) => state.ids.includes(exercise.id));
  const toggleSaved = useSavedStore((state) => state.toggle);
  const duration = formatDuration(exercise.duration);
  return (
    <div className="exercise-row" style={style} role="listitem" data-exercise-id={exercise.id}>
      <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="exercise-name" title={exercise.name}>
        <span className="exercise-title">{exercise.name}</span>
        <span className="exercise-meta"><span>{exercise.trainer}</span><span>{exercise.group} · {duration}</span></span>
      </span>
      <span className="trainer-name">{exercise.trainer}</span>
      <span className="exercise-group"><span className={`muscle-tag muscle-${exercise.group}`}>{exercise.group}</span></span>
      <span className="duration">{duration}</span>
      <div className="row-actions">
        <button className="button button-start" onClick={() => onStart(exercise)}>Bắt đầu</button>
        <button className={`icon-button ${isSaved ? 'is-saved' : ''}`} onClick={() => toggleSaved(exercise.id)} aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'} aria-pressed={isSaved}>{isSaved ? '★' : '☆'}</button>
        <button className={`button button-quiet${isAddedToSession ? ' button-added' : ''}`} disabled={!onAdd} onClick={() => onAdd?.(exercise)} aria-label={isAddedToSession ? 'Đã thêm vào buổi tập' : '+ Buổi tập'} title={isAddedToSession ? 'Bạn đã thêm bài này vào buổi tập hiện tại' : 'Thêm vào buổi tập'}>{isAddedToSession ? '✓ Buổi tập' : '+ Buổi tập'}</button>
        {onAddToRoutine && <button className={`button button-quiet${isInRoutine ? ' button-added' : ''}`} disabled={!canAddToRoutine} onClick={() => onAddToRoutine(exercise)} aria-label={isInRoutine ? 'Đã thêm vào giáo án' : '+ Giáo án'} title={isInRoutine ? 'Bài tập đã có trong giáo án đang chọn' : 'Thêm vào giáo án đang chọn'}>{isInRoutine ? '✓ Giáo án' : '+ Giáo án'}</button>}
      </div>
    </div>
  );
});

export default ExerciseRow;
