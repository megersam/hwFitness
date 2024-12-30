import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(file, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
