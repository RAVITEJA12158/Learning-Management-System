const prisma = require('../lib/prisma');
const cloudinary = require('../config/cloudinary');
const { uploadBufferToCloudinary } = require('../Middleware/upload');

/**
 * Extracts the Cloudinary public_id from a Cloudinary URL.
 * Example URL:
 * https://res.cloudinary.com/demo/image/upload/v1612345678/lms/profiles/sample_id.jpg
 * Returns: "lms/profiles/sample_id"
 */
function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) {
    return null;
  }
  const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return match ? match[1] : null;
}

/**
 * GET /api/users/profile
 * Returns the current authenticated user's profile.
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
};

/**
 * POST /api/users/profile/photo
 * Uploads a new profile picture to Cloudinary, removes any previously
 * existing Cloudinary picture to save storage space, and updates the DB.
 */
exports.updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Only image files are allowed.' });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImage: true },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If an existing Cloudinary picture is present, delete it first to conserve storage
    if (currentUser.profileImage) {
      const oldPublicId = extractCloudinaryPublicId(currentUser.profileImage);
      if (oldPublicId) {
        try {
          await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'image' });
        } catch (cleanupErr) {
          console.warn('Warning: Failed to delete previous Cloudinary image:', cleanupErr.message);
        }
      }
    }

    // Upload new profile image to Cloudinary in the "lms/profiles" folder
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'lms/profiles',
      resourceType: 'image',
    });

    // Update user record in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: uploadResult.secure_url },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
      },
    });

    res.json({
      message: 'Profile photo updated successfully.',
      profileImage: updatedUser.profileImage,
      user: updatedUser,
    });
  } catch (error) {
    console.error('updateProfilePhoto error:', error);
    res.status(500).json({ error: error.message || 'Failed to update profile photo.' });
  }
};

/**
 * DELETE /api/users/profile/photo
 * Deletes the user's profile picture from Cloudinary to save storage,
 * sets profileImage to null in the database, reverting to the default avatar.
 */
exports.deleteProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { profileImage: true },
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // If an existing picture is on Cloudinary, delete it
    if (currentUser.profileImage) {
      const publicId = extractCloudinaryPublicId(currentUser.profileImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        } catch (cleanupErr) {
          console.warn('Warning: Failed to delete Cloudinary image:', cleanupErr.message);
        }
      }
    }

    // Set profileImage to null in DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: null },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
      },
    });

    res.json({
      message: 'Profile photo removed successfully.',
      profileImage: null,
      user: updatedUser,
    });
  } catch (error) {
    console.error('deleteProfilePhoto error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete profile photo.' });
  }
};
