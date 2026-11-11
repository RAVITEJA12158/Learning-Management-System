const prisma = require('../lib/prisma');

function isCourseStaff(course, user) {
  if (!course || !user) return false;
  return (
    user.role === 'ADMIN' ||
    course.createdById === user.userId ||
    course.instructors?.some((i) => i.facultyId === user.userId)
  );
}

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
        instructors: {
          include: {
            faculty: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: {
            enrollments: true,
            modules: true,
          },
        },
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
        createdBy: { select: { id: true, name: true, email: true } },
        instructors: {
          include: {
            faculty: { select: { id: true, name: true, email: true, role: true } },
          },
        },
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

// Get modules for a course
exports.getCourseModules = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { position: 'asc' },
          include: {
            content: { orderBy: { position: 'asc' } },
          },
        },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    res.json(course.modules || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course modules.' });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const { title, courseCode, description, semester, category, bannerUrl } = req.body;

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
        category: category ? String(category).trim() : null,
        bannerUrl: bannerUrl ? String(bannerUrl).trim() : null,
        createdById: req.user.userId,
      },
    });

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
    const { title, description, semester, category, bannerUrl } = req.body;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (!isCourseStaff(course, req.user)) {
      return res.status(403).json({ error: 'Not authorized to update this course.' });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (semester !== undefined) updateData.semester = semester;
    if (category !== undefined) updateData.category = category ? String(category).trim() : null;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl ? String(bannerUrl).trim() : null;

    const updated = await prisma.course.update({
      where: { id },
      data: updateData,
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

    const course = await prisma.course.findUnique({ where: { id }, select: { id: true } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: { courseId_studentId: { courseId: id, studentId } },
    });

    if (existingEnrollment) {
      if (existingEnrollment.status === 'ACTIVE') {
        return res.status(400).json({ error: 'Already enrolled in this course.' });
      }

      const reactivated = await prisma.courseEnrollment.update({
        where: { courseId_studentId: { courseId: id, studentId } },
        data: { status: 'ACTIVE', enrolledAt: new Date() },
      });
      return res.status(200).json(reactivated);
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

// Get user's enrolled courses (only ACTIVE enrollments)
exports.getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user.userId;
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { studentId, status: 'ACTIVE' },
      include: {
        course: {
          include: { createdBy: { select: { name: true } } },
        },
      },
    });
    res.json(enrollments.map((e) => e.course));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrolled courses.' });
  }
};

// Drop a student's own enrollment
exports.unenrollStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.userId;

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { courseId_studentId: { courseId: id, studentId } },
    });
    if (!enrollment) return res.status(404).json({ error: 'Not enrolled in this course.' });

    const updated = await prisma.courseEnrollment.update({
      where: { courseId_studentId: { courseId: id, studentId } },
      data: { status: 'DROPPED' },
    });
    res.json({ message: 'Successfully dropped course.', enrollment: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to drop enrollment.' });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this course.' });
    }

    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course.' });
  }
};

// Assign an instructor to a course
exports.assignInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { facultyId } = req.body;

    if (!facultyId) {
      return res.status(400).json({ error: 'facultyId is required.' });
    }

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to assign instructors for this course.' });
    }

    const instructor = await prisma.user.findUnique({ where: { id: facultyId } });
    if (!instructor || (instructor.role !== 'FACULTY' && instructor.role !== 'ADMIN')) {
      return res.status(400).json({ error: 'Target user must be a faculty member or admin.' });
    }

    const existing = await prisma.courseInstructor.findUnique({
      where: { courseId_facultyId: { courseId: id, facultyId } },
    });
    if (existing) {
      return res.status(400).json({ error: 'Faculty member is already assigned to this course.' });
    }

    const assignment = await prisma.courseInstructor.create({
      data: {
        courseId: id,
        facultyId,
      },
      include: {
        faculty: { select: { id: true, name: true, email: true, username: true } },
      },
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign instructor.' });
  }
};

// Remove an assigned instructor
exports.removeInstructor = async (req, res) => {
  try {
    const { id, facultyId } = req.params;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (course.createdById !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to remove instructors from this course.' });
    }

    const existing = await prisma.courseInstructor.findUnique({
      where: { courseId_facultyId: { courseId: id, facultyId } },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Faculty assignment not found.' });
    }

    await prisma.courseInstructor.delete({
      where: { courseId_facultyId: { courseId: id, facultyId } },
    });

    res.json({ message: 'Instructor removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove instructor.' });
  }
};

// Faculty/Admin: roster of students enrolled in a course
exports.getCourseRoster = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (!isCourseStaff(course, req.user)) {
      return res.status(403).json({ error: 'Not authorized to view this roster.' });
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: { courseId: id },
      include: {
        student: { select: { id: true, name: true, email: true, profileImage: true, department: true, semester: true } },
      },
      orderBy: { enrolledAt: 'asc' },
    });

    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course roster.' });
  }
};

// Faculty/Admin: update a student's enrollment status on a course roster
exports.updateRosterStatus = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    const { status } = req.body;

    const normalizedStatus = String(status || '').toUpperCase();
    if (!['ACTIVE', 'DROPPED', 'COMPLETED'].includes(normalizedStatus)) {
      return res.status(400).json({ error: 'Valid status (ACTIVE, DROPPED, COMPLETED) is required.' });
    }

    const course = await prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });
    if (!isCourseStaff(course, req.user)) {
      return res.status(403).json({ error: 'Not authorized to modify this roster.' });
    }

    const updated = await prisma.courseEnrollment.update({
      where: { courseId_studentId: { courseId: id, studentId } },
      data: { status: normalizedStatus },
      include: {
        student: { select: { id: true, name: true, email: true, profileImage: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update roster status.' });
  }
};

// Get faculty's created or co-taught courses
exports.getCreatedCourses = async (req, res) => {
  try {
    const facultyId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';
    const courses = await prisma.course.findMany({
      where: isAdmin
        ? {}
        : {
            OR: [
              { createdById: facultyId },
              { instructors: { some: { facultyId } } },
            ],
          },
      include: {
        createdBy: { select: { id: true, name: true } },
        modules: { select: { id: true } },
        enrollments: {
          where: { status: 'ACTIVE' },
          select: { id: true, studentId: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch created courses.' });
  }
};
