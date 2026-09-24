import { api } from './api';

export const courseService = {
  getAll: (search = '') => api.get(`/courses${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  enroll: (id) => api.post(`/courses/${id}/enroll`, {}),
  unenroll: (id) => api.delete(`/courses/${id}/enroll`),
  getEnrolled: () => api.get('/courses/student/enrolled'),
  getCreated: () => api.get('/courses/faculty/created'),
  getRoster: (id) => api.get(`/courses/${id}/roster`),
};

export const moduleService = {
  createModule: (data) => api.post('/modules', data),
  updateModule: (id, data) => api.put(`/modules/${id}`, data),
  deleteModule: (id) => api.delete(`/modules/${id}`),

  createContent: (data) => api.post('/modules/content', data),
  updateContent: (id, data) => api.put(`/modules/content/${id}`, data),
  deleteContent: (id) => api.delete(`/modules/content/${id}`),

  // file: a File object from an <input type="file"> — returns { url, ... }
  // to pass as contentUrl into createContent/updateContent.
  uploadContentFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/modules/content/upload', formData);
  },
};

export const progressService = {
  markContent: (contentId, completed = true) =>
    api.put(`/progress/content/${contentId}`, { completed }),
  getCourseProgress: (courseId) => api.get(`/progress/course/${courseId}`),
};
