import { createContext, useContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { Routine } from '../../kieuDuLieu';
import { routineReducer } from './capNhatGiaoAn';
import type { RoutineAction } from './capNhatGiaoAn';
import { withLogger } from './ghiNhatKy';

const STORAGE_KEY = 'workout-routines';
const RoutineStateContext = createContext<Routine[] | undefined>(undefined);
const RoutineDispatchContext = createContext<Dispatch<RoutineAction> | undefined>(undefined);
const loggedReducer = withLogger(routineReducer);

function loadRoutines(): Routine[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is Routine => {
      if (typeof item !== 'object' || item === null) return false;
      const record = item as Record<string, unknown>;
      return typeof record.id === 'string' && typeof record.name === 'string' && record.name.trim().length > 0 &&
        Array.isArray(record.exerciseIds) && record.exerciseIds.every((id: unknown) => typeof id === 'string');
    });
  } catch {
    return [];
  }
}

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [routines, dispatch] = useReducer(loggedReducer, undefined, loadRoutines);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(routines)); }
    catch { /* Giáo án vẫn sử dụng được trong phiên khi trình duyệt không cho ghi bộ nhớ. */ }
  }, [routines]);

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
