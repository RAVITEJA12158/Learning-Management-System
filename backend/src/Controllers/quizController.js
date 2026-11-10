const prisma = require('../lib/prisma');

async function isCourseStaff(courseId, user) {
  if (user.role === 'ADMIN') return true;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { instructors: true },
  });
  if (!course) return false;
  return course.createdById === user.userId ||
    course.instructors?.some((i) => i.facultyId === user.userId);
}

async function isEnrolledStudent(courseId, studentId) {
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_studentId: { courseId, studentId } },
    select: { status: true },
  });
  return enrollment?.status === 'ACTIVE';
}

/**
 * GET /api/quizzes/course/:courseId
 * List all quizzes for a course, formatted with attempt stats for students.
 */
exports.getQuizzesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = req.user;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const staff = await isCourseStaff(courseId, user);
    if (!staff) {
      const enrolled = await isEnrolledStudent(courseId, user.userId);
      if (!enrolled) {
        return res.status(403).json({ error: 'Not authorized to view quizzes for this course.' });
      }
    }

    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        createdBy: { select: { name: true } },
        _count: {
          select: { questions: true, attempts: true },
        },
        attempts: user.role === 'STUDENT'
          ? {
              where: { studentId: user.userId },
              orderBy: { startedAt: 'desc' },
            }
          : false,
      },
      orderBy: { startTime: 'asc' },
    });

    const now = new Date();

    const formatted = quizzes.map((q, idx) => {
      const attempts = q.attempts || [];
      const attemptsUsed = attempts.length;
      const latestAttempt = attempts[0] || null;
      const highestScore = attempts.reduce((max, a) => {
        const sc = a.score ? Number(a.score) : 0;
        return sc > max ? sc : max;
      }, 0);

      let status = 'Active';
      if (now < new Date(q.startTime)) status = 'Upcoming';
      else if (now > new Date(q.endTime)) status = 'Closed';
      if (user.role === 'STUDENT' && attemptsUsed >= q.maxAttempts) {
        status = 'Completed';
      }

      return {
        id: q.id,
        courseId: q.courseId,
        title: q.title,
        description: q.description || '',
        quizNumber: `Quiz ${idx + 1}`,
        durationMinutes: q.durationMinutes,
        duration: `${q.durationMinutes} Mins`,
        timeLimit: `${q.durationMinutes} mins`,
        totalMarks: Number(q.totalMarks),
        marks: Number(q.totalMarks),
        maxAttempts: q.maxAttempts,
        attemptsAllowed: q.maxAttempts,
        attemptsUsed,
        startTime: q.startTime,
        endTime: q.endTime,
        questionCount: q._count?.questions || 0,
        status,
        score: latestAttempt?.score ? Number(latestAttempt.score) : null,
        highestScore: attempts.length > 0 ? highestScore : null,
        buttonText: status === 'Completed' ? 'View Results' : status === 'Active' ? 'Start Assessment' : 'View Details',
        createdBy: q.createdBy?.name,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('getQuizzesByCourse error:', err);
    res.status(500).json({ error: 'Failed to fetch quizzes.' });
  }
};

/**
 * GET /api/quizzes/:id
 * Get single quiz with questions and options.
 * Hides isCorrect for students taking the quiz.
 */
exports.getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, courseCode: true } },
        createdBy: { select: { name: true } },
        questions: {
          orderBy: { position: 'asc' },
          include: {
            options: {
              select: {
                id: true,
                optionText: true,
                isCorrect: user.role !== 'STUDENT',
              },
            },
          },
        },
      },
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    const staff = await isCourseStaff(quiz.courseId, user);
    if (!staff) {
      const enrolled = await isEnrolledStudent(quiz.courseId, user.userId);
      if (!enrolled) {
        return res.status(403).json({ error: 'Not authorized to view this quiz.' });
      }
    }

    res.json(quiz);
  } catch (err) {
    console.error('getQuizById error:', err);
    res.status(500).json({ error: 'Failed to fetch quiz details.' });
  }
};

/**
 * POST /api/quizzes
 * Author a new quiz with questions & options (Faculty/Admin).
 */
