const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Learning Management System...');

  // 1. Password Hashes
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10);
  const facultyPasswordHash = await bcrypt.hash('Faculty123!', 10);
  const studentPasswordHash = await bcrypt.hash('Student123!', 10);

  // User IDs (Deterministic UUIDs)
  const ADMIN_ID = 'a0000000-0000-4000-8000-000000000001';
  const FACULTY_TURING_ID = 'f0000000-0000-4000-8000-000000000001';
  const FACULTY_HOPPER_ID = 'f0000000-0000-4000-8000-000000000002';
  const FACULTY_JOHNSON_ID = 'f0000000-0000-4000-8000-000000000003';
  const FACULTY_TIM_ID = 'f0000000-0000-4000-8000-000000000004';

  const STUDENT_SARAH_ID = 'e0000000-0000-4000-8000-000000000001';
  const STUDENT_ARJUN_ID = 'e0000000-0000-4000-8000-000000000002';
  const STUDENT_ISHITA_ID = 'e0000000-0000-4000-8000-000000000003';
  const STUDENT_ALEX_ID = 'e0000000-0000-4000-8000-000000000004';

  // Course IDs
  const COURSE_ML_ID = 'c0000000-0000-4000-8000-000000000001';
  const COURSE_WEB_ID = 'c0000000-0000-4000-8000-000000000002';
  const COURSE_MATH_ID = 'c0000000-0000-4000-8000-000000000003';
  const COURSE_DSA_ID = 'c0000000-0000-4000-8000-000000000004';
  const COURSE_DL_ID = 'c0000000-0000-4000-8000-000000000005';
  const COURSE_ANALYTICS_ID = 'c0000000-0000-4000-8000-000000000006';

  console.log('👤 Seeding Users (Admin, Faculty, Students)...');

  // --- Seed Users ---
  const users = [
    {
      id: ADMIN_ID,
      name: 'Dean Robert Vance',
      username: 'admin_vance',
      email: 'admin@university.edu',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      mobileNumber: '+15550001111',
      department: 'Academic Administration',
      semester: 'Fall 2026',
      bio: 'Dean of Academic Operations & Curriculum Director',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      id: FACULTY_TURING_ID,
      name: 'Dr. Alan Turing',
      username: 'alan_turing',
      email: 'alan.turing@university.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      mobileNumber: '+15551112233',
      department: 'Computer Science & AI',
      semester: 'Fall 2026',
      bio: 'Pioneer of theoretical computer science and artificial intelligence.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      id: FACULTY_HOPPER_ID,
      name: 'Dr. Grace Hopper',
      username: 'grace_hopper',
      email: 'grace.hopper@university.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      mobileNumber: '+15552223344',
      department: 'Software Engineering',
      semester: 'Fall 2026',
      bio: 'Compiler pioneer and programming language systems architect.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      id: FACULTY_JOHNSON_ID,
      name: 'Prof. Katherine Johnson',
      username: 'katherine_johnson',
      email: 'katherine.johnson@university.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      mobileNumber: '+15553334455',
      department: 'Mathematics & Applied Statistics',
      semester: 'Fall 2026',
      bio: 'Orbital mechanics and applied linear algebra specialist.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
    {
      id: FACULTY_TIM_ID,
      name: 'Dr. Tim Berners-Lee',
      username: 'tim_bl',
      email: 'tim.bl@university.edu',
      passwordHash: facultyPasswordHash,
      role: 'FACULTY',
      mobileNumber: '+15554445566',
      department: 'Web & Distributed Systems',
      semester: 'Fall 2026',
      bio: 'Inventor of the World Wide Web and distributed protocols researcher.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      id: STUDENT_SARAH_ID,
      name: 'Sarah Jensen',
      username: 'sarah_jensen',
      email: 'sarah.jensen@university.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      mobileNumber: '+15552348910',
      department: 'Computer Science & Engineering',
      semester: 'Fall 2026',
      bio: 'Senior student focused on deep learning and distributed systems.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: STUDENT_ARJUN_ID,
      name: 'Arjun Rao',
      username: 'arjun_rao',
      email: 'arjun.rao@university.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      mobileNumber: '+15558765432',
      department: 'Computer Science & Engineering',
      semester: 'Fall 2026',
      bio: 'Undergraduate researcher in algorithms and competitive programming.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    },
    {
      id: STUDENT_ISHITA_ID,
      name: 'Ishita Nair',
      username: 'ishita_nair',
      email: 'ishita.nair@university.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      mobileNumber: '+15559871234',
      department: 'Data Science & Analytics',
      semester: 'Fall 2026',
      bio: 'Machine learning practitioner and analytics lead.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      id: STUDENT_ALEX_ID,
      name: 'Alex Chen',
      username: 'alex_chen',
      email: 'alex.chen@university.edu',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      mobileNumber: '+15553456789',
      department: 'Software Engineering',
      semester: 'Fall 2026',
      bio: 'Full-stack developer building cloud-native applications.',
      isVerified: true,
      profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        username: u.username,
        passwordHash: u.passwordHash,
        role: u.role,
        mobileNumber: u.mobileNumber,
        department: u.department,
        semester: u.semester,
        bio: u.bio,
        profileImage: u.profileImage,
        isVerified: true,
      },
      create: u,
    });
  }

  console.log('📚 Seeding Courses...');

  // --- Seed Courses ---
  const courses = [
    {
      id: COURSE_ML_ID,
      courseCode: 'CS401',
      title: 'Intro to Machine Learning & Neural Networks',
      description: 'Foundational machine learning covering Bayesian learning, regression, classification, neural networks, and statistical evaluation.',
      semester: 'Fall 2026',
      category: 'Artificial Intelligence',
      bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
      createdById: FACULTY_TURING_ID,
    },
    {
      id: COURSE_WEB_ID,
      courseCode: 'CS350',
      title: 'Advanced Web Development & Cloud Systems',
      description: 'Full-stack PERN architecture with PostgreSQL, Express, React 19, Node.js, JWT RBAC security, Redis caching, and Docker CI/CD.',
      semester: 'Fall 2026',
      category: 'Computer Science',
      bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      createdById: FACULTY_TIM_ID,
    },
    {
      id: COURSE_MATH_ID,
      courseCode: 'MATH202',
      title: 'Linear Algebra II & Matrix Decompositions',
      description: 'Eigenvalues, singular value decomposition (SVD), orthogonal projections, positive definite matrices, and spectral theorems.',
      semester: 'Fall 2026',
      category: 'Mathematics',
      bannerUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
      createdById: FACULTY_JOHNSON_ID,
    },
    {
      id: COURSE_DSA_ID,
      courseCode: 'CS102',
      title: 'Data Structures & Algorithmic Design',
      description: 'Master fundamental data structures, graph algorithms, dynamic programming, and asymptotic complexity analysis.',
      semester: 'Fall 2026',
      category: 'Computer Science',
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      createdById: FACULTY_HOPPER_ID,
    },
    {
      id: COURSE_DL_ID,
      courseCode: 'AI201',
      title: 'Deep Learning Foundations & CNN Architectures',
      description: 'Explore neural networks, CNNs, transformers, and optimization techniques to build real-world AI models.',
      semester: 'Fall 2026',
      category: 'Artificial Intelligence',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
      createdById: FACULTY_TURING_ID,
    },
    {
      id: COURSE_ANALYTICS_ID,
      courseCode: 'DS301',
      title: 'Business & Predictive Analytics',
      description: 'Statistical modeling, exploratory data analysis, cohort retention metrics, and executive decision dashboards.',
      semester: 'Fall 2026',
      category: 'Data Science',
      bannerUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      createdById: FACULTY_JOHNSON_ID,
    },
  ];

  for (const c of courses) {
    await prisma.course.upsert({
      where: { courseCode_semester: { courseCode: c.courseCode, semester: c.semester } },
      update: {
        title: c.title,
        description: c.description,
        createdById: c.createdById,
        category: c.category,
        bannerUrl: c.bannerUrl,
      },
      create: c,
    });
  }

  console.log('🧑‍🏫 Assigning Course Instructors...');

  const instructors = [
    { courseId: COURSE_ML_ID, facultyId: FACULTY_TURING_ID },
    { courseId: COURSE_ML_ID, facultyId: FACULTY_HOPPER_ID },
    { courseId: COURSE_WEB_ID, facultyId: FACULTY_TIM_ID },
    { courseId: COURSE_MATH_ID, facultyId: FACULTY_JOHNSON_ID },
    { courseId: COURSE_DSA_ID, facultyId: FACULTY_HOPPER_ID },
    { courseId: COURSE_DL_ID, facultyId: FACULTY_TURING_ID },
    { courseId: COURSE_ANALYTICS_ID, facultyId: FACULTY_JOHNSON_ID },
  ];

  for (const inst of instructors) {
    await prisma.courseInstructor.upsert({
      where: { courseId_facultyId: { courseId: inst.courseId, facultyId: inst.facultyId } },
      update: {},
      create: inst,
    });
  }

  console.log('🎓 Enrolling Students...');

  const enrollments = [
    // Course 1 (CS401)
    { courseId: COURSE_ML_ID, studentId: STUDENT_SARAH_ID, status: 'ACTIVE' },
    { courseId: COURSE_ML_ID, studentId: STUDENT_ARJUN_ID, status: 'ACTIVE' },
    { courseId: COURSE_ML_ID, studentId: STUDENT_ISHITA_ID, status: 'ACTIVE' },
    { courseId: COURSE_ML_ID, studentId: STUDENT_ALEX_ID, status: 'ACTIVE' },
    // Course 2 (CS350)
    { courseId: COURSE_WEB_ID, studentId: STUDENT_SARAH_ID, status: 'ACTIVE' },
    { courseId: COURSE_WEB_ID, studentId: STUDENT_ARJUN_ID, status: 'ACTIVE' },
    // Course 3 (MATH202)
    { courseId: COURSE_MATH_ID, studentId: STUDENT_SARAH_ID, status: 'ACTIVE' },
    { courseId: COURSE_MATH_ID, studentId: STUDENT_ISHITA_ID, status: 'ACTIVE' },
    // Course 4 (CS102)
    { courseId: COURSE_DSA_ID, studentId: STUDENT_ALEX_ID, status: 'ACTIVE' },
    { courseId: COURSE_DSA_ID, studentId: STUDENT_ARJUN_ID, status: 'ACTIVE' },
  ];

  for (const enr of enrollments) {
    await prisma.courseEnrollment.upsert({
      where: { courseId_studentId: { courseId: enr.courseId, studentId: enr.studentId } },
      update: { status: enr.status },
      create: enr,
    });
  }

  console.log('📦 Seeding Course Modules and Content Items...');

  // Modules for CS401
  const MOD_1_ID = 'm0000000-0000-4000-8000-000000000001';
  const MOD_2_ID = 'm0000000-0000-4000-8000-000000000002';
  const MOD_3_ID = 'm0000000-0000-4000-8000-000000000003';

  const modules = [
    {
      id: MOD_1_ID,
      courseId: COURSE_ML_ID,
      title: 'Foundations & Core Principles',
      description: 'Mathematical underpinnings, foundational models, and environment setup.',
      position: 1,
      isPublished: true,
      releaseAt: new Date('2026-09-01T08:00:00Z'),
    },
    {
      id: MOD_2_ID,
      courseId: COURSE_ML_ID,
      title: 'Supervised Learning & Optimization',
      description: 'Linear & logistic regression, gradient descent convergence, and regularization.',
      position: 2,
      isPublished: true,
      releaseAt: new Date('2026-09-15T08:00:00Z'),
    },
    {
      id: MOD_3_ID,
      courseId: COURSE_ML_ID,
      title: 'Neural Architectures & Production Systems',
      description: 'Backpropagation, multi-layer perceptrons, evaluation metrics, and deployment.',
      position: 3,
      isPublished: true,
      releaseAt: new Date('2026-10-01T08:00:00Z'),
    },
  ];

  for (const m of modules) {
    await prisma.module.upsert({
      where: { id: m.id },
      update: {
        title: m.title,
        description: m.description,
        position: m.position,
        isPublished: m.isPublished,
      },
      create: m,
    });
  }

  // Content Items
  const CNT_101_ID = 'cnt00000-0000-4000-8000-000000000101';
  const CNT_102_ID = 'cnt00000-0000-4000-8000-000000000102';
  const CNT_103_ID = 'cnt00000-0000-4000-8000-000000000103';
  const CNT_201_ID = 'cnt00000-0000-4000-8000-000000000201';
  const CNT_202_ID = 'cnt00000-0000-4000-8000-000000000202';
  const CNT_203_ID = 'cnt00000-0000-4000-8000-000000000203';
  const CNT_301_ID = 'cnt00000-0000-4000-8000-000000000301';
  const CNT_302_ID = 'cnt00000-0000-4000-8000-000000000302';

  const contents = [
    {
      id: CNT_101_ID,
      moduleId: MOD_1_ID,
      title: 'Lecture 1: Syllabus & Architectural Overview.pdf',
      type: 'PDF',
      description: 'Complete course roadmap, grading rubric, and foundational theorems.',
      contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      position: 1,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_102_ID,
      moduleId: MOD_1_ID,
      title: 'Recorded Lecture: Bayesian Inference & Prior Probability',
      type: 'VIDEO',
      description: '45-minute deep dive into conditional probability and posterior estimation.',
      contentUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      position: 2,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_103_ID,
      moduleId: MOD_1_ID,
      title: 'Comprehensive Lecture Notes & Derivations',
      type: 'TEXT',
      description: 'Step-by-step derivation of Bayes Theorem, Maximum Likelihood Estimation (MLE), and MAP.',
      contentUrl: 'Bayes Theorem:\nP(A|B) = [P(B|A) * P(A)] / P(B)\n\nNaive Bayes Classifier assumes feature conditional independence given the class label.\nLaplace smoothing prevents zero-probability estimates.',
      position: 3,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_201_ID,
      moduleId: MOD_2_ID,
      title: 'Linear & Polynomial Regression Slides.pdf',
      type: 'PDF',
      description: 'Closed-form normal equations vs. stochastic gradient descent.',
      contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      position: 1,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_202_ID,
      moduleId: MOD_2_ID,
      title: 'Interactive Lab Starter Repository',
      type: 'LINK',
      description: 'Starter code, unit tests, and normalized CSV datasets for Module 2.',
      contentUrl: 'https://github.com',
      position: 2,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_203_ID,
      moduleId: MOD_2_ID,
      title: 'Practice Problem Set & Solutions Guide',
      type: 'TEXT',
      description: 'Worked examples on L1 (Lasso) and L2 (Ridge) regularization penalties.',
      contentUrl: 'Ridge: J(w) = (1/2N) ||Xw - y||^2 + lambda ||w||^2\nLasso: adds L1 penalty lambda sum(|w_i|) promoting sparsity.',
      position: 3,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_301_ID,
      moduleId: MOD_3_ID,
      title: 'Backpropagation & Computational Graphs.pdf',
      type: 'PDF',
      description: 'Chain rule through matrix operations and activation functions.',
      contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      position: 1,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: CNT_302_ID,
      moduleId: MOD_3_ID,
      title: 'Capstone Reference Dataset Archive',
      type: 'FILE',
      description: 'Pre-processed training and validation split archive.',
      contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      position: 2,
      isPublished: true,
      createdById: FACULTY_TURING_ID,
    },
  ];

  for (const cnt of contents) {
    await prisma.content.upsert({
      where: { id: cnt.id },
      update: {
        title: cnt.title,
        type: cnt.type,
        contentUrl: cnt.contentUrl,
        position: cnt.position,
        isPublished: cnt.isPublished,
      },
      create: cnt,
    });
  }

  console.log('📈 Seeding Content Progress...');

  const progressRecords = [
    { userId: STUDENT_SARAH_ID, contentId: CNT_101_ID, completed: true, completedAt: new Date() },
    { userId: STUDENT_SARAH_ID, contentId: CNT_102_ID, completed: true, completedAt: new Date() },
    { userId: STUDENT_SARAH_ID, contentId: CNT_103_ID, completed: true, completedAt: new Date() },
    { userId: STUDENT_SARAH_ID, contentId: CNT_201_ID, completed: true, completedAt: new Date() },
    { userId: STUDENT_ARJUN_ID, contentId: CNT_101_ID, completed: true, completedAt: new Date() },
    { userId: STUDENT_ARJUN_ID, contentId: CNT_102_ID, completed: true, completedAt: new Date() },
  ];

  for (const p of progressRecords) {
    await prisma.contentProgress.upsert({
      where: { userId_contentId: { userId: p.userId, contentId: p.contentId } },
      update: { completed: p.completed, completedAt: p.completedAt },
      create: p,
    });
  }

  console.log('📝 Seeding Assignments & Submissions...');

  const ASM_1_ID = 'asm00000-0000-4000-8000-000000000001';
  const ASM_2_ID = 'asm00000-0000-4000-8000-000000000002';
  const ASM_3_ID = 'asm00000-0000-4000-8000-000000000003';

  const assignments = [
    {
      id: ASM_1_ID,
      courseId: COURSE_ML_ID,
      title: 'Assignment 1: Bayesian Classifier & Posterior Estimation',
      description: 'Implement Gaussian & Multinomial Naive Bayes classifier from scratch. Evaluate precision, recall, and F1-score on benchmark data.',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
      allowLateSubmission: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: ASM_2_ID,
      courseId: COURSE_ML_ID,
      title: 'Assignment 2: Regularized Linear & Logistic Regression Lab',
      description: 'Compare closed-form Ridge regression with mini-batch Stochastic Gradient Descent across varying learning rates and L2 regularization penalties.',
      maxMarks: 100,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      allowLateSubmission: true,
      createdById: FACULTY_TURING_ID,
    },
    {
      id: ASM_3_ID,
      courseId: COURSE_ML_ID,
      title: 'Assignment 3: Relational ER Schema & Normalization Report',
      description: 'Design the 3NF relational schema for an academic platform, including foreign-key constraints, composite indices, and query execution plans.',
      maxMarks: 50,
      dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      allowLateSubmission: false,
      createdById: FACULTY_TURING_ID,
    },
  ];

  for (const a of assignments) {
    await prisma.assignment.upsert({
      where: { id: a.id },
      update: {
        title: a.title,
        description: a.description,
        maxMarks: a.maxMarks,
        dueDate: a.dueDate,
        allowLateSubmission: a.allowLateSubmission,
      },
      create: a,
    });
  }

  // Submissions
  const submissions = [
    {
      assignmentId: ASM_1_ID,
      studentId: STUDENT_SARAH_ID,
      fileUrl: 'https://github.com/sarahjensen/bayesian-classifier-cs401',
      status: 'SUBMITTED',
      marks: 94,
      feedback: 'Excellent mathematical derivation of Laplace smoothing and clean vectorized implementation.',
      gradedById: FACULTY_TURING_ID,
      gradedAt: new Date(),
    },
    {
      assignmentId: ASM_1_ID,
      studentId: STUDENT_ARJUN_ID,
      fileUrl: 'https://github.com/arjunrao/cs401-naive-bayes',
      status: 'SUBMITTED',
      marks: 88,
      feedback: 'Strong experimental analysis; include confusion matrix plots in section 3 next time.',
      gradedById: FACULTY_TURING_ID,
      gradedAt: new Date(),
    },
    {
      assignmentId: ASM_1_ID,
      studentId: STUDENT_ISHITA_ID,
      fileUrl: 'https://github.com/ishitanair/ml-assignment-1',
      status: 'SUBMITTED',
      marks: null,
      feedback: null,
    },
    {
      assignmentId: ASM_2_ID,
      studentId: STUDENT_ARJUN_ID,
      fileUrl: 'https://github.com/arjunrao/cs401-regression-lab',
      status: 'SUBMITTED',
      marks: null,
      feedback: null,
    },
  ];

  for (const s of submissions) {
    await prisma.assignmentSubmission.upsert({
      where: { assignmentId_studentId: { assignmentId: s.assignmentId, studentId: s.studentId } },
      update: {
        fileUrl: s.fileUrl,
        status: s.status,
        marks: s.marks,
        feedback: s.feedback,
        gradedById: s.gradedById || null,
        gradedAt: s.gradedAt || null,
      },
      create: s,
    });
  }

  console.log('🧪 Seeding Quizzes, Questions & Options...');

  const QUIZ_1_ID = 'q0000000-0000-4000-8000-000000000001';
  const QUIZ_2_ID = 'q0000000-0000-4000-8000-000000000002';

  const quizzes = [
    {
      id: QUIZ_1_ID,
      courseId: COURSE_ML_ID,
      title: 'Control Flow, Probability & Bayesian Foundations',
      description: 'Covers Bayes Theorem, prior/posterior estimation, conditional independence, and algorithmic basics.',
      durationMinutes: 20,
      maxAttempts: 3,
      totalMarks: 20,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      createdById: FACULTY_TURING_ID,
    },
    {
      id: QUIZ_2_ID,
      courseId: COURSE_ML_ID,
      title: 'Functions, Modules & Linear Regression Assessment',
      description: 'Covers ordinary least squares, gradient descent, cost functions, and regularization principles.',
      durationMinutes: 30,
      maxAttempts: 3,
      totalMarks: 20,
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      createdById: FACULTY_TURING_ID,
    },
  ];

  for (const q of quizzes) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: {
        title: q.title,
        description: q.description,
        durationMinutes: q.durationMinutes,
        maxAttempts: q.maxAttempts,
        totalMarks: q.totalMarks,
      },
      create: q,
    });
  }

  // Quiz 1 Questions
  const quiz1Questions = [
    {
      id: 'qu000000-0000-4000-8000-000000000001',
      quizId: QUIZ_1_ID,
      questionText: 'What is the Naive Bayes classifier fundamentally based on?',
      questionType: 'MCQ',
      marks: 4,
      position: 1,
      options: [
        { id: 'opt00000-0000-4000-8000-000000000001', optionText: 'Bayes Theorem with conditional feature independence', isCorrect: true },
        { id: 'opt00000-0000-4000-8000-000000000002', optionText: 'Stochastic Gradient Descent without priors', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000003', optionText: 'Principal Component Analysis (PCA)', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000004', optionText: 'K-Means centroid clustering', isCorrect: false },
      ],
    },
    {
      id: 'qu000000-0000-4000-8000-000000000002',
      quizId: QUIZ_1_ID,
      questionText: 'Which regularization technique adds an L2 penalty (sum of squared weights) to the loss function?',
      questionType: 'MCQ',
      marks: 4,
      position: 2,
      options: [
        { id: 'opt00000-0000-4000-8000-000000000005', optionText: 'Ridge Regression', isCorrect: true },
        { id: 'opt00000-0000-4000-8000-000000000006', optionText: 'Lasso Regression', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000007', optionText: 'Dropout', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000008', optionText: 'Batch Normalization', isCorrect: false },
      ],
    },
    {
      id: 'qu000000-0000-4000-8000-000000000003',
      quizId: QUIZ_1_ID,
      questionText: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
      questionType: 'MCQ',
      marks: 4,
      position: 3,
      options: [
        { id: 'opt00000-0000-4000-8000-000000000009', optionText: 'O(1)', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000010', optionText: 'O(n)', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000011', optionText: 'O(log n)', isCorrect: true },
        { id: 'opt00000-0000-4000-8000-000000000012', optionText: 'O(n log n)', isCorrect: false },
      ],
    },
    {
      id: 'qu000000-0000-4000-8000-000000000004',
      quizId: QUIZ_1_ID,
      questionText: 'Which statement immediately exits a loop regardless of the test condition in JavaScript/Python?',
      questionType: 'MCQ',
      marks: 4,
      position: 4,
      options: [
        { id: 'opt00000-0000-4000-8000-000000000013', optionText: 'continue', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000014', optionText: 'break', isCorrect: true },
        { id: 'opt00000-0000-4000-8000-000000000015', optionText: 'pass', isCorrect: false },
        { id: 'opt00000-0000-4000-8000-000000000016', optionText: 'skip', isCorrect: false },
      ],
    },
    {
      id: 'qu000000-0000-4000-8000-000000000005',
      quizId: QUIZ_1_ID,
      questionText: 'In a Naive Bayes classifier, features are assumed to be independent given the class label.',
      questionType: 'TRUE_FALSE',
      marks: 4,
      position: 5,
      options: [
        { id: 'opt00000-0000-4000-8000-000000000017', optionText: 'True', isCorrect: true },
        { id: 'opt00000-0000-4000-8000-000000000018', optionText: 'False', isCorrect: false },
      ],
    },
  ];

  for (const qData of quiz1Questions) {
    const { options, ...qFields } = qData;
    await prisma.question.upsert({
      where: { id: qFields.id },
      update: {
        questionText: qFields.questionText,
        questionType: qFields.questionType,
        marks: qFields.marks,
        position: qFields.position,
      },
      create: qFields,
    });

    for (const opt of options) {
      await prisma.questionOption.upsert({
        where: { id: opt.id },
        update: {
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        },
        create: {
          id: opt.id,
          questionId: qFields.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect,
        },
      });
    }
  }

  // Quiz Attempts
  const ATTEMPT_1_ID = 'att00000-0000-4000-8000-000000000001';
  await prisma.quizAttempt.upsert({
    where: { id: ATTEMPT_1_ID },
    update: { score: 18, status: 'SUBMITTED' },
    create: {
      id: ATTEMPT_1_ID,
      quizId: QUIZ_1_ID,
      studentId: STUDENT_SARAH_ID,
      startedAt: new Date(Date.now() - 3600000),
      submittedAt: new Date(Date.now() - 2400000),
      score: 18,
      status: 'SUBMITTED',
    },
  });

  console.log('⚖️ Seeding Grade Components (Rubric)...');

  const gradeComponents = [
    { courseId: COURSE_ML_ID, name: 'Assignments', type: 'assignment', weight: 20.0 },
    { courseId: COURSE_ML_ID, name: 'Quizzes', type: 'quiz', weight: 20.0 },
    { courseId: COURSE_ML_ID, name: 'Midterm Exam', type: 'exam', weight: 25.0 },
    { courseId: COURSE_ML_ID, name: 'Final Exam', type: 'exam', weight: 30.0 },
    { courseId: COURSE_ML_ID, name: 'Participation', type: 'participation', weight: 5.0 },
  ];

  await prisma.gradeComponent.deleteMany({ where: { courseId: COURSE_ML_ID } });
  await prisma.gradeComponent.createMany({ data: gradeComponents });

  console.log('📅 Seeding Attendance Sessions & Records...');

  const ATT_SESS_1_ID = 'as000000-0000-4000-8000-000000000001';
  const ATT_SESS_2_ID = 'as000000-0000-4000-8000-000000000002';
  const ATT_SESS_3_ID = 'as000000-0000-4000-8000-000000000003';
  const ATT_SESS_4_ID = 'as000000-0000-4000-8000-000000000004';

  const attendanceSessions = [
    {
      id: ATT_SESS_1_ID,
      courseId: COURSE_ML_ID,
      date: new Date('2026-10-22'),
      createdById: FACULTY_TURING_ID,
      records: [
        { studentId: STUDENT_SARAH_ID, status: 'PRESENT' },
        { studentId: STUDENT_ARJUN_ID, status: 'PRESENT' },
        { studentId: STUDENT_ISHITA_ID, status: 'PRESENT' },
        { studentId: STUDENT_ALEX_ID, status: 'LATE' },
      ],
    },
    {
      id: ATT_SESS_2_ID,
      courseId: COURSE_ML_ID,
      date: new Date('2026-10-27'),
      createdById: FACULTY_TURING_ID,
      records: [
        { studentId: STUDENT_SARAH_ID, status: 'PRESENT' },
        { studentId: STUDENT_ARJUN_ID, status: 'PRESENT' },
        { studentId: STUDENT_ISHITA_ID, status: 'ABSENT' },
        { studentId: STUDENT_ALEX_ID, status: 'PRESENT' },
      ],
    },
    {
      id: ATT_SESS_3_ID,
      courseId: COURSE_ML_ID,
      date: new Date('2026-10-29'),
      createdById: FACULTY_TURING_ID,
      records: [
        { studentId: STUDENT_SARAH_ID, status: 'PRESENT' },
        { studentId: STUDENT_ARJUN_ID, status: 'LATE' },
        { studentId: STUDENT_ISHITA_ID, status: 'PRESENT' },
        { studentId: STUDENT_ALEX_ID, status: 'PRESENT' },
      ],
    },
    {
      id: ATT_SESS_4_ID,
      courseId: COURSE_ML_ID,
      date: new Date('2026-11-03'),
      createdById: FACULTY_TURING_ID,
      records: [
        { studentId: STUDENT_SARAH_ID, status: 'PRESENT' },
        { studentId: STUDENT_ARJUN_ID, status: 'PRESENT' },
        { studentId: STUDENT_ISHITA_ID, status: 'PRESENT' },
        { studentId: STUDENT_ALEX_ID, status: 'ABSENT' },
      ],
    },
  ];

  for (const sess of attendanceSessions) {
    await prisma.attendanceSession.upsert({
      where: { id: sess.id },
      update: { date: sess.date },
      create: {
        id: sess.id,
        courseId: sess.courseId,
        date: sess.date,
        createdById: sess.createdById,
      },
    });

    for (const rec of sess.records) {
      await prisma.attendanceRecord.upsert({
        where: { sessionId_studentId: { sessionId: sess.id, studentId: rec.studentId } },
        update: { status: rec.status },
        create: {
          sessionId: sess.id,
          studentId: rec.studentId,
          status: rec.status,
        },
      });
    }
  }

  console.log('💬 Seeding Discussions & Replies...');

  const DISC_1_ID = 'd0000000-0000-4000-8000-000000000001';
  const DISC_2_ID = 'd0000000-0000-4000-8000-000000000002';

  await prisma.discussion.upsert({
    where: { id: DISC_1_ID },
    update: {
      title: 'Clarification on Module 1 — Laplace Smoothing in Naive Bayes',
      content: 'When computing P(x_i | y) with Laplace smoothing (α = 1), do we add |V| (vocabulary size) or the number of feature classes to the denominator for multinomial text classification?',
    },
    create: {
      id: DISC_1_ID,
      courseId: COURSE_ML_ID,
      userId: STUDENT_ISHITA_ID,
      title: 'Clarification on Module 1 — Laplace Smoothing in Naive Bayes',
      content: 'When computing P(x_i | y) with Laplace smoothing (α = 1), do we add |V| (vocabulary size) or the number of feature classes to the denominator for multinomial text classification?',
    },
  });

  const REP_1_ID = 'r0000000-0000-4000-8000-000000000001';
  const REP_2_ID = 'r0000000-0000-4000-8000-000000000002';

  await prisma.discussionReply.upsert({
    where: { id: REP_1_ID },
    update: { content: 'Great question! For a multinomial Naive Bayes model over a vocabulary V, you add α * |V| to the denominator so that the smoothed probabilities across all words in V sum to 1.' },
    create: {
      id: REP_1_ID,
      discussionId: DISC_1_ID,
      userId: FACULTY_TURING_ID,
      content: 'Great question! For a multinomial Naive Bayes model over a vocabulary V, you add α * |V| to the denominator so that the smoothed probabilities across all words in V sum to 1.',
    },
  });

  await prisma.discussionReply.upsert({
    where: { id: REP_2_ID },
    update: { content: 'Thanks Dr. Turing! Confirming that with α = 1 and |V| = 5000, the test perplexity dropped from infinity to 42.3 on our validation split.' },
    create: {
      id: REP_2_ID,
      discussionId: DISC_1_ID,
      userId: STUDENT_ARJUN_ID,
      content: 'Thanks Dr. Turing! Confirming that with α = 1 and |V| = 5000, the test perplexity dropped from infinity to 42.3 on our validation split.',
    },
  });

  await prisma.discussion.upsert({
    where: { id: DISC_2_ID },
    update: {
      title: 'Study Group & Practice Session for Upcoming Midterm Exam',
      content: 'Setting up a collaborative review session this Saturday at 4:00 PM to work through past Bayesian derivation problems. Reply below if you want to join!',
    },
    create: {
      id: DISC_2_ID,
      courseId: COURSE_ML_ID,
      userId: STUDENT_ALEX_ID,
      title: 'Study Group & Practice Session for Upcoming Midterm Exam',
      content: 'Setting up a collaborative review session this Saturday at 4:00 PM to work through past Bayesian derivation problems. Reply below if you want to join!',
    },
  });

  console.log('📢 Seeding Announcements...');

  const announcements = [
    {
      id: 'an000000-0000-4000-8000-000000000001',
      courseId: COURSE_ML_ID,
      createdById: FACULTY_TURING_ID,
      title: 'Midterm Exam Schedule & Room Allocation Finalized',
      message: 'The midterm examination for this course has been officially scheduled for Nov 25th in Lecture Hall 302. Please review Modules 1 and 2 thoroughly.',
    },
    {
      id: 'an000000-0000-4000-8000-000000000002',
      courseId: COURSE_ML_ID,
      createdById: FACULTY_TURING_ID,
      title: 'New Benchmark Dataset & Jupyter Notebook Uploaded',
      message: 'The Module 2 practice dataset and starter notebook have been uploaded under Course Modules. Please verify your local Python environment before Friday’s lab session.',
    },
    {
      id: 'an000000-0000-4000-8000-000000000003',
      courseId: COURSE_ML_ID,
      createdById: FACULTY_TURING_ID,
      title: 'Welcome to Fall 2026 Semester on CourseHub!',
      message: 'Welcome everyone! Please review the course syllabus in Module 1, check the weighted grading rubric in the Grades tab, and introduce yourself in the Discussion Forum.',
    },
  ];

  for (const ann of announcements) {
    await prisma.announcement.upsert({
      where: { id: ann.id },
      update: { title: ann.title, message: ann.message },
      create: ann,
    });
  }

  console.log('🔔 Seeding Notifications...');

  const notifications = [
    {
      id: 'no000000-0000-4000-8000-000000000001',
      userId: STUDENT_SARAH_ID,
      title: 'Assignment 1 Grade Published: 94/100',
      message: 'Dr. Alan Turing graded your submission for "Assignment 1: Bayesian Classifier & Posterior Estimation" in CS401.',
      type: 'GRADE',
      isRead: false,
    },
    {
      id: 'no000000-0000-4000-8000-000000000002',
      userId: STUDENT_SARAH_ID,
      title: 'New Course Announcement: Midterm Exam Schedule',
      message: 'Dr. Alan Turing posted a pinned announcement in CS401: Intro to Machine Learning.',
      type: 'ANNOUNCEMENT',
      isRead: false,
    },
    {
      id: 'no000000-0000-4000-8000-000000000003',
      userId: STUDENT_SARAH_ID,
      title: 'Upcoming Deadline: Assignment 2 Due Nov 24',
      message: 'Reminder: "Assignment 2: Regularized Linear & Logistic Regression Lab" is due soon.',
      type: 'ASSIGNMENT',
      isRead: true,
    },
    {
      id: 'no000000-0000-4000-8000-000000000004',
      userId: STUDENT_SARAH_ID,
      title: 'Attendance Recorded: Present in CS401',
      message: 'Your attendance for Lecture 11 was recorded as PRESENT.',
      type: 'SYSTEM',
      isRead: true,
    },
    {
      id: 'no000000-0000-4000-8000-000000000005',
      userId: STUDENT_SARAH_ID,
      title: 'Instructor Reply in Discussion Forum',
      message: 'Dr. Alan Turing replied to "Clarification on Module 1 — Laplace Smoothing in Naive Bayes".',
      type: 'DISCUSSION',
      isRead: true,
    },
  ];

  for (const notif of notifications) {
    await prisma.notification.upsert({
      where: { id: notif.id },
      update: { title: notif.title, message: notif.message, isRead: notif.isRead },
      create: notif,
    });
  }

  console.log('✅ Database Seeding Completed Successfully!');
  console.log('----------------------------------------------------');
  console.log('🔑 Default User Accounts:');
  console.log('  👑 ADMIN:   admin@university.edu       / Admin123!   (Secret Code: admin@lms)');
  console.log('  👨‍🏫 FACULTY: alan.turing@university.edu   / Faculty123!');
  console.log('  👨‍🏫 FACULTY: grace.hopper@university.edu  / Faculty123!');
  console.log('  👩‍🎓 STUDENT: sarah.jensen@university.edu   / Student123!');
  console.log('  👨‍🎓 STUDENT: arjun.rao@university.edu      / Student123!');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

