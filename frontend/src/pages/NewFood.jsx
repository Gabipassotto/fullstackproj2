import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FoodForm } from '../components/FoodForm.jsx';
import { api } from '../services/api.js';

export default function NewFood() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  async function handleSubmit(data) {
    setMessage('');

    try {
      const response = await api.post('/foods', data);
      navigate(`/foods/${response.data.data._id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao cadastrar prato');
    }
  }

  return (
    <section className="page narrow">
      <div className="page-header">
        <div>
          <h1>Novo prato</h1>
          <p>Preencha os dados obrigatorios.</p>
        </div>
      </div>
      {message && <p className="error">{message}</p>}
      <FoodForm onSubmit={handleSubmit} />
    </section>
  );
}
