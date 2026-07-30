const { body, validationResult } = require('express-validator');
const { formatResponse } = require('../utils/helpers');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push(err.msg));

  return res.status(422).json(formatResponse({
    success: false,
    message: 'Validation failed.',
    errors: extractedErrors
  }));
};

const loginRules = [
  body('username').optional().isString().withMessage('Username must be a string'),
  body('password').notEmpty().withMessage('Password is required'),
];

const articleRules = [
  body('story.title').notEmpty().withMessage('Title is required'),
  body('story.category').notEmpty().withMessage('Category is required'),
  body('story.summary').optional().isString(),
  body('story.body').optional().isString(),
  body('story.status').optional().isIn(['draft', 'published']).withMessage('Status must be draft or published'),
];

const categoryRules = [
  body('nameUz').notEmpty().withMessage('Uzbek category name is required'),
  body('nameRu').notEmpty().withMessage('Russian category name is required'),
  body('slug').notEmpty().withMessage('Category slug is required'),
];

const commentRules = [
  body('name').optional().isString(),
  body('text').notEmpty().withMessage('Comment text is required'),
];

const tagRules = [
  body('name').notEmpty().withMessage('Tag name is required'),
];

const pageRules = [
  body('slug').notEmpty().withMessage('Slug is required'),
  body('title.uzk').notEmpty().withMessage('Title (uzk) is required'),
];

module.exports = {
  validate,
  loginRules,
  articleRules,
  categoryRules,
  commentRules,
  tagRules,
  pageRules
};
