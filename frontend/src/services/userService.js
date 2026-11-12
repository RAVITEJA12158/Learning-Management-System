import { api } from './api';

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
    return await api.put('/users/profile', profileData);
  },
  async updateProfilePhoto(file) {
    const formData = new FormData();
    formData.append('file', file);
    return await api.upload('/users/profile/photo', formData);
  },
  async deleteProfilePhoto() {
    return await api.delete('/users/profile/photo');
  },
  async changePassword(currentPassword, newPassword) {
    return await api.put('/users/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

export { userService };
export default userService;
