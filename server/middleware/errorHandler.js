const logger = require('../utils/logger');
const { formatResponse } = require('../utils/helpers');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  
  res.status(status).json(formatResponse({
    success: false,
    message,
    errors: config.env === 'development' ? [err.stack || err.message] : [message]
  }));
};

module.exports = errorHandler;
