/* 
We will define all the error codes and messages in this file.
This will help us to maintain a single source of truth for all the error codes and messages. 
Also help us to create a consistent error response format across the application. 
*/
export const ErrorCodes = {
  AUTHENTICATION_ERROR: {
    code: 'SONIQUE-40102',
    message: 'Authentication failed.',
    statusCode: 401,
    userMessage: 'Authentication failed. Please check your credentials.',
  },
  BAD_REQUEST: {
    code: 'SONIQUE-40001',
    message: 'Bad request.',
    statusCode: 400,
    userMessage: 'The request could not be understood by the server.',
  },
  CONFLICT: {
    code: 'SONIQUE-40901',
    message: 'Conflict occurred.',
    statusCode: 409,
    userMessage: 'There is a conflict with the current state of the resource.',
  },
  INTERNAL_SERVER_ERROR: {
    code: 'SONIQUE-50001',
    message: 'Internal server error.',
    statusCode: 500,
    userMessage: 'An unexpected error occurred. Please try again later.',
  },
  NOT_FOUND: {
    code: 'SONIQUE-40401',
    message: 'Resource not found.',
    statusCode: 404,
    userMessage: 'The requested resource could not be found.',
  },
  UNAUTHORIZED: {
    code: 'SONIQUE-40101',
    message: 'Unauthorized access.',
    statusCode: 401,
    userMessage: 'You are not authorized to perform this action.',
  },
  VALIDATION_ERROR: {
    code: 'SONIQUE-40002',
    message: 'Validation failed.',
    statusCode: 400,
    userMessage: 'Some of the provided data is invalid.',
  },
};
