const announcementController = require('../src/Controllers/announcementController');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  announcement: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  notification: {
    createMany: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
  courseEnrollment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('Announcement Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
      user: { userId: 'fac-1', role: 'FACULTY' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('lists announcements for an enrolled course', async () => {
    req.params.courseId = 'c1';
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.announcement.findMany.mockResolvedValue([
      {
        id: 'ann-1',
        courseId: 'c1',
        title: 'Exam Notice',
        message: 'Midterm will be held next Tuesday.',
        createdAt: new Date(),
        createdBy: { name: 'Dr. Alan Turing', role: 'FACULTY' },
      },
    ]);

    await announcementController.getAnnouncementsByCourse(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'ann-1',
          title: 'Exam Notice',
          author: 'Dr. Alan Turing',
        }),
      ])
    );
  });

  it('creates an announcement and dispatches student notifications', async () => {
    req.body = {
      courseId: 'c1',
      title: 'Lab Cancelled',
      message: 'No lab tomorrow morning.',
    };
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.announcement.create.mockResolvedValue({
      id: 'ann-2',
      courseId: 'c1',
      title: 'Lab Cancelled',
      message: 'No lab tomorrow morning.',
      createdAt: new Date(),
      createdBy: { name: 'Dr. Alan Turing' },
      course: { courseCode: 'CS101' },
    });
    prisma.courseEnrollment.findMany.mockResolvedValue([{ studentId: 'stu-1' }]);
    prisma.notification.createMany.mockResolvedValue({ count: 1 });

    await announcementController.createAnnouncement(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(prisma.announcement.create).toHaveBeenCalled();
    expect(prisma.notification.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          userId: 'stu-1',
          type: 'ANNOUNCEMENT',
        }),
      ]),
    });
  });

  it('deletes an announcement when called by creator', async () => {
    req.params.id = 'ann-2';
    prisma.announcement.findUnique.mockResolvedValue({
      id: 'ann-2',
      createdById: 'fac-1',
      courseId: 'c1',
      course: { createdById: 'fac-1', instructors: [] },
    });
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.announcement.delete.mockResolvedValue({ id: 'ann-2' });

    await announcementController.deleteAnnouncement(req, res);

    expect(prisma.announcement.delete).toHaveBeenCalledWith({ where: { id: 'ann-2' } });
    expect(res.json).toHaveBeenCalledWith({ message: 'Announcement deleted successfully.' });
  });
});

