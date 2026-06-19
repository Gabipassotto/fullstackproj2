import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';

export default function Foods() {
  const [filters, setFilters] = useState({ name: '', category: '' });
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await api.get('/foods/categories');
        setCategories(response.data.data);
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  async function loadFoods(params = filters) {
    setLoading(true);
    setMessage('');

    try {
      const response = await api.get('/foods', { params });
      setFoods(response.data.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao buscar pratos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods({ name: '', category: '' });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    loadFoods(filters);
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1>Lista de pratos</h1>
          <p>Pesquise por nome ou categoria (ex: pizza, burger, biryani, dessert).</p>
        </div>
        <Link className="primary-link" to="/foods/new">Novo prato</Link>
      </div>

      <form className="filters" onSubmit={handleSubmit}>
        <input placeholder="Nome" value={filters.name} onChange={(event) => setFilters({ ...filters, name: event.target.value })} />
        <input
          list="categorias-existentes"
          placeholder="Categoria"
          value={filters.category}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const value = event.target.value;
            const updated = { ...filters, category: value };
            setFilters(updated);

            if (categories.includes(value)) {
              loadFoods(updated);
            }
          }}
        />
        <datalist id="categorias-existentes">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
        <button type="submit">Buscar</button>
      </form>

      {message && <p className="error">{message}</p>}
      {loading ? <p>Carregando...</p> : (
        <div className="food-list">
          {foods.map((food) => (
            <Link className="food-card" key={food._id} to={`/foods/${food._id}`}>
              <div className="food-thumb">
                <img src={food.imageUrl} alt={food.name} />
              </div>
              <strong>{food.name}</strong>
              <span className="badge">{food.category}</span>
              <span>{food.calories} kcal</span>
            </Link>
          ))}
          {!foods.length && <p>Nenhum prato encontrado.</p>}
        </div>
      )}
    </section>
  );
}
