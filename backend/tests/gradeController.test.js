const gradeController = require('../src/Controllers/gradeController');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  gradeComponent: {
    findMany: jest.fn(),
    deleteMany: jest.fn(),
    createMany: jest.fn(),
  },
  courseEnrollment: {
    findMany: jest.fn(),
  },
  assignment: {
    findMany: jest.fn(),
  },
  quiz: {
    findMany: jest.fn(),
  },
  attendanceSession: {
    findMany: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
}));

describe('Grade Controller', () => {
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

  it('returns default grade components when none configured', async () => {
    req.params.courseId = 'c1';
    prisma.gradeComponent.findMany.mockResolvedValue([]);

    await gradeController.getGradeComponents(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Assignments', weight: 20 }),
        expect.objectContaining({ name: 'Quizzes', weight: 20 }),
      ])
    );
  });

  it('saves custom grade component weights', async () => {
    req.params.courseId = 'c1';
    req.body = {
      components: [
        { name: 'Assignments', type: 'assignment', weight: 40 },
        { name: 'Final Project', type: 'project', weight: 60 },
      ],
    };
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.gradeComponent.deleteMany.mockResolvedValue({ count: 2 });
    prisma.gradeComponent.createMany.mockResolvedValue({ count: 2 });
    prisma.gradeComponent.findMany.mockResolvedValue([
      { id: 'gc-1', name: 'Assignments', type: 'assignment', weight: 40 },
      { id: 'gc-2', name: 'Final Project', type: 'project', weight: 60 },
    ]);

    await gradeController.saveGradeComponents(req, res);

    expect(prisma.gradeComponent.deleteMany).toHaveBeenCalledWith({ where: { courseId: 'c1' } });
    expect(prisma.gradeComponent.createMany).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Assignments', weight: 40 }),
      ])
    );
  });

  it('computes aggregated gradebook for all students in course', async () => {
    req.params.courseId = 'c1';
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.courseEnrollment.findMany.mockResolvedValue([
      {
        id: 'enr-1',
        studentId: 'stu-1',
        status: 'ACTIVE',
        student: { id: 'stu-1', name: 'Sarah Jensen', email: 'sarah@example.com' },
      },
    ]);
    prisma.assignment.findMany.mockResolvedValue([
      { maxMarks: 100, submissions: [{ studentId: 'stu-1', marks: 95 }] },
    ]);
    prisma.quiz.findMany.mockResolvedValue([
      { totalMarks: 100, attempts: [{ studentId: 'stu-1', score: 90 }] },
    ]);
    prisma.attendanceSession.findMany.mockResolvedValue([
      { records: [{ studentId: 'stu-1', status: 'PRESENT' }] },
    ]);

    await gradeController.getCourseGradebook(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          studentId: 'stu-1',
          name: 'Sarah Jensen',
          assignments: 95,
          quizzes: 90,
          letter: expect.any(String),
        }),
      ])
    );
  });
});

