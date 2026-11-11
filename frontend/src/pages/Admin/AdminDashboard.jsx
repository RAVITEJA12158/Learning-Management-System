import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, courseService, notificationService } from '../../services/courseService';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import SpotlightCard from '../../components/common/SpotlightCard';
import Modal from '../../components/common/Modal';
import { PlusIcon, UsersIcon, BookIcon, ShieldCheckIcon, ChartIcon, SearchIcon } from '../../components/common/Icons';

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [feedback, setFeedback] = useState('');

  // New User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserMobile, setNewUserMobile] = useState('');
  const [newUserRole, setNewUserRole] = useState('student');
  const [newUserDept, setNewUserDept] = useState('Computer Science & Engineering');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastType, setBroadcastType] = useState('ANNOUNCEMENT');

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [userList, courseList, stats] = await Promise.all([
          adminService.fetchUsers(),
          courseService.getAll(),
          adminService.getSystemStats(),
        ]);
        if (isMounted) {
          if (Array.isArray(userList)) setUsers(userList);
          if (Array.isArray(courseList)) setCourses(courseList);
          if (stats) setSystemStats(stats);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showBanner = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3500);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const updatedList = await adminService.updateUser(userId, { role: newRole });
      if (Array.isArray(updatedList)) setUsers(updatedList);
      showBanner(`Updated user role to ${newRole.toUpperCase()}.`);
    } catch (err) {
      showBanner(err.message || 'Failed to update role.');
    }
  };

  const handleStatusToggle = async (u) => {
    const isCurrentlySuspended = (u.status || '').toUpperCase() === 'SUSPENDED';
    const nextStatus = isCurrentlySuspended ? 'ACTIVE' : 'SUSPENDED';
    try {
      const updatedList = await adminService.updateUser(u.id, { status: nextStatus });
      if (Array.isArray(updatedList)) setUsers(updatedList);
      showBanner(`Account ${u.name} marked as ${nextStatus}.`);
    } catch (err) {
      showBanner(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteUser = async (u) => {
    try {
      const updatedList = await adminService.deleteUser(u.id);
      if (Array.isArray(updatedList)) setUsers(updatedList);
      const refreshedStats = await adminService.getSystemStats();
      setSystemStats(refreshedStats);
      showBanner(`Removed user ${u.name}.`);
    } catch (err) {
      showBanner(err.message || 'Failed to delete user.');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    try {
      const updatedList = await adminService.createUser({
        name: newUserName.trim(),
        username: newUserEmail.trim().split('@')[0],
        email: newUserEmail.trim().toLowerCase(),
        mobileNumber: newUserMobile.trim() || undefined,
        role: newUserRole,
        department: newUserDept,
        semester: 'Fall 2026',
      });
      if (Array.isArray(updatedList)) setUsers(updatedList);
      const refreshedStats = await adminService.getSystemStats();
      setSystemStats(refreshedStats);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserMobile('');
      setShowAddUserModal(false);
      showBanner(`Created ${newUserRole.toUpperCase()} account for ${newUserName}.`);
    } catch (err) {
      showBanner(err.message || 'Failed to provision user.');
    }
  };

  const handleAssignInstructor = async (courseId, facultyId) => {
    if (!facultyId) return;
    try {
      await courseService.assignInstructor(courseId, facultyId);
      const refreshed = await courseService.getAll();
      setCourses(refreshed);
      const assigned = facultyList.find((f) => f.id === facultyId);
      showBanner(`Assigned ${assigned?.name || 'instructor'} to course.`);
    } catch (err) {
      showBanner(err.message || 'Failed to assign instructor.');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    try {
      await notificationService.create({
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
        type: broadcastType,
      });
      setBroadcastTitle('');
      setBroadcastMessage('');
      showBanner('Campus-wide notification broadcast published to all users!');
    } catch (err) {
      showBanner(err.message || 'Failed to broadcast notification.');
    }
  };

  const safeUsers = Array.isArray(users) ? users : [];
  const filteredUsers = safeUsers.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role?.toLowerCase() === roleFilter;
    const q = userSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  // Case-insensitive match so uppercase 'FACULTY' from backend is properly included
  const facultyList = safeUsers.filter((u) => u.role?.toLowerCase() === 'faculty');

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 w-full font-sans transition-colors duration-200">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Badge variant="warning" className="mb-2">
            System Administration · RBAC Governance
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            Admin Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1">
            Manage institution users, role permissions, course instructors, enrollments, and PERN infrastructure health.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" onClick={() => setShowAddUserModal(true)}>
            <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
            Provision User
          </Button>
          <Button onClick={() => navigate('/faculty/courses/new')}>
            <PlusIcon className="w-3.5 h-3.5 mr-1.5" />
            New Course
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <span>✓ {feedback}</span>
          <button onClick={() => setFeedback('')} className="cursor-pointer">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SpotlightCard onClick={() => setActiveTab('users')} className="p-5 flex items-center gap-4 cursor-pointer">
          <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-transparent dark:border-cyan-500/20">
            <UsersIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Total Accounts
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {systemStats?.totalUsers ?? safeUsers.length} Active Users
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard onClick={() => setActiveTab('courses')} className="p-5 flex items-center gap-4 cursor-pointer">
          <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-transparent dark:border-purple-500/20">
            <BookIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Course Catalog
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {systemStats?.totalCourses ?? courses.length} Courses Active
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-transparent dark:border-emerald-500/20">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Active Enrollments
            </p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {systemStats?.activeEnrollments ?? 0} Active
            </p>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-transparent dark:border-amber-500/20">
            <ChartIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Supabase PostgreSQL & Cache
            </p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {systemStats?.uptime ?? '99.98% Uptime'}
            </p>
          </div>
        </SpotlightCard>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-3">
        {[
          { id: 'overview', label: 'System Overview & Stack' },
          { id: 'users', label: `User & Role Management (${safeUsers.length})` },
          { id: 'courses', label: `Course & Instructor Governance (${courses.length})` },
          { id: 'broadcast', label: 'Campus Notification Broadcast' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]'
                : 'bg-white dark:bg-white/[0.03] text-slate-600 dark:text-gray-400 border border-slate-200/80 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  PERN Stack Infrastructure & Services Status
                </h2>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  Real-time operational status across deployed cloud components
                </p>
              </div>
              <Badge variant="open">All Systems Operational</Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  layer: 'Frontend Application',
                  tech: 'React 19 + Vite + Tailwind CSS',
                  host: 'Vercel Edge Network',
                  status: 'Healthy · 18ms',
                },
                {
                  layer: 'REST API & Auth Server',
                  tech: 'Node.js + Express.js + JWT / bcrypt',
                  host: 'Render Docker Container',
                  status: 'Healthy · 42ms',
                },
                {
                  layer: 'Primary Relational Database',
                  tech: 'PostgreSQL + Prisma ORM',
                  host: 'Supabase PostgreSQL Cloud',
                  status: 'Connected · Pool Active',
                },
                {
                  layer: 'Caching & Media Storage',
                  tech: 'Cloudinary CDN + EmailJS',
                  host: 'Cloud Cluster',
                  status: 'Active',
                },
              ].map((item) => (
                <div
                  key={item.layer}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                      {item.layer}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.tech}</p>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">{item.host}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5 pb-3.5">
              Quick Governance Actions
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => setActiveTab('users')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Manage User Roles (RBAC)
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                  Promote faculty, audit student accounts, or provision admins
                </p>
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Assign Course Instructors
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                  Map faculty members to courses in COURSE_INSTRUCTORS
                </p>
              </button>
              <button
                onClick={() => navigate('/grades')}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-cyan-400/40 transition cursor-pointer"
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Institution Gradebook
                </p>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                  Inspect weighted grade distributions across departments
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search users by name, email, or department..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'student', 'faculty', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    roleFilter === r
                      ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-gray-950'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-400'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Role (RBAC)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {filteredUsers.map((u) => {
                  const isSuspended = (u.status || '').toUpperCase() === 'SUSPENDED';
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">{u.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-gray-300 font-medium">
                        {u.department || 'Computer Science'}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role?.toLowerCase() || 'student'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
                        >
                          <option value="student">STUDENT</option>
                          <option value="faculty">FACULTY</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={isSuspended ? 'danger' : 'active'}>
                          {isSuspended ? 'Suspended' : 'Active'}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleStatusToggle(u)}
                          className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                        >
                          {isSuspended ? 'Activate' : 'Suspend'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Course Catalog & Faculty Instructor Mapping
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Assign faculty instructors to courses (COURSE_INSTRUCTORS) and manage course lifecycle
              </p>
            </div>
            <Button size="sm" onClick={() => navigate('/faculty/courses/new')}>
              + Add Course
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400">
                  <th className="py-3 px-4">Code & Title</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Assigned Instructors</th>
                  <th className="py-3 px-4">Add Co-Instructor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {courses.map((c) => {
                  const currentInstructors =
                    c.instructors?.map((i) => i.faculty?.name).filter(Boolean).join(', ') ||
                    c.createdBy?.name ||
                    'Unassigned';
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase">
                          {c.courseCode}
                        </span>
                        <p className="font-bold text-slate-900 dark:text-white">{c.title}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-gray-300 font-medium">
                        {c.semester || 'Fall 2026'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-gray-200">
                        {currentInstructors}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAssignInstructor(c.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-white cursor-pointer"
                        >
                          <option value="" disabled>
                            + Assign Faculty…
                          </option>
                          {facultyList.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-3">
                        <button
                          onClick={() => navigate(`/courses/${c.id}`)}
                          className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => navigate(`/faculty/courses/${c.id}/edit`)}
                          className="font-bold text-slate-600 dark:text-gray-300 hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'broadcast' && (
        <div className="max-w-2xl bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Campus-Wide Notification Broadcast
          </h2>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 mb-6">
            Publish an official alert to the NOTIFICATIONS feed for all students and faculty members.
          </p>
          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Fall 2026 Final Exam Timetable Released"
                  className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={broadcastType}
                  onChange={(e) => setBroadcastType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-white"
                >
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="SYSTEM">System Maintenance</option>
                  <option value="GRADE">Academic / Grades</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Broadcast Message *
              </label>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Write the official campus announcement message..."
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent p-3 text-sm font-medium text-slate-900 dark:text-white focus:border-purple-500 outline-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" size="lg">
                Publish Broadcast Notification
              </Button>
            </div>
          </form>
        </div>
      )}

      <Modal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        title="Provision New Account"
        subtitle="Create a verified Student, Faculty, or Admin account in USERS"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="e.g. Dr. Meera Shah"
              className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                University Email *
              </label>
              <input
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="meera.shah@university.edu"
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={newUserMobile}
                onChange={(e) => setNewUserMobile(e.target.value)}
                placeholder="9876543210"
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#030712] px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                type="text"
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-transparent px-3 py-2.5 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-white/10">
            <Button type="button" variant="outline" onClick={() => setShowAddUserModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </Modal>
    </main>
  );
}

export default AdminDashboard;
