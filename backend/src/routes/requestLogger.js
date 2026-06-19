import { logger } from '../config/logger.js';

export function requestLogger(req, res, next) {
  logger.info('Requisicao recebida', {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  next();
}

