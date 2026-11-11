const prisma = require('../lib/prisma');

async function verifyStudentCourseEnrollment(courseId, userId) {
  if (!courseId || !prisma.courseEnrollment?.findUnique) return true;
  const enrollment = await prisma.courseEnrollment.findUnique({
    where: { courseId_studentId: { courseId, studentId: userId } },
  });
  // Only block if findUnique explicitly resolved to null or non-ACTIVE status
  if (enrollment === null || (enrollment && enrollment.status !== 'ACTIVE')) {
    return false;
  }
  return true;
}

exports.markContentProgress = async (req, res) => {
  try {
    const { contentId } = req.params;
    const { completed = true } = req.body;
    const userId = req.user.userId;

    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { module: { select: { courseId: true } } },
    });
    if (!content) return res.status(404).json({ error: 'Content not found.' });

    const courseId = content.module?.courseId;
    if (courseId && !(await verifyStudentCourseEnrollment(courseId, userId))) {
      return res.status(403).json({ error: 'You must be actively enrolled in this course to track progress.' });
    }

    const progress = await prisma.contentProgress.upsert({
      where: { userId_contentId: { userId, contentId } },
      update: { completed, completedAt: completed ? new Date() : null },
      create: {
        userId,
        contentId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update content progress.' });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    if (!(await verifyStudentCourseEnrollment(courseId, userId))) {
      return res.status(403).json({ error: 'You must be actively enrolled in this course to view progress.' });
    }

    const modules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { position: 'asc' },
      include: {
        content: {
          orderBy: { position: 'asc' },
          include: {
            progress: { where: { userId } },
          },
        },
      },
    });

    let totalContent = 0;
    let completedContent = 0;

    const moduleProgress = modules.map((mod) => {
      const items = mod.content.map((item) => {
        totalContent += 1;
        const isCompleted = item.progress[0]?.completed || false;
        if (isCompleted) completedContent += 1;
        return {
          contentId: item.id,
          title: item.title,
          completed: isCompleted,
          completedAt: item.progress[0]?.completedAt || null,
        };
      });
      return { moduleId: mod.id, title: mod.title, content: items };
    });

    const completionPercent =
      totalContent === 0 ? 0 : Math.round((completedContent / totalContent) * 100);

    res.json({
      courseId,
      totalContent,
      completedContent,
      completionPercent,
      modules: moduleProgress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course progress.' });
  }
};
