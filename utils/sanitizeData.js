/* eslint-disable prefer-destructuring */
exports.sanitizeUser = function (user) {
  const data = {};
  data._id = user._id;
  data.firstName = user.firstName;
  data.lastName = user.lastName;
  data.email = user.email;
  data.profileImage = user.profileImage;
  data.accountType = user.accountType;

  if (user.accountType === "student") {
    data.myLearning = user.myLearning;
    data.interests = user.interests;
    data.wishList = user.wishList;
  } else if (user.accountType === "instructor") {
    data.totalReviews = user.totalReviews;
    data.totalStudents = user.totalStudents;
    data.myCourses = user.myCourses;
  }

  return data;
};
