const prisma = require('../lib/prisma');

const DEFAULT_COMPONENTS = [
  { name: 'Assignments', type: 'ASSIGNMENTS', weight: 20 },
  { name: 'Quizzes', type: 'QUIZZES', weight: 20 },
  { name: 'Midterm Exam', type: 'MID_EXAM', weight: 25 },
  { name: 'Final Exam', type: 'FINAL_EXAM', weight: 30 },
  { name: 'Participation', type: 'PARTICIPATION', weight: 5 },
];

function normalizeComponentType(type, name = '') {
  const raw = String(type || name).toUpperCase();
  if (raw.includes('ASSIGN')) return 'ASSIGNMENTS';
  if (raw.includes('QUIZ')) return 'QUIZZES';
  if (raw.includes('MID')) return 'MID_EXAM';
  if (raw.includes('FINAL')) return 'FINAL_EXAM';
  if (raw.includes('PARTICIP') || raw.includes('ATTEND')) return 'PARTICIPATION';
  return raw || 'OTHER';
}

function calculateLetterGrade(score) {
  const num = Number(score);
  if (num >= 93) return 'A';
  if (num >= 90) return 'A-';
  if (num >= 87) return 'B+';
  if (num >= 83) return 'B';
  if (num >= 80) return 'B-';
  if (num >= 77) return 'C+';
  if (num >= 70) return 'C';
  if (num >= 60) return 'D';
  return 'F';
}

function calculateGradePoint(letter) {
  switch (letter) {
    case 'A': return 4.0;
    case 'A-': return 3.7;
    case 'B+': return 3.3;
    case 'B': return 3.0;
    case 'B-': return 2.7;
    case 'C+': return 2.3;
    case 'C': return 2.0;
    case 'D': return 1.0;
    default: return 0.0;
  }
}

async function isCourseStaff(courseId, user) {
  if (user.role === 'ADMIN') return true;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { instructors: true },
  });
  if (!course) return false;
  return (
    course.createdById === user.userId ||
    course.instructors?.some((i) => i.facultyId === user.userId)
  );
}

/**
 * GET /api/grades/course/:courseId/components
 */
exports.getGradeComponents = async (req, res) => {
  try {
    const { courseId } = req.params;

    const components = await prisma.gradeComponent.findMany({
      where: { courseId },
    });

    if (components.length === 0) {
      return res.json(DEFAULT_COMPONENTS);
    }

    res.json(
      components.map((c) => ({
        id: c.id,
        name: c.name,
        type: normalizeComponentType(c.type, c.name),
        weight: Number(c.weight),
      }))
    );
  } catch (err) {
    console.error('getGradeComponents error:', err);
    res.status(500).json({ error: 'Failed to fetch grade components.' });
  }
};

/**
 * POST /api/grades/course/:courseId/components
 */
exports.saveGradeComponents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { components } = req.body;

    if (!Array.isArray(components) || components.length === 0) {
      return res.status(400).json({ error: 'Components array is required.' });
    }

    const staff = await isCourseStaff(courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to configure course grading rubric.' });
    }

    await prisma.gradeComponent.deleteMany({ where: { courseId } });

    await prisma.gradeComponent.createMany({
      data: components.map((c) => ({
        courseId,
        name: c.name,
        type: normalizeComponentType(c.type, c.name),
        weight: Number(c.weight),
      })),
    });

    const updated = await prisma.gradeComponent.findMany({ where: { courseId } });
    res.json(
      updated.map((c) => ({
        id: c.id,
        name: c.name,
        type: normalizeComponentType(c.type, c.name),
        weight: Number(c.weight),
      }))
    );
  } catch (err) {
    console.error('saveGradeComponents error:', err);
    res.status(500).json({ error: 'Failed to save grade components.' });
  }
};

/**
 * GET /api/grades/course/:courseId/roster
 */
