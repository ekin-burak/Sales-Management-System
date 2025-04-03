const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
const { ValidationError, AuthenticationError } = require('../utils/errors');

const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES_REP: 'sales_rep'
};

/**
 * @class UserService
 */
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * @param {Partial<User>} userData
   * @returns {Promise<User>}
   */
  async register(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return user;
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{user: User, token: string}>}
   */
  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * @param {string} id
   * @param {Partial<User>} userData
   * @returns {Promise<User>}
   */
  async updateUser(id, userData) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return await this.userRepository.update(id, userData);
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteUser(id) {
    return await this.userRepository.delete(id);
  }

  /**
   * @param {UserRole} [role]
   * @returns {Promise<User[]>}
   */
  async getUsers(role) {
    return await this.userRepository.findAll(role);
  }

  /**
   * @private
   * @param {User} user
   * @returns {string}
   */
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '24h',
    });
  }
}

module.exports = { UserService, UserRole }; 