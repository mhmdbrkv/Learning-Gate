const jwt = require("jsonwebtoken");

const generateToken = (user, res) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.cookie("token", token, {
    maxAge: 29 * 24 * 60 * 60 * 1000,
    // httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  return token;
};

module.exports = generateToken;
