import React from 'react';

exports.MOCK_USERS = exports.MOCK_STUDENT_COURSES = exports.MOCK_QUIZ_REVIEW_ITEMS = exports.MOCK_QUIZ_QUESTIONS = exports.MOCK_NOTIFICATIONS = exports.MOCK_EXAM_INSTRUCTIONS = exports.MOCK_DISCUSSIONS = exports.MOCK_COURSE_QUIZZES = exports.MOCK_CATALOG_COURSES = exports.MOCK_ATTENDANCE_SESSIONS = exports.MOCK_ASSIGNMENTS_BY_COURSE = exports.MOCK_ANNOUNCEMENTS = exports.DEFAULT_MODULES_TEMPLATE = void 0;
/**
 * Shared relational mock data used as fallback when backend records are empty or during standalone frontend usage.
 * Covers all LMS entities from the PERN Stack Database Design:
 * USERS, COURSES, COURSE_ENROLLMENTS, COURSE_INSTRUCTORS, MODULES, CONTENT, CONTENT_PROGRESS,
 * ASSIGNMENTS, ASSIGNMENT_SUBMISSIONS, QUIZZES, QUESTIONS, QUESTION_OPTIONS, QUIZ_ATTEMPTS,
 * ANNOUNCEMENTS, NOTIFICATIONS, ATTENDANCE_SESSIONS, ATTENDANCE_RECORDS, DISCUSSIONS, DISCUSSION_REPLIES, GRADE_COMPONENTS.
 */

const createAvatarSvg = (initials, bgFrom = '#06b6d4', bgTo = '#3b82f6') => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgFrom}"/>
          <stop offset="100%" stop-color="${bgTo}"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#g)"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="42" font-weight="800">${initials}</text>
    </svg>`)}`;
