import { body, param, query, validationResult } from 'express-validator';
import xss from 'xss';

const sanitizeText = (value) => (typeof value === 'string' ? xss(value.trim()) : value);

export function handleValidation(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  return next();
}

export const loginValidation = [
  body('email').isEmail().withMessage('Email invalido').normalizeEmail(),
  body('password').isLength({ min: 6, max: 72 }).withMessage('Senha deve ter entre 6 e 72 caracteres'),
  handleValidation
];

export const foodValidation = [
  body('name')
    .customSanitizer(sanitizeText)
    .notEmpty().withMessage('Nome do prato e obrigatorio')
    .isLength({ min: 3, max: 120 }).withMessage('Nome deve ter entre 3 e 120 caracteres'),
  body('description')
    .customSanitizer(sanitizeText)
    .notEmpty().withMessage('Descricao do prato e obrigatoria')
    .isLength({ min: 10, max: 1000 }).withMessage('Descricao deve ter entre 10 e 1000 caracteres'),
  body('category')
    .customSanitizer(sanitizeText)
    .notEmpty().withMessage('Categoria e obrigatoria')
    .isLength({ min: 3, max: 80 }).withMessage('Categoria deve ter entre 3 e 80 caracteres'),
  body('imageUrl')
    .customSanitizer(sanitizeText)
    .notEmpty().withMessage('URL da imagem e obrigatoria')
    .isURL().withMessage('URL da imagem invalida')
    .isLength({ max: 500 }).withMessage('URL da imagem muito longa'),
  body('calories')
    .isInt({ min: 1 }).withMessage('Calorias deve ser um numero positivo')
    .toInt(),
  handleValidation
];

export const idValidation = [
  param('id').isMongoId().withMessage('ID invalido'),
  handleValidation
];

export const foodSearchValidation = [
  query('name').optional().customSanitizer(sanitizeText).isLength({ max: 120 }).withMessage('Nome pesquisado e muito longo'),
  query('category').optional().customSanitizer(sanitizeText).isLength({ max: 80 }).withMessage('Categoria pesquisada e muito longa'),
  handleValidation
];

