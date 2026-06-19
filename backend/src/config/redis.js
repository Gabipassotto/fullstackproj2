import { createClient } from 'redis';
import { logger } from './logger.js';

export const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (error) => {
  logger.error('Erro no Redis', { message: error.message });
});

export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    logger.info('Redis conectado para cache e blacklist de tokens');
  } catch (error) {
    logger.error('Redis indisponivel; cache e blacklist persistente nao foram iniciados', { message: error.message });
  }
}

export async function safeRedisGet(key) {
  if (!redisClient.isOpen) return null;
  return redisClient.get(key);
}

export async function safeRedisSet(key, value, ttlSeconds) {
  if (!redisClient.isOpen) return;
  await redisClient.set(key, value, { EX: ttlSeconds });
}

export async function safeRedisDel(key) {
  if (!redisClient.isOpen) return;
  await redisClient.del(key);
}

export async function safeRedisDeleteByPrefix(prefix) {
  if (!redisClient.isOpen) return;

  for await (const key of redisClient.scanIterator({ MATCH: `${prefix}*`, COUNT: 100 })) {
    await redisClient.del(key);
  }
}
