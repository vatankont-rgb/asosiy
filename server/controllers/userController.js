const userRepository = require('../repositories/userRepository');
const logRepository = require('../repositories/logRepository');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserController {
  async getUsers(req, res, next) {
    try {
      if (req.user.role !== 'Super Admin') {
        return res.status(403).json({ error: "Faqat Super Admin ruxsatiga ega" });
      }
      const users = await userRepository.getAll();
      const safeUsers = users.map(u => ({ id: u.id, username: u.username, role: u.role, isActive: u.isActive }));
      return res.status(200).json({ users: safeUsers });
    } catch (err) {
      next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      if (req.user.role !== 'Super Admin') return res.status(403).json({ error: "Faqat Super Admin ruxsatiga ega" });
      const { username, password, role } = req.body;
      const existing = await userRepository.getByUsername(username);
      if (existing) return res.status(400).json({ error: "Foydalanuvchi allaqachon mavjud" });

      const hash = await bcrypt.hash(password, 10);
      const newUser = await userRepository.create({
        id: crypto.randomUUID(),
        username,
        password: hash,
        role: role || 'Writer',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await logRepository.addLog('CREATE_USER', 'User', newUser.id, req.user.username, `Yangi foydalanuvchi qo'shildi: ${username} (${role})`);
      
      const users = await userRepository.getAll();
      return res.status(200).json({ users: users.map(u => ({ id: u.id, username: u.username, role: u.role, isActive: u.isActive })) });
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      if (req.user.role !== 'Super Admin') return res.status(403).json({ error: "Faqat Super Admin ruxsatiga ega" });
      const { id } = req.params;
      if (id === req.user.id) return res.status(400).json({ error: "O'zini o'zi o'chirish mumkin emas" });
      
      await userRepository.delete(id);
      await logRepository.addLog('DELETE_USER', 'User', id, req.user.username, `Foydalanuvchi o'chirildi`);
      
      const users = await userRepository.getAll();
      return res.status(200).json({ users: users.map(u => ({ id: u.id, username: u.username, role: u.role, isActive: u.isActive })) });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
