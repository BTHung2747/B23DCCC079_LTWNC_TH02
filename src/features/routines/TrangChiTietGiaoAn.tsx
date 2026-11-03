import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EXERCISE_BY_ID } from '../../data/baiTap';
import { formatDuration } from '../../utils/dinhDangThoiGian';
import { useSessionStore } from '../session/khoBuoiTap';
import { useRoutineDispatch, useRoutines } from './NguCanhGiaoAn';

export default function RoutineDetailPage() {
  const { id } = useParams();
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const startSession = useSessionStore((state) => state.startSession);
  const routine = routines.find((item) => item.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const exercises = useMemo(() => routine?.exerciseIds.flatMap((exerciseId) => {
    const exercise = EXERCISE_BY_ID.get(exerciseId);
    return exercise ? [exercise] : [];
  }) ?? [], [routine]);
  const totalDuration = exercises.reduce((total, exercise) => total + exercise.duration, 0);

  if (!routine) return <div className="empty-state library-panel"><h1>Không tìm thấy giáo án</h1><Link to="/routines">Về danh sách giáo án</Link></div>;

  function handleRename(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) { setError('Tên giáo án không được để trống'); return; }
    if (routines.some((item) => item.id !== id && item.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) { setError('Tên giáo án đã tồn tại'); return; }
    dispatch({ type: 'rename', id: routine!.id, name });
    setIsEditing(false);
    setError('');
  }

  return (
    <>
      <Link className="back-link" to="/routines">← Danh sách giáo án</Link>
      <section className="page-heading compact-heading detail-heading">
        <p className="eyebrow">GIÁO ÁN CÁ NHÂN</p>
        <h1>{routine.name}<span>.</span></h1>
        <p>Tổng thời gian: {Math.floor(totalDuration / 60)} phút {totalDuration % 60} giây</p>
        <div className="detail-actions"><button className="button button-primary" disabled={exercises.length === 0} onClick={() => startSession(exercises, 0)}>Tập tất cả</button><button className="button button-quiet" onClick={() => { setNewName(routine.name); setIsEditing(!isEditing); setError(''); }}>Đổi tên</button><span className="subtle">{exercises.length} bài tập</span></div>
      </section>
      {isEditing && <form className="rename-form library-panel" onSubmit={handleRename}><div className="field"><label htmlFor="new-routine-name">Tên giáo án mới</label><input id="new-routine-name" value={newName} onChange={(event) => setNewName(event.target.value)} /></div><button className="button button-primary" type="submit">Lưu tên</button>{error && <p className="error-message" role="alert">{error}</p>}</form>}
      {exercises.length > 0 ? (
        <section className="library-panel" aria-label="Bài tập trong giáo án">
          <ol className="routine-exercises">
            {exercises.map((exercise, index) => <li key={exercise.id}><span className="row-number">{String(index + 1).padStart(2, '0')}</span><div className="routine-exercise-info"><strong>{exercise.name}</strong><span>HLV {exercise.trainer} · {exercise.group}</span></div><span className="duration">{formatDuration(exercise.duration)}</span><button className="button button-quiet danger-button" aria-label={`Bỏ ${exercise.name}`} onClick={() => dispatch({ type: 'removeExercise', id: routine.id, exerciseId: exercise.id })}>Bỏ</button></li>)}
          </ol>
        </section>
      ) : <div className="empty-state library-panel"><h2>Giáo án chưa có bài tập</h2><p>Chọn giáo án này tại kho bài tập, rồi bấm + Giáo án.</p><Link className="button button-primary" to="/">Thêm bài từ kho</Link></div>}
    </>
  );
}
