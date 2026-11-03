import { NavLink, Route, Routes } from 'react-router-dom';
import LibraryPage from './features/library/TrangKhoBaiTap';

export default function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Đến nội dung chính</a>
      <header className="site-header">
        <NavLink to="/" className="brand" aria-label="Nhịp Tập - Trang chủ">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>nhịp<span className="brand-accent">tập.</span></span>
        </NavLink>
        <nav aria-label="Điều hướng chính" className="main-nav">
          <NavLink to="/" end>Kho bài tập</NavLink>
          <NavLink to="/saved">Đã lưu</NavLink>
          <NavLink to="/routines">Giáo án</NavLink>
        </nav>
        <span className="header-note">Mỗi ngày, một nhịp tốt hơn.</span>
      </header>
      <main id="main-content" className="main-content">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/saved" element={<p className="empty-state">Bài tập đã lưu sẽ có ở Phần 2.</p>} />
          <Route path="/routines" element={<p className="empty-state">Giáo án sẽ có ở Phần 3.</p>} />
          <Route path="/routines/:id" element={<p className="empty-state">Chi tiết giáo án sẽ có ở Phần 3.</p>} />
          <Route path="*" element={<p className="empty-state">Không tìm thấy trang.</p>} />
        </Routes>
      </main>
    </div>
  );
}
