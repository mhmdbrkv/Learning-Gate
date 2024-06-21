const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

exports.cloudinaryUploadImage = async (imagePath, folderName) => {
  const result = await cloudinary.uploader.upload(imagePath, {
    resource_type: "image",
    width: 600,
    height: 600,
    crop: "fill",
    folder: folderName,
  });
  return result;
};

exports.cloudinaryUploadVideo = asyncHandler(async (videoPath, folderName) => {
  const resource = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(
      videoPath,
      {
        chunk_size: 150 * 1024 * 1024, // 150MB chunks
        resource_type: "video",
        folder: folderName,
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
  });

  return resource;
});
exports.cloudinaryRemoveFile = async (PublicId) => {
  const result = await cloudinary.uploader.destroy(PublicId);
  return result;
};
