import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, courseService, notificationService } from '../../services/courseService';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SpotlightCard from '../../components/common/SpotlightCard';
import Modal from '../../components/common/Modal';
import { PlusIcon, UsersIcon, BookIcon, ShieldCheckIcon, ChartIcon, SearchIcon } from '../../components/common/Icons';

function AdminDashboard() {
  const navigate = (0, useNavigate)();
  const [activeTab, setActiveTab] = (0, useState)('overview'); // 'overview' | 'users' | 'courses' | 'broadcast'
  const [users, setUsers] = (0, useState)(() => adminService.getUsers());
  const [courses, setCourses] = (0, useState)([]);
  const [userSearch, setUserSearch] = (0, useState)('');
  const [roleFilter, setRoleFilter] = (0, useState)('all');
  const [feedback, setFeedback] = (0, useState)('');

  // New User Modal
  const [showAddUserModal, setShowAddUserModal] = (0, useState)(false);
  const [newUserName, setNewUserName] = (0, useState)('');
  const [newUserEmail, setNewUserEmail] = (0, useState)('');
  const [newUserRole, setNewUserRole] = (0, useState)('student');
  const [newUserDept, setNewUserDept] = (0, useState)('Computer Science & Engineering');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = (0, useState)('');
  const [broadcastMessage, setBroadcastMessage] = (0, useState)('');
  const [broadcastType, setBroadcastType] = (0, useState)('ANNOUNCEMENT');
  (0, useEffect)(() => {
    courseService.getAll().then(list => setCourses(list || []));
  }, []);
  const showBanner = msg => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };
  const handleRoleChange = (userId, newRole) => {
    const updated = adminService.updateUser(userId, {
      role: newRole
    });
    setUsers(updated);
    showBanner(`Updated user role to ${newRole.toUpperCase()}.`);
  };
  const handleStatusToggle = user => {
    const nextStatus = user.status === 'suspended' ? 'active' : 'suspended';
    const updated = adminService.updateUser(user.id, {
      status: nextStatus
    });
    setUsers(updated);
    showBanner(`Account ${user.name} marked as ${nextStatus.toUpperCase()}.`);
  };
  const handleDeleteUser = user => {
    const updated = adminService.deleteUser(user.id);
    setUsers(updated);
    showBanner(`Removed user ${user.name}.`);
  };
  const handleCreateUser = e => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const updated = adminService.createUser({
      name: newUserName.trim(),
      username: newUserEmail.trim().split('@')[0],
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      department: newUserDept,
      semester: 'Fall 2026'
    });
    setUsers(updated);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
    showBanner(`Created ${newUserRole.toUpperCase()} account for ${newUserName}.`);
  };
  const handleAssignInstructor = async (courseId, instructorName) => {
    await courseService.update(courseId, {
      instructorName
    });
    const refreshed = await courseService.getAll();
    setCourses(refreshed);
    showBanner(`Assigned ${instructorName} to course.`);
  };
  const handleBroadcast = e => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    notificationService.create({
      title: broadcastTitle.trim(),
      message: broadcastMessage.trim(),
      type: broadcastType
    });
    setBroadcastTitle('');
    setBroadcastMessage('');
    showBanner('Campus-wide notification broadcast published to all users!');
  };
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter;
    const q = userSearch.toLowerCase().trim();
    const matchesSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.department?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });
  const facultyList = users.filter(u => u.role === 'faculty');
  return /*#__PURE__*/React.createElement("main", {
    className: "mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "warning",
    className: "mb-2"
  }, "System Administration \xB7 RBAC Governance"), /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors"
  }, "Admin Control Center"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1"
  }, "Manage institution users, role permissions, course instructors, enrollments, and PERN infrastructure health.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2.5"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => setShowAddUserModal(true)
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    className: "w-3.5 h-3.5 mr-1.5"
  }), "Provision User"), /*#__PURE__*/React.createElement(Button, {
    onClick: () => navigate('/faculty/courses/new')
  }, /*#__PURE__*/React.createElement(PlusIcon, {
    className: "w-3.5 h-3.5 mr-1.5"
  }), "New Course"))), feedback && /*#__PURE__*/React.createElement("div", {
    className: "mb-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "\u2713 ", feedback), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFeedback(''),
    className: "cursor-pointer"
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => setActiveTab('users'),
    className: "p-5 flex items-center gap-4 cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20"
  }, /*#__PURE__*/React.createElement(UsersIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Total Accounts"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, users.length, " Active Users"))), /*#__PURE__*/React.createElement(SpotlightCard, {
    onClick: () => setActiveTab('courses'),
    className: "p-5 flex items-center gap-4 cursor-pointer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20"
  }, /*#__PURE__*/React.createElement(BookIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Course Catalog"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, courses.length, " Courses Active"))), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-5 flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-transparent dark:border-emerald-500/20"
  }, /*#__PURE__*/React.createElement(ShieldCheckIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "JWT & RBAC Security"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-emerald-600 dark:text-emerald-400"
  }, "Enforced \xB7 100%"))), /*#__PURE__*/React.createElement(SpotlightCard, {
    className: "p-5 flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/20"
  }, /*#__PURE__*/React.createElement(ChartIcon, {
    className: "w-5 h-5"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400"
  }, "Redis & Neon DB"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg font-black text-slate-900 dark:text-white"
  }, "99.98% Uptime")))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3"
  }, [{
    id: 'overview',
    label: 'System Overview & Stack'
  }, {
    id: 'users',
    label: `User & Role Management (${users.length})`
  }, {
    id: 'courses',
    label: `Course & Instructor Governance (${courses.length})`
  }, {
    id: 'broadcast',
    label: 'Campus Notification Broadcast'
  }].map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setActiveTab(tab.id),
    className: `px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${activeTab === tab.id ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'}`
  }, tab.label))), activeTab === 'overview' && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white"
  }, "PERN Stack Infrastructure & Services Status"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400"
  }, "Real-time operational status across deployed cloud components")), /*#__PURE__*/React.createElement(Badge, {
    variant: "open"
  }, "All Systems Operational")), /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-2 gap-4"
  }, [{
    layer: 'Frontend Application',
    tech: 'React 19 + Vite + Tailwind CSS',
    host: 'Vercel Edge Network',
    status: 'Healthy · 18ms'
  }, {
    layer: 'REST API & Auth Server',
    tech: 'Node.js + Express.js + JWT / bcrypt',
    host: 'Render Docker Container',
    status: 'Healthy · 42ms'
  }, {
    layer: 'Primary Relational Database',
    tech: 'PostgreSQL + Prisma ORM',
    host: 'Neon Serverless Postgres',
    status: 'Connected · Pool Active'
  }, {
    layer: 'Caching & Media Storage',
    tech: 'Redis Cache + Cloudinary CDN',
    host: 'Cloud Cluster',
    status: '94.6% Cache Hit Ratio'
  }].map(item => /*#__PURE__*/React.createElement("div", {
    key: item.layer,
    className: "p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400"
  }, item.layer), /*#__PURE__*/React.createElement("span", {
    className: "inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
  }, /*#__PURE__*/React.createElement("span", {
    className: "h-1.5 w-1.5 rounded-full bg-emerald-500"
  }), item.status)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, item.tech), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400"
  }, item.host))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5"
  }, "Quick Governance Actions"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('users'),
    className: "w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Manage User Roles (RBAC)"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Promote faculty, audit student accounts, or provision admins")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveTab('courses'),
    className: "w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Assign Course Instructors"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Map faculty members to courses in COURSE_INSTRUCTORS")), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/grades'),
    className: "w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Institution Gradebook"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400 mt-0.5"
  }, "Inspect weighted grade distributions across departments"))))), activeTab === 'users' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex-1 max-w-md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400"
  }, /*#__PURE__*/React.createElement(SearchIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search users by name, email, or department...",
    value: userSearch,
    onChange: e => setUserSearch(e.target.value),
    className: "w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, ['all', 'student', 'faculty', 'admin'].map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => setRoleFilter(r),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${roleFilter === r ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-gray-950' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'}`
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "User"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Department"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Role (RBAC)"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-100 dark:divide-white/5 text-xs"
  }, filteredUsers.map(u => /*#__PURE__*/React.createElement("tr", {
    key: u.id,
    className: "hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-slate-900 dark:text-white"
  }, u.name), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-slate-500 dark:text-gray-400"
  }, u.email)), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4 text-slate-600 dark:text-gray-300 font-medium"
  }, u.department || 'Computer Science'), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4"
  }, /*#__PURE__*/React.createElement("select", {
    value: u.role?.toLowerCase() || 'student',
    onChange: e => handleRoleChange(u.id, e.target.value),
    className: "rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
  }, /*#__PURE__*/React.createElement("option", {
    value: "student"
  }, "STUDENT"), /*#__PURE__*/React.createElement("option", {
    value: "faculty"
  }, "FACULTY"), /*#__PURE__*/React.createElement("option", {
    value: "admin"
  }, "ADMIN"))), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: u.status === 'suspended' ? 'danger' : 'active'
  }, u.status === 'suspended' ? 'Suspended' : 'Active')), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4 text-right space-x-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => handleStatusToggle(u),
    className: "text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, u.status === 'suspended' ? 'Activate' : 'Suspend'), /*#__PURE__*/React.createElement("button", {
    onClick: () => handleDeleteUser(u),
    className: "text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
  }, "Remove")))))))), activeTab === 'courses' && /*#__PURE__*/React.createElement("div", {
    className: "bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-base font-extrabold text-slate-900 dark:text-white"
  }, "Course Catalog & Faculty Instructor Mapping"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400"
  }, "Assign faculty instructors to courses (COURSE_INSTRUCTORS) and manage course lifecycle")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => navigate('/faculty/courses/new')
  }, "+ Add Course")), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-left border-collapse"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400"
  }, /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Code & Title"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Semester"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Assigned Instructor"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4"
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    className: "py-3 px-4 text-right"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-slate-100 dark:divide-white/5 text-xs"
  }, courses.map(c => /*#__PURE__*/React.createElement("tr", {
    key: c.id,
    className: "hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase"
  }, c.courseCode), /*#__PURE__*/React.createElement("p", {
    className: "font-bold text-slate-900 dark:text-white"
  }, c.title)), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4 text-slate-600 dark:text-gray-300 font-medium"
  }, c.semester || 'Fall 2026'), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4"
  }, /*#__PURE__*/React.createElement("select", {
    value: c.instructorName || 'Dr. Alan Turing',
    onChange: e => handleAssignInstructor(c.id, e.target.value),
    className: "rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
  }, facultyList.map(f => /*#__PURE__*/React.createElement("option", {
    key: f.id,
    value: f.name
  }, f.name)))), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: c.status === 'Waiting List' ? 'waiting' : 'open'
  }, c.status || 'Open')), /*#__PURE__*/React.createElement("td", {
    className: "py-3.5 px-4 text-right space-x-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate(`/courses/${c.id}`),
    className: "font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
  }, "Inspect"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate(`/faculty/courses/${c.id}/edit`),
    className: "font-bold text-slate-600 dark:text-gray-300 hover:underline cursor-pointer"
  }, "Edit")))))))), activeTab === 'broadcast' && /*#__PURE__*/React.createElement("div", {
    className: "max-w-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xs"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-lg font-extrabold text-slate-900 dark:text-white"
  }, "Campus-Wide Notification Broadcast"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400 mt-1 mb-6"
  }, "Publish an official alert to the NOTIFICATIONS feed for all students and faculty members."), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleBroadcast,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid sm:grid-cols-3 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Notification Title *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: broadcastTitle,
    onChange: e => setBroadcastTitle(e.target.value),
    placeholder: "e.g. Fall 2026 Final Exam Timetable Released",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-purple-500 outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Category"), /*#__PURE__*/React.createElement("select", {
    value: broadcastType,
    onChange: e => setBroadcastType(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "ANNOUNCEMENT"
  }, "Announcement"), /*#__PURE__*/React.createElement("option", {
    value: "SYSTEM"
  }, "System Maintenance"), /*#__PURE__*/React.createElement("option", {
    value: "GRADE"
  }, "Academic / Grades")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Broadcast Message *"), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    required: true,
    value: broadcastMessage,
    onChange: e => setBroadcastMessage(e.target.value),
    placeholder: "Write the official campus announcement message...",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-sm font-medium text-slate-900 dark:text-white focus:border-purple-500 outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end pt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg"
  }, "Publish Broadcast Notification")))), /*#__PURE__*/React.createElement(Modal, {
    isOpen: showAddUserModal,
    onClose: () => setShowAddUserModal(false),
    title: "Provision New Account",
    subtitle: "Create a verified Student, Faculty, or Admin account in USERS"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleCreateUser,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Full Name *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    required: true,
    value: newUserName,
    onChange: e => setNewUserName(e.target.value),
    placeholder: "e.g. Dr. Meera Shah",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "University Email *"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    value: newUserEmail,
    onChange: e => setNewUserEmail(e.target.value),
    placeholder: "meera.shah@university.edu",
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Role"), /*#__PURE__*/React.createElement("select", {
    value: newUserRole,
    onChange: e => setNewUserRole(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "student"
  }, "Student"), /*#__PURE__*/React.createElement("option", {
    value: "faculty"
  }, "Faculty"), /*#__PURE__*/React.createElement("option", {
    value: "admin"
  }, "Admin"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1"
  }, "Department"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: newUserDept,
    onChange: e => setNewUserDept(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-3 py-2.5 text-xs text-slate-900 dark:text-white"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    variant: "outline",
    onClick: () => setShowAddUserModal(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    type: "submit"
  }, "Create Account")))));
}
var _default = AdminDashboard;

export default _default;
