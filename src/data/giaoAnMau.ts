import type { Routine } from '../kieuDuLieu';

export const SAMPLE_ROUTINES: readonly Routine[] = [
  { id: 'sample-upper-body', name: 'Thân trên cơ bản', exerciseIds: ['e1', 'e4', 'e5', 'e3'] },
  { id: 'sample-leg-day', name: 'Ngày chân', exerciseIds: ['e2', 'e7', 'e12'] },
  { id: 'sample-full-body', name: 'Toàn thân', exerciseIds: ['e1', 'e2', 'e3', 'e4', 'e5'] },
];

export const SAMPLE_ROUTINES_KEY = 'workout-routines-sample-pack-v1';
