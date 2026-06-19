import { useEffect, useState } from 'react';
import { api } from '../services/api.js';

const initialState = {
  name: '',
  description: '',
  category: '',
  imageUrl: '',
  calories: 1
};

export function FoodForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...form,
        calories: Number(form.calories)
      });
      setForm(initialState);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>
        Nome do prato
        <input value={form.name} onChange={(event) => updateField('name', event.target.value)} required minLength={3} maxLength={120} />
      </label>
      <label>
        Categoria
        <input
          list="categorias-existentes"
          placeholder="Selecione ou digite uma nova categoria"
          value={form.category}
          onChange={(event) => updateField('category', event.target.value)}
          required
          minLength={3}
          maxLength={80}
        />
        <datalist id="categorias-existentes">
          {categories.map((category) => (
            <option key={category} value={category} />
          ))}
        </datalist>
      </label>
      <label>
        URL da imagem
        <input type="url" placeholder="https://www.themealdb.com/images/media/meals/exemplo.jpg" value={form.imageUrl} onChange={(event) => updateField('imageUrl', event.target.value)} required maxLength={500} />
      </label>
      <label>
        Pre-visualizacao
        <div className="image-preview">
          {form.imageUrl ? (
            <img src={form.imageUrl} alt="Pre-visualizacao do prato" onError={(event) => { event.currentTarget.style.display = 'none'; }} onLoad={(event) => { event.currentTarget.style.display = 'block'; }} />
          ) : (
            <span>Cole uma URL para visualizar</span>
          )}
        </div>
      </label>
      <label>
        Calorias
        <input type="number" min="1" value={form.calories} onChange={(event) => updateField('calories', event.target.value)} required />
      </label>
      <label className="full">
        Descricao
        <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} required minLength={10} maxLength={1000} rows={5} />
      </label>
      <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar prato'}</button>
    </form>
  );
}
