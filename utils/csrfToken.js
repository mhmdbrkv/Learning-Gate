const csrf = require("csurf");

module.exports = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 900000, // 15 min
  },
});
