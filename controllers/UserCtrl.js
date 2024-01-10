const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters long' });
    }

    // Create a new user without hashing the password (for demonstration purposes)
    const user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Generate an access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Set the expiration time for the access token
    });

    res.status(201).json({
      message: 'User registered successfully',
      accessToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Log in a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct (without hashing)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate an access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m' // Set the expiration time for the access token
    });

    // Generate a refresh token
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Set the expiration time for the refresh token (long-lived)
    });

    res.status(200).json({
      message: 'User logged in successfully',
      userName: user.name,
      CIN: user.CIN, // Assuming you have a CIN field in your model
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Log out a user
exports.logout = async (req, res) => {
  try {
    // Perform any necessary actions for logging out a user
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
