const { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } = require('typeorm');
const { UserRole } = require('@sales-management/common');

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
 * @class User
 * @extends {Entity}
 */
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ unique: true })
  email;

  @Column()
  password;

  @Column()
  firstName;

  @Column()
  lastName;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SALES_REPRESENTATIVE
  })
  role;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}

module.exports = User; 