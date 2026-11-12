const prisma = require('../lib/prisma');
const { uploadBufferToCloudinary } = require('../Middleware/upload');

function isCourseStaff(course, user) {
  if (!course || !user) return false;
  return (
    user.role === 'ADMIN' ||
    course.createdById === user.userId ||
    course.instructors?.some((i) => i.facultyId === user.userId)
  );
}

// === Modules ===

exports.createModule = async (req, res) => {
  try {
    const { courseId, title, description, position, isPublished, releaseAt } = req.body;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (!isCourseStaff(course, req.user)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const newModule = await prisma.module.create({
      data: {
        courseId,
        title,
        description,
        position: position || 1,
        isPublished: isPublished || false,
        releaseAt: releaseAt ? new Date(releaseAt) : null,
      },
    });

    res.status(201).json(newModule);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create module.' });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, position, isPublished, releaseAt } = req.body;

    const moduleRecord = await prisma.module.findUnique({
      where: { id },
      include: { course: { include: { instructors: true } } },
    });
    if (!moduleRecord) return res.status(404).json({ error: 'Module not found.' });
    if (!isCourseStaff(moduleRecord.course, req.user)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const updated = await prisma.module.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(position !== undefined && { position }),
        ...(isPublished !== undefined && { isPublished }),
        ...(releaseAt !== undefined && { releaseAt: releaseAt ? new Date(releaseAt) : null }),
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update module.' });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    const moduleRecord = await prisma.module.findUnique({
      where: { id },
      include: { course: { include: { instructors: true } } },
    });
    if (!moduleRecord) return res.status(404).json({ error: 'Module not found.' });
    if (!isCourseStaff(moduleRecord.course, req.user)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    await prisma.module.delete({ where: { id } });
    res.json({ message: 'Module deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete module.' });
  }
};

// === Content ===

exports.createContent = async (req, res) => {
  try {
    const { moduleId, title, type, contentUrl, description, position, isPublished } = req.body;

    const moduleRecord = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: { include: { instructors: true } } },
    });
    if (!moduleRecord) return res.status(404).json({ error: 'Module not found.' });
    if (!isCourseStaff(moduleRecord.course, req.user)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const newContent = await prisma.content.create({
      data: {
        moduleId,
        title,
        type,
        contentUrl,
        description,
        position: position || 1,
        isPublished: isPublished || false,
        createdById: req.user.userId,
      },
    });

    res.status(201).json(newContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create content.' });
  }
};

exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, contentUrl, description, position, isPublished } = req.body;

    const contentRecord = await prisma.content.findUnique({
      where: { id },
      include: { module: { include: { course: { include: { instructors: true } } } } },
    });
    if (!contentRecord) return res.status(404).json({ error: 'Content not found.' });
    if (!isCourseStaff(contentRecord.module.course, req.user)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const updated = await prisma.content.update({
      where: { id },
      data: { title, type, contentUrl, description, position, isPublished },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content.' });
  }
};

exports.uploadContentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer, {
      folder: 'lms/content',
    });

    res.status(201).json({
      url: result.secure_url,
      resourceType: result.resource_type,
      originalName: req.file.originalname,
      bytes: result.bytes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to upload file.' });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const contentRecord = await prisma.content.findUnique({
      where: { id },
      include: { module: { include: { course: { include: { instructors: true } } } } },
    });
    if (!contentRecord) return res.status(404).json({ error: 'Content not found.' });
    if (!isCourseStaff(contentRecord.module.course, req.user)) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    await prisma.content.delete({ where: { id } });
    res.json({ message: 'Content deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete content.' });
  }
};
