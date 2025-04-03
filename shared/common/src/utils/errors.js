class AppError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(400, message);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(403, message);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

const handleError = (error) => {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      statusCode: error.statusCode
    };
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return {
    success: false,
    error: 'Internal server error',
    statusCode: 500
  };
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  handleError
}; 