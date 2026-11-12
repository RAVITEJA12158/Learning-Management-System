import { api, authApi } from './api';
import { DEFAULT_GRADE_COMPONENTS } from '../utils/constants';

// ============================================================================
// 1. Course Service (Direct Backend API Integration)
// ============================================================================
const courseService = {
  async getAll(search = '') {
    try {
      const data = await api.get(`/courses${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('courseService.getAll error:', err);
      return [];
    }
  },

  async getById(id) {
    if (!id) return null;
    try {
      const data = await api.get(`/courses/${id}`);
      return data && data.id ? data : null;
    } catch (err) {
      console.error(`courseService.getById(${id}) error:`, err);
      return null;
    }
  },

  async create(data) {
    return await api.post('/courses', data);
  },

  async update(id, data) {
    return await api.put(`/courses/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/courses/${id}`);
  },

  async enroll(id) {
    return await api.post(`/courses/${id}/enroll`, {});
  },

  async unenroll(id) {
    return await api.delete(`/courses/${id}/enroll`);
  },

  async getEnrolled() {
    try {
      const data = await api.get('/courses/student/enrolled');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('courseService.getEnrolled error:', err);
      return [];
    }
  },

  async getCreated() {
    try {
      const data = await api.get('/courses/faculty/created');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('courseService.getCreated error:', err);
      return [];
    }
  },

  async getRoster(id) {
    try {
      const data = await api.get(`/courses/${id}/roster`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`courseService.getRoster(${id}) error:`, err);
      return [];
    }
  },

  async assignInstructor(id, facultyUser) {
    const facultyId = typeof facultyUser === 'object' ? facultyUser.id : facultyUser;
    return await api.post(`/courses/${id}/instructors`, { facultyId });
  },

  async removeInstructor(id, facultyId) {
    return await api.delete(`/courses/${id}/instructors/${facultyId}`);
  },

  async updateRosterStatus(courseId, studentId, status) {
    return await api.put(`/courses/${courseId}/roster/${studentId}`, { status });
  },
};

// ============================================================================
// 2. Module & Content Service
// ============================================================================
const moduleService = {
  async getCourseModules(courseId) {
    try {
      const data = await api.get(`/courses/${courseId}/modules`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('moduleService.getCourseModules error:', err);
      return [];
    }
  },

  async createModule(data) {
    return await api.post('/modules', data);
  },

  async updateModule(id, data) {
    return await api.put(`/modules/${id}`, data);
  },

  async deleteModule(id) {
    return await api.delete(`/modules/${id}`);
  },

  async createContent(data) {
    return await api.post('/modules/content', data);
  },

  async updateContent(id, data) {
    return await api.put(`/modules/content/${id}`, data);
  },

  async deleteContent(id) {
    return await api.delete(`/modules/content/${id}`);
  },

  async uploadContentFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await api.upload('/modules/content/upload', formData);
  },
};

// ============================================================================
// 3. Progress Service
// ============================================================================
const progressService = {
  async markContent(contentId, completed = true) {
    return await api.put(`/progress/content/${contentId}`, { completed });
  },

  async getCourseProgress(courseId) {
    try {
      const res = await api.get(`/progress/course/${courseId}`);
      if (res && Array.isArray(res.modules)) return res;
      return { courseId, completionPercent: 0, modules: [] };
    } catch (err) {
      console.error('progressService.getCourseProgress error:', err);
      return { courseId, completionPercent: 0, modules: [] };
    }
  },
};

// ============================================================================
// 4. Assignment Service
// ============================================================================
const assignmentService = {
  async getByCourse(courseId) {
    if (!courseId) return [];
    try {
      const data = await api.get(`/assignments/course/${courseId}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`assignmentService.getByCourse(${courseId}) error:`, err);
      return [];
    }
  },

  async getById(id) {
    if (!id) return null;
    try {
      return await api.get(`/assignments/${id}`);
    } catch (err) {
      console.error(`assignmentService.getById(${id}) error:`, err);
      return null;
    }
  },

  async create(data) {
    return await api.post('/assignments', data);
  },

  async update(id, data) {
    return await api.put(`/assignments/${id}`, data);
  },

  async delete(id) {
    return await api.delete(`/assignments/${id}`);
  },

  async submit(id, formDataOrPayload) {
    if (typeof FormData !== 'undefined' && formDataOrPayload instanceof FormData) {
      return await api.upload(`/assignments/${id}/submit`, formDataOrPayload);
    }
    return await api.post(`/assignments/${id}/submit`, formDataOrPayload);
  },

  async getSubmissions(id) {
    try {
      const data = await api.get(`/assignments/${id}/submissions`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`assignmentService.getSubmissions(${id}) error:`, err);
      return [];
    }
  },

  async gradeSubmission(submissionId, data) {
    return await api.put(`/assignments/submissions/${submissionId}/grade`, data);
  },
};

