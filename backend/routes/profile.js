import express from 'express';
import User from '../models/User.js';
import passport from 'passport';

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() || req.headers.authorization) {
    return next();
  }
  res.status(401).json({ msg: 'Unauthorized' });
}

const router = express.Router();

// Get current user profile
router.get('/me', ensureAuthenticated, async (req, res) => {
  try {
    let userId;
    if (req.user) {
      userId = req.user._id;
    } else if (req.headers.authorization) {
      // JWT token support for API requests
      const token = req.headers.authorization.replace('Bearer ', '');
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update profile
router.put('/me', ensureAuthenticated, async (req, res) => {
  try {
    let userId = req.user ? req.user._id : null;
    if (!userId && req.headers.authorization) {
      const token = req.headers.authorization.replace('Bearer ', '');
      const jwt = await import('jsonwebtoken');
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    }
    const update = req.body;
    delete update.password; // Don't allow password change here
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
