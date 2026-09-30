jest.mock('../src/lib/prisma', () => ({
  course: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  courseInstructor: {
    create: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
  courseEnrollment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}));

const prisma = require('../src/lib/prisma');
const courseController = require('../src/Controllers/courseController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Course & Enrollment Controller (Sprint 2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllCourses', () => {
    it('returns all courses with createdBy info', async () => {
      const sampleCourses = [
        { id: 'c1', title: 'Data Structures', courseCode: 'CS101', createdBy: { name: 'Prof Smith' } },
      ];
      prisma.course.findMany.mockResolvedValue(sampleCourses);

      const req = { query: {} };
      const res = mockResponse();

      await courseController.getAllCourses(req, res);

      expect(prisma.course.findMany).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(sampleCourses);
    });

    it('filters courses by search parameter', async () => {
      prisma.course.findMany.mockResolvedValue([]);
      const req = { query: { search: 'CS101' } };
      const res = mockResponse();

      await courseController.getAllCourses(req, res);

      expect(prisma.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { title: { contains: 'CS101', mode: 'insensitive' } },
              { courseCode: { contains: 'CS101', mode: 'insensitive' } },
            ],
          }),
        })
      );
    });
  });

  describe('getCourseById', () => {
    it('returns course details if found', async () => {
      const course = { id: 'c1', title: 'Calculus', modules: [] };
      prisma.course.findUnique.mockResolvedValue(course);

      const req = { params: { id: 'c1' } };
      const res = mockResponse();

      await courseController.getCourseById(req, res);

      expect(res.json).toHaveBeenCalledWith(course);
    });

    it('returns 404 if course not found', async () => {
      prisma.course.findUnique.mockResolvedValue(null);

      const req = { params: { id: 'unknown' } };
      const res = mockResponse();

      await courseController.getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Course not found.' });
    });
  });

  describe('createCourse', () => {
    it('creates course and auto-assigns creator as instructor', async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      prisma.course.create.mockResolvedValue({
        id: 'c-new',
        title: 'Algorithms',
        courseCode: 'CS201',
        semester: 'Fall 2026',
        createdById: 'faculty-1',
      });
      prisma.courseInstructor.create.mockResolvedValue({});

      const req = {
        body: { title: 'Algorithms', courseCode: 'CS201', semester: 'Fall 2026', description: 'Algo basics' },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await courseController.createCourse(req, res);

      expect(prisma.course.create).toHaveBeenCalled();
      expect(prisma.courseInstructor.create).toHaveBeenCalledWith({
        data: { courseId: 'c-new', facultyId: 'faculty-1' },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('rejects duplicate course code + semester combination', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'existing-course' });

      const req = {
        body: { title: 'Algorithms', courseCode: 'CS201', semester: 'Fall 2026' },
        user: { userId: 'faculty-1' },
      };
      const res = mockResponse();

      await courseController.createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Course with this code and semester already exists.' });
    });
  });

  describe('updateCourse (RBAC)', () => {
    it('allows creator to update their course', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });
      prisma.course.update.mockResolvedValue({ id: 'c1', title: 'Updated Title' });

      const req = {
        params: { id: 'c1' },
        body: { title: 'Updated Title' },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await courseController.updateCourse(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 'c1', title: 'Updated Title' });
    });

    it('rejects updates from non-owner and non-admin (403)', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });

      const req = {
        params: { id: 'c1' },
        body: { title: 'Malicious Update' },
        user: { userId: 'faculty-2', role: 'FACULTY' },
      };
      const res = mockResponse();

      await courseController.updateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not authorized to update this course.' });
    });
  });

  describe('deleteCourse (RBAC)', () => {
    it('allows admin or creator to delete course', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });
      prisma.course.delete.mockResolvedValue({});

      const req = {
        params: { id: 'c1' },
        user: { userId: 'admin-1', role: 'ADMIN' },
      };
      const res = mockResponse();

      await courseController.deleteCourse(req, res);

      expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Course deleted successfully.' });
    });

    it('blocks unauthorized faculty from deleting another faculty course', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });

      const req = {
        params: { id: 'c1' },
        user: { userId: 'faculty-2', role: 'FACULTY' },
      };
      const res = mockResponse();

      await courseController.deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(prisma.course.delete).not.toHaveBeenCalled();
    });
  });

  describe('enrollStudent & unenrollStudent', () => {
    it('enrolls student successfully', async () => {
      prisma.courseEnrollment.findUnique.mockResolvedValue(null);
      prisma.courseEnrollment.create.mockResolvedValue({ id: 'e1', courseId: 'c1', studentId: 'student-1', status: 'ACTIVE' });

      const req = { params: { id: 'c1' }, user: { userId: 'student-1' } };
      const res = mockResponse();

      await courseController.enrollStudent(req, res);

      expect(prisma.courseEnrollment.create).toHaveBeenCalledWith({
        data: { courseId: 'c1', studentId: 'student-1', status: 'ACTIVE' },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('rejects duplicate enrollment (400)', async () => {
      prisma.courseEnrollment.findUnique.mockResolvedValue({ id: 'existing' });

      const req = { params: { id: 'c1' }, user: { userId: 'student-1' } };
      const res = mockResponse();

      await courseController.enrollStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Already enrolled in this course.' });
    });

    it('drops enrollment successfully', async () => {
      prisma.courseEnrollment.findUnique.mockResolvedValue({ id: 'e1', status: 'ACTIVE' });
      prisma.courseEnrollment.update.mockResolvedValue({ id: 'e1', status: 'DROPPED' });

      const req = { params: { id: 'c1' }, user: { userId: 'student-1' } };
      const res = mockResponse();

      await courseController.unenrollStudent(req, res);

      expect(prisma.courseEnrollment.update).toHaveBeenCalledWith({
        where: { courseId_studentId: { courseId: 'c1', studentId: 'student-1' } },
        data: { status: 'DROPPED' },
      });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Successfully dropped course.' }));
    });
  });

  describe('assignInstructor', () => {
    it('assigns qualified faculty member as instructor', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });
      prisma.user.findUnique.mockResolvedValue({ id: 'faculty-2', role: 'FACULTY' });
      prisma.courseInstructor.findUnique.mockResolvedValue(null);
      prisma.courseInstructor.create.mockResolvedValue({
        id: 'ci-1',
        courseId: 'c1',
        facultyId: 'faculty-2',
        faculty: { id: 'faculty-2', name: 'Dr. Jane' },
      });

      const req = {
        params: { id: 'c1' },
        body: { facultyId: 'faculty-2' },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await courseController.assignInstructor(req, res);

      expect(prisma.courseInstructor.create).toHaveBeenCalledWith({
        data: { courseId: 'c1', facultyId: 'faculty-2' },
        include: { faculty: { select: { id: true, name: true, email: true, username: true } } },
      });
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('rejects assignment if target user is not faculty or admin', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'faculty-1' });
      prisma.user.findUnique.mockResolvedValue({ id: 'student-1', role: 'STUDENT' });

      const req = {
        params: { id: 'c1' },
        body: { facultyId: 'student-1' },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await courseController.assignInstructor(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Target user must be a faculty member or admin.' });
    });
  });
});
