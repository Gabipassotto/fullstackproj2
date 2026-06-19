import { logger } from '../config/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ success: false, message: 'Recurso nao encontrado' });
}

export function errorHandler(error, req, res, next) {
  logger.error('Erro do sistema', {
    message: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path
  });

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor'
  });
}

