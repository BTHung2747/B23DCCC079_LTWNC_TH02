import { forwardRef, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, HTMLAttributes } from 'react';
import { FixedSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';
import { EXERCISES, GROUPS } from '../../data/baiTap';
import { useDebounce } from '../../hooks/useTriHoan';
import type { Exercise, MuscleGroup } from '../../kieuDuLieu';
import ExerciseRow from './DongBaiTap';
import { useSessionStore } from '../session/khoBuoiTap';

type SortOrder = 'default' | 'name' | 'duration';
interface ListData {
  exercises: Exercise[];
  onStart: (exercise: Exercise) => void;
  onAdd: (exercise: Exercise) => void;
}

const VirtualRow = memo(function VirtualRow({ index, style, data }: ListChildComponentProps<ListData>) {
  return <ExerciseRow exercise={data.exercises[index]} index={index} style={style} onStart={data.onStart} onAdd={data.onAdd} />;
});

function itemKey(index: number, data: ListData) {
  return data.exercises[index].id;
}

const ListContainer = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function ListContainer(props, ref) {
  return <div {...props} ref={ref} role="list" aria-label="Danh sách bài tập" />;
});

export default function LibraryPage() {
  const [keyword, setKeyword] = useState('');
  const [group, setGroup] = useState<MuscleGroup | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const startSession = useSessionStore((state) => state.startSession);
  const addToSession = useSessionStore((state) => state.addToSession);
  const debouncedKeyword = useDebounce(keyword, 300);
  const listRef = useRef<FixedSizeList<ListData>>(null);

  const exercises = useMemo(() => {
    const query = debouncedKeyword.trim().toLocaleLowerCase('vi');
    const result = EXERCISES.filter((exercise) =>
      (group === 'all' || exercise.group === group) &&
      (!query || exercise.name.toLocaleLowerCase('vi').includes(query) || exercise.trainer.toLocaleLowerCase('vi').includes(query)),
    );
    if (sortOrder === 'name') return [...result].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (sortOrder === 'duration') return [...result].sort((a, b) => a.duration - b.duration);
    return result;
  }, [debouncedKeyword, group, sortOrder]);

  const handleKeywordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  }, []);
  const handleStart = useCallback((exercise: Exercise) => {
    startSession(exercises, exercises.findIndex((item) => item.id === exercise.id));
  }, [exercises, startSession]);
  const itemData = useMemo<ListData>(() => ({ exercises, onStart: handleStart, onAdd: addToSession }), [exercises, handleStart, addToSession]);

  useEffect(() => { listRef.current?.scrollTo(0); }, [exercises]);

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">KHÔNG GIAN TẬP LUYỆN CỦA BẠN</p>
        <h1>Tìm bài tập.<br /><span>Bắt nhịp mỗi ngày.</span></h1>
        <p>10.000 bài tập, một khởi đầu dành cho bạn.</p>
      </section>
      <section className="library-panel" aria-label="Kho bài tập">
        <div className="filter-bar">
          <div className="field search-field">
            <label htmlFor="keyword">Tìm kiếm</label>
            <input id="keyword" type="search" placeholder="Tên bài tập hoặc huấn luyện viên..." value={keyword} onChange={handleKeywordChange} />
          </div>
          <div className="field">
            <label htmlFor="muscle-group">Nhóm cơ</label>
            <select id="muscle-group" value={group} onChange={(event) => setGroup(event.target.value as MuscleGroup | 'all')}>
              <option value="all">Tất cả</option>
              {GROUPS.map((muscleGroup) => <option key={muscleGroup}>{muscleGroup}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="sort-order">Sắp xếp</label>
            <select id="sort-order" value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)}>
              <option value="default">Mặc định</option>
              <option value="name">Tên A–Z</option>
              <option value="duration">Thời lượng tăng dần</option>
            </select>
          </div>
        </div>
        <div className="results-bar">
          <p aria-live="polite">Tìm thấy <strong>{exercises.length}</strong> bài tập</p>
          <span className="subtle">Chọn một bài để bắt đầu</span>
        </div>
        {exercises.length > 0 ? (
          <div className="table-scroll">
            <div className="table-content">
              <div className="table-header" aria-hidden="true">
                <span>#</span><span>BÀI TẬP</span><span>HUẤN LUYỆN VIÊN</span><span>NHÓM CƠ</span><span>THỜI GIAN</span><span>THAO TÁC</span>
              </div>
              <FixedSizeList ref={listRef} height={560} itemSize={56} width="100%" itemCount={exercises.length} itemData={itemData} itemKey={itemKey} overscanCount={2} outerElementType={ListContainer}>
                {VirtualRow}
              </FixedSizeList>
            </div>
          </div>
        ) : <div className="empty-state"><h2>Không tìm thấy bài tập nào</h2><p>Thử từ khóa hoặc nhóm cơ khác nhé.</p></div>}
        <div className="panel-footer"><span>Vận động theo nhịp của bạn.</span><span>5 nhóm cơ · 30–120 giây / bài</span></div>
      </section>
    </>
  );
}