const MOCK_USERS = [{
  id: 'user-student-1',
  name: 'Sarah Jensen',
  username: 'sarah_jensen',
  email: 'sarah.jensen@university.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  semester: 'Fall 2026',
  mobileNumber: '+15552348910',
  status: 'active',
  createdAt: '2026-08-15T09:00:00Z',
  profileImage: createAvatarSvg('SJ', '#06b6d4', '#6366f1')
}, {
  id: 'user-student-2',
  name: 'Arjun Rao',
  username: 'arjun_rao',
  email: 'arjun.rao@university.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  semester: 'Fall 2026',
  mobileNumber: '+15558765432',
  status: 'active',
  createdAt: '2026-08-16T10:30:00Z',
  profileImage: createAvatarSvg('AR', '#10b981', '#0ea5e9')
}, {
  id: 'user-student-3',
  name: 'Ishita Nair',
  username: 'ishita_nair',
  email: 'ishita.nair@university.edu',
  role: 'student',
  department: 'Data Science & AI',
  semester: 'Fall 2026',
  mobileNumber: '+15559871234',
  status: 'active',
  createdAt: '2026-08-18T11:15:00Z',
  profileImage: createAvatarSvg('IN', '#8b5cf6', '#ec4899')
}, {
  id: 'user-student-4',
  name: 'Alex Chen',
  username: 'alex_chen',
  email: 'alex.chen@university.edu',
  role: 'student',
  department: 'Computer Science & Engineering',
  semester: 'Fall 2026',
  mobileNumber: '+15553456789',
  status: 'active',
  createdAt: '2026-08-20T14:00:00Z',
  profileImage: createAvatarSvg('AC', '#f59e0b', '#ef4444')
}, {
  id: 'user-faculty-1',
  name: 'Dr. Alan Turing',
  username: 'alan_turing',
  email: 'alan.turing@university.edu',
  role: 'faculty',
  department: 'Artificial Intelligence & ML',
  semester: 'Fall 2026',
  mobileNumber: '+15551112233',
  status: 'active',
  createdAt: '2026-01-10T08:00:00Z',
  profileImage: createAvatarSvg('AT', '#2563eb', '#7c3aed')
}, {
  id: 'user-faculty-2',
  name: 'Dr. Grace Hopper',
  username: 'grace_hopper',
  email: 'grace.hopper@university.edu',
  role: 'faculty',
  department: 'Computer Systems & Compilers',
  semester: 'Fall 2026',
  mobileNumber: '+15552223344',
  status: 'active',
  createdAt: '2026-01-12T08:00:00Z',
  profileImage: createAvatarSvg('GH', '#0891b2', '#2563eb')
}, {
  id: 'user-faculty-3',
  name: 'Prof. Katherine Johnson',
  username: 'katherine_johnson',
  email: 'katherine.johnson@university.edu',
  role: 'faculty',
  department: 'Applied Mathematics',
  semester: 'Fall 2026',
  mobileNumber: '+15553334455',
  status: 'active',
  createdAt: '2026-02-01T08:00:00Z',
  profileImage: createAvatarSvg('KJ', '#7c3aed', '#db2777')
}, {
  id: 'user-faculty-4',
  name: 'Dr. Tim Berners-Lee',
  username: 'tim_bl',
  email: 'tim.bl@university.edu',
  role: 'faculty',
  department: 'Web Architecture & Distributed Systems',
  semester: 'Fall 2026',
  mobileNumber: '+15554445566',
  status: 'active',
  createdAt: '2026-02-10T08:00:00Z',
  profileImage: createAvatarSvg('TB', '#059669', '#0284c7')
}, {
  id: 'user-admin-1',
  name: 'Dean Robert Vance',
  username: 'robert_vance',
  email: 'admin@university.edu',
  role: 'admin',
  department: 'Academic Administration',
  semester: 'Fall 2026',
  mobileNumber: '+15550001111',
  status: 'active',
  createdAt: '2025-09-01T08:00:00Z',
  profileImage: createAvatarSvg('RV', '#dc2626', '#9333ea')
}];
const DEFAULT_MODULES_TEMPLATE = [{
  id: 'mod-1',
  title: 'Foundations & Core Principles',
  description: 'Mathematical underpinnings, foundational models, and environment setup.',
  position: 1,
  isPublished: true,
  releaseAt: '2026-09-01T08:00:00Z',
  content: [{
    id: 'cnt-101',
    title: 'Lecture 1: Syllabus & Architectural Overview.pdf',
    type: 'PDF',
    description: 'Complete course roadmap, grading rubric, and foundational theorems.',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    position: 1,
    isPublished: true
  }, {
    id: 'cnt-102',
    title: 'Recorded Lecture: Bayesian Inference & Prior Probability',
    type: 'VIDEO',
    description: '45-minute deep dive into conditional probability and posterior estimation.',
    contentUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    position: 2,
    isPublished: true
  }, {
    id: 'cnt-103',
    title: 'Comprehensive Lecture Notes & Derivations',
    type: 'TEXT',
    description: 'Step-by-step derivation of Bayes Theorem, Maximum Likelihood Estimation (MLE), and MAP.',
    contentUrl: '1. Bayes Theorem:\n   P(A | B) = [P(B | A) * P(A)] / P(B)\n\n2. Naive Bayes Classifier:\n   Assumes conditional independence between features given the class label.\n   y_hat = argmax_y P(y) * Π P(x_i | y)\n\n3. Key Takeaways:\n   - Prior probabilities capture domain knowledge before observing data.\n   - Laplace smoothing prevents zero-probability estimates in categorical features.',
    position: 3,
    isPublished: true
  }]
}, {
  id: 'mod-2',
  title: 'Supervised Learning & Optimization',
  description: 'Linear & logistic regression, gradient descent convergence, and regularization.',
  position: 2,
  isPublished: true,
  releaseAt: '2026-09-15T08:00:00Z',
  content: [{
    id: 'cnt-201',
    title: 'Linear & Polynomial Regression Slides.pdf',
    type: 'PDF',
    description: 'Closed-form normal equations vs. stochastic gradient descent.',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    position: 1,
    isPublished: true
  }, {
    id: 'cnt-202',
    title: 'Interactive Lab Repository & Benchmark Dataset',
    type: 'LINK',
    description: 'Starter code, unit tests, and normalized CSV datasets for Module 2.',
    contentUrl: 'https://github.com',
    position: 2,
    isPublished: true
  }, {
    id: 'cnt-203',
    title: 'Practice Problem Set & Solutions Guide',
    type: 'TEXT',
    description: 'Worked examples on L1 (Lasso) and L2 (Ridge) regularization penalties.',
    contentUrl: 'Problem 1: Ridge Regression Objective\nJ(w) = (1/2N) ||Xw - y||^2_2 + λ ||w||^2_2\nClosed-form solution: w* = (X^T X + λI)^(-1) X^T y\n\nProblem 2: Bias-Variance Tradeoff\nIncreasing λ increases bias but reduces variance, preventing overfitting on high-dimensional inputs.',
    position: 3,
    isPublished: true
  }]
}, {
  id: 'mod-3',
  title: 'Neural Architectures & Production Systems',
  description: 'Backpropagation, multi-layer perceptrons, evaluation metrics, and deployment.',
  position: 3,
  isPublished: true,
  releaseAt: '2026-10-01T08:00:00Z',
  content: [{
    id: 'cnt-301',
    title: 'Backpropagation & Computational Graphs.pdf',
    type: 'PDF',
    description: 'Chain rule through matrix operations and activation functions.',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    position: 1,
    isPublished: true
  }, {
    id: 'cnt-302',
    title: 'Capstone Reference Dataset Archive',
    type: 'FILE',
    description: 'Pre-processed training and validation split archive.',
    contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    position: 2,
    isPublished: true
  }]
}];
const MOCK_STUDENT_COURSES = [{
  id: 'mock-1',
  title: 'Intro to Machine Learning',
  courseCode: 'CS401',
  category: 'Artificial Intelligence',
  semester: 'Fall 2026',
  instructorName: 'Dr. Alan Turing',
  instructorId: 'user-faculty-1',
  instructorAvatar: createAvatarSvg('AT', '#2563eb', '#7c3aed'),
  progress: 85,
  status: 'Active',
  statusBadge: 'Active',
  bannerUrl: null,
  description: 'Foundational machine learning covering Bayesian learning, regression, classification, neural networks, and statistical evaluation.'
}, {
  id: 'mock-2',
  title: 'Linear Algebra II',
  courseCode: 'MATH202',
  category: 'Mathematics',
  semester: 'Fall 2026',
  instructorName: 'Prof. Katherine Johnson',
  instructorId: 'user-faculty-3',
  instructorAvatar: createAvatarSvg('KJ', '#7c3aed', '#db2777'),
  progress: 62,
  status: 'Active',
  statusBadge: 'Active',
  bannerUrl: null,
  description: 'Eigenvalues, singular value decomposition (SVD), orthogonal projections, positive definite matrices, and spectral theorems.'
}, {
  id: 'mock-3',
  title: 'Advanced Web Development',
  courseCode: 'CS350',
  category: 'Software Engineering',
  semester: 'Fall 2026',
  instructorName: 'Dr. Tim Berners-Lee',
  instructorId: 'user-faculty-4',
  instructorAvatar: createAvatarSvg('TB', '#059669', '#0284c7'),
  progress: 78,
  status: 'Active',
  statusBadge: 'Active',
  bannerUrl: null,
  description: 'Full-stack PERN architecture with PostgreSQL, Express, React 19, Node.js, JWT RBAC security, Redis caching, and Docker CI/CD.'
}, {
  id: 'mock-4',
  title: 'Statistical Learning Theory',
  courseCode: 'CS410',
  category: 'Artificial Intelligence',
  semester: 'Fall 2026',
  instructorName: 'Dr. Alan Turing',
  instructorId: 'user-faculty-1',
  instructorAvatar: createAvatarSvg('AT', '#2563eb', '#7c3aed'),
  progress: 85,
  status: 'Active',
  statusBadge: 'Active',
  bannerUrl: null,
  description: 'VC dimension, Rademacher complexity, kernel methods, support vector machines, and PAC learning bounds.'
}, {
  id: 'mock-5',
  title: 'Numerical Matrix Analysis',
  courseCode: 'MATH305',
  category: 'Mathematics',
  semester: 'Fall 2026',
  instructorName: 'Prof. Katherine Johnson',
  instructorId: 'user-faculty-3',
  instructorAvatar: createAvatarSvg('KJ', '#7c3aed', '#db2777'),
  progress: 62,
  status: 'Active',
  statusBadge: 'Active',
  bannerUrl: null,
  description: 'Iterative linear solvers, QR factorization, conditioning analysis, and high-performance matrix computations.'
}, {
  id: 'mock-6',
  title: 'Cloud & Distributed Systems',
  courseCode: 'CS499',
  category: 'Computer Science',
  semester: 'Fall 2026',
  instructorName: 'Dr. Tim Berners-Lee',
  instructorId: 'user-faculty-4',
  instructorAvatar: createAvatarSvg('TB', '#059669', '#0284c7'),
  progress: 78,
  status: 'Active',
  statusBadge: 'Active',
  bannerUrl: null,
  description: 'Consensus protocols, distributed caching with Redis, containerized microservices, and fault-tolerant storage engines.'
}];
const MOCK_CATALOG_COURSES = [{
  id: 'cat-1',
  courseCode: 'CS102',
  title: 'Data Structures & Algorithms',
  description: 'Master fundamental data structures, graph algorithms, dynamic programming, and asymptotic complexity analysis.',
  semester: 'Fall 2026',
  category: 'Computer Science',
  instructorName: 'Dr. Grace Hopper',
  instructorId: 'user-faculty-2',
  instructorAvatar: createAvatarSvg('GH', '#0891b2', '#2563eb'),
  status: 'Open',
  popularity: 98,
  rating: 4.9
}, {
  id: 'cat-2',
  courseCode: 'AI201',
  title: 'Deep Learning Foundations',
  description: 'Explore neural networks, CNNs, transformers, and optimization techniques to build real-world AI models.',
  semester: 'Fall 2026',
  category: 'Artificial Intelligence',
  instructorName: 'Dr. Alan Turing',
  instructorId: 'user-faculty-1',
  instructorAvatar: createAvatarSvg('AT', '#2563eb', '#7c3aed'),
  status: 'Open',
  popularity: 95,
  rating: 4.9
}, {
  id: 'cat-3',
  courseCode: 'DS301',
  title: 'Business & Predictive Analytics',
  description: 'Statistical modeling, exploratory data analysis, cohort retention metrics, and executive decision dashboards.',
  semester: 'Fall 2026',
  category: 'Data Science',
  instructorName: 'Prof. Katherine Johnson',
  instructorId: 'user-faculty-3',
  instructorAvatar: createAvatarSvg('KJ', '#7c3aed', '#db2777'),
  status: 'Waiting List',
  popularity: 88,
  rating: 4.7
}, {
  id: 'cat-4',
  courseCode: 'CS204',
  title: 'Advanced Data Structures II',
  description: 'B-Trees, Red-Black trees, Fibonacci heaps, suffix arrays, and cache-oblivious data structures.',
  semester: 'Fall 2026',
  category: 'Computer Science',
  instructorName: 'Dr. Grace Hopper',
  instructorId: 'user-faculty-2',
  instructorAvatar: createAvatarSvg('GH', '#0891b2', '#2563eb'),
  status: 'Open',
  popularity: 85,
  rating: 4.8
}, {
  id: 'cat-5',
  courseCode: 'AI305',
  title: 'ML Systems & Hardware Acceleration',
  description: 'Distributed training, GPU kernel fusion, quantization, and low-latency inference serving.',
  semester: 'Spring 2026',
  category: 'Artificial Intelligence',
  instructorName: 'Dr. Alan Turing',
  instructorId: 'user-faculty-1',
  instructorAvatar: createAvatarSvg('AT', '#2563eb', '#7c3aed'),
  status: 'Open',
  popularity: 91,
  rating: 4.8
}, {
  id: 'cat-6',
  courseCode: 'DS310',
  title: 'Data Engineering & Pipelines',
  description: 'Relational warehousing in PostgreSQL, ETL orchestration, streaming pipelines, and schema governance.',
  semester: 'Spring 2026',
  category: 'Data Science',
  instructorName: 'Dr. Tim Berners-Lee',
  instructorId: 'user-faculty-4',
  instructorAvatar: createAvatarSvg('TB', '#059669', '#0284c7'),
  status: 'Open',
  popularity: 82,
  rating: 4.6
}, {
  id: 'cat-7',
  courseCode: 'CS315',
  title: 'Database Internals & Prisma ORM',
  description: 'ACID transactions, MVCC concurrency control, B+ tree indexing, query planning, and modern ORM design.',
  semester: 'Fall 2026',
  category: 'Computer Science',
  instructorName: 'Dr. Grace Hopper',
  instructorId: 'user-faculty-2',
  instructorAvatar: createAvatarSvg('GH', '#0891b2', '#2563eb'),
  status: 'Open',
  popularity: 89,
  rating: 4.8
}, {
  id: 'cat-8',
  courseCode: 'AI402',
  title: 'Large Language Models & Agents',
  description: 'Transformer attention mechanisms, retrieval-augmented generation (RAG), fine-tuning, and alignment.',
  semester: 'Fall 2026',
  category: 'Artificial Intelligence',
  instructorName: 'Dr. Alan Turing',
  instructorId: 'user-faculty-1',
  instructorAvatar: createAvatarSvg('AT', '#2563eb', '#7c3aed'),
  status: 'Waiting List',
  popularity: 96,
  rating: 4.9
}, {
  id: 'cat-9',
  courseCode: 'DS405',
  title: 'Quantitative Time-Series & Forecasting',
  description: 'ARIMA, state-space models, stochastic processes, and sequential decision frameworks.',
  semester: 'Spring 2026',
  category: 'Data Science',
  instructorName: 'Prof. Katherine Johnson',
  instructorId: 'user-faculty-3',
  instructorAvatar: createAvatarSvg('KJ', '#7c3aed', '#db2777'),
  status: 'Open',
  popularity: 90,
  rating: 4.8
}];
const MOCK_COURSE_QUIZZES = [{
  id: 'quiz-1',
  quizNumber: 'Quiz 1',
  title: 'Control Flow, Probability & Bayesian Foundations',
  questions: 10,
  duration: '20 mins',
  attemptsAllowed: 3,
  attemptsUsed: 0,
  points: 20,
  status: 'Active',
  colorTheme: 'cyan',
  buttonText: 'Start Attempt'
}, {
  id: 'quiz-2',
  quizNumber: 'Quiz 2',
  title: 'Functions, Modules & Linear Regression Assessment',
  questions: 10,
  duration: '30 mins',
  attemptsAllowed: 3,
  attemptsUsed: 1,
  points: 20,
  score: 17,
  status: 'Attempted',
  colorTheme: 'amber',
  buttonText: 'Continue Attempt'
}, {
  id: 'quiz-3',
  quizNumber: 'Quiz 3',
  title: 'Data Structures & Algorithmic Complexity Quiz',
  questions: 10,
  duration: '30 mins',
  attemptsAllowed: 3,
  attemptsUsed: 3,
  points: 16,
  score: 15,
  status: 'Completed',
  colorTheme: 'emerald',
  buttonText: 'View Results'
}];
const MOCK_QUIZ_QUESTIONS = [{
  id: 1,
  question: 'What is the Naive Bayes classifier fundamentally based on?',
  type: 'MCQ',
  marks: 2,
  options: ['Bayes Theorem with conditional feature independence', 'Stochastic Gradient Descent without priors', 'Principal Component Analysis (PCA)', 'K-Means centroid clustering'],
  correctIndex: 0
}, {
  id: 2,
  question: 'Which statement immediately exits a loop regardless of the test condition?',
  type: 'MCQ',
  marks: 2,
  options: ['continue', 'break', 'pass', 'return'],
  correctIndex: 1
}, {
  id: 3,
  question: 'What is the time complexity of searching in a balanced Binary Search Tree (BST)?',
  type: 'MCQ',
  marks: 2,
  options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
  correctIndex: 2
}, {
  id: 4,
  question: 'In JavaScript, which operator checks both value and type equality?',
  type: 'MCQ',
  marks: 2,
  options: ['==', '===', '!=', 'equals()'],
  correctIndex: 1
}, {
  id: 5,
  question: 'Which data structure follows the First-In, First-Out (FIFO) principle?',
  type: 'MCQ',
  marks: 2,
  options: ['Stack', 'Queue', 'Binary Heap', 'Hash Table'],
  correctIndex: 1
}, {
  id: 6,
  question: 'What keyword defines an anonymous function in Python?',
  type: 'MCQ',
  marks: 2,
  options: ['def', 'lambda', 'func', 'anonymous'],
  correctIndex: 1
}, {
  id: 7,
  question: 'Which regularization technique adds an L2 penalty (sum of squared weights) to the loss function?',
  type: 'MCQ',
  marks: 2,
  options: ['Ridge Regression', 'Lasso Regression', 'Dropout', 'Batch Normalization'],
  correctIndex: 0
}, {
  id: 8,
  question: 'What is the base case in a recursive function responsible for?',
  type: 'MCQ',
  marks: 2,
  options: ['Initiating recursion', 'Preventing infinite loops by terminating recursion', 'Optimizing heap allocation', 'Compiling the call stack'],
  correctIndex: 1
}, {
  id: 9,
  question: 'Which binary tree traversal visits nodes in Left → Root → Right order?',
  type: 'MCQ',
  marks: 2,
  options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
  correctIndex: 1
}, {
  id: 10,
  question: 'In PostgreSQL, which clause is used with GROUP BY to filter grouped rows based on aggregate conditions?',
  type: 'MCQ',
  marks: 2,
  options: ['WHERE', 'ORDER BY', 'HAVING', 'DISTINCT'],
  correctIndex: 2
}];
const MOCK_QUIZ_REVIEW_ITEMS = [{
  q: '1. What is the time complexity of searching in a balanced BST?',
  userAns: 'O(log n)',
  correctAns: 'O(log n)',
  correct: true,
  points: '1.6 / 1.6'
}, {
  q: '2. Which statement immediately exits a loop regardless of the condition?',
  userAns: 'break',
  correctAns: 'break',
  correct: true,
  points: '1.6 / 1.6'
}, {
  q: '3. What data structure follows the FIFO principle?',
  userAns: 'Queue',
  correctAns: 'Queue',
  correct: true,
  points: '1.6 / 1.6'
}, {
  q: '4. What keyword defines an anonymous function in Python?',
  userAns: 'func',
  correctAns: 'lambda',
  correct: false,
  points: '0.0 / 1.6'
}, {
  q: '5. Which traversal visits: Left, Root, Right order?',
  userAns: 'In-order',
  correctAns: 'In-order',
  correct: true,
  points: '1.6 / 1.6'
}];
const MOCK_EXAM_INSTRUCTIONS = [{
  id: 'inst-1',
  title: 'Fullscreen Exam Environment',
  desc: 'This assessment is conducted in full screen mode to minimize distractions. Please stay on this screen until you finish.',
  icon: 'fullscreen'
}, {
  id: 'inst-2',
  title: 'Timed Assessment',
  desc: 'The countdown timer starts as soon as you enter the exam. The assessment will automatically submit when time expires.',
  icon: 'timer'
}, {
  id: 'inst-3',
  title: 'Question Palette & Flagging',
  desc: 'Use the interactive question palette on the right to jump between questions. You can mark challenging questions for review.',
  icon: 'palette'
}, {
  id: 'inst-4',
  title: 'Submission Review Prompt',
  desc: 'Before final submission, a confirmation dialog will display a summary of your attempted, unattempted, and flagged questions.',
  icon: 'checklist'
}, {
  id: 'inst-5',
  title: 'Academic Integrity',
  desc: 'All submitted responses must be your individual work. Unauthorized aids, secondary devices, or browser tab switching are monitored.',
  icon: 'shield'
}];
const MOCK_ASSIGNMENTS_BY_COURSE = {
  default: [{
    id: 'asm-1',
    courseId: 'mock-1',
    title: 'Assignment 1: Bayesian Classifier & Posterior Estimation',
    description: 'Implement a Gaussian & Multinomial Naive Bayes classifier from scratch in Python. Evaluate precision, recall, and F1-score on the benchmark test split and submit your report PDF or repository link.',
    maxMarks: 100,
    dueDate: '2026-11-18T23:59:00Z',
    allowLateSubmission: true,
    _count: {
      submissions: 3
    },
    submissions: [{
      id: 'sub-101',
      assignmentId: 'asm-1',
      studentId: 'user-student-1',
      student: {
        name: 'Sarah Jensen',
        email: 'sarah.jensen@university.edu'
      },
      fileUrl: 'https://github.com/sarahjensen/bayesian-classifier-cs401',
      submittedAt: '2026-11-02T16:40:00Z',
      status: 'SUBMITTED',
      marks: 94,
      feedback: 'Excellent mathematical derivation of Laplace smoothing and clean vectorized implementation.',
      gradedBy: 'user-faculty-1',
      gradedAt: '2026-11-03T11:20:00Z'
    }, {
      id: 'sub-102',
      assignmentId: 'asm-1',
      studentId: 'user-student-2',
      student: {
        name: 'Arjun Rao',
        email: 'arjun.rao@university.edu'
      },
      fileUrl: 'https://github.com/arjunrao/cs401-naive-bayes',
      submittedAt: '2026-11-03T19:15:00Z',
      status: 'SUBMITTED',
      marks: 88,
      feedback: 'Strong experimental analysis; include confusion matrix plots in section 3 next time.',
      gradedBy: 'user-faculty-1',
      gradedAt: '2026-11-04T09:10:00Z'
    }, {
      id: 'sub-103',
      assignmentId: 'asm-1',
      studentId: 'user-student-3',
      student: {
        name: 'Ishita Nair',
        email: 'ishita.nair@university.edu'
      },
      fileUrl: 'https://github.com/ishitanair/ml-assignment-1',
      submittedAt: '2026-11-04T21:05:00Z',
      status: 'SUBMITTED',
      marks: null,
      feedback: ''
    }]
  }, {
    id: 'asm-2',
    courseId: 'mock-1',
    title: 'Assignment 2: Regularized Linear & Logistic Regression',
    description: 'Compare closed-form Ridge regression with mini-batch Stochastic Gradient Descent across varying learning rates and L2 regularization penalties.',
    maxMarks: 100,
    dueDate: '2026-11-24T23:59:00Z',
    allowLateSubmission: true,
    _count: {
      submissions: 1
    },
    submissions: [{
      id: 'sub-201',
      assignmentId: 'asm-2',
      studentId: 'user-student-2',
      student: {
        name: 'Arjun Rao',
        email: 'arjun.rao@university.edu'
      },
      fileUrl: 'https://github.com/arjunrao/cs401-regression-lab',
      submittedAt: '2026-11-04T18:30:00Z',
      status: 'SUBMITTED',
      marks: null,
      feedback: ''
    }]
  }, {
    id: 'asm-3',
    courseId: 'mock-1',
    title: 'Assignment 3: Relational ER Schema & Normalization Report',
    description: 'Design the 3NF relational schema for a multi-tenant academic platform, including foreign-key constraints, composite indices, and query execution plans.',
    maxMarks: 50,
    dueDate: '2026-12-02T23:59:00Z',
    allowLateSubmission: false,
    _count: {
      submissions: 0
    },
    submissions: []
  }]
};
const MOCK_ATTENDANCE_SESSIONS = [{
  id: 'att-sess-1',
  courseId: 'mock-1',
  date: '2026-10-22',
  topic: 'Lecture 08: Conditional Probability & Priors',
  createdBy: 'Dr. Alan Turing',
  records: [{
    id: 'rec-1',
    studentId: 'user-student-1',
    studentName: 'Sarah Jensen',
    studentEmail: 'sarah.jensen@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-2',
    studentId: 'user-student-2',
    studentName: 'Arjun Rao',
    studentEmail: 'arjun.rao@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-3',
    studentId: 'user-student-3',
    studentName: 'Ishita Nair',
    studentEmail: 'ishita.nair@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-4',
    studentId: 'user-student-4',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@university.edu',
    status: 'LATE'
  }]
}, {
  id: 'att-sess-2',
  courseId: 'mock-1',
  date: '2026-10-27',
  topic: 'Lecture 09: Maximum Likelihood & MAP Estimation',
  createdBy: 'Dr. Alan Turing',
  records: [{
    id: 'rec-5',
    studentId: 'user-student-1',
    studentName: 'Sarah Jensen',
    studentEmail: 'sarah.jensen@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-6',
    studentId: 'user-student-2',
    studentName: 'Arjun Rao',
    studentEmail: 'arjun.rao@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-7',
    studentId: 'user-student-3',
    studentName: 'Ishita Nair',
    studentEmail: 'ishita.nair@university.edu',
    status: 'ABSENT'
  }, {
    id: 'rec-8',
    studentId: 'user-student-4',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@university.edu',
    status: 'PRESENT'
  }]
}, {
  id: 'att-sess-3',
  courseId: 'mock-1',
  date: '2026-10-29',
  topic: 'Lecture 10: Linear Regression & Normal Equations',
  createdBy: 'Dr. Alan Turing',
  records: [{
    id: 'rec-9',
    studentId: 'user-student-1',
    studentName: 'Sarah Jensen',
    studentEmail: 'sarah.jensen@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-10',
    studentId: 'user-student-2',
    studentName: 'Arjun Rao',
    studentEmail: 'arjun.rao@university.edu',
    status: 'LATE'
  }, {
    id: 'rec-11',
    studentId: 'user-student-3',
    studentName: 'Ishita Nair',
    studentEmail: 'ishita.nair@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-12',
    studentId: 'user-student-4',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@university.edu',
    status: 'PRESENT'
  }]
}, {
  id: 'att-sess-4',
  courseId: 'mock-1',
  date: '2026-11-03',
  topic: 'Lecture 11: Gradient Descent & Regularization Lab',
  createdBy: 'Dr. Alan Turing',
  records: [{
    id: 'rec-13',
    studentId: 'user-student-1',
    studentName: 'Sarah Jensen',
    studentEmail: 'sarah.jensen@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-14',
    studentId: 'user-student-2',
    studentName: 'Arjun Rao',
    studentEmail: 'arjun.rao@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-15',
    studentId: 'user-student-3',
    studentName: 'Ishita Nair',
    studentEmail: 'ishita.nair@university.edu',
    status: 'PRESENT'
  }, {
    id: 'rec-16',
    studentId: 'user-student-4',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@university.edu',
    status: 'ABSENT'
  }]
}];
const MOCK_DISCUSSIONS = [{
  id: 'thread-1',
  courseId: 'mock-1',
  title: 'Clarification on Module 1 — Laplace Smoothing in Naive Bayes',
  author: 'Ishita Nair',
  authorRole: 'Student',
  time: '3 hours ago',
  pinned: true,
  resolved: true,
  likes: 8,
  likedByMe: false,
  content: 'When computing P(x_i | y) with Laplace smoothing (α = 1), do we add |V| (vocabulary size) or the number of feature classes to the denominator for multinomial text classification?',
  replies: [{
    id: 'rep-1',
    author: 'Dr. Alan Turing',
    authorRole: 'Instructor',
    time: '2 hours ago',
    content: 'Great question! For a multinomial Naive Bayes model over a vocabulary V, you add α * |V| to the denominator so that the smoothed probabilities across all words in V sum to 1.'
  }, {
    id: 'rep-2',
    author: 'Arjun Rao',
    authorRole: 'Student',
    time: '1 hour ago',
    content: 'Thanks Dr. Turing! Confirming that with α = 1 and |V| = 5000, the test perplexity dropped from infinity to 42.3 on our validation split.'
  }]
}, {
  id: 'thread-2',
  courseId: 'mock-1',
  title: 'Study Group & Practice Session for Upcoming Midterm Exam',
  author: 'Alex Chen',
  authorRole: 'Student',
  time: '1 day ago',
  pinned: false,
  resolved: false,
  likes: 15,
  likedByMe: true,
  content: 'Setting up a collaborative review session this Saturday at 4:00 PM IST to work through past Eigenvalue, SVD, and Bayesian derivation problems. Reply below if you want to join!',
  replies: [{
    id: 'rep-3',
    author: 'Sarah Jensen',
    authorRole: 'Student',
    time: '20 hours ago',
    content: 'Count me in! I can share my summary sheet for Module 2 Ridge & Lasso derivations.'
  }]
}];
const MOCK_ANNOUNCEMENTS = [{
  id: 'ann-1',
  courseId: 'mock-1',
  title: 'Midterm Exam Schedule & Room Allocation Finalized',
  author: 'Dr. Alan Turing',
  time: '2 hours ago',
  pinned: true,
  content: 'The midterm examination for this course has been officially scheduled for Nov 25th in Lecture Hall 302. Please review Modules 1 and 2 thoroughly. Extended office hours will be held Tuesday and Thursday from 3:00 PM to 5:00 PM.'
}, {
  id: 'ann-2',
  courseId: 'mock-1',
  title: 'New Benchmark Dataset & Jupyter Notebook Uploaded',
  author: 'Dr. Alan Turing',
  time: 'Yesterday',
  pinned: false,
  content: 'The Module 2 practice dataset and starter notebook have been uploaded under Course Modules. Please verify your local Python environment before Friday’s lab session.'
}, {
  id: 'ann-3',
  courseId: 'mock-1',
  title: 'Welcome to Fall 2026 Semester on CourseHub!',
  author: 'Dr. Alan Turing',
  time: '1 week ago',
  pinned: false,
  content: 'Welcome everyone! Please review the course syllabus in Module 1, check the weighted grading rubric in the Grades tab, and introduce yourself in the Discussion Forum.'
}];
const MOCK_NOTIFICATIONS = [{
  id: 'notif-1',
  userId: 'user-student-1',
  title: 'Assignment 1 Grade Published: 94/100',
  message: 'Dr. Alan Turing graded your submission for "Assignment 1: Bayesian Classifier & Posterior Estimation" in CS401.',
  type: 'GRADE',
  courseId: 'mock-1',
  isRead: false,
  createdAt: '2 hours ago'
}, {
  id: 'notif-2',
  userId: 'user-student-1',
  title: 'New Course Announcement: Midterm Exam Schedule',
  message: 'Dr. Alan Turing posted a pinned announcement in CS401: Intro to Machine Learning.',
  type: 'ANNOUNCEMENT',
  courseId: 'mock-1',
  isRead: false,
  createdAt: '3 hours ago'
}, {
  id: 'notif-3',
  userId: 'user-student-1',
  title: 'Upcoming Deadline: Assignment 2 Due Nov 24',
  message: 'Reminder: "Assignment 2: Regularized Linear & Logistic Regression" is due in 19 days.',
  type: 'ASSIGNMENT',
  courseId: 'mock-1',
  isRead: true,
  createdAt: 'Yesterday'
}, {
  id: 'notif-4',
  userId: 'user-student-1',
  title: 'Attendance Recorded: Present (100% in CS401)',
  message: 'Your attendance for Lecture 11: Gradient Descent & Regularization Lab was marked PRESENT.',
  type: 'ATTENDANCE',
  courseId: 'mock-1',
  isRead: true,
  createdAt: '2 days ago'
}, {
  id: 'notif-5',
  userId: 'user-student-1',
  title: 'Instructor Reply in Discussion Forum',
  message: 'Dr. Alan Turing replied to "Clarification on Module 1 — Laplace Smoothing in Naive Bayes".',
  type: 'DISCUSSION',
  courseId: 'mock-1',
  isRead: true,
  createdAt: '3 days ago'
}];

export { MOCK_USERS, DEFAULT_MODULES_TEMPLATE, MOCK_STUDENT_COURSES, MOCK_CATALOG_COURSES, MOCK_COURSE_QUIZZES, MOCK_QUIZ_QUESTIONS, MOCK_QUIZ_REVIEW_ITEMS, MOCK_EXAM_INSTRUCTIONS, MOCK_ASSIGNMENTS_BY_COURSE, MOCK_ATTENDANCE_SESSIONS, MOCK_DISCUSSIONS, MOCK_ANNOUNCEMENTS, MOCK_NOTIFICATIONS };
