const prisma = require('../lib/prisma');

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
 * GET /api/attendance/course/:courseId
 */
exports.getSessionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const staff = await isCourseStaff(courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to view course attendance sessions.' });
    }

    const sessions = await prisma.attendanceSession.findMany({
      where: { courseId },
      include: {
        createdBy: { select: { id: true, name: true } },
        records: {
          include: {
            student: { select: { id: true, name: true, email: true, profileImage: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    const formatted = sessions.map((s) => {
      const dateStr = s.date ? new Date(s.date).toISOString().slice(0, 10) : '';
      return {
        id: s.id,
        courseId: s.courseId,
        date: dateStr,
        topic: s.topic || `Lecture Session (${dateStr})`,
        createdBy: s.createdBy?.name || 'Instructor',
        records: s.records.map((r) => ({
          id: r.id,
          sessionId: r.sessionId,
          studentId: r.studentId,
          studentName: r.student?.name || 'Student',
          email: r.student?.email || '',
          status: r.status,
        })),
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('getSessionsByCourse error:', err);
    res.status(500).json({ error: 'Failed to fetch attendance sessions.' });
  }
};

/**
 * POST /api/attendance/session
 */
exports.createSession = async (req, res) => {
  try {
    const { courseId, date, topic, records } = req.body;

    if (!courseId || !date) {
      return res.status(400).json({ error: 'courseId and date are required.' });
    }

    const staff = await isCourseStaff(courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to create attendance sessions.' });
    }

    const parsedDate = new Date(date);

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId, status: 'ACTIVE' },
      select: { studentId: true },
    });

    const sessionData = {
      courseId,
      date: parsedDate,
      createdById: req.user.userId,
    };
    if (topic && String(topic).trim()) {
      sessionData.topic = String(topic).trim();
    }

    const session = await prisma.attendanceSession.create({
      data: sessionData,
      include: {
        createdBy: { select: { name: true } },
      },
    });

    let recordsToCreate = [];
    if (Array.isArray(records) && records.length > 0) {
      recordsToCreate = records.map((r) => ({
        sessionId: session.id,
        studentId: r.studentId,
        status: ['PRESENT', 'ABSENT', 'LATE'].includes(r.status) ? r.status : 'PRESENT',
      }));
    } else {
      recordsToCreate = enrollments.map((e) => ({
        sessionId: session.id,
        studentId: e.studentId,
        status: 'PRESENT',
      }));
    }

    if (recordsToCreate.length > 0) {
      await prisma.attendanceRecord.createMany({
        data: recordsToCreate,
        skipDuplicates: true,
      });
    }

    const createdRecords = await prisma.attendanceRecord.findMany({
      where: { sessionId: session.id },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json({
      id: session.id,
      courseId: session.courseId,
      date: session.date ? new Date(session.date).toISOString().slice(0, 10) : date,
      topic: session.topic || topic || `Lecture Session (${date})`,
      createdBy: session.createdBy?.name || req.user.userId,
      records: createdRecords.map((r) => ({
        id: r.id,
        sessionId: r.sessionId,
        studentId: r.studentId,
        studentName: r.student?.name || 'Student',
        status: r.status,
      })),
    });
  } catch (err) {
    console.error('createSession error:', err);
    res.status(500).json({ error: 'Failed to create attendance session.' });
  }
};

/**
 * PUT /api/attendance/session/:sessionId/record
 */
exports.updateRecord = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { studentId, status } = req.body;

    if (!studentId || !status || !['PRESENT', 'ABSENT', 'LATE'].includes(status)) {
      return res.status(400).json({ error: 'Valid studentId and status (PRESENT, ABSENT, LATE) are required.' });
    }

    const session = await prisma.attendanceSession.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ error: 'Attendance session not found.' });

    const staff = await isCourseStaff(session.courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to modify attendance.' });
    }

    const record = await prisma.attendanceRecord.upsert({
      where: { sessionId_studentId: { sessionId, studentId } },
      update: { status },
      create: { sessionId, studentId, status },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(record);
  } catch (err) {
    console.error('updateRecord error:', err);
    res.status(500).json({ error: 'Failed to update attendance record.' });
  }
};

/**
 * POST /api/attendance/session/:sessionId/mark-all
 */
exports.markAllPresent = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.attendanceSession.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ error: 'Attendance session not found.' });

    const staff = await isCourseStaff(session.courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to modify attendance.' });
    }

    await prisma.attendanceRecord.updateMany({
      where: { sessionId },
      data: { status: 'PRESENT' },
    });

    const updated = await prisma.attendanceRecord.findMany({
      where: { sessionId },
      include: {
        student: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('markAllPresent error:', err);
    res.status(500).json({ error: 'Failed to update records.' });
  }
};

/**
 * GET /api/attendance/student/course/:courseId
 */
exports.getStudentAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.userId;

    if (req.user.role === 'STUDENT' && prisma.courseEnrollment?.findUnique) {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: { courseId_studentId: { courseId, studentId } },
      });
      if (enrollment === null || (enrollment && enrollment.status !== 'ACTIVE')) {
        return res.status(403).json({ error: 'You must be actively enrolled in this course to view attendance.' });
      }
    }

    const sessions = await prisma.attendanceSession.findMany({
      where: { courseId },
      include: {
        records: {
          where: { studentId },
        },
      },
      orderBy: { date: 'asc' },
    });

    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    const sessionLogs = sessions.map((s) => {
      const rec = s.records[0];
      const status = rec?.status || 'ABSENT';
      if (status === 'PRESENT') presentCount += 1;
      else if (status === 'LATE') lateCount += 1;
      else absentCount += 1;

      const dateStr = s.date ? new Date(s.date).toISOString().slice(0, 10) : '';
      return {
        sessionId: s.id,
        date: dateStr,
        topic: s.topic || `Lecture Session (${dateStr})`,
        status,
      };
    });

    const totalSessions = sessionLogs.length;
    const derivedPercentage =
      totalSessions > 0
        ? Math.round(((presentCount + lateCount * 0.5) / totalSessions) * 100)
        : 100;

    res.json({
      courseId,
      totalSessions,
      presentCount,
      lateCount,
      absentCount,
      derivedPercentage,
      sessions: sessionLogs,
    });
  } catch (err) {
    console.error('getStudentAttendance error:', err);
    res.status(500).json({ error: 'Failed to fetch student attendance.' });
  }
};
