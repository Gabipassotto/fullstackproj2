import express from 'express';
import { Food } from '../models/Food.js';
import { logger } from '../config/logger.js';
import { safeRedisDeleteByPrefix, safeRedisGet, safeRedisSet } from '../config/redis.js';
import { authenticate } from './authMiddleware.js';
import { idValidation, foodSearchValidation, foodValidation } from './validators.js';

const router = express.Router();
const CACHE_TTL_SECONDS = 60;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFilter(query) {
  const filter = {};

  if (query.name) {
    filter.name = { $regex: escapeRegex(query.name), $options: 'i' };
  }

  if (query.category) {
    filter.category = { $regex: escapeRegex(query.category), $options: 'i' };
  }

  return filter;
}

router.get('/foods', authenticate, foodSearchValidation, async (req, res, next) => {
  try {
    const cacheKey = `foods:${JSON.stringify(req.query)}`;
    const cached = await safeRedisGet(cacheKey);

    logger.info('Busca de pratos realizada', {
      userId: req.user.id,
      filters: req.query,
      cacheHit: Boolean(cached)
    });

    if (cached) {
      return res.status(200).json({ success: true, data: JSON.parse(cached), cached: true });
    }

    const foods = await Food.find(buildFilter(req.query)).sort({ createdAt: -1 });
    await safeRedisSet(cacheKey, JSON.stringify(foods), CACHE_TTL_SECONDS);

    return res.status(200).json({ success: true, data: foods, cached: false });
  } catch (error) {
    return next(error);
  }
});

router.get('/foods/categories', authenticate, async (req, res, next) => {
  try {
    const categories = await Food.distinct('category');
    categories.sort((a, b) => a.localeCompare(b));

    return res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return next(error);
  }
});

router.get('/foods/:id', authenticate, idValidation, async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Prato nao encontrado' });
    }

    return res.status(200).json({ success: true, data: food });
  } catch (error) {
    return next(error);
  }
});

router.post('/foods', authenticate, foodValidation, async (req, res, next) => {
  try {
    const food = await Food.create(req.body);

    await safeRedisDeleteByPrefix('foods:');
    logger.info('Prato inserido', { userId: req.user.id, foodId: food.id });

    return res.status(201).json({ success: true, data: food });
  } catch (error) {
    return next(error);
  }
});

router.put('/foods/:id', authenticate, idValidation, foodValidation, async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!food) {
      return res.status(404).json({ success: false, message: 'Prato nao encontrado' });
    }

    await safeRedisDeleteByPrefix('foods:');
    logger.info('Prato atualizado', { userId: req.user.id, foodId: food.id });
    return res.status(200).json({ success: true, data: food });
  } catch (error) {
    return next(error);
  }
});

router.delete('/foods/:id', authenticate, idValidation, async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({ success: false, message: 'Prato nao encontrado' });
    }

    await safeRedisDeleteByPrefix('foods:');
    logger.info('Prato removido', { userId: req.user.id, foodId: food.id });
    return res.status(200).json({ success: true, message: 'Prato removido com sucesso' });
  } catch (error) {
    return next(error);
  }
});

export default router;
