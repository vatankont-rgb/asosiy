const userRepository = require('../repositories/userRepository');
const { verifyPassword, generateAccessToken, generateRefreshToken, formatResponse } = require('../utils/helpers');
const config = require('../config/config');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const user = await userRepository.getByUsername(username || 'admin');
      
      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json(formatResponse({
          success: false,
          message: "Parol noto'g'ri",
          errors: ['Invalid credentials']
        }));
      }

      if (user.pin) {
        // Issue temp token for PIN verification
        const tempToken = generateAccessToken({ id: user.id, username: user.username, preauth: true }, '5m');
        return res.status(200).json({ requiresPin: true, tempToken });
      }

      // If no PIN set, login directly
      await userRepository.update(user.id, { lastLoginAt: new Date().toISOString() });
      const payload = { id: user.id, username: user.username, role: user.role };
      const accessToken = generateAccessToken(payload);

      res.cookie('yk_session', accessToken, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: config.cookieMaxAge
      });

      const logRepository = require('../repositories/logRepository');
      await logRepository.addLog('LOGIN', 'User', user.id, user.username, `Tizimga kirdi`);

      return res.status(200).json({ ok: true, role: user.role });
    } catch (err) {
      next(err);
    }
  }

  async verifyPin(req, res, next) {
    try {
      const { tempToken, pin } = req.body;
      const jwt = require('jsonwebtoken');
      let decoded;
      try {
        decoded = jwt.verify(tempToken, config.jwtSecret);
      } catch (e) {
        return res.status(401).json(formatResponse({ success: false, message: 'Yaroqsiz yoki muddati o\'tgan sessiya' }));
      }

      if (!decoded.preauth) {
        return res.status(400).json({ success: false, message: 'Noto\'g\'ri token' });
      }

      const user = await userRepository.getByUsername(decoded.username);
      if (!user || !user.pin) {
        return res.status(400).json({ success: false, message: 'PIN sozlangan emas' });
      }

      const bcrypt = require('bcrypt');
      if (!(await bcrypt.compare(pin.toString(), user.pin))) {
        return res.status(401).json(formatResponse({ success: false, message: 'PIN-kod noto\'g\'ri' }));
      }

      await userRepository.update(user.id, { lastLoginAt: new Date().toISOString() });
      const payload = { id: user.id, username: user.username, role: user.role };
      const accessToken = generateAccessToken(payload);

      res.cookie('yk_session', accessToken, {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'Lax',
        path: '/',
        maxAge: config.cookieMaxAge
      });

      const logRepository = require('../repositories/logRepository');
      await logRepository.addLog('LOGIN_PIN', 'User', user.id, user.username, `PIN orqali tizimga kirdi`);

      return res.status(200).json({ ok: true, role: user.role });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('yk_session', {
        httpOnly: true,
        sameSite: 'Lax',
        path: '/'
      });
      return res.status(200).json({ ok: true });
    } catch (err) {
      next(err);
    }
  }

  async checkSession(req, res, next) {
    try {
      // If the authenticate middleware succeeded, req.user is set
      return res.status(200).json({ authenticated: true, role: req.user.role });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await userRepository.getByUsername(req.user.username);
      
      if (!user || !(await verifyPassword(currentPassword, user.password))) {
        return res.status(401).json(formatResponse({
          success: false,
          message: 'Joriy parol noto\'g\'ri.',
          errors: ['Invalid password']
        }));
      }

      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await userRepository.update(user.id, { password: passwordHash });

      return res.status(200).json({ ok: true, message: 'Parol muvaffaqiyatli yangilandi' });
    } catch (err) {
      next(err);
    }
  }

  async changePin(req, res, next) {
    try {
      const { currentPin, newPin } = req.body;
      const user = await userRepository.getByUsername(req.user.username);
      const bcrypt = require('bcrypt');

      if (user.pin) {
        if (!currentPin || !(await bcrypt.compare(currentPin.toString(), user.pin))) {
          return res.status(401).json(formatResponse({ success: false, message: 'Joriy PIN-kod noto\'g\'ri' }));
        }
      }

      const pinHash = await bcrypt.hash(newPin.toString(), 10);
      await userRepository.update(user.id, { pin: pinHash });

      return res.status(200).json({ ok: true, message: 'PIN-kod muvaffaqiyatli yangilandi' });
    } catch (err) {
      next(err);
    }
  }

  async getSecurityStatus(req, res, next) {
    try {
      const user = await userRepository.getByUsername(req.user.username);
      return res.status(200).json({
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt || null,
        hasPin: !!user.pin
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
