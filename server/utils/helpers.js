const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config/config');

const formatResponse = ({ success = true, message = '', data = null, errors = null }) => {
  return {
    success,
    message,
    data,
    errors,
    timestamp: new Date().toISOString()
  };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.accessTokenExpiry });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: config.refreshTokenExpiry });
};

module.exports = {
  formatResponse,
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken
};
