import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

/**
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const existing = await User.findOne({ username });
  if (existing) {
    throw new ApiError(409, 'Username already exists');
  }

  const user = await User.create({ username, password });

  res.status(201).json({
    success: true,
    data: {
      user: user.toPublicJSON(),
      token: signToken(user),
    },
  });
});

/**
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid username or password');
  }

  res.json({
    success: true,
    data: {
      user: user.toPublicJSON(),
      token: signToken(user),
    },
  });
});

/**
 * GET /api/auth/me
 */
export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user.toPublicJSON(),
  });
});
