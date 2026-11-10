const userController = require('../src/Controllers/userController');
const prisma = require('../src/lib/prisma');
const cloudinary = require('../src/config/cloudinary');
const { uploadBufferToCloudinary } = require('../src/Middleware/upload');

jest.mock('../src/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  course: {
    count: jest.fn(),
  },
  courseEnrollment: {
    count: jest.fn(),
  },
  assignment: {
    count: jest.fn(),
  },
  quiz: {
    count: jest.fn(),
  },
  assignmentSubmission: {
    count: jest.fn(),
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
      user: { userId: 'user-123', role: 'STUDENT' },
      body: {},
      params: {},
      query: {},
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

  describe('updateProfile', () => {
    it('successfully updates user profile name and mobile', async () => {
      req.body = { name: 'Sarah J.', mobileNumber: '9876543210' };
      prisma.user.update.mockResolvedValue({
        id: 'user-123',
        name: 'Sarah J.',
        mobileNumber: '9876543210',
      });

      await userController.updateProfile(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-123' },
          data: { name: 'Sarah J.', mobileNumber: '9876543210' },
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Sarah J.' })
      );
    });

    it('rejects an empty name update', async () => {
      req.body = { name: '   ' };

      await userController.updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name cannot be empty.' });
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
      req.file = { mimetype: 'application/pdf' };

      await userController.updateProfilePhoto(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Only image files are allowed.' });
    });

    it('cleans up old cloudinary image and uploads new image', async () => {
      req.file = {
        mimetype: 'image/png',
        buffer: Buffer.from('fake-image-bytes'),
      };
      prisma.user.findUnique.mockResolvedValue({
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612345678/lms/profiles/old_pic.png',
      });
      uploadBufferToCloudinary.mockResolvedValue({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1612345678/lms/profiles/new_pic.png',
      });
      prisma.user.update.mockResolvedValue({
        id: 'user-123',
        name: 'Sarah Jensen',
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612345678/lms/profiles/new_pic.png',
      });

      await userController.updateProfilePhoto(req, res);

      expect(uploadBufferToCloudinary).toHaveBeenCalled();
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        'lms/profiles/old_pic',
        { resource_type: 'image' }
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612345678/lms/profiles/new_pic.png',
        })
      );
    });
  });

  describe('deleteProfilePhoto', () => {
    it('deletes old Cloudinary image and sets profileImage to null', async () => {
      prisma.user.findUnique.mockResolvedValue({
        profileImage: 'https://res.cloudinary.com/demo/image/upload/v1612345678/lms/profiles/to_delete.png',
      });
      prisma.user.update.mockResolvedValue({
        id: 'user-123',
        name: 'Sarah Jensen',
        profileImage: null,
      });

      await userController.deleteProfilePhoto(req, res);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-123' },
          data: { profileImage: null },
        })
      );
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
        'lms/profiles/to_delete',
        { resource_type: 'image' }
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ profileImage: null })
      );
    });
  });

    describe('Admin operations', () => {
      it('lists all users with filters', async () => {
    req.query = { search: 'alan', role: 'faculty' };
    prisma.user.findMany.mockResolvedValue([
      { id: 'u1', name: 'Dr. Alan Turing', role: 'FACULTY' },
    ]);

    await userController.getAllUsers(req, res);

    expect(prisma.user.findMany).toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith([
    expect.objectContaining({ name: 'Dr. Alan Turing' }),
  ]);
});

it('provisions a new user', async () => {
  req.body = {
    name: 'John von Neumann',
    email: 'john@example.com',
    role: 'faculty',
  };
  prisma.user.findFirst.mockResolvedValue(null);
  prisma.user.create.mockResolvedValue({
    id: 'u2',
    name: 'John von Neumann',
    email: 'john@example.com',
    role: 'FACULTY',
  });

  await userController.createUser(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ name: 'John von Neumann' })
  );
});

it('returns system overview statistics', async () => {
  prisma.user.count.mockResolvedValue(42);
  prisma.course.count.mockResolvedValue(8);
  prisma.courseEnrollment.count.mockResolvedValue(120);
  prisma.assignment.count.mockResolvedValue(15);
  prisma.quiz.count.mockResolvedValue(6);
  prisma.assignmentSubmission.count.mockResolvedValue(85);

  await userController.getSystemStats(req, res);

  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({
      totalUsers: 42,
      totalCourses: 8,
      activeEnrollments: 120,
    })
  );
});
  });
});