// ============================================================================
// 5. Quiz Service
// ============================================================================
const quizService = {
  getByCourse() {
    return [];
  },

  async fetchByCourse(courseId) {
    if (!courseId) return [];
    try {
      const data = await api.get(`/quizzes/course/${courseId}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`quizService.fetchByCourse(${courseId}) error:`, err);
      return [];
    }
  },

  async getById(id) {
    if (!id) return null;
    try {
      return await api.get(`/quizzes/${id}`);
    } catch (err) {
      console.error(`quizService.getById(${id}) error:`, err);
      return null;
    }
  },

  async create(data) {
    return await api.post('/quizzes', data);
  },

  async submitAttempt(quizId, answers) {
    return await api.post(`/quizzes/${quizId}/attempt`, { answers });
  },

  async getAttempts(quizId) {
    if (!quizId) return [];
    try {
      const data = await api.get(`/quizzes/${quizId}/attempts`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`quizService.getAttempts(${quizId}) error:`, err);
      return [];
    }
  },

  async getAttemptDetails(attemptId) {
    if (!attemptId) return null;
    try {
      return await api.get(`/quizzes/attempts/${attemptId}`);
    } catch (err) {
      console.error(`quizService.getAttemptDetails(${attemptId}) error:`, err);
      return null;
    }
  },
};

// ============================================================================
// 6. Attendance Service
// ============================================================================
const attendanceService = {
  getSessions() {
    return [];
  },

  async fetchSessions(courseId, isStaff = false) {
    if (!courseId) return [];
    try {
      if (isStaff) {
        const data = await api.get(`/attendance/course/${courseId}`);
        return Array.isArray(data) ? data : [];
      } else {
        const studentData = await api.get(`/attendance/student/course/${courseId}`);
        if (studentData && Array.isArray(studentData.sessions)) {
          return studentData.sessions.map((s) => ({
            id: s.sessionId,
            courseId,
            date: s.date,
            topic: s.topic,
            status: s.status,
            records: [{ studentId: 'me', studentName: 'Me', status: s.status }],
          }));
        }
        return [];
      }
    } catch (err) {
      console.error(`attendanceService.fetchSessions(${courseId}) error:`, err);
      return [];
    }
  },

  async createSession(courseId, { date, topic, records }) {
    return await api.post('/attendance/session', { courseId, date, topic, records });
  },

  async updateRecord(courseId, sessionId, studentId, status) {
    return await api.put(`/attendance/session/${sessionId}/record`, { studentId, status });
  },

  async markAllPresent(courseId, sessionId) {
    return await api.post(`/attendance/session/${sessionId}/mark-all`, {});
  },
};

// ============================================================================
// 7. Discussion Service
// ============================================================================
const discussionService = {
  getByCourse() {
    return [];
  },

  async fetchByCourse(courseId) {
    if (!courseId) return [];
    try {
      const data = await api.get(`/discussions/course/${courseId}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`discussionService.fetchByCourse(${courseId}) error:`, err);
      return [];
    }
  },

  async createThread(courseId, { title, content }) {
    return await api.post('/discussions', { courseId, title, content });
  },

  async updateThread(id, updates) {
    return await api.put(`/discussions/${id}`, updates);
  },

  async createReply(discussionId, content) {
    return await api.post(`/discussions/${discussionId}/replies`, { content });
  },

  async deleteThread(id) {
    return await api.delete(`/discussions/${id}`);
  },

  async deleteReply(replyId) {
    return await api.delete(`/discussions/replies/${replyId}`);
  },

  saveForCourse(courseId, threads) {
    return threads;
  },
};

