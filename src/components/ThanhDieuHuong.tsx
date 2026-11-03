import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/NguCanhGiaoDien';

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Nhịp Tập - Trang chủ"><span className="brand-mark" aria-hidden="true">N</span><span>nhịp<span className="brand-accent">tập.</span></span></NavLink>
      <nav aria-label="Điều hướng chính" className="main-nav"><NavLink to="/" end>Kho bài tập</NavLink><NavLink to="/saved">Đã lưu</NavLink><NavLink to="/routines">Giáo án</NavLink></nav>
      <button className="button theme-button" onClick={toggleTheme}><span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>{theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'}</button>
    </header>
  );
}
