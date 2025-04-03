import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { AppError } from '../middleware/errorHandler';
import jwt from 'jsonwebtoken';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const existingUser = await this.userRepository.findOne({ where: { email } });
      if (existingUser) {
        return next(new AppError('Email already exists', 400));
      }

      const user = this.userRepository.create({
        email,
        password,
        firstName,
        lastName,
        role: role || UserRole.SALES_REP
      });

      await this.userRepository.save(user);

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return next(new AppError('Invalid credentials', 401));
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return next(new AppError('Invalid credentials', 401));
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.user?.userId }
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, password, email } = req.body;
      const user = await this.userRepository.findOne({
        where: { id: req.user?.userId }
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      // Check if email is being updated and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
          return next(new AppError('Email already exists', 400));
        }
        user.email = email;
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (password) user.password = password;

      await this.userRepository.save(user);

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userRepository.find();
      res.json({
        status: 'success',
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.params.id }
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, role } = req.body;
      const user = await this.userRepository.findOne({
        where: { id: req.params.id }
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (role) user.role = role;

      await this.userRepository.save(user);

      res.json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userRepository.findOne({
        where: { id: req.params.id }
      });

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      await this.userRepository.remove(user);

      res.json({
        status: 'success',
        data: null
      });
    } catch (error) {
      next(error);
    }
  };
} 