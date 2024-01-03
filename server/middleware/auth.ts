import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

export const SECRET = 'SECr3t'; // This should be in an environment variable in a real application

interface MyUserRequest extends Request {
  // Use `user?:` here instead of `user:`.
  user: string;
}

export const authenticateJwt = (req:  MyUserRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET, (err: VerifyErrors | null, user: any) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

