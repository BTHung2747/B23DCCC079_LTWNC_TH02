import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/TrangKhoBaiTap';
import SessionBar from './features/session/ThanhBuoiTap';
import { RoutineProvider } from './features/routines/NguCanhGiaoAn';
import { ThemeProvider } from './contexts/NguCanhGiaoDien';
import Navigation from './components/ThanhDieuHuong';

const SavedPage = lazy(() => import('./features/saved/TrangBaiTapDaLuu'));
const RoutinesPage = lazy(() => import('./features/routines/TrangGiaoAn'));
const RoutineDetailPage = lazy(() => import('./features/routines/TrangChiTietGiaoAn'));

export default function App() {
  return (
    <ThemeProvider><RoutineProvider><div className="app-shell">
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <Navigation />
      <main id="main-content" className="main-content">
        <Suspense fallback={<p className="empty-state" role="status">Đang tải trang...</p>}><Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/routines/:id" element={<RoutineDetailPage />} />
          <Route path="*" element={<p className="empty-state">Không tìm thấy trang.</p>} />
        </Routes></Suspense>
      </main>
      <SessionBar />
    </div></RoutineProvider></ThemeProvider>
  );
}
