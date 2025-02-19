import * as userService from '@/services/auth/user';
import { ValidationError } from '@/utils/errors';
import { NextFunction, Request, Response } from 'express';
import { ZodError, object, string } from 'zod';

// schema is basically what the request body should look like
const registerUserSchema = object({
  email: string().email(),
  firstName: string(),
  lastName: string(),
  password: string().min(8),
  username: string().min(4).max(20),
});

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, firstName, lastName, password, username } =
      registerUserSchema.parse(req.body);

    const response = await userService.registerUser(
      email,
      firstName,
      lastName,
      password,
      username,
    );
    return res.status(201).json(response);
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new ValidationError(error.issues));
    } else {
      return next(error);
    }
  }
};

export { registerUser };
