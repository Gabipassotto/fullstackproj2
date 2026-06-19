import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDatabase } from './database.js';
import { User } from '../models/User.js';
import { Food } from '../models/Food.js';

await connectDatabase();

const passwordHash = await bcrypt.hash('123456', 12);

await User.updateOne(
  { email: 'professor@example.com' },
  { $set: { email: 'professor@example.com', passwordHash, role: 'professor' } },
  { upsert: true }
);

async function fetchMealImage(termoBusca) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(termoBusca)}`);
    const data = await response.json();
    const meal = data.meals?.[0];
    return meal?.strMealThumb || 'https://placehold.co/400x300?text=' + encodeURIComponent(termoBusca);
  } catch (error) {
    console.warn(`Nao foi possivel buscar imagem para "${termoBusca}" na TheMealDB:`, error.message);
    return 'https://placehold.co/400x300?text=' + encodeURIComponent(termoBusca);
  }
}

const seedItems = [
  {
    name: 'Pizza Margherita',
    description: 'Pizza classica italiana com molho de tomate, mussarela e manjericao.',
    category: 'Pizza',
    buscaImagem: 'pizza',
    calories: 850
  },
  {
    name: 'Burger Artesanal',
    description: 'Hamburguer com carne bovina, queijo cheddar e pao brioche.',
    category: 'Burger',
    buscaImagem: 'burger',
    calories: 700
  },
  {
    name: 'Biryani de Frango',
    description: 'Arroz indiano temperado com especiarias e frango.',
    category: 'Biryani',
    buscaImagem: 'biryani',
    calories: 600
  },
  {
    name: 'Dessert Especial',
    description: 'Sobremesa doce do dia, com calda e cobertura.',
    category: 'Dessert',
    buscaImagem: 'pudding',
    calories: 450
  }
];

const foodsWithImages = await Promise.all(
  seedItems.map(async (item) => ({
    name: item.name,
    description: item.description,
    category: item.category,
    calories: item.calories,
    imageUrl: await fetchMealImage(item.buscaImagem)
  }))
);

await Food.deleteMany({});
await Food.insertMany(foodsWithImages);

console.log('Seed concluido. Usuario: professor@example.com / senha: 123456');
process.exit(0);
