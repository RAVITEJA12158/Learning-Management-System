const prisma = require('../lib/prisma');

async function canAccessCourse(courseId, user) {
  if (user.role === 'ADMIN') return true;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { instructors: true },
  });
  if (!course) return false;
  if (course.createdById === user.userId || course.instructors?.some((i) => i.facultyId === user.userId)) {
    return true;
  }
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_studentId: { courseId, studentId: user.userId } },
  });
  return enrollment?.status === 'ACTIVE';
}

/**
 * GET /api/discussions/course/:courseId
 * List all discussion threads with replies for a course.
 */
exports.getDiscussionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const access = await canAccessCourse(courseId, req.user);
    if (!access) {
      return res.status(403).json({ error: 'Not authorized to view discussions for this course.' });
    }

    const threads = await prisma.discussion.findMany({
      where: { courseId },
      include: {
        user: { select: { id: true, name: true, role: true, profileImage: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, role: true, profileImage: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = threads.map((t) => ({
      id: t.id,
      courseId: t.courseId,
      title: t.title,
      content: t.content,
      createdAt: t.createdAt,
      time: new Date(t.createdAt).toLocaleString(),
      author: t.user?.name || 'Anonymous',
      authorRole: t.user?.role === 'FACULTY' ? 'Instructor' : t.user?.role === 'ADMIN' ? 'Admin' : 'Student',
      userId: t.userId,
      replies: t.replies.map((r) => ({
        id: r.id,
        content: r.content,
        createdAt: r.createdAt,
        time: new Date(r.createdAt).toLocaleString(),
        author: r.user?.name || 'Anonymous',
        authorRole: r.user?.role === 'FACULTY' ? 'Instructor' : r.user?.role === 'ADMIN' ? 'Admin' : 'Student',
        userId: r.userId,
      })),
    }));

    res.json(formatted);
  } catch (err) {
    console.error('getDiscussionsByCourse error:', err);
    res.status(500).json({ error: 'Failed to fetch discussions.' });
  }
};

/**
 * GET /api/discussions/:id
 * Get single thread details with all replies.
 */
exports.getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await prisma.discussion.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, role: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!thread) return res.status(404).json({ error: 'Discussion not found.' });

    const access = await canAccessCourse(thread.courseId, req.user);
    if (!access) {
      return res.status(403).json({ error: 'Not authorized to view this discussion.' });
    }

    res.json(thread);
  } catch (err) {
    console.error('getDiscussionById error:', err);
    res.status(500).json({ error: 'Failed to fetch discussion.' });
  }
};

/**
 * POST /api/discussions
 * Create a new discussion thread in a course.
 */
exports.createDiscussion = async (req, res) => {
  try {
    const { courseId, title, content } = req.body;

    if (!courseId || !title || !content) {
      return res.status(400).json({ error: 'courseId, title, and content are required.' });
    }

    const access = await canAccessCourse(courseId, req.user);
    if (!access) {
      return res.status(403).json({ error: 'Not authorized to post discussions in this course.' });
    }

    const thread = await prisma.discussion.create({
      data: {
        courseId,
        title: title.trim(),
        content: content.trim(),
        userId: req.user.userId,
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json({
      id: thread.id,
      courseId: thread.courseId,
      title: thread.title,
      content: thread.content,
      createdAt: thread.createdAt,
      time: 'Just now',
      author: thread.user?.name || 'Anonymous',
      authorRole: thread.user?.role === 'FACULTY' ? 'Instructor' : 'Student',
      userId: thread.userId,
      replies: [],
    });
  } catch (err) {
    console.error('createDiscussion error:', err);
    res.status(500).json({ error: 'Failed to create discussion thread.' });
  }
};

/**
 * POST /api/discussions/:id/replies
 * Add a reply to a discussion thread.
 */
exports.createReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    const thread = await prisma.discussion.findUnique({ where: { id } });
    if (!thread) return res.status(404).json({ error: 'Discussion thread not found.' });

    const access = await canAccessCourse(thread.courseId, req.user);
    if (!access) {
      return res.status(403).json({ error: 'Not authorized to reply in this course.' });
    }

    const reply = await prisma.discussionReply.create({
      data: {
        discussionId: id,
        userId: req.user.userId,
        content: content.trim(),
      },
      include: {
        user: { select: { id: true, name: true, role: true } },
      },
    });

    // Notify thread author if not the replier
    if (thread.userId !== req.user.userId) {
      await prisma.notification.create({
        data: {
          userId: thread.userId,
          title: `New reply on: ${thread.title}`,
          message: `${reply.user.name}: ${content.trim().slice(0, 120)}`,
          type: 'DISCUSSION',
        },
      }).catch((err) => {
        console.warn('Failed to create discussion reply notification:', err);
      });
    }

    res.status(201).json({
      id: reply.id,
      discussionId: reply.discussionId,
      content: reply.content,
      createdAt: reply.createdAt,
      time: 'Just now',
      author: reply.user?.name || 'Anonymous',
      authorRole: reply.user?.role === 'FACULTY' ? 'Instructor' : 'Student',
      userId: reply.userId,
    });
  } catch (err) {
    console.error('createReply error:', err);
    res.status(500).json({ error: 'Failed to add reply.' });
  }
};

/**
 * DELETE /api/discussions/:id
 * Delete a thread (Author or Admin).
 */
exports.deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;

    const thread = await prisma.discussion.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!thread) return res.status(404).json({ error: 'Discussion not found.' });

    const isAuthor = thread.userId === req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';
    const isCreator = thread.course.createdById === req.user.userId;

    if (!isAuthor && !isAdmin && !isCreator) {
      return res.status(403).json({ error: 'Not authorized to delete this discussion.' });
    }

    await prisma.discussion.delete({ where: { id } });
    res.json({ message: 'Discussion thread deleted successfully.' });
  } catch (err) {
    console.error('deleteDiscussion error:', err);
    res.status(500).json({ error: 'Failed to delete discussion.' });
  }
};

/**
 * DELETE /api/discussions/replies/:replyId
 * Delete a reply (Author or Admin).
 */
exports.deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;

    const reply = await prisma.discussionReply.findUnique({
      where: { id: replyId },
      include: { discussion: { include: { course: true } } },
    });
    if (!reply) return res.status(404).json({ error: 'Reply not found.' });

    const isAuthor = reply.userId === req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';
    const isCreator = reply.discussion.course.createdById === req.user.userId;

    if (!isAuthor && !isAdmin && !isCreator) {
      return res.status(403).json({ error: 'Not authorized to delete this reply.' });
    }

    await prisma.discussionReply.delete({ where: { id: replyId } });
    res.json({ message: 'Reply deleted successfully.' });
  } catch (err) {
    console.error('deleteReply error:', err);
    res.status(500).json({ error: 'Failed to delete reply.' });
  }
};

