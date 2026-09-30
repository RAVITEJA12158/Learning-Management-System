const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  assignment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  assignmentSubmission: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    upsert: jest.fn(),
    update: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
}));

describe('Assignment & Submission Integration Flow (Sprint 4)', () => {
  const JWT_SECRET = 'test-assignment-secret';
  let studentToken;
  let facultyToken;

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.JWT_EXPIRES_IN = '1h';

    studentToken = jwt.sign({ userId: 'student-20', role: 'STUDENT' }, JWT_SECRET);
    facultyToken = jwt.sign({ userId: 'faculty-20', role: 'FACULTY' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows faculty to create an assignment, student to submit, and faculty to grade', async () => {
    // 1. Faculty creates assignment
    prisma.course.findUnique.mockResolvedValue({
      id: 'course-20',
      createdById: 'faculty-20',
      instructors: [],
    });
    prisma.assignment.create.mockResolvedValue({
      id: 'assign-20',
      courseId: 'course-20',
      title: 'Lab 4: REST API Design',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 86400000),
      allowLateSubmission: true,
      createdById: 'faculty-20',
    });

    const createRes = await request(app)
      .post('/api/assignments')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send({
        courseId: 'course-20',
        title: 'Lab 4: REST API Design',
        maxMarks: 100,
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        allowLateSubmission: true,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('id', 'assign-20');

    // 2. Student submits assignment
    prisma.assignment.findUnique.mockResolvedValue({
      id: 'assign-20',
      dueDate: new Date(Date.now() + 86400000),
      allowLateSubmission: true,
    });
    prisma.assignmentSubmission.upsert.mockResolvedValue({
      id: 'sub-20',
      assignmentId: 'assign-20',
      studentId: 'student-20',
      fileUrl: 'https://cloudinary.test/lab4.zip',
      status: 'SUBMITTED',
    });

    const submitRes = await request(app)
      .post('/api/assignments/assign-20/submit')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ fileUrl: 'https://cloudinary.test/lab4.zip' });

    expect(submitRes.status).toBe(201);
    expect(submitRes.body).toHaveProperty('status', 'SUBMITTED');

    // 3. Faculty grades submission
    prisma.assignmentSubmission.findUnique.mockResolvedValue({
      id: 'sub-20',
      assignment: {
        maxMarks: 100,
        createdById: 'faculty-20',
        course: { createdById: 'faculty-20' },
      },
    });
    prisma.assignmentSubmission.update.mockResolvedValue({
      id: 'sub-20',
      marks: 98,
      feedback: 'Great modular structure!',
    });

    const gradeRes = await request(app)
      .put('/api/assignments/submissions/sub-20/grade')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send({ marks: 98, feedback: 'Great modular structure!' });

    expect(gradeRes.status).toBe(200);
    expect(gradeRes.body).toHaveProperty('marks', 98);
  });
});
