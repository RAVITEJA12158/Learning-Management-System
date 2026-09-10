const prisma = require('../lib/prisma');

// Get all courses (with optional search/filter)
exports.getAllCourses = async (req, res) => {
  try {
    const { search } = req.query;
    const whereClause = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { courseCode: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true } },
        modules: {
          orderBy: { position: 'asc' },
          include: {
            content: { orderBy: { position: 'asc' } },
          },
        },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course.' });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, courseCode, description, semester } = req.body;
    
    // Check if course code + semester already exists
    const existing = await prisma.course.findUnique({
      where: { courseCode_semester: { courseCode, semester: semester || '' } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Course with this code and semester already exists.' });
    }

    const course = await prisma.course.create({
      data: {
        title,
        courseCode,
        description,
        semester: semester || '',
        createdById: req.user.userId,
      },
    });

    // Automatically add the creator as an instructor
    await prisma.courseInstructor.create({
      data: {
        courseId: course.id,
        facultyId: req.user.userId,
      },
    });

    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course.' });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, semester } = req.body;

    // Verify ownership or admin
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this course.' });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: { title, description, semester },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course.' });
  }
};

// Enroll a student
exports.enrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.userId;

    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: { courseId_studentId: { courseId: id, studentId } },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course.' });
    }

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId: id,
        studentId,
        status: 'ACTIVE',
      },
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll in course.' });
  }
};

// Get user's enrolled courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: { createdBy: { select: { name: true } } },
        },
      },
    });
    res.json(enrollments.map(e => e.course));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses.' });
  }
};

// Get faculty's created courses
exports.getCreatedCourses = async (req, res) => {
  try {
    const facultyId = req.user.userId;
    const courses = await prisma.course.findMany({
      where: { createdById: facultyId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch created courses.' });
  }
};
