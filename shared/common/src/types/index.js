/**
 * @enum {string}
 */
const UserRole = {
  ADMIN: 'ADMIN',
  SALES_REPRESENTATIVE: 'SALES_REPRESENTATIVE',
  MANAGER: 'MANAGER'
};

/**
 * @enum {string}
 */
const SalesStatus = {
  NEW: 'NEW',
  IN_CONTACT: 'IN_CONTACT',
  NEGOTIATION: 'NEGOTIATION',
  CLOSED: 'CLOSED'
};

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} password
 * @property {string} firstName
 * @property {string} lastName
 * @property {UserRole} role
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} company
 * @property {string[]} notes
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Sale
 * @property {string} id
 * @property {string} customerId
 * @property {SalesStatus} status
 * @property {number} amount
 * @property {string[]} notes
 * @property {Array<{status: SalesStatus, date: Date, notes?: string}>} statusHistory
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} JwtPayload
 * @property {string} userId
 * @property {string} email
 * @property {UserRole} role
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} [error]
 */

module.exports = {
  UserRole,
  SalesStatus
}; 