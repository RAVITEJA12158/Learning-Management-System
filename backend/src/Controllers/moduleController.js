const prisma = require('../lib/prisma');
const { uploadBufferToCloudinary } = require('../Middleware/upload');

// === Modules ===

exports.createModule = async (req, res) => {
  try {
    const { courseId, title, description, position, isPublished, releaseAt } = req.body;
    
    // Verify course ownership
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
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
      }
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

    const moduleRecord = await prisma.module.findUnique({ where: { id }, include: { course: true } });
    if (!moduleRecord) return res.status(404).json({ error: 'Module not found.' });
    if (moduleRecord.course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const updated = await prisma.module.update({
      where: { id },
      data: {
        title,
        description,
        position,
        isPublished,
        releaseAt: releaseAt ? new Date(releaseAt) : null,
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update module.' });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const moduleRecord = await prisma.module.findUnique({ where: { id }, include: { course: true } });
    if (!moduleRecord) return res.status(404).json({ error: 'Module not found.' });
    if (moduleRecord.course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
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

    const moduleRecord = await prisma.module.findUnique({ where: { id: moduleId }, include: { course: true } });
    if (!moduleRecord) return res.status(404).json({ error: 'Module not found.' });
    if (moduleRecord.course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
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
      }
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

    const contentRecord = await prisma.content.findUnique({ where: { id }, include: { module: { include: { course: true } } } });
    if (!contentRecord) return res.status(404).json({ error: 'Content not found.' });
    if (contentRecord.module.course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const updated = await prisma.content.update({
      where: { id },
      data: { title, type, contentUrl, description, position, isPublished }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update content.' });
  }
};

// Uploads a learning-material file (PDF, slides, image, video, etc.) to
// Cloudinary and returns its URL, so the frontend can then call
// createContent/updateContent with that URL as `contentUrl`. Kept as a
// separate step (rather than bundled into createContent) so the same
// endpoint can also be used to swap out a file on an existing content item.
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

    const contentRecord = await prisma.content.findUnique({ where: { id }, include: { module: { include: { course: true } } } });
    if (!contentRecord) return res.status(404).json({ error: 'Content not found.' });
    if (contentRecord.module.course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    await prisma.content.delete({ where: { id } });
    res.json({ message: 'Content deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete content.' });
  }
};
