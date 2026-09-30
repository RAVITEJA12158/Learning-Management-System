const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const prisma = require('../src/lib/prisma');

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

describe('Course & Enrollment Integration Flows (Sprint 2)', () => {
  const JWT_SECRET = 'test-course-secret';
  let studentToken;
  let facultyToken;
  let otherFacultyToken;
  let adminToken;

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.JWT_EXPIRES_IN = '1h';

    studentToken = jwt.sign({ userId: 'student-1', role: 'STUDENT' }, JWT_SECRET);
    facultyToken = jwt.sign({ userId: 'faculty-1', role: 'FACULTY' }, JWT_SECRET);
    otherFacultyToken = jwt.sign({ userId: 'faculty-2', role: 'FACULTY' }, JWT_SECRET);
    adminToken = jwt.sign({ userId: 'admin-1', role: 'ADMIN' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Course Creation & RBAC', () => {
    it('allows FACULTY to create a course', async () => {
      prisma.course.findUnique.mockResolvedValue(null);
      prisma.course.create.mockResolvedValue({
        id: 'course-101',
        title: 'Operating Systems',
        courseCode: 'CS301',
        semester: 'Fall 2026',
        createdById: 'faculty-1',
      });
      prisma.courseInstructor.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send({
          title: 'Operating Systems',
          courseCode: 'CS301',
          semester: 'Fall 2026',
          description: 'Kernel & Process Management',
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id', 'course-101');
      expect(res.body).toHaveProperty('courseCode', 'CS301');
    });

    it('blocks STUDENT from creating a course (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Unauthorized Course',
          courseCode: 'CS999',
        });

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Access denied. Insufficient permissions.');
    });
  });

  describe('2. Course Browsing & Enrollment Flow', () => {
    it('allows student to list courses and enroll', async () => {
      // Browse
      prisma.course.findMany.mockResolvedValue([
        { id: 'course-101', title: 'Operating Systems', courseCode: 'CS301' },
      ]);

      const listRes = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body).toHaveLength(1);

      // Enroll
      prisma.courseEnrollment.findUnique.mockResolvedValue(null);
      prisma.courseEnrollment.create.mockResolvedValue({
        id: 'enroll-1',
        courseId: 'course-101',
        studentId: 'student-1',
        status: 'ACTIVE',
      });

      const enrollRes = await request(app)
        .post('/api/courses/course-101/enroll')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(enrollRes.status).toBe(201);
      expect(enrollRes.body).toHaveProperty('status', 'ACTIVE');
    });

    it('allows student to view active enrolled courses and drop a course', async () => {
      // Get enrolled
      prisma.courseEnrollment.findMany.mockResolvedValue([
        {
          id: 'enroll-1',
          course: { id: 'course-101', title: 'Operating Systems', courseCode: 'CS301' },
        },
      ]);

      const enrolledRes = await request(app)
        .get('/api/courses/student/enrolled')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(enrolledRes.status).toBe(200);
      expect(enrolledRes.body[0]).toHaveProperty('id', 'course-101');

      // Drop
      prisma.courseEnrollment.findUnique.mockResolvedValue({
        id: 'enroll-1',
        courseId: 'course-101',
        studentId: 'student-1',
        status: 'ACTIVE',
      });
      prisma.courseEnrollment.update.mockResolvedValue({
        id: 'enroll-1',
        status: 'DROPPED',
      });

      const dropRes = await request(app)
        .delete('/api/courses/course-101/enroll')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(dropRes.status).toBe(200);
      expect(dropRes.body).toHaveProperty('message', 'Successfully dropped course.');
    });
  });

  describe('3. Faculty Instructor Management & Roster Flow', () => {
    it('allows course creator to assign another faculty member', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'course-101', createdById: 'faculty-1' });
      prisma.user.findUnique.mockResolvedValue({ id: 'faculty-2', role: 'FACULTY' });
      prisma.courseInstructor.findUnique.mockResolvedValue(null);
      prisma.courseInstructor.create.mockResolvedValue({
        id: 'inst-2',
        courseId: 'course-101',
        facultyId: 'faculty-2',
        faculty: { id: 'faculty-2', name: 'Dr. Jane' },
      });

      const res = await request(app)
        .post('/api/courses/course-101/instructors')
        .set('Authorization', `Bearer ${facultyToken}`)
        .send({ facultyId: 'faculty-2' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('facultyId', 'faculty-2');
    });

    it('blocks non-owner faculty from modifying instructors or deleting course', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'course-101', createdById: 'faculty-1' });

      const res = await request(app)
        .post('/api/courses/course-101/instructors')
        .set('Authorization', `Bearer ${otherFacultyToken}`)
        .send({ facultyId: 'faculty-3' });

      expect(res.status).toBe(403);
    });

    it('allows admin to delete course', async () => {
      prisma.course.findUnique.mockResolvedValue({ id: 'course-101', createdById: 'faculty-1' });
      prisma.course.delete.mockResolvedValue({});

      const res = await request(app)
        .delete('/api/courses/course-101')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Course deleted successfully.');
    });
  });
});
