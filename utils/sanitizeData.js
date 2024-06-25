exports.sanitizeUser = function (user) {
  return {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role,
  };
};
