import 'dotenv/config';
import { connectDatabase } from './database.js';
import { Food } from '../models/Food.js';

await connectDatabase();

const novosPratos = [
  // 5 tipos de bolo
  {
    name: 'Bolo de Chocolate',
    description: 'Bolo fofinho de chocolate, com cobertura cremosa e intenso sabor de cacau.',
    category: 'Bolo',
    imageUrl: 'https://www.themealdb.com/images/media/meals/qxutws1486978099.jpg',
    calories: 480
  },
  {
    name: 'Bolo de Laranja',
    description: 'Bolo caseiro de laranja, leve e perfumado, ideal para o cafe da tarde.',
    category: 'Bolo',
    imageUrl: 'https://www.themealdb.com/images/media/meals/y4jpgq1560459207.jpg',
    calories: 350
  },
  {
    name: 'Cheesecake',
    description: 'Bolo cremoso de queijo sobre base crocante de biscoito, estilo New York.',
    category: 'Bolo',
    imageUrl: 'https://www.themealdb.com/images/media/meals/swttys1511385853.jpg',
    calories: 420
  },
  {
    name: 'Bolo de Cenoura',
    description: 'Classico bolo de cenoura, macio e umido, com cobertura de chocolate.',
    category: 'Bolo',
    imageUrl: 'https://www.themealdb.com/images/media/meals/vrspxv1511722107.jpg',
    calories: 390
  },
  {
    name: 'Bolo Madeira',
    description: 'Bolo ingles simples e denso, com sabor amanteigado e textura firme.',
    category: 'Bolo',
    imageUrl: 'https://www.themealdb.com/images/media/meals/urtqut1511723591.jpg',
    calories: 360
  },
  // 6 comidas brasileiras
  {
    name: 'Feijoada',
    description: 'Tradicional prato brasileiro a base de feijao preto cozido com carnes, servido com arroz, couve e farofa.',
    category: 'Comida Brasileira',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Feijoada%202008.JPG',
    calories: 650
  },
  {
    name: 'Brigadeiro',
    description: 'Doce brasileiro feito de leite condensado, chocolate em po e manteiga, enrolado em bolinhas.',
    category: 'Comida Brasileira',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brigadeiro.jpg',
    calories: 130
  },
  {
    name: 'Pao de Queijo',
    description: 'Pãozinho mineiro feito com polvilho e queijo, com casquinha crocante e miolo elastico.',
    category: 'Comida Brasileira',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/P%C3%A3o%20de%20Queijo%20-%20cheese%20bread.jpg',
    calories: 210
  },
  {
    name: 'Moqueca',
    description: 'Guisado de peixe ou frutos do mar cozido em leite de coco, dende e pimentoes, tradicional da Bahia e Espirito Santo.',
    category: 'Comida Brasileira',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Moqueca.jpg',
    calories: 420
  },
  {
    name: 'Picanha',
    description: 'Corte bovino brasileiro nobre, grelhado na churrasqueira e servido em fatias com sal grosso.',
    category: 'Comida Brasileira',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Picanha%20brazil.JPG',
    calories: 550
  },
  {
    name: 'Vatapa',
    description: 'Prato baiano cremoso a base de pao, camarao, amendoim, castanha de caju e leite de coco.',
    category: 'Comida Brasileira',
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vatap%C3%A1.jpg',
    calories: 480
  }
];

const existentes = await Food.find({ name: { $in: novosPratos.map((p) => p.name) } }).select('name');
const nomesExistentes = new Set(existentes.map((f) => f.name));
const pratosParaInserir = novosPratos.filter((p) => !nomesExistentes.has(p.name));

if (pratosParaInserir.length > 0) {
  await Food.insertMany(pratosParaInserir);
  console.log(`Inseridos ${pratosParaInserir.length} novos pratos:`, pratosParaInserir.map((p) => p.name).join(', '));
} else {
  console.log('Nenhum prato novo para inserir (todos ja existem).');
}

if (pratosParaInserir.length < novosPratos.length) {
  const pulados = novosPratos.filter((p) => nomesExistentes.has(p.name));
  console.log(`Pulados (ja existiam): ${pulados.map((p) => p.name).join(', ')}`);
}

process.exit(0);
