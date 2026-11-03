import { useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useRoutineDispatch, useRoutines } from './NguCanhGiaoAn';
import RoutineCreateForm from './BieuMauTaoGiaoAn';

export default function RoutinesPage() {
  const routines = useRoutines();
  const dispatch = useRoutineDispatch();
  const routinesRef = useRef(routines);
  useEffect(() => { routinesRef.current = routines; }, [routines]);
  const isNameTaken = useCallback((name: string) => routinesRef.current.some((routine) => routine.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi')), []);

  return (
    <>
      <section className="page-heading compact-heading">
        <p className="eyebrow">LÊN KẾ HOẠCH. GIỮ NHỊP TẬP.</p>
        <h1>Giáo án của bạn<span>.</span></h1>
        <p>Gom những bài tập phù hợp thành một buổi tập của riêng bạn.</p>
      </section>
      <section className="routine-create-panel library-panel" aria-label="Tạo giáo án">
        <div><h2>Một buổi tập mới</h2><p>Đặt tên, thêm bài tập và sẵn sàng bắt đầu.</p></div>
        <RoutineCreateForm isNameTaken={isNameTaken} />
      </section>
      <div className="collection-heading"><h2>Danh sách giáo án</h2><span>{routines.length} giáo án</span></div>
      {routines.length > 0 ? (
        <div className="routine-grid">
          {routines.map((routine, index) => (
            <article className="routine-card" key={routine.id}>
              <span className="routine-number">{String(index + 1).padStart(2, '0')}</span>
              <h3><Link to={`/routines/${routine.id}`}>{routine.name}</Link></h3>
              <p>{routine.exerciseIds.length} bài</p>
              <div className="routine-card-footer"><Link className="button button-start" to={`/routines/${routine.id}`}>Xem chi tiết →</Link><button className="button button-quiet danger-button" onClick={() => dispatch({ type: 'remove', id: routine.id })} aria-label={`Xóa giáo án ${routine.name}`}>Xóa</button></div>
            </article>
          ))}
        </div>
      ) : <div className="empty-state library-panel"><h2>Chưa có giáo án nào</h2><p>Tạo giáo án đầu tiên bằng biểu mẫu phía trên.</p></div>}
    </>
  );
}
