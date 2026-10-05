const userController = require('../src/Controllers/userController');
const prisma = require('../src/lib/prisma');
const cloudinary = require('../src/config/cloudinary');
const { uploadBufferToCloudinary } = require('../src/Middleware/upload');

jest.mock('../src/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    destroy: jest.fn(),
  },
}));

jest.mock('../src/Middleware/upload', () => ({
  uploadBufferToCloudinary: jest.fn(),
}));

describe('userController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      user: { userId: 'user-123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getProfile', () => {
    it('returns the current user profile', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'user-123',
        name: 'Sarah Jensen',
        username: 'sarah',
        email: 'sarah@example.com',
        role: 'STUDENT',
        profileImage: null,
      });

      await userController.getProfile(req, res);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: expect.any(Object),
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'user-123',
          name: 'Sarah Jensen',
        })
      );
    });

    it('returns 404 if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found.' });
    });
  });

  describe('updateProfilePhoto', () => {
    it('rejects if no file is provided', async () => {
      req.file = undefined;

      await userController.updateProfilePhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No image file provided.' });
    });

    it('rejects if file is not an image', async () => {
      req.file = {
        mimetype: 'application/pdf',
      };

      await userController.updateProfilePhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Only image files are allowed.' });
    });

    it('cleans up old cloudinary image and uploads new image', async () => {
      req.file = {
        mimetype: 'image/png',
        buffer: Buffer.from('mock-image'),
      };

      prisma.user.findUnique.mockResolvedValue({
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612345/lms/profiles/old_pic.png',
      });

      uploadBufferToCloudinary.mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1612346/lms/profiles/new_pic.png',
      });

      prisma.user.update.mockResolvedValue({
        id: 'user-123',
        name: 'Sarah Jensen',
        username: 'sarah',
        email: 'sarah@example.com',
        role: 'STUDENT',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612346/lms/profiles/new_pic.png',
      });

      await userController.updateProfilePhoto(req, res);

      // Verify old image was removed from Cloudinary
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('lms/profiles/old_pic', {
        resource_type: 'image',
      });

      // Verify new image was uploaded to Cloudinary
      expect(uploadBufferToCloudinary).toHaveBeenCalledWith(req.file.buffer, {
        folder: 'lms/profiles',
        resourceType: 'image',
      });

      // Verify DB was updated
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612346/lms/profiles/new_pic.png' },
        select: expect.any(Object),
      });

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Profile photo updated successfully.',
          profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612346/lms/profiles/new_pic.png',
        })
      );
    });
  });

  describe('deleteProfilePhoto', () => {
    it('deletes old Cloudinary image and sets profileImage to null', async () => {
      prisma.user.findUnique.mockResolvedValue({
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612345/lms/profiles/existing_pic.jpg',
      });

      prisma.user.update.mockResolvedValue({
        id: 'user-123',
        name: 'Sarah Jensen',
        username: 'sarah',
        email: 'sarah@example.com',
        role: 'STUDENT',
        profileImage: null,
      });

      await userController.deleteProfilePhoto(req, res);

      // Verify Cloudinary deletion was called
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('lms/profiles/existing_pic', {
        resource_type: 'image',
      });

      // Verify DB updated with null
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { profileImage: null },
        select: expect.any(Object),
      });

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Profile photo removed successfully.',
          profileImage: null,
        })
      );
    });
  });
});