// ============================================================================
// 8. Announcement Service
// ============================================================================
const announcementService = {
  getByCourse() {
    return [];
  },

  async fetchByCourse(courseId) {
    if (!courseId) return [];
    try {
      const data = await api.get(`/announcements/course/${courseId}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`announcementService.fetchByCourse(${courseId}) error:`, err);
      return [];
    }
  },

  async createAnnouncement(courseId, { title, message, content, pinned }) {
    const cleanMessage = message || content;
    return await api.post('/announcements', {
      courseId,
      title,
      message: cleanMessage,
      pinned: Boolean(pinned),
    });
  },

  async updateAnnouncement(id, updates) {
    return await api.put(`/announcements/${id}`, updates);
  },

  async deleteAnnouncement(id) {
    return await api.delete(`/announcements/${id}`);
  },

  saveForCourse(courseId, list) {
    return list;
  },
};

// ============================================================================
// 9. Notification Service
// ============================================================================
let notificationCache = [];

const notificationService = {
  getAll() {
    api
      .get('/notifications')
      .then((data) => {
        if (Array.isArray(data)) {
          notificationCache = data;
        }
      })
      .catch(() => {});
    return notificationCache;
  },

  async fetchAll() {
    try {
      const data = await api.get('/notifications');
      if (Array.isArray(data)) {
        notificationCache = data;
        return data;
      }
    } catch (err) {
      console.error('notificationService.fetchAll error:', err);
    }
    return notificationCache;
  },

  markAsRead(id) {
    notificationCache = notificationCache.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    );
    api.put(`/notifications/${id}/read`).catch(() => {});
    return [...notificationCache];
  },

  markAllAsRead() {
    notificationCache = notificationCache.map((n) => ({ ...n, isRead: true }));
    api.put('/notifications/read-all').catch(() => {});
    return [...notificationCache];
  },

  delete(id) {
    notificationCache = notificationCache.filter((n) => n.id !== id);
    api.delete(`/notifications/${id}`).catch(() => {});
    return [...notificationCache];
  },

  async create(notification) {
    const res = await api.post('/notifications/broadcast', notification);
    await this.fetchAll();
    return res;
  },
};

// ============================================================================
// 10. Grade Service
// ============================================================================
const gradeService = {
  getWeights() {
    return DEFAULT_GRADE_COMPONENTS;
  },

  async fetchWeights(courseId) {
    if (!courseId) return DEFAULT_GRADE_COMPONENTS;
    try {
      const data = await api.get(`/grades/course/${courseId}/components`);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.error('gradeService.fetchWeights error:', err);
    }
    return DEFAULT_GRADE_COMPONENTS;
  },

  async saveWeights(courseId, weights) {
    const res = await api.post(`/grades/course/${courseId}/components`, {
      components: weights,
    });
    return Array.isArray(res) ? res : weights;
  },

  async getStudentOverview() {
    try {
      const data = await api.get('/grades/student/overview');
      if (data && Array.isArray(data.courses)) return data;
    } catch (err) {
      console.error('gradeService.getStudentOverview error:', err);
    }
    return null;
  },

  async getCourseGradebook(courseId) {
    try {
      const data = await api.get(`/grades/course/${courseId}/roster`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('gradeService.getCourseGradebook error:', err);
      return [];
    }
  },
};

// ============================================================================
// 11. Admin & User Service
// ============================================================================
const adminService = {
  getUsers() {
    return [];
  },

  async fetchUsers(search = '', role = '') {
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (role && role !== 'all') query.set('role', role);
      const queryString = query.toString() ? `?${query.toString()}` : '';
      const data = await api.get(`/users${queryString}`);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('adminService.fetchUsers error:', err);
      return [];
    }
  },

  async getSystemStats() {
    try {
      const stats = await api.get('/users/stats');
      if (stats && stats.totalUsers !== undefined) return stats;
    } catch (err) {
      console.error('adminService.getSystemStats error:', err);
    }
    return {
      totalUsers: 0,
      totalCourses: 0,
      activeEnrollments: 0,
      totalAssignments: 0,
      totalQuizzes: 0,
      totalSubmissions: 0,
      status: 'healthy',
      uptime: '100%',
    };
  },

  async createUser(userData) {
    await api.post('/users', userData);
    return await this.fetchUsers();
  },

  async updateUser(id, updates) {
    await api.put(`/users/${id}`, updates);
    return await this.fetchUsers();
  },

  async deleteUser(id) {
    await api.delete(`/users/${id}`);
    return await this.fetchUsers();
  },
};

export {
  courseService,
  moduleService,
  progressService,
  assignmentService,
  quizService,
  attendanceService,
  discussionService,
  announcementService,
  notificationService,
  gradeService,
  adminService,
};
