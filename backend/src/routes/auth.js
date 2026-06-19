import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { User } from '../models/User.js';
import { logger } from '../config/logger.js';
import { safeRedisSet } from '../config/redis.js';
import { authenticate } from './authMiddleware.js';
import { loginValidation } from './validators.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Muitas tentativas de login. Tente novamente mais tarde.' }
});

router.post('/login', loginLimiter, loginValidation, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    logger.info('Tentativa de login', { email, ip: req.ip });

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      logger.warn('Falha de login: usuario nao encontrado', { email, ip: req.ip });
      return res.status(401).json({ success: false, message: 'Credenciais invalidas' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      logger.warn('Falha de login: senha invalida', { email, ip: req.ip });
      return res.status(401).json({ success: false, message: 'Credenciais invalidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    const decoded = jwt.decode(req.token);
    const ttl = decoded?.exp ? Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1) : 3600;

    await safeRedisSet(`blacklist:${req.token}`, 'revoked', ttl);
    logger.info('Logout realizado e token invalidado', { userId: req.user.id });

    return res.status(200).json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (error) {
    return next(error);
  }
});

export default router;

