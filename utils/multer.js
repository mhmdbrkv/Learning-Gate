const multer = require("multer");
const ApiError = require("./apiError");

const multerStorage = multer.memoryStorage();

const imgFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError(`file must be image only`, 400), false);
  }
};

const vidFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new ApiError(`file must be video only`, 400), false);
  }
};

exports.uploadImage = multer({ storage: multerStorage, fileFilter: imgFilter });
exports.uploadVideo = multer({ storage: multerStorage, fileFilter: vidFilter });
