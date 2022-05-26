const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");

// A function to generate a token for a user and pass the id of the user in the payload
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
};

// Controller to register a user, token is also returned with other details
// route: /api/users
// public routed
// method: POST

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const user = await User.findOne({ username });

  if (user) {
    res.status(400);
    throw new Error("User with that username already exists");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    password: hashedPassword,
  });

  if (newUser) {
    res.status(201).json({
      id: newUser._id,
      username: newUser.username,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Controller that returns the JWT token of a user after authentication
// route: /api/users/login
// public routed
// method: POST

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

module.exports = {
  registerUser,
  loginUser,
};
