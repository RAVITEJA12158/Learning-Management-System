const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/server');
const prisma = require('../src/lib/prisma');

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

describe('Module, Content & Progress Integration Flow (Sprint 3)', () => {
  const JWT_SECRET = 'test-module-secret';
  let studentToken;
  let facultyToken;

  beforeAll(() => {
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.JWT_EXPIRES_IN = '1h';

    studentToken = jwt.sign({ userId: 'student-10', role: 'STUDENT' }, JWT_SECRET);
    facultyToken = jwt.sign({ userId: 'faculty-10', role: 'FACULTY' }, JWT_SECRET);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows faculty to create and update a module', async () => {
    prisma.course.findUnique.mockResolvedValue({ id: 'course-10', createdById: 'faculty-10' });
    prisma.module.create.mockResolvedValue({
      id: 'mod-1',
      courseId: 'course-10',
      title: 'Module 1: React Basics',
      position: 1,
      isPublished: true,
    });

    const res = await request(app)
      .post('/api/modules')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send({
        courseId: 'course-10',
        title: 'Module 1: React Basics',
        isPublished: true,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', 'mod-1');

    // Update publish state
    prisma.module.findUnique.mockResolvedValue({
      id: 'mod-1',
      course: { createdById: 'faculty-10' },
    });
    prisma.module.update.mockResolvedValue({
      id: 'mod-1',
      title: 'Module 1: React Basics (Published)',
      isPublished: true,
    });

    const updateRes = await request(app)
      .put('/api/modules/mod-1')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send({ title: 'Module 1: React Basics (Published)', isPublished: true });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toHaveProperty('title', 'Module 1: React Basics (Published)');
  });

  it('allows student to track and fetch course completion progress', async () => {
    // 1. Mark content as completed
    prisma.content.findUnique.mockResolvedValue({ id: 'cnt-1' });
    prisma.contentProgress.upsert.mockResolvedValue({
      userId: 'student-10',
      contentId: 'cnt-1',
      completed: true,
    });

    const markRes = await request(app)
      .put('/api/progress/content/cnt-1')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ completed: true });

    expect(markRes.status).toBe(200);
    expect(markRes.body).toHaveProperty('completed', true);

    // 2. Fetch course overall progress
    prisma.module.findMany.mockResolvedValue([
      {
        id: 'mod-1',
        title: 'Module 1',
        content: [
          { id: 'cnt-1', title: 'Video Lecture', progress: [{ completed: true }] },
        ],
      },
    ]);

    const progressRes = await request(app)
      .get('/api/progress/course/course-10')
      .set('Authorization', `Bearer ${studentToken}`);

    expect(progressRes.status).toBe(200);
    expect(progressRes.body).toHaveProperty('completionPercent', 100);
    expect(progressRes.body).toHaveProperty('totalContent', 1);
    expect(progressRes.body).toHaveProperty('completedContent', 1);
  });
});
