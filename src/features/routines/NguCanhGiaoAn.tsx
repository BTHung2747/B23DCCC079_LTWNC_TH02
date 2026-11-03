import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { Routine } from '../../kieuDuLieu';
import { routineReducer } from './capNhatGiaoAn';
import type { RoutineAction } from './capNhatGiaoAn';
import { withLogger } from './ghiNhatKy';
import { SAMPLE_ROUTINES, SAMPLE_ROUTINES_KEY } from '../../data/giaoAnMau';

const STORAGE_KEY = 'workout-routines';
const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | undefined>(undefined);
const loggedReducer = withLogger(routineReducer);

function loadRoutines(includeSamples: boolean): Routine[] {
  let routines: Routine[] = [];
  let samplesInitialized = false;
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    samplesInitialized = localStorage.getItem(SAMPLE_ROUTINES_KEY) === '1';
    if (Array.isArray(data)) routines = data.filter((item): item is Routine => {
      if (typeof item !== 'object' || item === null) return false;
      const record = item as Record<string, unknown>;
      return typeof record.id === 'string' && typeof record.name === 'string' && record.name.trim().length > 0 &&
        Array.isArray(record.exerciseIds) && record.exerciseIds.every((id: unknown) => typeof id === 'string');
    });
  } catch {
    // Khởi tạo được giáo án mẫu cả khi dữ liệu lưu trước đó bị hỏng.
  }
  if (!includeSamples || samplesInitialized) return routines;
  const missingSamples = SAMPLE_ROUTINES.filter((sample) => !routines.some((routine) =>
    routine.id === sample.id || routine.name.toLocaleLowerCase('vi') === sample.name.toLocaleLowerCase('vi'),
  ));
  return [...routines, ...missingSamples.map((sample) => ({ ...sample, exerciseIds: [...sample.exerciseIds] }))];
}

export function RoutineProvider({ children, includeSamples = true }: { children: ReactNode; includeSamples?: boolean }) {
  const [routines, dispatch] = useReducer(loggedReducer, includeSamples, loadRoutines);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
      if (includeSamples && SAMPLE_ROUTINES.every((sample) => routines.some((routine) =>
        routine.id === sample.id || routine.name.toLocaleLowerCase('vi') === sample.name.toLocaleLowerCase('vi'),
      ))) localStorage.setItem(SAMPLE_ROUTINES_KEY, '1');
    }
    catch { /* Giáo án vẫn sử dụng được trong phiên khi trình duyệt không cho ghi bộ nhớ. */ }
  }, [routines, includeSamples]);

  return (
    <RoutineDispatchContext.Provider value={dispatch}>
      <RoutineStateContext.Provider value={routines}>{children}</RoutineStateContext.Provider>
    </RoutineDispatchContext.Provider>
  );
}

export function useRoutines() {
  const context = useContext(RoutineStateContext);
  if (context === undefined) throw new Error('useRoutines phải được dùng bên trong RoutineProvider.');
  return context;
}

export function useRoutineDispatch() {
  const context = useContext(RoutineDispatchContext);
  if (context === undefined) throw new Error('useRoutineDispatch phải được dùng bên trong RoutineProvider.');
  return context;
}
