const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');
const { UserRole } = require('@sales-management/common');
const { ValidationError, AuthenticationError } = require('@sales-management/common');

jest.mock('../repositories/UserRepository');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = new UserRepository();
    userService = new UserService();
  });

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.SALES_REPRESENTATIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await userService.register(userData);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ValidationError if email already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.register(userData)).rejects.toThrow(ValidationError);
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userService.login(email, password);

      expect(result).toHaveProperty('user', mockUser);
      expect(result).toHaveProperty('token');
    });

    it('should throw AuthenticationError with invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userService.login(email, password)).rejects.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError if user not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(userService.login(email, password)).rejects.toThrow(AuthenticationError);
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = '1';
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue({ ...mockUser, ...updateData });

      const result = await userService.updateUser(userId, updateData);

      expect(result).toEqual({ ...mockUser, ...updateData });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalled();
    });

    it('should throw ValidationError if user not found', async () => {
      const userId = 'nonexistent';
      const updateData = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userId = '1';

      mockUserRepository.delete.mockResolvedValue(true);

      const result = await userService.deleteUser(userId);

      expect(result).toBe(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];

      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await userService.getUsers();

      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });

    it('should return users filtered by role', async () => {
      const role = UserRole.ADMIN;
      const users = [mockUser];

      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await userService.getUsers(role);

      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith(role);
    });
  });
}); 