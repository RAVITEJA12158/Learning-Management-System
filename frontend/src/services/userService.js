import React from 'react';
import { api } from './api';

exports.userService = exports.default = void 0;
const userService = {
  async getProfile() {
    try {
      return await api.get('/users/profile');
    } catch {
      try {
        const raw = localStorage.getItem('lms_user');
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
  },
  async updateProfile(profileData) {
    try {
      return await api.put('/users/profile', profileData);
    } catch {
      try {
        const raw = localStorage.getItem('lms_user');
        const current = raw ? JSON.parse(raw) : {};
        const next = {
          ...current,
          ...profileData
        };
        localStorage.setItem('lms_user', JSON.stringify(next));
        return next;
      } catch {
        return profileData;
      }
    }
  },
  async updateProfilePhoto(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await api.upload('/users/profile/photo', formData);
    } catch {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return {
        profileImage: dataUrl
      };
    }
  },
  async deleteProfilePhoto() {
    try {
      return await api.delete('/users/profile/photo');
    } catch {
      return {
        profileImage: null
      };
    }
  }
};
var _default = userService;

export { userService };

export default _default;
