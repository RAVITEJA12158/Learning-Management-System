const prisma = require('../lib/prisma');
const { uploadBufferToCloudinary } = require('../Middleware/upload');

// === Assignment CRUD ===

// Create an assignment (Faculty/Admin)
exports.createAssignment = async (req, res) => {
  try {
    const { courseId, title, description, maxMarks, dueDate, allowLateSubmission } = req.body;

    if (!courseId || !title || !dueDate || maxMarks === undefined) {
      return res.status(400).json({ error: 'courseId, title, maxMarks, and dueDate are required.' });
    }

    // Verify course ownership or instructor role
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { instructors: true },
    });
    if (!course) return res.status(404).json({ error: 'Course not found.' });

    const isInstructor =
      course.createdById === req.user.userId ||
      course.instructors.some((inst) => inst.facultyId === req.user.userId) ||
      req.user.role === 'ADMIN';

    if (!isInstructor) {
      return res.status(403).json({ error: 'Not authorized to create assignments for this course.' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        courseId,
        title,
        description,
        maxMarks: parseFloat(maxMarks),
        dueDate: new Date(dueDate),
        allowLateSubmission: Boolean(allowLateSubmission),
        createdById: req.user.userId,
      },
    });

    res.status(201).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create assignment.' });
  }
};

// Get all assignments for a course
exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;
    const isStudent = req.user.role === 'STUDENT';

    const assignments = await prisma.assignment.findMany({
      where: { courseId },
      include: {
        createdBy: { select: { name: true } },
        submissions: isStudent
          ? {
              where: { studentId: userId },
              select: {
                id: true,
                fileUrl: true,
                submittedAt: true,
                status: true,
                marks: true,
                feedback: true,
                gradedAt: true,
              },
            }
          : false,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
};

// Get single assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const isStudent = req.user.role === 'STUDENT';

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true, courseCode: true, createdById: true } },
        createdBy: { select: { name: true } },
        submissions: isStudent
          ? {
              where: { studentId: userId },
            }
          : {
              include: {
                student: { select: { id: true, name: true, email: true, profileImage: true } },
                gradedBy: { select: { name: true } },
              },
              orderBy: { submittedAt: 'desc' },
            },
      },
    });

    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignment.' });
  }
};

// Update an assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, maxMarks, dueDate, allowLateSubmission } = req.body;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    if (
      assignment.createdById !== req.user.userId &&
      assignment.course.createdById !== req.user.userId &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized to update this assignment.' });
    }

    const updated = await prisma.assignment.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(maxMarks !== undefined && { maxMarks: parseFloat(maxMarks) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(allowLateSubmission !== undefined && { allowLateSubmission: Boolean(allowLateSubmission) }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update assignment.' });
  }
};

// Delete an assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    if (
      assignment.createdById !== req.user.userId &&
      assignment.course.createdById !== req.user.userId &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized to delete this assignment.' });
    }

    await prisma.assignment.delete({ where: { id } });
    res.json({ message: 'Assignment deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete assignment.' });
  }
};

// === Submission & Late-submission Logic ===

// Submit assignment (Student) with Cloudinary upload
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.userId;
    let fileUrl = req.body.fileUrl;

    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    // Handle multipart file upload to Cloudinary if file buffer present
    if (req.file) {
      const uploadRes = await uploadBufferToCloudinary(req.file.buffer, {
        folder: 'lms/submissions',
      });
      fileUrl = uploadRes.secure_url;
    }

    if (!fileUrl) {
      return res.status(400).json({ error: 'Submission file or fileUrl is required.' });
    }

    // Check late submission rules
    const now = new Date();
    const isPastDue = now > new Date(assignment.dueDate);

    if (isPastDue && !assignment.allowLateSubmission) {
      return res.status(400).json({
        error: 'The deadline for this assignment has passed and late submissions are not allowed.',
      });
    }

    const submissionStatus = isPastDue ? 'LATE' : 'SUBMITTED';

    // Upsert student submission
    const submission = await prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId: id, studentId } },
      update: {
        fileUrl,
        submittedAt: now,
        status: submissionStatus,
      },
      create: {
        assignmentId: id,
        studentId,
        fileUrl,
        submittedAt: now,
        status: submissionStatus,
      },
    });

    res.status(201).json(submission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit assignment.' });
  }
};

// Get all submissions for an assignment (Faculty/Admin)
exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found.' });

    if (
      assignment.createdById !== req.user.userId &&
      assignment.course.createdById !== req.user.userId &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized to view submissions.' });
    }

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { assignmentId: id },
      include: {
        student: { select: { id: true, name: true, email: true, username: true } },
        gradedBy: { select: { name: true } },
      },
      orderBy: { submittedAt: 'desc' },
    });

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch submissions.' });
  }
};

// Grade a submission (Faculty/Admin)
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    if (marks === undefined || marks === null) {
      return res.status(400).json({ error: 'Marks are required.' });
    }

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: { assignment: { include: { course: true } } },
    });
    if (!submission) return res.status(404).json({ error: 'Submission not found.' });

    const isAuthorized =
      submission.assignment.createdById === req.user.userId ||
      submission.assignment.course.createdById === req.user.userId ||
      req.user.role === 'ADMIN';

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Not authorized to grade this submission.' });
    }

    const awardedMarks = parseFloat(marks);
    const maxMarks = parseFloat(submission.assignment.maxMarks);

    if (awardedMarks < 0 || awardedMarks > maxMarks) {
      return res.status(400).json({
        error: `Marks must be between 0 and maximum marks allowed (${maxMarks}).`,
      });
    }

    const updated = await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marks: awardedMarks,
        feedback: feedback || null,
        gradedById: req.user.userId,
        gradedAt: new Date(),
      },
      include: {
        student: { select: { id: true, name: true, email: true } },
        gradedBy: { select: { name: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to grade submission.' });
  }
};
