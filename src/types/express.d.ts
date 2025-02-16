/*
    The Request interface is extended to include a user property that is an object with id and email properties(might change later).
    This allows us to access the user object from the request object in our route handlers.
*/

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
