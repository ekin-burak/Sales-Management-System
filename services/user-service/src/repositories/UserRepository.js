const { User } = require('../models/User');

/**
 * @class UserRepository
 */
class UserRepository {
  /**
   * @param {Partial<User>} userData
   * @returns {Promise<User>}
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * @param {string} id
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    return await User.findById(id);
  }

  /**
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * @param {string} id
   * @param {Partial<User>} userData
   * @returns {Promise<User|null>}
   */
  async update(id, userData) {
    return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
  }

  /**
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * @param {UserRole} [role]
   * @returns {Promise<User[]>}
   */
  async findAll(role) {
    if (role) {
      return await User.find({ role });
    }
    return await User.find();
  }
}

module.exports = UserRepository; 