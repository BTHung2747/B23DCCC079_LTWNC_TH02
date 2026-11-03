import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EXERCISE_BY_ID } from '../../data/baiTap';
import type { Exercise } from '../../kieuDuLieu';
import ExerciseRow from '../library/DongBaiTap';
import { useSessionStore } from '../session/khoBuoiTap';
import { useSavedStore } from './khoBaiTapDaLuu';

export default function SavedPage() {
  const ids = useSavedStore((state) => state.ids);
  const startSession = useSessionStore((state) => state.startSession);
  const addToSession = useSessionStore((state) => state.addToSession);
  const exercises = useMemo(() => ids.flatMap((id) => {
    const exercise = EXERCISE_BY_ID.get(id);
    return exercise ? [exercise] : [];
  }), [ids]);
  const handleStart = useCallback((exercise: Exercise) => {
    startSession(exercises, exercises.findIndex((item) => item.id === exercise.id));
  }, [exercises, startSession]);

  return (
    <>
      <section className="page-heading compact-heading">
        <p className="eyebrow">BỘ SƯU TẬP CÁ NHÂN</p>
        <h1>Bài tập đã lưu<span>.</span></h1>
        <p>Những bài tập bạn muốn quay lại.</p>
      </section>
      {exercises.length > 0 ? (
        <section className="library-panel">
          <div className="section-toolbar"><p><strong>{exercises.length}</strong> bài tập đã lưu</p><button className="button button-primary" onClick={() => startSession(exercises, 0)}>Tập tất cả</button></div>
          <div className="table-scroll"><div className="table-content saved-list" role="list" aria-label="Bài tập đã lưu">
            {exercises.map((exercise, index) => <ExerciseRow key={exercise.id} exercise={exercise} index={index} onStart={handleStart} onAdd={addToSession} />)}
          </div></div>
        </section>
      ) : <div className="empty-state library-panel"><span className="empty-symbol" aria-hidden="true">☆</span><h2>Bạn chưa lưu bài tập nào</h2><p>Bấm ngôi sao cạnh một bài tập để lưu vào đây.</p><Link className="button button-primary" to="/">Khám phá kho bài tập</Link></div>}
    </>
  );
}
