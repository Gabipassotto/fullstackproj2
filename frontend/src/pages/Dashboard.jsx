import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Gerencie buscas e cadastros de pratos.</p>
        </div>
        <Link className="primary-link" to="/foods/new">Novo prato</Link>
      </div>
      <div className="dashboard-grid">
        <Link className="metric-card" to="/foods">
          <strong>Buscar pratos</strong>
          <span>Filtre por nome ou categoria.</span>
        </Link>
        <Link className="metric-card" to="/foods/new">
          <strong>Cadastrar prato</strong>
          <span>Insira um novo prato no catalogo.</span>
        </Link>
      </div>
    </section>
  );
}

