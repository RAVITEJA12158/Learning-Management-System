import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({
  children,
  allowedRoles
}) {
  const {
    loading,
    isAuthenticated,
    user
  } = (0, useAuth)();
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "grid min-h-screen place-items-center bg-[#F3F6FA] dark:bg-[#030712] text-slate-900 dark:text-white transition-colors"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] backdrop-blur-xl px-6 py-4 shadow-xl text-xs font-bold"
    }, /*#__PURE__*/React.createElement("span", {
      className: "h-4 w-4 rounded-full border-2 border-blue-600/30 border-t-blue-600 dark:border-cyan-400/30 dark:border-t-cyan-400 animate-spin"
    }), "Preparing your learning space\u2026"));
  }
  if (!isAuthenticated) return /*#__PURE__*/React.createElement(Navigate, {
    to: "/login",
    replace: true
  });
  const userRole = user?.role?.toLowerCase();
  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    return /*#__PURE__*/React.createElement(Navigate, {
      to: "/",
      replace: true
    });
  }
  return children;
}
var _default = ProtectedRoute;

export default _default;
