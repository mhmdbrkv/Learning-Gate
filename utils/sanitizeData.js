exports.sanitizeUser = function (user) {
  return {
    _id: user._id,
    userName: user.firstname,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
};
