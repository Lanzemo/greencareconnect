// Auth Routes - Greencare Connect

/**
 * Authentication Routes
 * Handles user registration and login endpoints, including password hashing,
 * validation, and JWT token issuance.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import User Mongoose Model
const User = require("../models/User");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Parent or Caregiver)
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Input Validation: Check for required payload fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
        data: null,
      });
    }

    // Enforce minimum password security length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
        data: null,
      });
    }

    // 2. Data Sanitization: Normalize email to prevent case-sensitive duplicates
    const normalizedEmail = email.toLowerCase().trim();

    // Check if account already exists in database
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
        data: null,
      });
    }

    // 3. Security: Hash password prior to storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Record Creation: Default role falls back to 'PARENT' if omitted
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "PARENT",
    });

    // 5. Success Response: Send sanitized user payload back (exclude password)
    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while registering.",
      data: null,
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & issue JWT authorization token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Input Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
        data: null,
      });
    }

    // 2. Locate User in Database
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        data: null,
      });
    }

    // 3. Credential Verification: Compare plain text password against hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
        data: null,
      });
    }

    // 4. Token Generation: Issue JWT valid for 24 hours
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // 5. Return Auth Token & User Metadata
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in.",
      data: null,
    });
  }
});

module.exports = router;