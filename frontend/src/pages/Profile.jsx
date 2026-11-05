import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Button from '../components/common/Button';
import SpotlightCard from '../components/common/SpotlightCard';

function Profile() {
  const {
    user,
    updateUser
  } = (0, useAuth)();
  const fileInputRef = (0, useRef)(null);
  const [uploading, setUploading] = (0, useState)(false);
  const [deleting, setDeleting] = (0, useState)(false);
  const [savingProfile, setSavingProfile] = (0, useState)(false);
  const [message, setMessage] = (0, useState)(null);
  const [formData, setFormData] = (0, useState)({
    name: user?.name || 'Sarah Jensen',
    username: user?.username || 'sarah_jensen',
    email: user?.email || 'sarah.jensen@university.edu',
    department: user?.department || 'Computer Science & Engineering',
    semester: user?.semester || 'Fall 2026',
    mobileNumber: user?.mobileNumber || '+1 (555) 234-8910',
    bio: user?.bio || 'Passionate about machine learning, distributed systems, and algorithmic problem solving.'
  });
  (0, useEffect)(() => {
    async function loadFreshProfile() {
      try {
        const freshUser = await userService.getProfile();
        if (freshUser && freshUser.id) {
          updateUser(freshUser);
        }
      } catch {
        // Silent fallback
      }
    }
    loadFreshProfile();
  }, []);
  (0, useEffect)(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        username: user.username || prev.username,
        email: user.email || prev.email,
        department: user.department || prev.department,
        semester: user.semester || prev.semester,
        mobileNumber: user.mobileNumber || prev.mobileNumber,
        bio: user.bio || prev.bio
      }));
    }
  }, [user]);
  const handleAvatarClick = () => {
    if (uploading || deleting) return;
    fileInputRef.current?.click();
  };
  const handleFileChange = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'Image file size must be less than 5MB.'
      });
      return;
    }
    setUploading(true);
    setMessage(null);
    try {
      const response = await userService.updateProfilePhoto(file);
      const newImageUrl = response.profileImage || response.user?.profileImage;
      updateUser({
        profileImage: newImageUrl
      });
      setMessage({
        type: 'success',
        text: 'Profile photo updated successfully!'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to upload image. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };
  const handleDeletePhoto = async () => {
    setDeleting(true);
    setMessage(null);
    try {
      await userService.deleteProfilePhoto();
      updateUser({
        profileImage: null
      });
      setMessage({
        type: 'success',
        text: 'Profile photo removed. Default initial avatar restored.'
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to remove profile photo.'
      });
    } finally {
      setDeleting(false);
    }
  };
  const handleSaveProfile = async e => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage(null);
    try {
      await userService.updateProfile(formData);
      updateUser(formData);
      setMessage({
        type: 'success',
        text: 'Account profile information saved successfully!'
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to save profile changes.'
      });
    } finally {
      setSavingProfile(false);
    }
  };
  const userInitial = formData.name ? formData.name.trim().charAt(0).toUpperCase() : 'U';
  const hasCustomPhoto = Boolean(user?.profileImage);
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-5 py-10 sm:px-8 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "User Profile & Academic Identity"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-slate-500 dark:text-gray-400 mt-1 transition-colors"
  }, "Manage your personal information, Cloudinary profile photo, and academic metadata")), message && /*#__PURE__*/React.createElement("div", {
    className: `mb-6 p-4 rounded-xl text-xs font-bold transition flex items-center justify-between gap-3 ${message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'}`
  }, /*#__PURE__*/React.createElement("span", null, message.text), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMessage(null),
    className: "text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Account Role"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-blue-600 dark:text-cyan-400 uppercase mt-1"
  }, user?.role || 'STUDENT')), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Department"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-slate-900 dark:text-white truncate mt-1"
  }, formData.department)), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Active Term"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white mt-1"
  }, formData.semester)), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, "Standing"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1"
  }, "Verified Active"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 shadow-xs dark:shadow-md dark:shadow-black/40 space-y-8 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative group shrink-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative p-[2.5px] rounded-full dark:bg-gradient-to-r dark:from-cyan-400 dark:via-blue-500 dark:to-purple-600 dark:animate-spin-ring"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: handleAvatarClick,
    title: "Click to change profile photo",
    className: "relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-2 border-slate-200 dark:border-transparent bg-slate-100 dark:bg-gray-950 cursor-pointer shadow-sm group-hover:border-cyan-400 transition duration-200"
  }, hasCustomPhoto ? /*#__PURE__*/React.createElement("img", {
    src: user.profileImage,
    alt: formData.name,
    className: "h-full w-full object-cover transition duration-200 group-hover:scale-105"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "h-full w-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-purple-600 text-white text-3xl sm:text-4xl font-black select-none"
  }, userInitial), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center select-none"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider"
  }, "Change Photo")))), /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: "image/png,image/jpeg,image/jpg,image/webp,image/gif",
    className: "hidden",
    onChange: handleFileChange
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate"
  }, formData.name), /*#__PURE__*/React.createElement("span", {
    className: "inline-block rounded-md bg-blue-50 dark:bg-purple-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider border border-blue-200/60 dark:border-purple-800/40"
  }, user?.role || 'Student')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1"
  }, formData.email), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex flex-wrap items-center gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    size: "sm",
    onClick: handleAvatarClick,
    disabled: uploading || deleting
  }, uploading ? 'Uploading…' : 'Upload Photo'), hasCustomPhoto && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: handleDeletePhoto,
    disabled: uploading || deleting,
    className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-rose-400 border border-red-200 dark:border-rose-800/60 hover:bg-red-50 dark:hover:bg-rose-950/40 transition cursor-pointer disabled:opacity-50"
  }, deleting ? 'Removing…' : 'Remove Photo')))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSaveProfile,
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
  }, "Personal & Academic Information"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: formData.name,
    onChange: e => setFormData({
      ...formData,
      name: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Email Address"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    value: formData.email,
    onChange: e => setFormData({
      ...formData,
      email: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Username"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.username,
    onChange: e => setFormData({
      ...formData,
      username: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Mobile Number"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.mobileNumber,
    onChange: e => setFormData({
      ...formData,
      mobileNumber: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Department / Major"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.department,
    onChange: e => setFormData({
      ...formData,
      department: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Current Semester"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: formData.semester,
    onChange: e => setFormData({
      ...formData,
      semester: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2"
  }, "Academic Bio & Research Interests"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: formData.bio,
    onChange: e => setFormData({
      ...formData,
      bio: e.target.value
    }),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3.5 text-sm font-medium text-slate-800 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex justify-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    disabled: savingProfile
  }, savingProfile ? 'Saving Changes…' : 'Save Profile Changes')))));
}
var _default = Profile;

export default _default;