exports.createQuiz = async (req, res) => {
  try {
    const {
      courseId,
      title,
      description,
      durationMinutes,
      maxAttempts,
      startTime,
      endTime,
      totalMarks,
      questions,
    } = req.body;

    if (!courseId || !title || !durationMinutes || !totalMarks) {
      return res.status(400).json({ error: 'courseId, title, durationMinutes, and totalMarks are required.' });
    }

    const staff = await isCourseStaff(courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to create quizzes for this course.' });
    }

    const parsedStart = startTime ? new Date(startTime) : new Date();
    const parsedEnd = endTime ? new Date(endTime) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const questionsData = Array.isArray(questions)
      ? questions.map((q, idx) => ({
          questionText: q.questionText || `Question ${idx + 1}`,
          questionType: q.questionType || 'MCQ',
          marks: Number(q.marks) || 1,
          position: q.position || idx + 1,
          options: {
            create: Array.isArray(q.options)
              ? q.options.map((opt) => ({
                  optionText: typeof opt === 'string' ? opt : opt.optionText,
                  isCorrect: typeof opt === 'object' ? Boolean(opt.isCorrect) : false,
                }))
              : [],
          },
        }))
      : [];

    const newQuiz = await prisma.quiz.create({
      data: {
        courseId,
        title: title.trim(),
        description: description || null,
        durationMinutes: Number(durationMinutes),
        maxAttempts: Number(maxAttempts) || 1,
        startTime: parsedStart,
        endTime: parsedEnd,
        totalMarks: Number(totalMarks),
        createdById: req.user.userId,
        questions: {
          create: questionsData,
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    res.status(201).json(newQuiz);
  } catch (err) {
    console.error('createQuiz error:', err);
    res.status(500).json({ error: 'Failed to author quiz.' });
  }
};

/**
 * PUT /api/quizzes/:id
 * Update quiz metadata (Faculty/Admin).
 */
exports.updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, durationMinutes, maxAttempts, startTime, endTime, totalMarks } = req.body;

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    const staff = await isCourseStaff(quiz.courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to update this quiz.' });
    }

    const updated = await prisma.quiz.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(description !== undefined && { description }),
        ...(durationMinutes !== undefined && { durationMinutes: Number(durationMinutes) }),
        ...(maxAttempts !== undefined && { maxAttempts: Number(maxAttempts) }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(totalMarks !== undefined && { totalMarks: Number(totalMarks) }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('updateQuiz error:', err);
    res.status(500).json({ error: 'Failed to update quiz.' });
  }
};

/**
 * DELETE /api/quizzes/:id
 * Delete a quiz (Faculty/Admin).
 */
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    const staff = await isCourseStaff(quiz.courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to delete this quiz.' });
    }

    await prisma.quiz.delete({ where: { id } });
    res.json({ message: 'Quiz deleted successfully.' });
  } catch (err) {
    console.error('deleteQuiz error:', err);
    res.status(500).json({ error: 'Failed to delete quiz.' });
  }
};

/**
 * POST /api/quizzes/:id/attempt
 * Student submits an attempt: auto-grades MCQs & True/False, stores results.
 */
exports.submitQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.userId;
    const { answers } = req.body; // array of { questionId, selectedOptionId, textAnswer }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    const enrolled = await isEnrolledStudent(quiz.courseId, studentId);
    if (!enrolled) {
      return res.status(403).json({ error: 'You must be actively enrolled in the course to take this quiz.' });
    }

    const previousAttempts = await prisma.quizAttempt.count({
      where: { quizId: id, studentId },
    });

    if (previousAttempts >= quiz.maxAttempts) {
      return res.status(400).json({ error: `Maximum allowed attempts (${quiz.maxAttempts}) reached.` });
    }

    let totalAwarded = 0;
    const answerRecords = [];
    const submittedAnswersMap = new Map();

    if (Array.isArray(answers)) {
      answers.forEach((ans) => {
        if (ans && ans.questionId) {
          submittedAnswersMap.set(ans.questionId, ans);
        }
      });
    }

    quiz.questions.forEach((question) => {
      const submission = submittedAnswersMap.get(question.id);
      let marksAwarded = 0;

      if (submission) {
        if (question.questionType === 'MCQ' || question.questionType === 'TRUE_FALSE') {
          const selectedOption = question.options.find((opt) => opt.id === submission.selectedOptionId);
          if (selectedOption && selectedOption.isCorrect) {
            marksAwarded = Number(question.marks);
          }
        }
      }

      totalAwarded += marksAwarded;

      answerRecords.push({
        questionId: question.id,
        selectedOptionId: submission?.selectedOptionId || null,
        textAnswer: submission?.textAnswer || null,
        marksAwarded,
      });
    });

    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: id,
        studentId,
        submittedAt: new Date(),
        score: totalAwarded,
        status: 'SUBMITTED',
        answers: {
          create: answerRecords,
        },
      },
      include: {
        answers: {
          include: {
            question: { select: { questionText: true, marks: true } },
            selectedOption: { select: { optionText: true } },
          },
        },
      },
    });

    const totalMarks = Number(quiz.totalMarks);
    const percentage = totalMarks > 0 ? Math.round((totalAwarded / totalMarks) * 100) : 0;

    res.status(201).json({
      attemptId: attempt.id,
      quizId: id,
      studentId,
      score: totalAwarded,
      totalMarks,
      percentage,
      status: 'Completed',
      submittedAt: attempt.submittedAt,
      answers: attempt.answers,
    });
  } catch (err) {
    console.error('submitQuizAttempt error:', err);
    res.status(500).json({ error: 'Failed to process quiz submission.' });
  }
};

/**
 * GET /api/quizzes/:id/attempts
 * List attempts for a quiz (student gets own, faculty gets all).
 */
exports.getQuizAttempts = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const quiz = await prisma.quiz.findUnique({ where: { id } });
    if (!quiz) return res.status(404).json({ error: 'Quiz not found.' });

    const staff = await isCourseStaff(quiz.courseId, user);
    const where = { quizId: id };

    if (!staff) {
      where.studentId = user.userId;
    }

    const attempts = await prisma.quizAttempt.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, email: true, username: true } },
      },
      orderBy: { startedAt: 'desc' },
    });

    res.json(attempts);
  } catch (err) {
    console.error('getQuizAttempts error:', err);
    res.status(500).json({ error: 'Failed to fetch quiz attempts.' });
  }
};

/**
 * GET /api/quizzes/attempts/:attemptId
 * Detailed view of a completed attempt with correct answers for review.
 */
exports.getAttemptDetails = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const user = req.user;

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          select: { id: true, courseId: true, title: true, totalMarks: true },
        },
        student: { select: { id: true, name: true, email: true } },
        answers: {
          include: {
            question: {
              include: { options: true },
            },
            selectedOption: true,
          },
        },
      },
    });

    if (!attempt) return res.status(404).json({ error: 'Attempt not found.' });

    const staff = await isCourseStaff(attempt.quiz.courseId, user);
    if (!staff && attempt.studentId !== user.userId) {
      return res.status(403).json({ error: 'Not authorized to view this attempt.' });
    }

    res.json(attempt);
  } catch (err) {
    console.error('getAttemptDetails error:', err);
    res.status(500).json({ error: 'Failed to fetch attempt details.' });
  }
};

