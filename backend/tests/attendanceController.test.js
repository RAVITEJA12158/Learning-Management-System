const attendanceController = require('../src/Controllers/attendanceController');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  attendanceSession: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  attendanceRecord: {
    findMany: jest.fn(),
    createMany: jest.fn(),
    upsert: jest.fn(),
    updateMany: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
  courseEnrollment: {
    findMany: jest.fn(),
  },
}));

describe('Attendance Controller', () => {
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

  it('lists attendance sessions for an instructor', async () => {
    req.params.courseId = 'c1';
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.attendanceSession.findMany.mockResolvedValue([
      {
        id: 'sess-1',
        courseId: 'c1',
        date: new Date('2026-09-01'),
        createdBy: { name: 'Dr. Alan Turing' },
        records: [
          {
            id: 'rec-1',
            sessionId: 'sess-1',
            studentId: 'stu-1',
            status: 'PRESENT',
            student: { name: 'Sarah Jensen', email: 'sarah@example.com' },
          },
        ],
      },
    ]);

    await attendanceController.getSessionsByCourse(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'sess-1',
          records: expect.arrayContaining([
            expect.objectContaining({ studentName: 'Sarah Jensen', status: 'PRESENT' }),
          ]),
        }),
      ])
    );
  });

  it('creates an attendance session and auto-initializes enrolled students', async () => {
    req.body = {
      courseId: 'c1',
      date: '2026-09-02',
      topic: 'Graph Algorithms',
    };
    prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
    prisma.courseEnrollment.findMany.mockResolvedValue([{ studentId: 'stu-1' }, { studentId: 'stu-2' }]);
    prisma.attendanceSession.create.mockResolvedValue({
      id: 'sess-2',
      courseId: 'c1',
      date: new Date('2026-09-02'),
      createdBy: { name: 'Dr. Alan Turing' },
    });
    prisma.attendanceRecord.createMany.mockResolvedValue({ count: 2 });
    prisma.attendanceRecord.findMany.mockResolvedValue([
      { id: 'rec-2', sessionId: 'sess-2', studentId: 'stu-1', status: 'PRESENT', student: { name: 'Sarah' } },
      { id: 'rec-3', sessionId: 'sess-2', studentId: 'stu-2', status: 'PRESENT', student: { name: 'Arjun' } },
    ]);

    await attendanceController.createSession(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(prisma.attendanceRecord.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ studentId: 'stu-1', status: 'PRESENT' }),
        expect.objectContaining({ studentId: 'stu-2', status: 'PRESENT' }),
      ]),
      skipDuplicates: true,
    });
  });

  it('calculates derived attendance percentage for a student', async () => {
    req.params.courseId = 'c1';
    req.user = { userId: 'stu-1', role: 'STUDENT' };

    prisma.attendanceSession.findMany.mockResolvedValue([
      { id: 's1', date: new Date('2026-09-01'), records: [{ status: 'PRESENT' }] },
      { id: 's2', date: new Date('2026-09-02'), records: [{ status: 'PRESENT' }] },
      { id: 's3', date: new Date('2026-09-03'), records: [{ status: 'LATE' }] },
      { id: 's4', date: new Date('2026-09-04'), records: [{ status: 'ABSENT' }] },
    ]);

    await attendanceController.getStudentAttendance(req, res);

    // 2 present (2) + 1 late (0.5) = 2.5 / 4 = 63%
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        totalSessions: 4,
        presentCount: 2,
        lateCount: 1,
        absentCount: 1,
        derivedPercentage: 63,
      })
    );
  });
});

