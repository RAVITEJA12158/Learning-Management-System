import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SpotlightCard from '../../components/common/SpotlightCard';
import Modal from '../../components/common/Modal';

const roles = [{
  id: 'student',
  roleId: 1,
  label: 'Student',
  description: 'Learn & manage courses',
  letter: 'S'
}, {
  id: 'faculty',
  roleId: 2,
  label: 'Faculty',
  description: 'Teach & assess',
  letter: 'F'
}, {
  id: 'admin',
  roleId: 3,
  label: 'Admin',
  description: 'Manage institution',
  letter: 'A'
}];
const barData = [{
  height: 28,
  color: 'bg-cyan-500/80 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
}, {
  height: 52,
  color: 'bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.4)]'
}, {
  height: 38,
  color: 'bg-indigo-500/80 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
}, {
  height: 80,
  color: 'bg-purple-500/80 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
}, {
  height: 58,
  color: 'bg-gradient-to-t from-cyan-400 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
}];
function Login() {
  const navigate = (0, useNavigate)();
  const {
    login
  } = (0, useAuth)();
  const [selectedRole, setSelectedRole] = (0, useState)(roles[0]);
  const [email, setEmail] = (0, useState)('');
  const [password, setPassword] = (0, useState)('');
  const [secretCode, setSecretCode] = (0, useState)('');
  const [showPassword, setShowPassword] = (0, useState)(false);
  const [errors, setErrors] = (0, useState)({});
  const [message, setMessage] = (0, useState)('');
  const [loading, setLoading] = (0, useState)(false);

  // Password Recovery Modal
  const [showRecoveryModal, setShowRecoveryModal] = (0, useState)(false);
  const [recoveryEmail, setRecoveryEmail] = (0, useState)('');
  const [recoverySent, setRecoverySent] = (0, useState)(false);

  // Animated Data Visualization States
  const [progress, setProgress] = (0, useState)(0);
  const [count, setCount] = (0, useState)(0);
  const [barsVisible, setBarsVisible] = (0, useState)(false);
  (0, useEffect)(() => {
    const timer = setTimeout(() => {
      setProgress(74);
      setBarsVisible(true);
      const duration = 1500;
      const startTime = performance.now();
      const animateCounter = currentTime => {
        const elapsed = currentTime - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progressRatio, 3);
        setCount(Math.round(easeOut * 74));
        if (progressRatio < 1) {
          requestAnimationFrame(animateCounter);
        }
      };
      requestAnimationFrame(animateCounter);
    }, 180);
    return () => clearTimeout(timer);
  }, []);
  const handleQuickDemoLogin = async roleId => {
    const demoCredentials = {
      student: {
        email: 'sarah.jensen@university.edu',
        password: 'Student123!',
      },
      faculty: {
        email: 'alan.turing@university.edu',
        password: 'Faculty123!',
      },
      admin: {
        email: 'admin@university.edu',
        password: 'Admin123!',
        secretCode: 'admin@lms',
      },
    };

    const creds = demoCredentials[roleId] || demoCredentials.student;
    setLoading(true);
    setMessage('');
    try {
      const response = await authApi.login(creds);
      login({
        token: response.token,
        user: {
          id: response.userId,
          name: response.name,
          username: response.username,
          role: response.role.toLowerCase(),
          department: response.department,
          semester: response.semester,
          bio: response.bio,
          profileImage: response.profileImage,
        },
      });
      navigate(roleId === 'student' ? '/student' : `/${roleId}`);
    } catch (err) {
      console.warn('Backend login fallback to demo mock mode:', err.message);
      const demoProfiles = {
        student: {
          id: 'e0000000-0000-4000-8000-000000000001',
          name: 'Sarah Jensen',
          username: 'sarah_jensen',
          email: 'sarah.jensen@university.edu',
          role: 'student',
          department: 'Computer Science & Engineering',
          semester: 'Fall 2026',
        },
        faculty: {
          id: 'f0000000-0000-4000-8000-000000000001',
          name: 'Dr. Alan Turing',
          username: 'alan_turing',
          email: 'alan.turing@university.edu',
          role: 'faculty',
          department: 'Computer Science & AI',
          semester: 'Fall 2026',
        },
        admin: {
          id: 'a0000000-0000-4000-8000-000000000001',
          name: 'Dean Robert Vance',
          username: 'admin_vance',
          email: 'admin@university.edu',
          role: 'admin',
          department: 'Academic Administration',
          semester: 'Fall 2026',
        },
      };
      const profile = demoProfiles[roleId] || demoProfiles.student;
      login({
        token: `jwt-demo-${roleId}-${Date.now()}`,
        user: profile,
      });
      navigate(roleId === 'student' ? '/student' : `/${roleId}`);
    } finally {
      setLoading(false);
    }
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    setMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Enter a valid academic email address';
    }
    if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    if (selectedRole.id === 'admin' && !secretCode.trim()) {
      nextErrors.secretCode = 'Administrator access code is required';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login({
        email: email.trim(),
        password,
        role: selectedRole.id,
        ...(selectedRole.id === 'admin' ? {
          secretCode: secretCode.trim()
        } : {})
      });
      const returnedRole = (data.role || selectedRole.id).toLowerCase();
      if (returnedRole && returnedRole !== selectedRole.id) {
        setMessage(`This account belongs to the ${roleName(data.role)} workspace. Select that role to continue.`);
        return;
      }
      const user = {
        id: data.userId || `user-${returnedRole}-1`,
        name: data.name || data.username || 'Scholar',
        email: email.trim(),
        role: returnedRole || selectedRole.id,
        department: data.department,
        semester: data.semester,
        bio: data.bio,
        profileImage: data.profileImage,
      };
      login({
        token: data.token,
        user
      });
      navigate(returnedRole === 'student' ? '/student' : `/${returnedRole}`);
    } catch (error) {
      setMessage(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }
  const selectedIndex = roles.findIndex(r => r.id === selectedRole.id);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen overflow-x-hidden bg-[#f8fafc] dark:bg-[#030712] transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "animate-panel-left relative hidden flex-col justify-between overflow-hidden bg-[#030712] p-8 xl:p-12 text-white lg:flex border-r border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px]"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/'),
    className: "flex w-fit items-center gap-3 transition-opacity duration-200 hover:opacity-90 relative z-10 cursor-pointer"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    darkBg: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold tracking-tight text-white"
  }, "CourseHub")), /*#__PURE__*/React.createElement("div", {
    className: "max-w-lg py-4 relative z-10"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "animate-heading text-5xl font-extrabold leading-[1.08] tracking-tight text-white xl:text-[54px]"
  }, "Your learning", /*#__PURE__*/React.createElement("br", null), "space is", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
  }, "waiting.")), /*#__PURE__*/React.createElement("p", {
    className: "animate-subtext mt-5 max-w-sm text-[15px] leading-relaxed text-gray-400"
  }, "Sign in to return to your courses, assignments, progress, and academic community."), /*#__PURE__*/React.createElement(SpotlightCard, {
    alwaysDark: true,
    className: "mt-9 w-full max-w-[390px] p-5 shadow-2xl transition-all duration-300"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-400"
  }, "WEEKLY PROGRESS"), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex items-center justify-between gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex h-[70px] w-[70px] items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "h-full w-full -rotate-90 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
    viewBox: "0 0 76 76"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "loginGaugeGradient",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#22d3ee"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: "#3b82f6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#a855f7"
  }))), /*#__PURE__*/React.createElement("circle", {
    cx: "38",
    cy: "38",
    r: "30",
    fill: "transparent",
    stroke: "rgba(255, 255, 255, 0.08)",
    strokeWidth: "5.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "38",
    cy: "38",
    r: "30",
    fill: "transparent",
    stroke: "url(#loginGaugeGradient)",
    strokeWidth: "5.5",
    strokeDasharray: "188.5",
    strokeDashoffset: 188.5 * (1 - progress / 100),
    strokeLinecap: "round",
    style: {
      transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "absolute text-xl font-black tracking-tight text-white"
  }, count, "%")), /*#__PURE__*/React.createElement("span", {
    className: "mt-1.5 text-[11px] font-medium text-gray-400"
  }, "This week")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-1 flex-col items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex h-12 w-full items-end justify-end gap-2.5"
  }, barData.map((bar, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: `w-8 rounded-t-sm ${bar.color}`,
    style: {
      height: barsVisible ? `${bar.height}%` : '0%',
      transitionProperty: 'height',
      transitionDuration: '750ms',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      transitionDelay: `${index * 130}ms`
    }
  }))), /*#__PURE__*/React.createElement("span", {
    className: "mt-2 text-[11px] font-medium text-gray-400"
  }, "Goal completion"))))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-500 relative z-10 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
  }), "Secure access for your academic community.")), /*#__PURE__*/React.createElement("main", {
    className: "animate-panel-right flex min-h-screen items-center justify-center bg-[#f8fafc] dark:bg-[#030712] px-4 py-8 sm:px-8 lg:px-12 transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-[460px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-6 lg:hidden"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/'),
    className: "flex items-center gap-3 cursor-pointer"
  }, /*#__PURE__*/React.createElement(BrandMark, {
    darkBg: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold text-slate-900 dark:text-white"
  }, "CourseHub"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-cyan-400"
  }, "SIGN IN"), /*#__PURE__*/React.createElement("h2", {
    className: "animate-heading mt-1.5 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl"
  }, "Welcome back."), /*#__PURE__*/React.createElement("p", {
    className: "animate-subtext mt-2 text-sm text-slate-500 dark:text-gray-400"
  }, "Choose your workspace and continue where you left off.")), /*#__PURE__*/React.createElement("div", {
    className: "animate-card-bloom mt-6 rounded-[24px] border border-slate-200/80 dark:border-white/10 bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl p-6 sm:p-7 shadow-xs dark:shadow-2xl dark:shadow-black/50 transition-colors"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-2.5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
  }, "SELECT WORKSPACE"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-semibold tracking-wider text-slate-400 dark:text-gray-500"
  }, "STEP 01")), /*#__PURE__*/React.createElement("div", {
    className: "relative grid grid-cols-3 gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pointer-events-none absolute inset-y-0 rounded-2xl bg-[#48566a] dark:bg-cyan-500/20 dark:border dark:border-cyan-500/40 shadow-sm transition-transform duration-300 ease-out",
    style: {
      width: 'calc((100% - 20px) / 3)',
      transform: `translateX(calc(${selectedIndex} * (100% + 10px)))`
    }
  }), roles.map(role => {
    const isSelected = selectedRole.id === role.id;
    return /*#__PURE__*/React.createElement("button", {
      key: role.id,
      type: "button",
      onClick: () => {
        setSelectedRole(role);
        setErrors({});
        setMessage('');
      },
      className: `relative z-10 rounded-2xl p-3.5 text-left transition-colors duration-200 cursor-pointer ${isSelected ? 'text-white' : 'bg-[#f0f3f6] dark:bg-white/5 text-slate-800 dark:text-gray-300 hover:bg-[#e7ecf1] dark:hover:bg-white/10'}`,
      style: {
        backgroundColor: isSelected ? 'transparent' : undefined
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: `flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${isSelected ? 'bg-[#283444] dark:bg-cyan-500 text-white' : 'bg-[#dce2e8] dark:bg-white/10 text-slate-500 dark:text-gray-400'}`
    }, role.letter), /*#__PURE__*/React.createElement("span", {
      className: `mt-2.5 block text-xs font-bold transition-colors duration-200 ${isSelected ? 'text-white' : 'text-slate-800 dark:text-gray-200'}`
    }, role.label), /*#__PURE__*/React.createElement("span", {
      className: `mt-0.5 block text-[9px] leading-tight transition-colors duration-200 sm:text-[10px] ${isSelected ? 'text-slate-300 dark:text-gray-300' : 'text-slate-400 dark:text-gray-500'}`
    }, role.description));
  }))), message && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-3 text-xs font-medium text-rose-700 dark:text-rose-400"
  }, message), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "mt-5 space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
  }, "ACADEMIC EMAIL"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "sarah.jensen@university.edu",
    value: email,
    onChange: e => setEmail(e.target.value),
    className: "w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
  }), errors.email && /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs font-medium text-rose-600 dark:text-rose-400"
  }, errors.email)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
  }, "PASSWORD"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: showPassword ? 'text' : 'password',
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: password,
    onChange: e => setPassword(e.target.value),
    className: "w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 pr-14 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowPassword(!showPassword),
    className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-800 dark:hover:text-white cursor-pointer"
  }, showPassword ? 'Hide' : 'Show')), errors.password && /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs font-medium text-rose-600 dark:text-rose-400"
  }, errors.password)), selectedRole.id === 'admin' && /*#__PURE__*/React.createElement("div", {
    className: "animate-auth-fade"
  }, /*#__PURE__*/React.createElement("label", {
    className: "mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-gray-300"
  }, "ADMIN ACCESS CODE"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Enter institutional code (e.g. ADMIN2026)",
    value: secretCode,
    onChange: e => setSecretCode(e.target.value),
    className: "w-full rounded-xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-3.5 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 ease-out focus:border-[#1a6ef5] dark:focus:border-cyan-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-500/10"
  }), errors.secretCode && /*#__PURE__*/React.createElement("p", {
    className: "mt-1 text-xs font-medium text-rose-600 dark:text-rose-400"
  }, errors.secretCode)), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end pt-0.5"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setRecoverySent(false);
      setShowRecoveryModal(true);
    },
    className: "text-xs font-medium text-[#1a6ef5] dark:text-cyan-400 transition-colors hover:underline cursor-pointer"
  }, "Forgot password?")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: loading,
    className: "group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a6ef5] dark:bg-[#0066FF] px-4 py-3.5 text-sm font-medium text-white shadow-sm dark:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#155bd5] dark:hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "h-4 w-4 animate-spin text-white",
    fill: "none",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("circle", {
    className: "opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /*#__PURE__*/React.createElement("path", {
    className: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })), /*#__PURE__*/React.createElement("span", null, "Signing you in\u2026")) : /*#__PURE__*/React.createElement("div", {
    key: selectedRole.id,
    className: "animate-cta-swap flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "Enter ", selectedRole.label, " workspace"), /*#__PURE__*/React.createElement("span", {
    className: "transition-transform duration-200 group-hover:translate-x-1"
  }, "\u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-5 pt-4 border-t border-slate-100 dark:border-white/5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-[10px] font-bold uppercase tracking-wider text-center text-slate-400 dark:text-gray-500 mb-2.5"
  }, "Instant One-Click Demo Access"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, roles.map(r => /*#__PURE__*/React.createElement("button", {
    key: r.id,
    type: "button",
    onClick: () => handleQuickDemoLogin(r.id),
    className: "py-2 px-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-blue-500 dark:hover:border-cyan-400 text-[11px] font-bold text-slate-700 dark:text-gray-200 transition cursor-pointer"
  }, r.label, " Demo"))))), /*#__PURE__*/React.createElement("p", {
    className: "mt-5 text-center text-xs text-slate-600 dark:text-gray-400 sm:text-sm"
  }, "New to CourseHub?", ' ', /*#__PURE__*/React.createElement(Link, {
    to: "/register",
    className: "font-bold text-slate-900 dark:text-cyan-400 transition-colors hover:underline"
  }, "Create your account")), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('/'),
    className: "mt-3 mx-auto block text-xs font-medium text-slate-500 dark:text-gray-500 transition-colors hover:text-slate-800 dark:hover:text-gray-300 cursor-pointer"
  }, "\u2190 Back to home")))), /*#__PURE__*/React.createElement(Modal, {
    isOpen: showRecoveryModal,
    onClose: () => setShowRecoveryModal(false),
    title: "Reset Your Password",
    subtitle: "Enter your university email to receive a password reset link"
  }, recoverySent ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto font-bold"
  }, "\u2713"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-slate-900 dark:text-white"
  }, "Recovery Link Dispatched"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-slate-500 dark:text-gray-400"
  }, "If an account exists for ", /*#__PURE__*/React.createElement("strong", null, recoveryEmail), ", you will receive reset instructions shortly."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowRecoveryModal(false),
    className: "mt-2 px-5 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold cursor-pointer"
  }, "Return to Sign In")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (recoveryEmail.trim()) setRecoverySent(true);
    },
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    required: true,
    placeholder: "sarah.jensen@university.edu",
    value: recoveryEmail,
    onChange: e => setRecoveryEmail(e.target.value),
    className: "w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-cyan-400"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setShowRecoveryModal(false),
    className: "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-gray-400 cursor-pointer"
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-5 py-2 rounded-xl bg-[#0066FF] text-white text-xs font-bold cursor-pointer"
  }, "Send Reset Link")))));
}
function BrandMark({
  darkBg = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${darkBg ? 'bg-white/10 backdrop-blur-md border border-white/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-white text-slate-900 border border-slate-200'}`
  }, /*#__PURE__*/React.createElement("svg", {
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "16",
    height: "16",
    rx: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.5"
  })));
}
function roleName(role) {
  if (typeof role === 'string') {
    const found = roles.find(r => r.id === role.toLowerCase());
    return found ? found.label : role;
  }
  return roles.find(r => r.roleId === role)?.label || 'correct';
}
var _default = Login;

export default _default;
