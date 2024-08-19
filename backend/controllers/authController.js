// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const getMe = (req, res) => {
  try {
    // `req.user` is set by the auth middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const register = async (req, res) => {
	const { username, email, password } = req.body;

	if (!username || !email || !password) {
		return res.status(400).json({ message: 'All fields are required' });
  }
	if (!validator.isEmail(email)) {
		return res.status(400).json({ message: 'Invalid email format' });
  }
	if (password.length < 6) { // Basic password strength check
		return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
	try {
		const newUser = new User({ username, email, password });
		await newUser.save();
		res.status(201).json({ message: 'User registered successfully' });
	} catch (error) {
		if (error.code === 11000) {
			const key = Object.keys(error.keyValue)[0];
			return res.status(400).json({ message: `${key.charAt(0).toUpperCase() + key.slice(1)} already in use` });
		}
		res.status(500).json({ error: error.message });
	}
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful' });
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
