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

jest.mock('../src/Middleware/upload', () => ({
  uploadBufferToCloudinary: jest.fn(),
}));

const prisma = require('../src/lib/prisma');
const { uploadBufferToCloudinary } = require('../src/Middleware/upload');
const assignmentController = require('../src/Controllers/assignmentController');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Assignment & Submission Controller (Sprint 4)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAssignment', () => {
    it('creates an assignment for course instructor', async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: 'c1',
        createdById: 'faculty-1',
        instructors: [],
      });
      prisma.assignment.create.mockResolvedValue({
        id: 'a1',
        title: 'Project 1',
        maxMarks: 100,
        dueDate: new Date(),
        allowLateSubmission: false,
      });

      const req = {
        body: {
          courseId: 'c1',
          title: 'Project 1',
          maxMarks: 100,
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          allowLateSubmission: false,
        },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await assignmentController.createAssignment(req, res);

      expect(prisma.assignment.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('rejects creation from unauthorized user (403)', async () => {
      prisma.course.findUnique.mockResolvedValue({
        id: 'c1',
        createdById: 'faculty-1',
        instructors: [],
      });

      const req = {
        body: {
          courseId: 'c1',
          title: 'Project 1',
          maxMarks: 100,
          dueDate: new Date().toISOString(),
        },
        user: { userId: 'student-1', role: 'STUDENT' },
      };
      const res = mockResponse();

      await assignmentController.createAssignment(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('submitAssignment & Late Logic', () => {
    it('accepts on-time submission with SUBMITTED status', async () => {
      const futureDue = new Date(Date.now() + 100000);
      prisma.assignment.findUnique.mockResolvedValue({
        id: 'a1',
        dueDate: futureDue,
        allowLateSubmission: false,
      });
      prisma.assignmentSubmission.upsert.mockResolvedValue({
        id: 'sub-1',
        assignmentId: 'a1',
        studentId: 'student-1',
        status: 'SUBMITTED',
      });

      const req = {
        params: { id: 'a1' },
        body: { fileUrl: 'https://cloudinary.test/submission.pdf' },
        user: { userId: 'student-1' },
      };
      const res = mockResponse();

      await assignmentController.submitAssignment(req, res);

      expect(prisma.assignmentSubmission.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ status: 'SUBMITTED' }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('marks submission as LATE when past due and late allowed', async () => {
      const pastDue = new Date(Date.now() - 100000);
      prisma.assignment.findUnique.mockResolvedValue({
        id: 'a1',
        dueDate: pastDue,
        allowLateSubmission: true,
      });
      prisma.assignmentSubmission.upsert.mockResolvedValue({
        id: 'sub-1',
        status: 'LATE',
      });

      const req = {
        params: { id: 'a1' },
        body: { fileUrl: 'https://cloudinary.test/late.pdf' },
        user: { userId: 'student-1' },
      };
      const res = mockResponse();

      await assignmentController.submitAssignment(req, res);

      expect(prisma.assignmentSubmission.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ status: 'LATE' }),
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('rejects late submission when past due and allowLateSubmission is false (400)', async () => {
      const pastDue = new Date(Date.now() - 100000);
      prisma.assignment.findUnique.mockResolvedValue({
        id: 'a1',
        dueDate: pastDue,
        allowLateSubmission: false,
      });

      const req = {
        params: { id: 'a1' },
        body: { fileUrl: 'https://cloudinary.test/late.pdf' },
        user: { userId: 'student-1' },
      };
      const res = mockResponse();

      await assignmentController.submitAssignment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'The deadline for this assignment has passed and late submissions are not allowed.',
        })
      );
    });
  });

  describe('gradeSubmission', () => {
    it('allows faculty to award marks and feedback', async () => {
      prisma.assignmentSubmission.findUnique.mockResolvedValue({
        id: 'sub-1',
        assignment: {
          maxMarks: 100,
          createdById: 'faculty-1',
          course: { createdById: 'faculty-1' },
        },
      });
      prisma.assignmentSubmission.update.mockResolvedValue({
        id: 'sub-1',
        marks: 95,
        feedback: 'Excellent work',
      });

      const req = {
        params: { submissionId: 'sub-1' },
        body: { marks: 95, feedback: 'Excellent work' },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await assignmentController.gradeSubmission(req, res);

      expect(prisma.assignmentSubmission.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ marks: 95, feedback: 'Excellent work' }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ marks: 95 }));
    });

    it('rejects marks greater than maximum allowed marks (400)', async () => {
      prisma.assignmentSubmission.findUnique.mockResolvedValue({
        id: 'sub-1',
        assignment: {
          maxMarks: 50,
          createdById: 'faculty-1',
          course: { createdById: 'faculty-1' },
        },
      });

      const req = {
        params: { submissionId: 'sub-1' },
        body: { marks: 75 },
        user: { userId: 'faculty-1', role: 'FACULTY' },
      };
      const res = mockResponse();

      await assignmentController.gradeSubmission(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Marks must be between 0 and maximum marks allowed (50).',
      });
    });
  });
});
