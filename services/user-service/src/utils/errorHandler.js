const { ValidationError, AuthenticationError, AuthorizationError, NotFoundError } = require('./errors');

const handleError = (error) => {
  if (error instanceof ValidationError) {
    return {
      statusCode: error.statusCode,
      success: false,
      error: 'Validation Error',
      message: error.message
    };
  }

  if (error instanceof AuthenticationError) {
    return {
      statusCode: error.statusCode,
      success: false,
      error: 'Authentication Error',
      message: error.message
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      statusCode: error.statusCode,
      success: false,
      error: 'Authorization Error',
      message: error.message
    };
  }

  if (error instanceof NotFoundError) {
    return {
      statusCode: error.statusCode,
      success: false,
      error: 'Not Found Error',
      message: error.message
    };
  }

  // Default error
  return {
    statusCode: 500,
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong'
  };
};

module.exports = { handleError }; 