import mongoose from 'mongoose';
import { logger } from './logger.js';

export async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI nao configurada');
  }

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000
  });

  logger.info('Banco de dados conectado com pool de conexoes ativo');
}

