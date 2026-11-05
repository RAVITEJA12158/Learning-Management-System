import React from 'react';
import { api } from './api';
import { MOCK_STUDENT_COURSES, MOCK_CATALOG_COURSES, DEFAULT_MODULES_TEMPLATE, MOCK_ASSIGNMENTS_BY_COURSE, MOCK_ATTENDANCE_SESSIONS, MOCK_DISCUSSIONS, MOCK_ANNOUNCEMENTS, MOCK_NOTIFICATIONS, MOCK_USERS } from '../utils/mockData';
import { DEFAULT_GRADE_COMPONENTS } from '../utils/constants';

const STORAGE_KEYS = {
  COURSES: 'lms_store_courses_v2',
  ENROLLED_IDS: 'lms_store_enrolled_ids_v2',
  PROGRESS: 'lms_store_progress_v2',
  ASSIGNMENTS: 'lms_store_assignments_v2',
  QUIZZES: 'lms_store_quizzes_v2',
  ATTENDANCE: 'lms_store_attendance_v2',
  DISCUSSIONS: 'lms_store_discussions_v2',
  ANNOUNCEMENTS: 'lms_store_announcements_v2',
  NOTIFICATIONS: 'lms_store_notifications_v2',
  GRADE_WEIGHTS: 'lms_store_grade_weights_v2',
  USERS: 'lms_store_users_v2'
};
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}
function buildInitialCourses() {
  const map = new Map();
  [...MOCK_STUDENT_COURSES, ...MOCK_CATALOG_COURSES].forEach((c, idx) => {
    const clonedModules = DEFAULT_MODULES_TEMPLATE.map(m => ({
      ...m,
      id: `${c.id}-${m.id}`,
      courseId: c.id,
      content: m.content.map(cnt => ({
        ...cnt,
        id: `${c.id}-${cnt.id}`,
        moduleId: `${c.id}-${m.id}`
      }))
    }));
    map.set(c.id, {
      ...c,
      createdById: c.instructorId || 'user-faculty-1',
      createdBy: {
        id: c.instructorId || 'user-faculty-1',
        name: (c.instructorName || 'Dr. Alan Turing').replace(/^Dr\.\s+|^Prof\.\s+/i, ''),
        fullName: c.instructorName || 'Dr. Alan Turing',
        email: 'faculty@university.edu'
      },
      instructors: [{
        id: c.instructorId || 'user-faculty-1',
        name: c.instructorName || 'Dr. Alan Turing',
        email: 'alan.turing@university.edu',
        role: 'Lead Instructor'
      }],
      roster: [{
        id: 'enr-1',
        studentId: 'user-student-1',
        name: 'Sarah Jensen',
        email: 'sarah.jensen@university.edu',
        enrolledAt: '2026-08-25T10:00:00Z',
        status: 'active',
        progress: 85,
        grade: 92.4
      }, {
        id: 'enr-2',
        studentId: 'user-student-2',
        name: 'Arjun Rao',
        email: 'arjun.rao@university.edu',
        enrolledAt: '2026-08-26T11:30:00Z',
        status: 'active',
        progress: 78,
        grade: 88.5
      }, {
        id: 'enr-3',
        studentId: 'user-student-3',
        name: 'Ishita Nair',
        email: 'ishita.nair@university.edu',
        enrolledAt: '2026-08-27T09:15:00Z',
        status: 'active',
        progress: 91,
        grade: 94.0
      }, {
        id: 'enr-4',
        studentId: 'user-student-4',
        name: 'Alex Chen',
        email: 'alex.chen@university.edu',
        enrolledAt: '2026-08-28T14:20:00Z',
        status: idx % 3 === 0 ? 'dropped' : 'active',
        progress: 54,
        grade: 79.2
      }],
      modules: clonedModules
    });
  });
  return Array.from(map.values());
}
function getStoredCourses() {
  const existing = readStore(STORAGE_KEYS.COURSES, null);
  if (Array.isArray(existing) && existing.length > 0) return existing;
  const seeded = buildInitialCourses();
  writeStore(STORAGE_KEYS.COURSES, seeded);
  return seeded;
}
function getStoredEnrolledIds() {
  const existing = readStore(STORAGE_KEYS.ENROLLED_IDS, null);
  if (Array.isArray(existing)) return existing;
  const seeded = MOCK_STUDENT_COURSES.map(c => c.id);
  writeStore(STORAGE_KEYS.ENROLLED_IDS, seeded);
  return seeded;
}
function getStoredAssignments(courseId) {
  const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
  if (all[courseId]) return all[courseId];
  const seeded = MOCK_ASSIGNMENTS_BY_COURSE.default.map((a, idx) => ({
    ...a,
    id: `${courseId}-asm-${idx + 1}`,
    courseId
  }));
  all[courseId] = seeded;
  writeStore(STORAGE_KEYS.ASSIGNMENTS, all);
  return seeded;
}
function saveStoredAssignments(courseId, list) {
  const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
  all[courseId] = list;
  writeStore(STORAGE_KEYS.ASSIGNMENTS, all);
}
const courseService = {
  async getAll(search = '') {
    try {
      const data = await api.get(`/courses${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback to local store
    }
    const courses = getStoredCourses();
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(c => c.title?.toLowerCase().includes(q) || c.courseCode?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
  },
  async getById(id) {
    try {
      const data = await api.get(`/courses/${id}`);
      if (data && data.id) return data;
    } catch {
      // Fallback to local store
    }
    const courses = getStoredCourses();
    const found = courses.find(c => c.id === id);
    if (found) return found;
    return courses[0] || null;
  },
  async create(data) {
    try {
      const created = await api.post('/courses', data);
      if (created && created.id) return created;
    } catch {
      // Fallback to local store
    }
    const courses = getStoredCourses();
    const newId = `course-${Date.now()}`;
    const newCourse = {
      id: newId,
      title: data.title,
      courseCode: data.courseCode || 'CS101',
      description: data.description || '',
      semester: data.semester || 'Fall 2026',
      category: data.category || 'Computer Science',
      bannerUrl: data.bannerUrl || null,
      instructorName: data.instructorName || 'Dr. Alan Turing',
      status: 'Open',
      progress: 0,
      createdBy: {
        name: 'Alan Turing'
      },
      instructors: [{
        id: 'user-faculty-1',
        name: data.instructorName || 'Dr. Alan Turing',
        email: 'alan.turing@university.edu',
        role: 'Lead Instructor'
      }],
      roster: [],
      modules: DEFAULT_MODULES_TEMPLATE.map(m => ({
        ...m,
        id: `${newId}-${m.id}`,
        courseId: newId,
        content: m.content.map(cnt => ({
          ...cnt,
          id: `${newId}-${cnt.id}`,
          moduleId: `${newId}-${m.id}`
        }))
      }))
    };
    const next = [newCourse, ...courses];
    writeStore(STORAGE_KEYS.COURSES, next);
    return newCourse;
  },
  async update(id, data) {
    try {
      const updated = await api.put(`/courses/${id}`, data);
      if (updated && updated.id) return updated;
    } catch {
      // Fallback to local store
    }
    const courses = getStoredCourses();
    const next = courses.map(c => c.id === id ? {
      ...c,
      ...data
    } : c);
    writeStore(STORAGE_KEYS.COURSES, next);
    return next.find(c => c.id === id);
  },
  async delete(id) {
    try {
      await api.delete(`/courses/${id}`);
    } catch {
      // Fallback
    }
    const courses = getStoredCourses().filter(c => c.id !== id);
    writeStore(STORAGE_KEYS.COURSES, courses);
    return {
      success: true
    };
  },
  async enroll(id) {
    try {
      await api.post(`/courses/${id}/enroll`, {});
    } catch {
      // Fallback
    }
    const enrolledIds = getStoredEnrolledIds();
    if (!enrolledIds.includes(id)) {
      writeStore(STORAGE_KEYS.ENROLLED_IDS, [...enrolledIds, id]);
    }
    return {
      success: true
    };
  },
  async unenroll(id) {
    try {
      await api.delete(`/courses/${id}/enroll`);
    } catch {
      // Fallback
    }
    const enrolledIds = getStoredEnrolledIds().filter(item => item !== id);
    writeStore(STORAGE_KEYS.ENROLLED_IDS, enrolledIds);
    return {
      success: true
    };
  },
  async getEnrolled() {
    try {
      const data = await api.get('/courses/student/enrolled');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const enrolledIds = new Set(getStoredEnrolledIds());
    return courses.filter(c => enrolledIds.has(c.id));
  },
  async getCreated() {
    try {
      const data = await api.get('/courses/faculty/created');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    return courses.slice(0, 6);
  },
  async getRoster(id) {
    try {
      const data = await api.get(`/courses/${id}/roster`);
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback
    }
    const course = await this.getById(id);
    return course?.roster || [];
  },
  async assignInstructor(id, facultyUser) {
    try {
      await api.post(`/courses/${id}/instructors`, {
        facultyId: facultyUser.id || facultyUser
      });
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const next = courses.map(c => {
      if (c.id !== id) return c;
      const existing = c.instructors || [];
      const newInst = typeof facultyUser === 'object' ? facultyUser : {
        id: `inst-${Date.now()}`,
        name: facultyUser,
        email: 'faculty@university.edu',
        role: 'Co-Instructor'
      };
      return {
        ...c,
        instructors: [...existing.filter(i => i.email !== newInst.email), newInst]
      };
    });
    writeStore(STORAGE_KEYS.COURSES, next);
    return next.find(c => c.id === id)?.instructors || [];
  },
  async removeInstructor(id, facultyId) {
    try {
      await api.delete(`/courses/${id}/instructors/${facultyId}`);
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const next = courses.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        instructors: (c.instructors || []).filter(i => i.id !== facultyId)
      };
    });
    writeStore(STORAGE_KEYS.COURSES, next);
    return {
      success: true
    };
  },
  async updateRosterStatus(courseId, studentId, status) {
    const courses = getStoredCourses();
    const next = courses.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        roster: (c.roster || []).map(r => r.studentId === studentId || r.id === studentId ? {
          ...r,
          status
        } : r)
      };
    });
    writeStore(STORAGE_KEYS.COURSES, next);
    return next.find(c => c.id === courseId)?.roster || [];
  }
};
const moduleService = {
  async createModule(data) {
    try {
      const res = await api.post('/modules', data);
      if (res && res.id) return res;
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const newMod = {
      id: `mod-${Date.now()}`,
      courseId: data.courseId,
      title: data.title,
      description: data.description || '',
      position: data.position || 1,
      isPublished: data.isPublished !== false,
      releaseAt: data.releaseAt || new Date().toISOString(),
      content: []
    };
    const next = courses.map(c => c.id === data.courseId ? {
      ...c,
      modules: [...(c.modules || []), newMod]
    } : c);
    writeStore(STORAGE_KEYS.COURSES, next);
    return newMod;
  },
  async updateModule(id, data) {
    try {
      const res = await api.put(`/modules/${id}`, data);
      if (res && res.id) return res;
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const next = courses.map(c => ({
      ...c,
      modules: (c.modules || []).map(m => m.id === id ? {
        ...m,
        ...data
      } : m).sort((a, b) => (a.position || 0) - (b.position || 0))
    }));
    writeStore(STORAGE_KEYS.COURSES, next);
    return {
      id,
      ...data
    };
  },
  async deleteModule(id) {
    try {
      await api.delete(`/modules/${id}`);
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const next = courses.map(c => ({
      ...c,
      modules: (c.modules || []).filter(m => m.id !== id)
    }));
    writeStore(STORAGE_KEYS.COURSES, next);
    return {
      success: true
    };
  },
  async createContent(data) {
    try {
      const res = await api.post('/modules/content', data);
      if (res && res.id) return res;
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const newItem = {
      id: `cnt-${Date.now()}`,
      moduleId: data.moduleId,
      title: data.title,
      type: data.type || 'PDF',
      description: data.description || '',
      contentUrl: data.contentUrl || '',
      isPublished: data.isPublished !== false,
      position: data.position || 1,
      createdAt: new Date().toISOString()
    };
    const next = courses.map(c => ({
      ...c,
      modules: (c.modules || []).map(m => m.id === data.moduleId ? {
        ...m,
        content: [...(m.content || []), newItem]
      } : m)
    }));
    writeStore(STORAGE_KEYS.COURSES, next);
    return newItem;
  },
  async updateContent(id, data) {
    try {
      const res = await api.put(`/modules/content/${id}`, data);
      if (res && res.id) return res;
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const next = courses.map(c => ({
      ...c,
      modules: (c.modules || []).map(m => ({
        ...m,
        content: (m.content || []).map(item => item.id === id ? {
          ...item,
          ...data
        } : item)
      }))
    }));
    writeStore(STORAGE_KEYS.COURSES, next);
    return {
      id,
      ...data
    };
  },
  async deleteContent(id) {
    try {
      await api.delete(`/modules/content/${id}`);
    } catch {
      // Fallback
    }
    const courses = getStoredCourses();
    const next = courses.map(c => ({
      ...c,
      modules: (c.modules || []).map(m => ({
        ...m,
        content: (m.content || []).filter(item => item.id !== id)
      }))
    }));
    writeStore(STORAGE_KEYS.COURSES, next);
    return {
      success: true
    };
  },
  async uploadContentFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.upload('/modules/content/upload', formData);
      if (res && res.url) return res;
    } catch {
      // Fallback to local object URL
    }
    const url = typeof URL !== 'undefined' && file ? URL.createObjectURL(file) : 'https://example.com/uploaded-resource';
    return {
      url,
      fileName: file?.name || 'uploaded-file'
    };
  }
};
const progressService = {
  async markContent(contentId, completed = true) {
    try {
      await api.put(`/progress/content/${contentId}`, {
        completed
      });
    } catch {
      // Fallback
    }
    const map = readStore(STORAGE_KEYS.PROGRESS, {});
    map[contentId] = Boolean(completed);
    writeStore(STORAGE_KEYS.PROGRESS, map);
    return {
      contentId,
      completed
    };
  },
  async getCourseProgress(courseId) {
    try {
      const res = await api.get(`/progress/course/${courseId}`);
      if (res && Array.isArray(res.modules)) return res;
    } catch {
      // Fallback
    }
    const course = await courseService.getById(courseId);
    const savedMap = readStore(STORAGE_KEYS.PROGRESS, {});
    const modules = (course?.modules || []).map(mod => ({
      moduleId: mod.id,
      content: (mod.content || []).map((item, idx) => {
        const isComp = savedMap[item.id] !== undefined ? savedMap[item.id] : idx === 0;
        savedMap[item.id] = isComp;
        return {
          contentId: item.id,
          completed: isComp
        };
      })
    }));
    writeStore(STORAGE_KEYS.PROGRESS, savedMap);
    const allItems = modules.flatMap(m => m.content);
    const completedCount = allItems.filter(i => i.completed).length;
    const completionPercent = allItems.length > 0 ? Math.round(completedCount / allItems.length * 100) : 0;
    return {
      courseId,
      completionPercent,
      modules
    };
  }
};
const assignmentService = {
  async getByCourse(courseId) {
    try {
      const data = await api.get(`/assignments/course/${courseId}`);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch {
      // Fallback
    }
    return getStoredAssignments(courseId);
  },
  async getById(id) {
    try {
      return await api.get(`/assignments/${id}`);
    } catch {
      const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
      for (const list of Object.values(all)) {
        const found = list.find(a => a.id === id);
        if (found) return found;
      }
      return null;
    }
  },
  async create(data) {
    try {
      const created = await api.post('/assignments', data);
      if (created && created.id) return created;
    } catch {
      // Fallback
    }
    const list = getStoredAssignments(data.courseId);
    const newAsm = {
      id: `${data.courseId}-asm-${Date.now()}`,
      courseId: data.courseId,
      title: data.title,
      description: data.description || '',
      maxMarks: Number(data.maxMarks) || 100,
      dueDate: data.dueDate,
      allowLateSubmission: Boolean(data.allowLateSubmission),
      _count: {
        submissions: 0
      },
      submissions: []
    };
    const next = [newAsm, ...list];
    saveStoredAssignments(data.courseId, next);
    return newAsm;
  },
  async update(id, data) {
    try {
      return await api.put(`/assignments/${id}`, data);
    } catch {
      const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
      for (const [cId, list] of Object.entries(all)) {
        if (list.some(a => a.id === id)) {
          all[cId] = list.map(a => a.id === id ? {
            ...a,
            ...data
          } : a);
          writeStore(STORAGE_KEYS.ASSIGNMENTS, all);
          return all[cId].find(a => a.id === id);
        }
      }
      return data;
    }
  },
  async delete(id) {
    try {
      await api.delete(`/assignments/${id}`);
    } catch {
      // Fallback
    }
    const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
    for (const [cId, list] of Object.entries(all)) {
      all[cId] = list.filter(a => a.id !== id);
    }
    writeStore(STORAGE_KEYS.ASSIGNMENTS, all);
    return {
      success: true
    };
  },
  async submit(id, formDataOrPayload) {
    try {
      if (typeof FormData !== 'undefined' && formDataOrPayload instanceof FormData) {
        return await api.upload(`/assignments/${id}/submit`, formDataOrPayload);
      }
      return await api.post(`/assignments/${id}/submit`, formDataOrPayload);
    } catch {
      // Fallback local submission
    }
    let fileUrl = 'https://example.com/student-submission.pdf';
    if (typeof FormData !== 'undefined' && formDataOrPayload instanceof FormData) {
      const f = formDataOrPayload.get('file');
      if (f && typeof URL !== 'undefined') {
        fileUrl = URL.createObjectURL(f);
      }
    } else if (formDataOrPayload?.fileUrl) {
      fileUrl = formDataOrPayload.fileUrl;
    }
    const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
    for (const [cId, list] of Object.entries(all)) {
      const target = list.find(a => a.id === id);
      if (target) {
        const isLate = new Date() > new Date(target.dueDate);
        const newSub = {
          id: `sub-${Date.now()}`,
          assignmentId: id,
          studentId: 'user-student-1',
          student: {
            name: 'Sarah Jensen',
            email: 'sarah.jensen@university.edu'
          },
          fileUrl,
          submittedAt: new Date().toISOString(),
          status: isLate ? 'LATE' : 'SUBMITTED',
          marks: null,
          feedback: ''
        };
        const filteredSubs = (target.submissions || []).filter(s => s.studentId !== 'user-student-1');
        const updatedSubs = [newSub, ...filteredSubs];
        all[cId] = list.map(a => a.id === id ? {
          ...a,
          submissions: updatedSubs,
          _count: {
            submissions: updatedSubs.length
          }
        } : a);
        writeStore(STORAGE_KEYS.ASSIGNMENTS, all);
        return newSub;
      }
    }
    return {
      id: `sub-${Date.now()}`,
      status: 'SUBMITTED',
      fileUrl
    };
  },
  async getSubmissions(id) {
    try {
      const data = await api.get(`/assignments/${id}/submissions`);
      if (Array.isArray(data)) return data;
    } catch {
      // Fallback
    }
    const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
    for (const list of Object.values(all)) {
      const found = list.find(a => a.id === id);
      if (found) return found.submissions || [];
    }
    return MOCK_ASSIGNMENTS_BY_COURSE.default[0].submissions;
  },
  async gradeSubmission(submissionId, data) {
    try {
      return await api.put(`/assignments/submissions/${submissionId}/grade`, data);
    } catch {
      // Fallback
    }
    const all = readStore(STORAGE_KEYS.ASSIGNMENTS, {});
    for (const [cId, list] of Object.entries(all)) {
      all[cId] = list.map(a => ({
        ...a,
        submissions: (a.submissions || []).map(s => s.id === submissionId ? {
          ...s,
          marks: Number(data.marks),
          feedback: data.feedback || '',
          gradedAt: new Date().toISOString()
        } : s)
      }));
    }
    writeStore(STORAGE_KEYS.ASSIGNMENTS, all);
    return {
      id: submissionId,
      ...data
    };
  }
};
const attendanceService = {
  getSessions(courseId = 'mock-1') {
    const all = readStore(STORAGE_KEYS.ATTENDANCE, {});
    if (all[courseId]) return all[courseId];
    const seeded = MOCK_ATTENDANCE_SESSIONS.map(s => ({
      ...s,
      id: `${courseId}-${s.id}`,
      courseId
    }));
    all[courseId] = seeded;
    writeStore(STORAGE_KEYS.ATTENDANCE, all);
    return seeded;
  },
  createSession(courseId, {
    date,
    topic,
    createdBy,
    records
  }) {
    const current = this.getSessions(courseId);
    const newSession = {
      id: `att-${Date.now()}`,
      courseId,
      date: date || new Date().toISOString().slice(0, 10),
      topic: topic || 'Course Lecture Session',
      createdBy: createdBy || 'Dr. Alan Turing',
      records: records || MOCK_ATTENDANCE_SESSIONS[0].records.map(r => ({
        ...r,
        id: `rec-${Date.now()}-${r.studentId}`,
        status: 'PRESENT'
      }))
    };
    const all = readStore(STORAGE_KEYS.ATTENDANCE, {});
    all[courseId] = [newSession, ...current];
    writeStore(STORAGE_KEYS.ATTENDANCE, all);
    return newSession;
  },
  updateRecord(courseId, sessionId, studentId, status) {
    const current = this.getSessions(courseId);
    const next = current.map(s => {
      if (s.id !== sessionId) return s;
      return {
        ...s,
        records: s.records.map(r => r.studentId === studentId ? {
          ...r,
          status
        } : r)
      };
    });
    const all = readStore(STORAGE_KEYS.ATTENDANCE, {});
    all[courseId] = next;
    writeStore(STORAGE_KEYS.ATTENDANCE, all);
    return next;
  }
};
const discussionService = {
  getByCourse(courseId = 'mock-1') {
    const all = readStore(STORAGE_KEYS.DISCUSSIONS, {});
    if (all[courseId]) return all[courseId];
    all[courseId] = MOCK_DISCUSSIONS.map(d => ({
      ...d,
      courseId
    }));
    writeStore(STORAGE_KEYS.DISCUSSIONS, all);
    return all[courseId];
  },
  saveForCourse(courseId, threads) {
    const all = readStore(STORAGE_KEYS.DISCUSSIONS, {});
    all[courseId] = threads;
    writeStore(STORAGE_KEYS.DISCUSSIONS, all);
    return threads;
  }
};
const announcementService = {
  getByCourse(courseId = 'mock-1') {
    const all = readStore(STORAGE_KEYS.ANNOUNCEMENTS, {});
    if (all[courseId]) return all[courseId];
    all[courseId] = MOCK_ANNOUNCEMENTS.map(a => ({
      ...a,
      courseId
    }));
    writeStore(STORAGE_KEYS.ANNOUNCEMENTS, all);
    return all[courseId];
  },
  saveForCourse(courseId, list) {
    const all = readStore(STORAGE_KEYS.ANNOUNCEMENTS, {});
    all[courseId] = list;
    writeStore(STORAGE_KEYS.ANNOUNCEMENTS, all);
    return list;
  }
};
const notificationService = {
  getAll() {
    return readStore(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
  },
  markAsRead(id) {
    const list = this.getAll().map(n => n.id === id ? {
      ...n,
      isRead: true
    } : n);
    writeStore(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },
  markAllAsRead() {
    const list = this.getAll().map(n => ({
      ...n,
      isRead: true
    }));
    writeStore(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },
  delete(id) {
    const list = this.getAll().filter(n => n.id !== id);
    writeStore(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  },
  create(notification) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: 'Just now',
      ...notification
    };
    const list = [newNotif, ...this.getAll()];
    writeStore(STORAGE_KEYS.NOTIFICATIONS, list);
    return list;
  }
};
const gradeService = {
  getWeights(courseId = 'mock-1') {
    const all = readStore(STORAGE_KEYS.GRADE_WEIGHTS, {});
    return all[courseId] || DEFAULT_GRADE_COMPONENTS;
  },
  saveWeights(courseId, weights) {
    const all = readStore(STORAGE_KEYS.GRADE_WEIGHTS, {});
    all[courseId] = weights;
    writeStore(STORAGE_KEYS.GRADE_WEIGHTS, all);
    return weights;
  }
};
const adminService = {
  getUsers() {
    return readStore(STORAGE_KEYS.USERS, MOCK_USERS);
  },
  saveUsers(users) {
    writeStore(STORAGE_KEYS.USERS, users);
    return users;
  },
  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: `user-${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...userData
    };
    const next = [newUser, ...users];
    return this.saveUsers(next);
  },
  updateUser(id, updates) {
    const next = this.getUsers().map(u => u.id === id ? {
      ...u,
      ...updates
    } : u);
    return this.saveUsers(next);
  },
  deleteUser(id) {
    const next = this.getUsers().filter(u => u.id !== id);
    return this.saveUsers(next);
  }
};

export { courseService, moduleService, progressService, assignmentService, attendanceService, discussionService, announcementService, notificationService, gradeService, adminService };
