const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const { uploadBufferToCloudinary } = require('../Middleware/upload');

/**
 * Extracts the Cloudinary public_id from a Cloudinary URL.
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
        mobileNumber: true,
        department: true,
        semester: true,
        bio: true,
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
 * PUT /api/users/profile
 * Updates the current authenticated user's profile details.
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, mobileNumber, mobile_number, department, semester, bio } = req.body;

    const targetMobile = mobileNumber !== undefined ? mobileNumber : mobile_number;
    const dataToUpdate = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }
      dataToUpdate.name = name.trim();
    }

    if (targetMobile !== undefined) {
      dataToUpdate.mobileNumber = targetMobile ? String(targetMobile).trim() : null;
    }

    if (department !== undefined) {
      dataToUpdate.department = department ? String(department).trim() : null;
    }

    if (semester !== undefined) {
      dataToUpdate.semester = semester ? String(semester).trim() : null;
    }

    if (bio !== undefined) {
      dataToUpdate.bio = bio ? String(bio).trim() : null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
        mobileNumber: true,
        department: true,
        semester: true,
        bio: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Failed to update user profile.' });
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

    // Keep the old image available until the replacement is safely stored.
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

/**
 * GET /api/users (Admin only)
 * List users with optional search and role filtering.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    const where = {};

    if (role && ['STUDENT', 'FACULTY', 'ADMIN'].includes(role.toUpperCase())) {
      where.role = role.toUpperCase();
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
        { username: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
        mobileNumber: true,
        department: true,
        semester: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            enrollments: true,
            coursesCreated: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
};

/**
 * POST /api/users (Admin only)
 * Provision a new user account.
 */
exports.createUser = async (req, res) => {
  try {
    const { name, email, username, role, mobileNumber, password, department, semester, bio } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = (username || cleanEmail.split('@')[0]).trim();
    const normalizedRole = role.toUpperCase();

    if (!['STUDENT', 'FACULTY', 'ADMIN'].includes(normalizedRole)) {
      return res.status(400).json({ error: 'Invalid role specified.' });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: cleanEmail }, { username: cleanUsername }] },
    });
    if (existing) {
      return res.status(409).json({ error: 'User with this email or username already exists.' });
    }

    const defaultPass = password || 'Temporary123!';
    const hashedPassword = await bcrypt.hash(defaultPass, 10);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: cleanUsername,
        email: cleanEmail,
        passwordHash: hashedPassword,
        role: normalizedRole,
        mobileNumber: mobileNumber ? String(mobileNumber).trim() : null,
        department: department ? String(department).trim() : null,
        semester: semester ? String(semester).trim() : null,
        bio: bio ? String(bio).trim() : null,
        isVerified: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        mobileNumber: true,
        department: true,
        semester: true,
        bio: true,
        createdAt: true,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('createUser error:', error);
    res.status(500).json({ error: 'Failed to provision user.' });
  }
};

/**
 * PUT /api/users/:id (Admin only)
 * Update a user's details or role.
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, mobileNumber, email, department, semester, bio } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber ? String(mobileNumber).trim() : null;
    if (department !== undefined) updateData.department = department ? String(department).trim() : null;
    if (semester !== undefined) updateData.semester = semester ? String(semester).trim() : null;
    if (bio !== undefined) updateData.bio = bio ? String(bio).trim() : null;
    if (role && ['STUDENT', 'FACULTY', 'ADMIN'].includes(role.toUpperCase())) {
      updateData.role = role.toUpperCase();
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        profileImage: true,
        mobileNumber: true,
        department: true,
        semester: true,
        bio: true,
        updatedAt: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ error: 'Failed to update user.' });
  }
};

/**
 * DELETE /api/users/:id (Admin only)
 * Delete a user by ID.
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    await prisma.user.delete({ where: { id } });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

/**
 * GET /api/users/stats (Admin only)
 * System-wide overview metrics for the Admin dashboard.
 */
exports.getSystemStats = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, totalAssignments, totalQuizzes, totalSubmissions] = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.courseEnrollment.count({ where: { status: 'ACTIVE' } }),
      prisma.assignment.count(),
      prisma.quiz.count(),
      prisma.assignmentSubmission.count(),
    ]);

    res.json({
      totalUsers,
      totalCourses,
      activeEnrollments: totalEnrollments,
      totalAssignments,
      totalQuizzes,
      totalSubmissions,
      status: 'healthy',
      uptime: '99.98%',
    });
  } catch (error) {
    console.error('getSystemStats error:', error);
    res.status(500).json({ error: 'Failed to retrieve system statistics.' });
  }
};

/**
 * PUT /api/users/change-password
 * Change current user password with old password verification and bcrypt hash.
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword },
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ error: 'Failed to update password.' });
  }
};
