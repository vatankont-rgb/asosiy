const BaseRepository = require('./baseRepository');
const bcrypt = require('bcrypt');

class UserRepository extends BaseRepository {
  constructor() {
    super('users');
    this.seedDefaultAdmin();
  }

  async seedDefaultAdmin() {
    const users = this.read();
    if (users.length === 0) {
      const passwordHash = await bcrypt.hash('admin2026', 10);
      const defaultAdmin = {
        id: 'admin-id-1',
        username: 'admin',
        email: 'admin@vatanuz.uz',
        password: passwordHash,
        role: 'Super Admin',
        isActive: true,
        permissions: ['all'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.write([defaultAdmin]);
    }
  }

  async getByUsername(username) {
    const list = this.read();
    return list.find(u => u.username === username && u.isActive) || null;
  }

  async getByEmail(email) {
    const list = this.read();
    return list.find(u => u.email === email && u.isActive) || null;
  }
}

module.exports = new UserRepository();
