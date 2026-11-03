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
}

const ExerciseRow = memo(function ExerciseRow({ exercise, index, style, onStart, onAdd, onAddToRoutine, canAddToRoutine = false }: ExerciseRowProps) {
  const isSaved = useSavedStore((state) => state.ids.includes(exercise.id));
  const toggleSaved = useSavedStore((state) => state.toggle);
  return (
    <div className="exercise-row" style={style} role="listitem" data-exercise-id={exercise.id}>
      <span className="row-number">{String(index + 1).padStart(2, '0')}</span>
      <span className="exercise-name" title={exercise.name}>{exercise.name}</span>
      <span className="trainer-name">{exercise.trainer}</span>
      <span><span className={`muscle-tag muscle-${exercise.group}`}>{exercise.group}</span></span>
      <span className="duration">{formatDuration(exercise.duration)}</span>
      <div className="row-actions">
        <button className="button button-start" onClick={() => onStart(exercise)}>Bắt đầu</button>
        <button className={`icon-button ${isSaved ? 'is-saved' : ''}`} onClick={() => toggleSaved(exercise.id)} aria-label={isSaved ? 'Bỏ lưu' : 'Lưu bài tập'} aria-pressed={isSaved}>{isSaved ? '★' : '☆'}</button>
        <button className="button button-quiet" disabled={!onAdd} onClick={() => onAdd?.(exercise)}>+ Buổi tập</button>
        {onAddToRoutine && <button className="button button-quiet" disabled={!canAddToRoutine} onClick={() => onAddToRoutine(exercise)}>+ Giáo án</button>}
      </div>
    </div>
  );
});

export default ExerciseRow;
