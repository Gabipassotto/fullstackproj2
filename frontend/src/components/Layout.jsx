import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/">Foods</Link>
        <nav>
          <NavLink to="/foods">Lista</NavLink>
          <NavLink to="/foods/new">Novo prato</NavLink>
        </nav>
        <div className="user-area">
          <span>{user?.email}</span>
          <button type="button" onClick={handleLogout}>Sair</button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

