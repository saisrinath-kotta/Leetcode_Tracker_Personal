import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { config } from '../config/env.js';
import { isConnectedToDb } from '../config/db.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export async function register(req: AuthenticatedRequest, res: Response) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let user;
    if (isConnectedToDb) {
      user = await User.create({ username, email, passwordHash });
    } else {
      user = { _id: '660000000000000000000001', username, email, passwordHash, currentStreak: 1, bestStreak: 1 };
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, config.jwtSecret, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 86400000,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    let user;
    if (isConnectedToDb) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    } else {
      return res.status(401).json({ message: 'Database connection offline.' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, config.jwtSecret, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
      maxAge: 7 * 86400000,
    });

    return res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
  return res.json({ message: 'Logged out successfully.' });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  return res.json({ user: req.user });
}
