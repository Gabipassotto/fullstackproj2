import jwt from 'jsonwebtoken';
import { safeRedisGet } from '../config/redis.js';
import { logger } from '../config/logger.js';

export async function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    logger.warn('Falha de autenticacao: token ausente', { path: req.path });
    return res.status(401).json({ success: false, message: 'Token de autenticacao ausente' });
  }

  try {
    const blacklisted = await safeRedisGet(`blacklist:${token}`);

    if (blacklisted) {
      logger.warn('Falha de autenticacao: token invalidado', { path: req.path });
      return res.status(401).json({ success: false, message: 'Token invalidado' });
    }

    req.user = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
    return next();
  } catch (error) {
    logger.warn('Falha de autenticacao: token invalido', { path: req.path, message: error.message });
    return res.status(401).json({ success: false, message: 'Token invalido ou expirado' });
  }
}

