const cloudinary = require('cloudinary').v2;

// Configured from env (see .env.example). Used by the upload middleware to
// store learning materials, assignment submission files, etc. per the
// "1.7 File Management" section of the LMS documentation.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
