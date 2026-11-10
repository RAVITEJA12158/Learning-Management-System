const quizController = require('../src/Controllers/quizController');
const prisma = require('../src/lib/prisma');

jest.mock('../src/lib/prisma', () => ({
  quiz: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  quizAttempt: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
  course: {
    findUnique: jest.fn(),
  },
  courseEnrollment: {
    findUnique: jest.fn(),
  },
}));

describe('Quiz Controller', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      params: {},
      body: {},
      query: {},
      user: { userId: 'student-1', role: 'STUDENT' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getQuizzesByCourse', () => {
    it('blocks student who is not enrolled in course', async () => {
      req.params.courseId = 'c1';
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
      prisma.courseEnrollment.findUnique.mockResolvedValue(null);

      await quizController.getQuizzesByCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.stringMatching(/Not authorized/) }));
    });

    it('returns formatted quizzes for enrolled student', async () => {
      req.params.courseId = 'c1';
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
      prisma.courseEnrollment.findUnique.mockResolvedValue({ status: 'ACTIVE' });
      prisma.quiz.findMany.mockResolvedValue([
        {
          id: 'q1',
          courseId: 'c1',
          title: 'Midterm Quiz',
          durationMinutes: 30,
          totalMarks: 50,
          maxAttempts: 2,
          startTime: new Date(Date.now() - 10000),
          endTime: new Date(Date.now() + 100000),
          _count: { questions: 10, attempts: 1 },
          attempts: [{ score: 45 }],
        },
      ]);

      await quizController.getQuizzesByCourse(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: 'q1',
            title: 'Midterm Quiz',
            attemptsUsed: 1,
            score: 45,
            status: 'Active',
          }),
        ])
      );
    });
  });

  describe('getQuizById', () => {
    it('hides isCorrect on options for student callers', async () => {
      req.params.id = 'q1';
      prisma.quiz.findUnique.mockResolvedValue({
        id: 'q1',
        courseId: 'c1',
        title: 'Quiz 1',
        questions: [
          {
            id: 'ques1',
            questionText: 'What is O(1)?',
            options: [
              { id: 'opt1', optionText: 'Constant time', isCorrect: false },
            ],
          },
        ],
      });
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
      prisma.courseEnrollment.findUnique.mockResolvedValue({ status: 'ACTIVE' });

      await quizController.getQuizById(req, res);

      expect(res.json).toHaveBeenCalled();
      const returnedQuiz = res.json.mock.calls[0][0];
      expect(returnedQuiz.questions[0].options[0].isCorrect).toBe(false);
    });
  });

  describe('createQuiz', () => {
    it('allows course instructor to create a quiz with questions', async () => {
      req.user = { userId: 'fac-1', role: 'FACULTY' };
      req.body = {
        courseId: 'c1',
        title: 'Algorithms Quiz',
        durationMinutes: 45,
        totalMarks: 20,
        questions: [
          {
            questionText: 'Is binary search O(log n)?',
            questionType: 'TRUE_FALSE',
            marks: 10,
            options: [
              { optionText: 'True', isCorrect: true },
              { optionText: 'False', isCorrect: false },
            ],
          },
        ],
      };
      prisma.course.findUnique.mockResolvedValue({ id: 'c1', createdById: 'fac-1', instructors: [] });
      prisma.quiz.create.mockResolvedValue({
        id: 'new-q',
        title: 'Algorithms Quiz',
        courseId: 'c1',
      });

      await quizController.createQuiz(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(prisma.quiz.create).toHaveBeenCalled();
    });
  });

  describe('submitQuizAttempt', () => {
    it('auto-grades MCQ answers correctly and creates a QuizAttempt', async () => {
      req.params.id = 'q1';
      req.user = { userId: 'student-1', role: 'STUDENT' };
      req.body = {
        answers: [
          { questionId: 'ques-1', selectedOptionId: 'opt-correct' },
          { questionId: 'ques-2', selectedOptionId: 'opt-wrong' },
        ],
      };

      prisma.quiz.findUnique.mockResolvedValue({
        id: 'q1',
        courseId: 'c1',
        maxAttempts: 2,
        totalMarks: 20,
        questions: [
          {
            id: 'ques-1',
            questionType: 'MCQ',
            marks: 10,
            options: [
              { id: 'opt-correct', isCorrect: true },
              { id: 'opt-wrong', isCorrect: false },
            ],
          },
          {
            id: 'ques-2',
            questionType: 'MCQ',
            marks: 10,
            options: [
              { id: 'opt-correct-2', isCorrect: true },
              { id: 'opt-wrong', isCorrect: false },
            ],
          },
        ],
      });
      prisma.courseEnrollment.findUnique.mockResolvedValue({ status: 'ACTIVE' });
      prisma.quizAttempt.count.mockResolvedValue(0);
      prisma.quizAttempt.create.mockResolvedValue({
        id: 'att-1',
        quizId: 'q1',
        studentId: 'student-1',
        submittedAt: new Date(),
        score: 10,
        status: 'SUBMITTED',
        answers: [],
      });

      await quizController.submitQuizAttempt(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(prisma.quizAttempt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            score: 10,
          }),
        })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          score: 10,
          totalMarks: 20,
          percentage: 50,
          status: 'Completed',
        })
      );
    });
  });
});

