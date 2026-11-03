import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RoutineProvider } from '../features/routines/NguCanhGiaoAn';
import { ThemeProvider } from '../contexts/NguCanhGiaoDien';

export function renderWithProviders(ui: ReactElement, route = '/') {
  return render(<MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><ThemeProvider><RoutineProvider>{ui}</RoutineProvider></ThemeProvider></MemoryRouter>);
}
