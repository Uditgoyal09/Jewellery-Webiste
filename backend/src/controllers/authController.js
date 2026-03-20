import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { formatUser } from '../utils/formatters.js';
import { signToken, getBearerToken } from '../utils/token.js';

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Full name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  const token = signToken(user);
  res.status(201).json({ token, user: formatUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = signToken(user);
  res.json({ token, user: formatUser(user) });
};

export const me = async (req, res) => {
  const token = getBearerToken(req.headers.authorization);
  res.json({ token, user: formatUser(req.user) });
};

export const updateProfile = async (req, res) => {
  const { fullName, phone } = req.body;

  const nextFullName = typeof fullName === 'string' ? fullName.trim() : req.user.fullName;
  const nextPhone = typeof phone === 'string' ? phone.trim() : req.user.phone;

  if (!nextFullName) {
    return res.status(400).json({ message: 'Full name is required.' });
  }

  if (nextPhone && !/^[+\d\s()-]{8,20}$/.test(nextPhone)) {
    return res.status(400).json({ message: 'Please enter a valid phone number.' });
  }

  req.user.fullName = nextFullName;
  req.user.phone = nextPhone || null;

  await req.user.save();

  const token = signToken(req.user);
  res.json({ token, user: formatUser(req.user), message: 'Profile updated successfully.' });
};
