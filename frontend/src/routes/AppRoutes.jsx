import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import StudentDashboard from '../pages/Student/StudentDashboard';
import FacultyDashboard from '../pages/Faculty/FacultyDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import CourseCatalog from '../pages/CourseCatalog';
import Course from '../pages/Course';
import CourseForm from '../components/CourseForm';
import AssessmentsPage from '../pages/AssessmentsPage';
import GradesPage from '../pages/GradesPage';
import AttendancePage from '../pages/AttendancePage';
import NotificationsPage from '../pages/NotificationsPage';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
import DashboardLayout from '../components/layout/DashboardLayout';
import Landing from '../pages/Landing';

function LandingLoader() {
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex items-center justify-center bg-[#F3F6FA] dark:bg-[#030712] transition-colors"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-8 border-3 border-blue-600/20 border-t-blue-600 dark:border-cyan-400/20 dark:border-t-cyan-400 rounded-full animate-spin"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-semibold text-slate-500 dark:text-gray-400"
  }, "Loading CourseHub\u2026")));
}
function AppRoutes() {
  const {
    isAuthenticated
  } = (0, useAuth)();
  return /*#__PURE__*/React.createElement(Routes, null, /*#__PURE__*/React.createElement(Route, {
    path: "/login",
    element: /*#__PURE__*/React.createElement(Login, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/register",
    element: /*#__PURE__*/React.createElement(Register, null)
  }), isAuthenticated ? /*#__PURE__*/React.createElement(Route, {
    element: /*#__PURE__*/React.createElement(DashboardLayout, null)
  }, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    element: /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(LandingLoader, null)
    }, /*#__PURE__*/React.createElement(Landing, null))
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/student",
    element: /*#__PURE__*/React.createElement(StudentDashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/faculty",
    element: /*#__PURE__*/React.createElement(FacultyDashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/admin",
    element: /*#__PURE__*/React.createElement(AdminDashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/courses",
    element: /*#__PURE__*/React.createElement(CourseCatalog, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/courses/:id",
    element: /*#__PURE__*/React.createElement(Course, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/faculty/courses/new",
    element: /*#__PURE__*/React.createElement(CourseForm, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/faculty/courses/:id/edit",
    element: /*#__PURE__*/React.createElement(CourseForm, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/assignments",
    element: /*#__PURE__*/React.createElement(AssessmentsPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/grades",
    element: /*#__PURE__*/React.createElement(GradesPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/attendance",
    element: /*#__PURE__*/React.createElement(AttendancePage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/notifications",
    element: /*#__PURE__*/React.createElement(NotificationsPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/profile",
    element: /*#__PURE__*/React.createElement(Profile, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/settings",
    element: /*#__PURE__*/React.createElement(Settings, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/contact",
    element: /*#__PURE__*/React.createElement(Contact, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "*",
    element: /*#__PURE__*/React.createElement(NotFound, null)
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Route, {
    path: "/",
    element: /*#__PURE__*/React.createElement(Suspense, {
      fallback: /*#__PURE__*/React.createElement(LandingLoader, null)
    }, /*#__PURE__*/React.createElement(Landing, null))
  }), /*#__PURE__*/React.createElement(Route, {
    element: /*#__PURE__*/React.createElement(DashboardLayout, null)
  }, /*#__PURE__*/React.createElement(Route, {
    path: "/student",
    element: /*#__PURE__*/React.createElement(StudentDashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/faculty",
    element: /*#__PURE__*/React.createElement(FacultyDashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/admin",
    element: /*#__PURE__*/React.createElement(AdminDashboard, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/courses",
    element: /*#__PURE__*/React.createElement(CourseCatalog, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/courses/:id",
    element: /*#__PURE__*/React.createElement(Course, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/faculty/courses/new",
    element: /*#__PURE__*/React.createElement(CourseForm, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/faculty/courses/:id/edit",
    element: /*#__PURE__*/React.createElement(CourseForm, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/assignments",
    element: /*#__PURE__*/React.createElement(AssessmentsPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/grades",
    element: /*#__PURE__*/React.createElement(GradesPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/attendance",
    element: /*#__PURE__*/React.createElement(AttendancePage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/notifications",
    element: /*#__PURE__*/React.createElement(NotificationsPage, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/profile",
    element: /*#__PURE__*/React.createElement(Profile, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/settings",
    element: /*#__PURE__*/React.createElement(Settings, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "/contact",
    element: /*#__PURE__*/React.createElement(Contact, null)
  }), /*#__PURE__*/React.createElement(Route, {
    path: "*",
    element: /*#__PURE__*/React.createElement(NotFound, null)
  }))));
}
var _default = AppRoutes;

export default _default;