exports.getCourseGradebook = async (req, res) => {
  try {
    const { courseId } = req.params;

    const staff = await isCourseStaff(courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to view course gradebook.' });
    }

    const [enrollments, assignments, quizzes, attendanceSessions] = await Promise.all([
      prisma.courseEnrollment.findMany({
        where: { courseId, status: 'ACTIVE' },
        include: {
          student: { select: { id: true, name: true, email: true, profileImage: true } },
        },
      }),
      prisma.assignment.findMany({
        where: { courseId },
        include: { submissions: true },
      }),
      prisma.quiz.findMany({
        where: { courseId },
        include: { attempts: true },
      }),
      prisma.attendanceSession.findMany({
        where: { courseId },
        include: { records: true },
      }),
    ]);

    const rosterGrades = enrollments.map((enr) => {
      const studentId = enr.studentId;

      let asmTotalPct = 0;
      let asmCount = 0;
      assignments.forEach((asm) => {
        const sub = asm.submissions.find((s) => s.studentId === studentId);
        if (sub && sub.marks !== null) {
          const max = Number(asm.maxMarks) || 100;
          asmTotalPct += (Number(sub.marks) / max) * 100;
          asmCount += 1;
        }
      });
      const assignmentScore = asmCount > 0 ? Math.round(asmTotalPct / asmCount) : 0;

      let quizTotalPct = 0;
      let quizCount = 0;
      quizzes.forEach((q) => {
        const attempts = q.attempts.filter((a) => a.studentId === studentId && a.score !== null);
        if (attempts.length > 0) {
          const highest = Math.max(...attempts.map((a) => Number(a.score)));
          const max = Number(q.totalMarks) || 100;
          quizTotalPct += (highest / max) * 100;
          quizCount += 1;
        }
      });
      const quizScore = quizCount > 0 ? Math.round(quizTotalPct / quizCount) : 0;

      let attended = 0;
      const totalSess = attendanceSessions.length;
      attendanceSessions.forEach((s) => {
        const rec = s.records.find((r) => r.studentId === studentId);
        if (rec?.status === 'PRESENT') attended += 1;
        else if (rec?.status === 'LATE') attended += 0.5;
      });
      const attendanceScore = totalSess > 0 ? Math.round((attended / totalSess) * 100) : 100;

      const midAsm = assignments.find((a) => /midterm|mid\s*exam/i.test(a.title));
      const finAsm = assignments.find((a) => /final\s*exam|final\s*project/i.test(a.title));
      const midSub = midAsm?.submissions.find((s) => s.studentId === studentId && s.marks !== null);
      const finSub = finAsm?.submissions.find((s) => s.studentId === studentId && s.marks !== null);

      const midtermScore = midSub
        ? Math.round((Number(midSub.marks) / Number(midAsm.maxMarks)) * 100)
        : assignmentScore;
      const finalScore = finSub
        ? Math.round((Number(finSub.marks) / Number(finAsm.maxMarks)) * 100)
        : quizScore;

      const weighted = Number(
        (
          assignmentScore * 0.2 +
          quizScore * 0.2 +
          midtermScore * 0.25 +
          finalScore * 0.3 +
          attendanceScore * 0.05
        ).toFixed(1)
      );
      const letter = calculateLetterGrade(weighted);

      return {
        id: enr.id,
        studentId: enr.student.id,
        name: enr.student.name,
        email: enr.student.email,
        status: enr.status,
        assignments: assignmentScore,
        quizzes: quizScore,
        midterm: midtermScore,
        final: finalScore,
        attendance: attendanceScore,
        grade: weighted,
        letter,
      };
    });

    res.json(rosterGrades);
  } catch (err) {
    console.error('getCourseGradebook error:', err);
    res.status(500).json({ error: 'Failed to fetch gradebook.' });
  }
};

/**
 * GET /api/grades/student/overview
 */
