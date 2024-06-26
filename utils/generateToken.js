const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

module.exports = generateToken;
