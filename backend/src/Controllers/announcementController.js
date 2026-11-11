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

async function canAccessCourse(courseId, user) {
  if (user.role === 'ADMIN') return true;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { instructors: true },
  });
  if (!course) return false;
  if (
    course.createdById === user.userId ||
    course.instructors?.some((i) => i.facultyId === user.userId)
  ) {
    return true;
  }
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_studentId: { courseId, studentId: user.userId } },
  });
  return enrollment?.status === 'ACTIVE';
}

/**
 * GET /api/announcements/course/:courseId
 */
exports.getAnnouncementsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const access = await canAccessCourse(courseId, req.user);
    if (!access) {
      return res.status(403).json({ error: 'Not authorized to view announcements for this course.' });
    }

    const announcements = await prisma.announcement.findMany({
      where: { courseId },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true, profileImage: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = announcements.map((a) => ({
      id: a.id,
      courseId: a.courseId,
      title: a.title,
      message: a.message,
      content: a.message,
      pinned: Boolean(a.pinned),
      createdAt: a.createdAt,
      time: new Date(a.createdAt).toLocaleString(),
      author: a.createdBy?.name || 'Instructor',
      authorRole: a.createdBy?.role === 'FACULTY' ? 'Instructor' : a.createdBy?.role,
      createdById: a.createdById,
    }));

    res.json(formatted);
  } catch (err) {
    console.error('getAnnouncementsByCourse error:', err);
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
};

/**
 * POST /api/announcements
 */
exports.createAnnouncement = async (req, res) => {
  try {
    const { courseId, title, message, content, pinned } = req.body;
    const bodyMessage = message || content;

    if (!courseId || !title || !bodyMessage) {
      return res.status(400).json({ error: 'courseId, title, and message are required.' });
    }

    const staff = await isCourseStaff(courseId, req.user);
    if (!staff) {
      return res.status(403).json({ error: 'Not authorized to post announcements for this course.' });
    }

    const createData = {
      courseId,
      title: title.trim(),
      message: bodyMessage.trim(),
      createdById: req.user.userId,
    };
    if (pinned !== undefined) {
      createData.pinned = Boolean(pinned);
    }

    const announcement = await prisma.announcement.create({
      data: createData,
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        course: { select: { title: true, courseCode: true } },
      },
    });

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId, status: 'ACTIVE' },
      select: { studentId: true },
    });

    if (enrollments.length > 0) {
      const notifData = enrollments.map((e) => ({
        userId: e.studentId,
        title: `New Announcement in ${announcement.course.courseCode}: ${announcement.title}`,
        message: announcement.message.slice(0, 150),
        type: 'ANNOUNCEMENT',
      }));
      await prisma.notification.createMany({ data: notifData }).catch((err) => {
        console.warn('Failed to bulk-create announcement notifications:', err);
      });
    }

    res.status(201).json({
      id: announcement.id,
      courseId: announcement.courseId,
      title: announcement.title,
      message: announcement.message,
      content: announcement.message,
      pinned: Boolean(announcement.pinned),
      createdAt: announcement.createdAt,
      time: 'Just now',
      author: announcement.createdBy?.name || 'Instructor',
      authorRole: 'Instructor',
    });
  } catch (err) {
    console.error('createAnnouncement error:', err);
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
};

/**
 * PUT /api/announcements/:id
 */
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, content, pinned } = req.body;
    const bodyMessage = message || content;

    const existing = await prisma.announcement.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!existing) return res.status(404).json({ error: 'Announcement not found.' });

    const staff = await isCourseStaff(existing.courseId, req.user);
    if (existing.createdById !== req.user.userId && !staff) {
      return res.status(403).json({ error: 'Not authorized to edit this announcement.' });
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(bodyMessage !== undefined && { message: bodyMessage.trim() }),
        ...(pinned !== undefined && { pinned: Boolean(pinned) }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('updateAnnouncement error:', err);
    res.status(500).json({ error: 'Failed to update announcement.' });
  }
};

/**
 * DELETE /api/announcements/:id
 */
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.announcement.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!existing) return res.status(404).json({ error: 'Announcement not found.' });

    const staff = await isCourseStaff(existing.courseId, req.user);
    if (existing.createdById !== req.user.userId && !staff) {
      return res.status(403).json({ error: 'Not authorized to delete this announcement.' });
    }

    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    console.error('deleteAnnouncement error:', err);
    res.status(500).json({ error: 'Failed to delete announcement.' });
  }
};
