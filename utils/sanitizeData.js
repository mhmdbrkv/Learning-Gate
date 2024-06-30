exports.sanitizeUser = function (user) {
  return {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImage: user.profileImage,
    accountType: user.role,
  };
};
