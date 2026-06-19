import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api.js';

export default function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadFood() {
      try {
        const response = await api.get(`/foods/${id}`);
        setFood(response.data.data);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Erro ao carregar prato');
      }
    }

    loadFood();
  }, [id]);

  async function handleDelete() {
    await api.delete(`/foods/${id}`);
    navigate('/foods', { replace: true });
  }

  if (message) {
    return <section className="page"><p className="error">{message}</p></section>;
  }

  if (!food) {
    return <section className="page"><p>Carregando...</p></section>;
  }

  return (
    <section className="page narrow">
      <Link to="/foods" className="back-link">Voltar</Link>
      <article className="details">
        <img src={food.imageUrl} alt={food.name} style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', borderRadius: '8px' }} />
        <h1>{food.name}</h1>
        <p>{food.description}</p>
        <dl>
          <div><dt>Categoria</dt><dd>{food.category}</dd></div>
          <div><dt>Calorias</dt><dd>{food.calories} kcal</dd></div>
        </dl>
        <button className="danger" type="button" onClick={handleDelete}>Excluir prato</button>
      </article>
    </section>
  );
}
