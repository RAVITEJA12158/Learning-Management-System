const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

// Supported file types per "1.7 File Management": PDF, PPT/PPTX, images,
// video lectures, assignment files.
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200MB, generous for video lectures

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error(`Unsupported file type: ${file.mimetype}`));
}

// Exposed as `upload.single('file')` on any route that accepts one file.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
});

// Streams the in-memory buffer multer collected up to Cloudinary and
// resolves with Cloudinary's response (secure_url, resource_type, etc.).
// `folder` scopes uploads by feature (e.g. "lms/content", "lms/submissions").
function uploadBufferToCloudinary(buffer, { folder, resourceType = 'auto' } = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

module.exports = { upload, uploadBufferToCloudinary };
