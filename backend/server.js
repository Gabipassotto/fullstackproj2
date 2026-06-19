import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDatabase } from './src/config/database.js';
import { connectRedis } from './src/config/redis.js';
import { logger } from './src/config/logger.js';
import { requestLogger } from './src/routes/requestLogger.js';
import { errorHandler, notFoundHandler } from './src/routes/errorHandler.js';
import authRoutes from './src/routes/auth.js';
import foodRoutes from './src/routes/foods.js';

const app = express();
const port = process.env.PORT || 3333;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(compression());
app.use(express.json({ limit: '20kb' }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API online' });
});

app.use(authRoutes);
app.use(foodRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

await connectDatabase();
await connectRedis();

app.listen(port, () => {
  logger.info(`Servidor HTTP iniciado na porta ${port}. Configure HTTPS no proxy/reverse proxy em producao.`);
});

