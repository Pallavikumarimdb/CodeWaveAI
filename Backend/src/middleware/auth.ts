import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '../db/schema.db';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export interface AuthenticatedRequest extends Request {
  userId: mongoose.Types.ObjectId;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET not configured');
    }

    const tokenVerify = jwt.verify(token, jwtSecret) as JwtPayload;

    if (tokenVerify?.id && ObjectId.isValid(tokenVerify.id)) {
      req.userId = new ObjectId(tokenVerify.id);
    } else {
      res.status(401).json({ message: 'Invalid token payload' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(403).json({ error: 'User ID not provided' });
      return;
    }

    const user = await UserModel.findById(req.userId);

    if (!user?.isAdmin) {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error checking admin status' });
  }
};
