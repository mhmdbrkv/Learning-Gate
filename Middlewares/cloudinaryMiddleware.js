const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// make a promise, so i can pass the result
const uploadPromise = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

exports.uploadOnCloudinary = (folderName) => async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  try {
    let resourceType = "image";
    if (req.file.mimetype.startsWith("video")) {
      resourceType = "video";
    }

    const options = {
      chunk_size: 150 * 1024 * 1024, // 150MB chunks
      resource_type: resourceType,
      folder: folderName,
    };

    const result = await uploadPromise(req.file.buffer, options);
    req.result = result; // Store the result in the request object

    next();
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).send("Upload to Cloudinary failed.");
  }
};

exports.removeFromCloudinary = async (publicId, resourceType) => {
  await cloudinary.api.delete_resources(publicId, {
    type: "upload",
    resource_type: resourceType,
  });
};