exports.getStudentGradeOverview = async (req, res) => {
  try {
    const studentId = req.user.userId;

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { studentId, status: 'ACTIVE' },
      include: {
        course: {
          include: {
            createdBy: { select: { name: true } },
            assignments: {
              include: {
                submissions: { where: { studentId } },
              },
            },
            quizzes: {
              include: {
                attempts: { where: { studentId } },
              },
            },
            attendanceSessions: {
              include: {
                records: { where: { studentId } },
              },
            },
            modules: {
              include: {
                content: {
                  include: {
                    progress: { where: { userId: studentId } },
                  },
                },
              },
            },
          },
        },
      },
    });

    let totalPoints = 0;
    const coursesSummary = enrollments.map((enr) => {
      const c = enr.course;

      let totalContent = 0;
      let completedContent = 0;
      c.modules.forEach((mod) => {
        mod.content.forEach((cnt) => {
          totalContent += 1;
          if (cnt.progress[0]?.completed) completedContent += 1;
        });
      });
      const progress = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;

      let asmPctSum = 0;
      let asmCount = 0;
      c.assignments.forEach((asm) => {
        const sub = asm.submissions[0];
        if (sub && sub.marks !== null) {
          asmPctSum += (Number(sub.marks) / Number(asm.maxMarks)) * 100;
          asmCount += 1;
        }
      });
      const assignments = asmCount > 0 ? Math.round(asmPctSum / asmCount) : 0;

      let quizPctSum = 0;
      let quizCount = 0;
      c.quizzes.forEach((q) => {
        if (q.attempts.length > 0) {
          const maxScore = Math.max(...q.attempts.map((a) => Number(a.score)));
          quizPctSum += (maxScore / Number(q.totalMarks)) * 100;
          quizCount += 1;
        }
      });
      const quizzes = quizCount > 0 ? Math.round(quizPctSum / quizCount) : 0;

      let attended = 0;
      const sessions = c.attendanceSessions || [];
      sessions.forEach((s) => {
        const rec = s.records?.[0];
        if (rec?.status === 'PRESENT') attended += 1;
        else if (rec?.status === 'LATE') attended += 0.5;
      });
      const participation = sessions.length > 0 ? Math.round((attended / sessions.length) * 100) : 100;

      const midAsm = c.assignments.find((a) => /midterm|mid\s*exam/i.test(a.title));
      const finAsm = c.assignments.find((a) => /final\s*exam|final\s*project/i.test(a.title));
      const midSub = midAsm?.submissions[0];
      const finSub = finAsm?.submissions[0];

      const midExam =
        midSub && midSub.marks !== null
          ? Math.round((Number(midSub.marks) / Number(midAsm.maxMarks)) * 100)
          : assignments;
      const finalExam =
        finSub && finSub.marks !== null
          ? Math.round((Number(finSub.marks) / Number(finAsm.maxMarks)) * 100)
          : quizzes;

      const weighted = Number(
        (
          assignments * 0.2 +
          quizzes * 0.2 +
          midExam * 0.25 +
          finalExam * 0.3 +
          participation * 0.05
        ).toFixed(1)
      );
      const letter = calculateLetterGrade(weighted);
      totalPoints += calculateGradePoint(letter);

      return {
        id: c.id,
        courseCode: c.courseCode,
        title: c.title,
        instructorName: c.createdBy?.name || 'Course Instructor',
        progress,
        totalContent,
        completedContent,
        assignments,
        quizzes,
        midExam,
        finalExam,
        participation,
        weighted,
        letter,
      };
    });

    const gpa =
      coursesSummary.length > 0
        ? (totalPoints / coursesSummary.length).toFixed(2)
        : '0.00';

    res.json({
      gpa: `${gpa} / 4.00`,
      creditsEarned: coursesSummary.length * 4,
      semester: 'Fall 2026',
      courses: coursesSummary,
    });
  } catch (err) {
    console.error('getStudentGradeOverview error:', err);
    res.status(500).json({ error: 'Failed to calculate student grades overview.' });
  }
};
