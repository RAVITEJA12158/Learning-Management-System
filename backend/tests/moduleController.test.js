jest.mock('../src/lib/prisma', () => ({
  module: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  content: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
  contentProgress: {
    upsert: jest.fn(),
  },
}));

jest.mock('../src/Middleware/upload', () => ({
  uploadBufferToCloudinary: jest.fn(),
}));

const prisma = require('../src/lib/prisma');
const { uploadBufferToCloudinary } = require('../src/Middleware/upload');
const moduleController = require('../src/Controllers/moduleController');
const progressController = require('../src/Controllers/progressController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Module, Content & Progress Controllers (Sprint 3)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Module Management', () => {
    it('creates module when authorized faculty requests it', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });
      prisma.module.create.mockResolvedValue({
        id: 'm1',
        courseId: 'c1',
        title: 'Module 1: Foundations',
        position: 1,
        isPublished: true,
      });

      const req = {
        body: { courseId: 'c1', title: 'Module 1: Foundations', isPublished: true },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await moduleController.createModule(req, res);

      expect(prisma.module.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Module 1: Foundations' }));
    });

    it('rejects module creation for non-owner faculty (403)', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });

      const req = {
        body: { courseId: 'c1', title: 'Hacked Module' },
        user: { userId: 'faculty-2', role: 'FACULTY' },
      };
      const res = mockResponse();

      await moduleController.createModule(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not authorized.' });
    });

    it('updates module publish status', async () => {
      prisma.module.findUnique.mockResolvedValue({
        id: 'm1',
        course: { createdById: 'faculty-1' },
      });
      prisma.module.update.mockResolvedValue({
        id: 'm1',
        title: 'Updated Module',
        isPublished: true,
      });

      const req = {
        params: { id: 'm1' },
        body: { title: 'Updated Module', isPublished: true },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await moduleController.updateModule(req, res);

      expect(prisma.module.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ isPublished: true }));
    });

    it('deletes module successfully', async () => {
      prisma.module.findUnique.mockResolvedValue({
        id: 'm1',
        course: { createdById: 'faculty-1' },
      });
      prisma.module.delete.mockResolvedValue({});

      const req = {
        params: { id: 'm1' },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await moduleController.deleteModule(req, res);

      expect(prisma.module.delete).toHaveBeenCalledWith({ where: { id: 'm1' } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Module deleted successfully.' });
    });
  });

  describe('Content Management & Cloudinary Upload', () => {
    it('creates content inside module', async () => {
      prisma.module.findUnique.mockResolvedValue({
        id: 'm1',
        course: { createdById: 'faculty-1' },
      });
      prisma.content.create.mockResolvedValue({
        id: 'cnt-1',
        moduleId: 'm1',
        title: 'Lecture Slides.pdf',
        type: 'PDF',
        contentUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        createdById: 'faculty-1',
      });

      const req = {
        body: {
          moduleId: 'm1',
          title: 'Lecture Slides.pdf',
          type: 'PDF',
          contentUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await moduleController.createContent(req, res);

      expect(prisma.content.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('uploads file buffer to Cloudinary successfully', async () => {
      uploadBufferToCloudinary.mockResolvedValue({
        secure_url: 'https://cloudinary.test/sample.pdf',
        resource_type: 'image',
        bytes: 1024,
      });

      const req = {
        file: {
          buffer: Buffer.from('test-pdf-data'),
          originalname: 'lecture.pdf',
        },
      };
      const res = mockResponse();

      await moduleController.uploadContentFile(req, res);

      expect(uploadBufferToCloudinary).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://cloudinary.test/sample.pdf' }));
    });
  });

  describe('Content Progress Tracking', () => {
    it('marks content as completed for student', async () => {
      prisma.content.findUnique.mockResolvedValue({ id: 'cnt-1' });
      prisma.contentProgress.upsert.mockResolvedValue({
        userId: 'student-1',
        contentId: 'cnt-1',
        completed: true,
      });

      const req = {
        params: { contentId: 'cnt-1' },
        body: { completed: true },
        user: { userId: 'student-1' },
      };
      const res = mockResponse();

      await progressController.markContentProgress(req, res);

      expect(prisma.contentProgress.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId_contentId: { userId: 'student-1', contentId: 'cnt-1' } },
        })
      );
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
    });

    it('computes course progress percentage accurately', async () => {
      prisma.module.findMany.mockResolvedValue([
        {
          id: 'm1',
          title: 'Module 1',
          content: [
            { id: 'cnt-1', title: 'Lec 1', progress: [{ completed: true }] },
            { id: 'cnt-2', title: 'Lec 2', progress: [{ completed: false }] },
          ],
        },
        {
          id: 'm2',
          title: 'Module 2',
          content: [
            { id: 'cnt-3', title: 'Lec 3', progress: [{ completed: true }] },
            { id: 'cnt-4', title: 'Lec 4', progress: [{ completed: true }] },
          ],
        },
      ]);

      const req = {
        params: { courseId: 'c1' },
        user: { userId: 'student-1' },
      };
      const res = mockResponse();

      await progressController.getCourseProgress(req, res);

      expect(res.json).toHaveBeenCalledWith({
        courseId: 'c1',
        totalContent: 4,
        completedContent: 3,
        completionPercent: 75,
        modules: expect.any(Array),
      });
    });
  });
});
