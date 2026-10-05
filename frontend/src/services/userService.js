import { api } from './api';

export const userService = {
  getProfile() {
    return api.get('/users/profile');
  },

  updateProfilePhoto(file) {
    const formData = new FormData();
    formData.append('file', file);
    return api.upload('/users/profile/photo', formData);
  },

  deleteProfilePhoto() {
    return api.delete('/users/profile/photo');
  },
};

export default userService;
