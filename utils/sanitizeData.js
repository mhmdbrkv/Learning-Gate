exports.sanitizeUser = function (user) {
  return {
    _id: user._id,
    userName: user.firstname,
    email: user.email,
    role: user.role,
  };
};
