import type { Routine } from '../../kieuDuLieu';

export type RoutineAction =
  | { type: 'create'; id: string; name: string }
  | { type: 'rename'; id: string; name: string }
  | { type: 'remove'; id: string }
  | { type: 'addExercise'; id: string; exerciseId: string }
  | { type: 'removeExercise'; id: string; exerciseId: string };

export function routineReducer(state: Routine[], action: RoutineAction): Routine[] {
  switch (action.type) {
    case 'create': {
      const name = action.name.trim();
      if (!name || state.some((routine) => routine.id === action.id || routine.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) return state;
      return [...state, { id: action.id, name, exerciseIds: [] }];
    }
    case 'rename': {
      const name = action.name.trim();
      if (!name || state.some((routine) => routine.id !== action.id && routine.name.toLocaleLowerCase('vi') === name.toLocaleLowerCase('vi'))) return state;
      return state.map((routine) => routine.id === action.id ? { ...routine, name } : routine);
    }
    case 'remove':
      return state.filter((routine) => routine.id !== action.id);
    case 'addExercise':
      return state.map((routine) => routine.id === action.id && !routine.exerciseIds.includes(action.exerciseId)
        ? { ...routine, exerciseIds: [...routine.exerciseIds, action.exerciseId] }
        : routine);
    case 'removeExercise':
      return state.map((routine) => routine.id === action.id
        ? { ...routine, exerciseIds: routine.exerciseIds.filter((id) => id !== action.exerciseId) }
        : routine);
  }
}
